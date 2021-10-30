package world

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	"path/filepath"

	"lunatic-acres/config"
	"lunatic-acres/player"
	"lunatic-acres/server"
)

var (
	Players []player.Player
)

func Initialise(cfg config.Config) [][]uint8 {
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
			Players = append(Players, newPlayer)
		}
	}

	for _, p := range Players {
		fmt.Printf("%v\n", p)
	}

	server.AddMessageListener(playerMessageListener)

	return worldMap
}

type MessageInfo struct {
	MsgType string `json:"type"`
	Payload string `json:"payload"`
}

// Receives messages of the type PLAYER_LOGIN
func playerMessageListener(message string, replyChannel chan<- []byte) {

	var msgInfo MessageInfo
	if err := json.Unmarshal([]byte(message), &msgInfo); err != nil {
		fmt.Printf("Couldnt parse json from %s", message)
		return
	}

	switch msgInfo.MsgType {
	case "PLAYER_LOGIN":
		doPlayerLogin(msgInfo.Payload, replyChannel)
	default:
		doUnexpectedMsgType(msgInfo)
	}
}

func doPlayerLogin(payload string, replyChannel chan<- []byte) {
	type PlayerInfo struct {
		Name string `json:"playerName"`
	}
	var playerInfo PlayerInfo
	if err := json.Unmarshal([]byte(payload), &playerInfo); err != nil {
		fmt.Printf("Couldnt parse json for player login from %s", payload)
		return
	}

	for _, p := range Players {
		if p.Name == playerInfo.Name {
			type playerStats struct {
				Money   int64 `json:"money"`
				Seeds   int64 `json:"seeds"`
				Produce int64 `json:"produce"`
			}
			statsToReturn := playerStats{Money: p.Money, Seeds: p.Seeds}
			statsJson, err := json.Marshal(statsToReturn)

			if err != nil {
				fmt.Printf("Error converting player to json: %v", err)
				return
			}
			msgInfo := MessageInfo{MsgType: "PLAYER_STATS", Payload: string(statsJson)}
			str, err := json.Marshal(msgInfo)
			if err != nil {
				fmt.Printf("Error converting msgInfo to json: %v", err)
				return
			}
			replyChannel <- []byte(str)
		}
	}
}

func doUnexpectedMsgType(msgInfo MessageInfo) {
	fmt.Printf("Unexpected message type: %s\n", msgInfo.MsgType)
}
