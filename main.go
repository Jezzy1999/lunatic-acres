package main

import (
	"fmt"
	"net/http"

	"lunatic-acres/config"
	"lunatic-acres/server"
	"lunatic-acres/world"
)

func serveHome(res http.ResponseWriter, req *http.Request) {
	fmt.Println(req.URL)
	if req.URL.Path != "/" {
		http.Error(res, "Not found", http.StatusNotFound)
		return
	}
	if req.Method != "GET" {
		http.Error(res, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
}

func main() {

	cfg := config.Initialise()

	fmt.Println("Welcome to Luncatic Acres")
	quit := world.Initialise(cfg)
	defer close(quit)

	http.HandleFunc("/", serveHome)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		server.ServeWs(w, r)
	})

	err := http.ListenAndServe(cfg.Server.Host+":"+cfg.Server.Port, nil)
	if err != nil {
		fmt.Println("ListenAndServe: ", err)
	}
}
