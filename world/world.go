package world


func Initialise(width int, height int) [][]uint8 {
	var worldMap = make([][]uint8, height)
	for y := range worldMap {
    	worldMap[y] = make([]uint8, width)
	}
	return worldMap
}