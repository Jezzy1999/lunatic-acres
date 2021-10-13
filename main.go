package main

import (
	"fmt"

	"lunatic-acres/world"
)

func main() {

	worldMap := world.Initialise(20, 20)
	fmt.Println("Welcome to Luncatic Acres")

	for iy, y := range worldMap {
		for ix, x := range y {
			fmt.Printf("Value at %d,%d:%d\n", ix, iy, x)
		}
	}
}
