package farm

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"lunatic-acres/server"
	"os"
)

type Field struct {
	Contents uint8 `json:"contents"`
	State    uint8 `json:"state"`
	Ticks    uint8 `json:"ticks"`
}

type Farm struct {
	Uid    string     `json:"uid"`
	Name   string     `json:"name"`
	Fields [][]*Field `json:"fields"`
}

func (f *Farm) ReadFromFile(filename string) {
	file, err := os.Open(filename)

	if err != nil {
		fmt.Printf("Error reading farm file %s: %v", filename, err)
	} else {
		byteValue, _ := ioutil.ReadAll(file)
		json.Unmarshal(byteValue, f)
	}
}

func (f Farm) WriteToFile() {

	str, err := json.Marshal(f)

	if err != nil {
		fmt.Printf("Error converting farm to json: %v", err)
	} else {
		err = ioutil.WriteFile(f.Uid, str, 0644)

		if err != nil {
			fmt.Printf("Error writing farm file: %v", err)
		}
	}
}

func (f *Farm) Update(playerUid string) {
	for y, fields := range f.Fields {
		for x, field := range fields {
			if field.Contents == 1 {
				field.Ticks -= 1
				if field.Ticks == 0 {
					if field.State < 4 {
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

						msgInfo := server.MessageInfo{MsgType: "WORLD_CELL_UPDATE", Payload: string(replyJson)}
						str, err := json.Marshal(msgInfo)
						if err != nil {
							fmt.Printf("Error converting msgInfo to json: %v\n", err)
							return
						}
						server.GetReplyChannelForPlayerUid(playerUid) <- []byte(str)
					}
					field.Ticks = 5
				}
			}
		}
	}
}
