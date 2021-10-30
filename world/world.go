package world

import (
	"fmt"
	"io/ioutil"
	"path/filepath"

	"lunatic-acres/config"
	"lunatic-acres/player"
)

var (
	Players []player.Player
)

func Initialise(width int, height int, cfg config.Config) [][]uint8 {
	var worldMap = make([][]uint8, height)
	for y := range worldMap {
		worldMap[y] = make([]uint8, width)
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
	return worldMap
}
