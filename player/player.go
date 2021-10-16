package player

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

type Player struct {
	Uid     string `json:"uid"`
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
