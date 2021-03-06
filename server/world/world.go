package world

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"time"

	"path/filepath"

	"lunatic-acres/config"
	"lunatic-acres/farm"
	"lunatic-acres/player"
	"lunatic-acres/server"
)

var (
	Players          []*player.Player
	FarmsByPlayerUid map[string]farm.Farm
)

func Initialise(cfg config.Config) chan struct{} {
	var worldMap = make([][]uint8, cfg.World.Height)
	for y := range worldMap {
		worldMap[y] = make([]uint8, cfg.World.Width)
	}

	files, err := ioutil.ReadDir(cfg.Folders.Players)
	if err != nil {
		fmt.Println(err)
	}

	for _, f := range files {
		if !f.IsDir() {
			newPlayer := player.Player{}
			newPlayer.ReadFromFile(filepath.Join(cfg.Folders.Players, f.Name()))
			Players = append(Players, &newPlayer)
		}
	}

	for _, p := range Players {
		fmt.Printf("%v\n", p)
	}

	FarmsByPlayerUid = make(map[string]farm.Farm)
	files, err = ioutil.ReadDir(cfg.Folders.Farms)
	if err != nil {
		fmt.Println(err)
	}

	for _, f := range files {
		if !f.IsDir() {
			newFarm := farm.Farm{}
			newFarm.ReadFromFile(filepath.Join(cfg.Folders.Farms, f.Name()))

			foundPlayerForFarm := false
			for _, p := range Players {
				if p.FarmUid == newFarm.Uid {
					FarmsByPlayerUid[p.Uid] = newFarm
					foundPlayerForFarm = true
					break
				}
			}
			if !foundPlayerForFarm {
				fmt.Printf("Couldnt find player for farm with uid %s\n", newFarm.Uid)
			}
		}
	}

	for k, f := range FarmsByPlayerUid {
		fmt.Printf("Found farm \"%s\" belonging to \"%s\"\n", f.Name, k)
	}

	server.AddMessageListener(playerMessageListener)

	return startUpdateTicks()
}

func startUpdateTicks() chan struct{} {
	ticker := time.NewTicker(1 * time.Second)
	quit := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				for _, p := range Players {
					if farm, found := FarmsByPlayerUid[p.Uid]; found {
						farm.Update(p.Uid)
					}
				}
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()
	return quit
}

func GetPlayerFromName(name string) *player.Player {
	for _, p := range Players {
		if p.Name == name {
			return p
		}
	}
	return nil
}

func GetPlayerFromUid(uid string) *player.Player {
	for _, p := range Players {
		if p.Uid == uid {
			return p
		}
	}
	return nil
}

// Receives messages of the type PLAYER_LOGIN
func playerMessageListener(message string, s *server.Server) {

	var msgInfo server.MessageInfo
	if err := json.Unmarshal([]byte(message), &msgInfo); err != nil {
		fmt.Printf("Couldnt parse json from %s", message)
		return
	}

	switch msgInfo.MsgType {
	case "PLAYER_LOGIN":
		doPlayerLogin(msgInfo.Payload, s)
	case "CELL_CLICKED":
		doCellClicked(msgInfo.Payload, s)
	default:
		doUnexpectedMsgType(msgInfo)
	}
}

func doPlayerLogin(payload string, s *server.Server) {
	type PlayerInfo struct {
		Name string `json:"playerName"`
	}
	var playerInfo PlayerInfo
	if err := json.Unmarshal([]byte(payload), &playerInfo); err != nil {
		fmt.Printf("Couldnt parse json for player login from %s\n", payload)
		return
	}

	p := GetPlayerFromName(playerInfo.Name)
	if p != nil {
		s.MapPlayerUid(p.Uid)
		p.SendPlayerStats(server.GetReplyChannelForPlayerUid(p.Uid))
	} else {
		fmt.Printf("Unknown player %s\n", playerInfo.Name)
	}
}

func doCellClicked(payload string, s *server.Server) {
	type CellInfo struct {
		PlayerUid string `json:"playerUid"`
		X         int    `json:"x"`
		Y         int    `json:"y"`
		ID        string `json:"id"`
	}

	var cellInfo CellInfo
	if err := json.Unmarshal([]byte(payload), &cellInfo); err != nil {
		fmt.Printf("Couldnt parse json for doCellClicked from %s\n", payload)
		return
	}

	player := GetPlayerFromUid(cellInfo.PlayerUid)
	if farm, found := FarmsByPlayerUid[cellInfo.PlayerUid]; !found {
		fmt.Printf("doCellClicked couldnt find farm for PlayerUid %s\n", cellInfo.PlayerUid)
		return
	} else {
		player.HandleCellClicked(farm, cellInfo.X, cellInfo.Y, cellInfo.ID, server.GetReplyChannelForPlayerUid(player.Uid))
	}
}

func doUnexpectedMsgType(msgInfo server.MessageInfo) {
	fmt.Printf("Unexpected message type: %s\n", msgInfo.MsgType)
}
