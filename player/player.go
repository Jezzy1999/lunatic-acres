package player

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"

	"lunatic-acres/farm"
)

type Player struct {
	Uid     string `json:"uid"`
	FarmUid string `json:"farmuid"`
	Name    string `json:"name"`
	Money   int64  `json:"money"`
	Seeds   int64  `json:"seeds"`
	Produce int64  `json:"produce"`
}

func (p *Player) ReadFromFile(filename string) {
	file, err := os.Open(filename)

	if err != nil {
		fmt.Printf("Error reading player file %s: %v", filename, err)
	} else {
		byteValue, _ := ioutil.ReadAll(file)
		json.Unmarshal(byteValue, p)
	}
}

func (p Player) WriteToFile() {

	str, err := json.Marshal(p)

	if err != nil {
		fmt.Printf("Error converting player to json: %v", err)
	} else {
		err = ioutil.WriteFile(p.Uid, str, 0644)

		if err != nil {
			fmt.Printf("Error writing player file: %v", err)
		}
	}
}

type MessageInfo struct {
	MsgType string `json:"type"`
	Payload string `json:"payload"`
}

func (p *Player) SendPlayerStats(replyChannel chan<- []byte) {

	type playerStats struct {
		Uid     string `json:"uid"`
		Money   int64  `json:"money"`
		Seeds   int64  `json:"seeds"`
		Produce int64  `json:"produce"`
	}
	statsToReturn := playerStats{Uid: p.Uid, Money: p.Money, Seeds: p.Seeds}
	statsJson, err := json.Marshal(statsToReturn)

	if err != nil {
		fmt.Printf("Error converting player to json: %v\n", err)
		return
	}
	msgInfo := MessageInfo{MsgType: "PLAYER_STATS", Payload: string(statsJson)}
	str, err := json.Marshal(msgInfo)
	if err != nil {
		fmt.Printf("Error converting msgInfo to json: %v\n", err)
		return
	}
	replyChannel <- []byte(str)
}

func (p *Player) HandleCellClicked(farm farm.Farm, x int, y int, menuId string, replyChannel chan<- []byte) {

	switch {
	case menuId == "plant_wheat":
		if farm.Fields[y][x].Contents == 1 {
			return
		}
		farm.Fields[y][x].Contents = 1
		farm.Fields[y][x].State = 0
		farm.Fields[y][x].Ticks = 5

		p.Money -= 30
		p.SendPlayerStats(replyChannel)

	case menuId == "harvest":
		if farm.Fields[y][x].Contents != 1 {
			return
		}
		farm.Fields[y][x].Contents = 0
		farm.Fields[y][x].State = 1

		p.Money += 50
		p.SendPlayerStats(replyChannel)
	}

	type cellUpdate struct {
		X        int   `json:"x"`
		Y        int   `json:"y"`
		Contents uint8 `json:"contents"`
		State    uint8 `json:"state"`
	}

	cellToReturn := cellUpdate{X: x, Y: y, Contents: farm.Fields[y][x].Contents, State: farm.Fields[y][x].State}
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
	replyChannel <- []byte(str)
}
