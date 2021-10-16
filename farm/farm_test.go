package farm

import (
	"reflect"
	"testing"
)

func TestFarmPersisting(t *testing.T) {

	filename := "testUid"
	test_farm := Farm{

		Uid: filename, Name: "testName", Fields: [][]Field{

			[]Field{Field{Contents: 1, State: 2}, Field{Contents: 3, State: 4}},
			[]Field{Field{Contents: 5, State: 6}, Field{Contents: 7, State: 8}},
		},
	}

	test_farm.WriteToFile()
	new_farm := Farm{}
	new_farm.ReadFromFile(filename)

	if !reflect.DeepEqual(test_farm, new_farm) {
		t.Errorf("Farms do not match: %v vs %v", test_farm, new_farm)
	}
}
