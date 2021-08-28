package main

import (
	"net/http"
	"os"

	"github.com/google/logger"
)

func main() {
	logger.Init("trie", true, false, os.Stdout)

	port, exists := os.LookupEnv("PORT")
	if port == "" || !exists {
		port = "8080"
	}

	server := NewServer()

	logger.Infof("server starting on :%s", port)
	http.ListenAndServe(":"+port, server.HttpServeMux())
}
