package farm

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
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
