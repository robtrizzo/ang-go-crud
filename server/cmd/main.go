package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"

	"server/models"
)

func init() {
	err := models.Connect()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer models.Close()
}

func main() {

	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello World!!")
	})
	e.GET("/users", func(c echo.Context) error {
		users, err := models.GetAllUsers()
		if err != nil {
			return c.String(http.StatusInternalServerError, "Internal Server Error")
		}
		return c.JSON(http.StatusOK, users)
	})
	e.GET("/users/test", func(c echo.Context) error {
		return c.String(http.StatusOK, "Inserted Test User")
	})
	e.Logger.Fatal(e.Start(":1323"))
}
