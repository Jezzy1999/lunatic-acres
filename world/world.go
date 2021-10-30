package world

import (
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

// Receives messages of the type PLAYER_LOGIN
func playerMessageListener(message string, replyChannel chan<- []byte) {
	replyChannel <- []byte(message)
}
