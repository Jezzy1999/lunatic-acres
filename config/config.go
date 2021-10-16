package config

import (
	"fmt"
	"gopkg.in/yaml.v2"
	"os"
)

type Config struct {
	Server struct {
		Port string `yaml:"port"`
		Host string `yaml:"host"`
	} `yaml:"server"`
	Folders struct {
		Players string `yaml:"players"`
		Farms   string `yaml:"farms"`
	} `yaml:"folders"`
}

func processError(err error) {
	fmt.Println(err)
	os.Exit(2)
}

func Initialise() Config {
	var cfg Config
	file, err := os.Open("config.yml")
	if err != nil {
		processError(err)
	}
	defer file.Close()

	decoder := yaml.NewDecoder(file)
	err = decoder.Decode(&cfg)
	if err != nil {
		processError(err)
	}
	return cfg
}
