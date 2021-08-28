package main

import (
	"net/http"
	"os"

	"github.com/google/logger"
)

func main() {
	logger.Init("trie", true, false, os.Stdout)

	port := os.Getenv("PORT")
	if port == "" {
		logger.Fatalln("$PORT must be set")
		return
	}

	server := NewServer()

	logger.Infof("server starting on :%s", port)
	http.ListenAndServe(":"+port, server.HttpServeMux())
}
