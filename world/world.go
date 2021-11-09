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

func Initialise(cfg config.Config) ([][]uint8, chan struct{}) {
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

	return worldMap, startUpdateTicks()
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
						for y, fields := range farm.Fields {
							for x, field := range fields {
								if field.Contents == 1 {
									field.Ticks -= 1
									if field.Ticks == 0 {
										if field.State < 5 {
											field.State += 1
											fmt.Printf("%d %d %d %d\n", x, y, field.State, field.Ticks)
											type cellUpdate struct {
												X        int   `json:"x"`
												Y        int   `json:"y"`
												Contents uint8 `json:"contents"`
												State    uint8 `json:"state"`
											}

											cellToReturn := cellUpdate{X: x, Y: y, Contents: field.Contents, State: field.State}
											replyJson, err := json.Marshal(cellToReturn)
											if err != nil {
												fmt.Printf("Error converting cellUpdate to json: %v\n", err)
												return
											}

											msgInfo := MessageInfo{MsgType: "WORLD_CELL_UPDATE", Payload: string(replyJson)}
											str, err := json.Marshal(msgInfo)
											if err != nil {
												fmt.Printf("Error converting msgInfo to json: %v\n", err)
												return
											}
											server.GetReplyChannelForPlayerUid(p.Uid) <- []byte(str)
										}
										field.Ticks = 5
									}
								}
							}
						}
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

type MessageInfo struct {
	MsgType string `json:"type"`
	Payload string `json:"payload"`
}

// Receives messages of the type PLAYER_LOGIN
func playerMessageListener(message string, server *server.Server) {

	var msgInfo MessageInfo
	if err := json.Unmarshal([]byte(message), &msgInfo); err != nil {
		fmt.Printf("Couldnt parse json from %s", message)
		return
	}

	switch msgInfo.MsgType {
	case "PLAYER_LOGIN":
		doPlayerLogin(msgInfo.Payload, server)
	case "CELL_CLICKED":
		doCellClicked(msgInfo.Payload, server)
	default:
		doUnexpectedMsgType(msgInfo)
	}
}

func doPlayerLogin(payload string, s *server.Server) string {
	type PlayerInfo struct {
		Name string `json:"playerName"`
	}
	var playerInfo PlayerInfo
	if err := json.Unmarshal([]byte(payload), &playerInfo); err != nil {
		fmt.Printf("Couldnt parse json for player login from %s\n", payload)
		return ""
	}

	p := GetPlayerFromName(playerInfo.Name)
	if p != nil {
		s.MapPlayerUid(p.Uid)
		p.SendPlayerStats(server.GetReplyChannelForPlayerUid(p.Uid))
		return p.Uid
	} else {
		fmt.Printf("Unknown player %s\n", playerInfo.Name)
		return ""
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

func doUnexpectedMsgType(msgInfo MessageInfo) {
	fmt.Printf("Unexpected message type: %s\n", msgInfo.MsgType)
}
