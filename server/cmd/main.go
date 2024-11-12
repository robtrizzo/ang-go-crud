package main

import (
	"fmt"
	"os"

	"server/model"
	"server/router"
)

func init() {
	err := model.Connect()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer model.Close()
}

func main() {
	router.Route()
}
