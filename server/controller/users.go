package controller

import (
	"net/http"
	"server/model"

	"github.com/labstack/echo/v4"
)

func GetAllUsers(c echo.Context) error {
	users, err := model.GetAllUsers()
	if err != nil {
		return c.String(http.StatusInternalServerError, "Internal Server Error")
	}
	return c.JSON(http.StatusOK, users)
}

func InsertUser(c echo.Context) error {
	return c.String(http.StatusOK, "Inserted User")
}

func GetUser(c echo.Context) error {
	return c.String(http.StatusOK, "Get User")
}

func UpdateUser(c echo.Context) error {
	return c.String(http.StatusOK, "Update User")
}

func DeleteUser(c echo.Context) error {
	return c.String(http.StatusOK, "Delete User")
}
