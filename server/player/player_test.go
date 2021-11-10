package player

import (
	"testing"
)

func TestPlayerPersisting(t *testing.T) {

	filename := "testUid"
	test_player := Player{Uid: filename, Name: "testName", Money: 1000, Seeds: 10, Produce: 20}

	test_player.WriteToFile()
	new_player := Player{}
	new_player.ReadFromFile(filename)

	if test_player != new_player {
		t.Errorf("Players do not match: %v vs %v", test_player, new_player)
	}
}
