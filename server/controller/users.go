package controller

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"server/model"
	"strconv"

	"github.com/labstack/echo/v4"
)

type GetAllUsersFunc func() ([]model.User, error)

func GetAllUsers(getAllUsers GetAllUsersFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		fmt.Printf("GetAllUsers\n")
		users, err := getAllUsers()
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetAllUsers controller: %v\n", err)
			return c.JSON(http.StatusInternalServerError, err.Error())
		}
		return c.JSON(http.StatusOK, users)
	}
}

type InsertUsersFunc func(model.User) error

func InsertUser(insertUser InsertUsersFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		fmt.Printf("insert user controller")
		userToInsert := new(model.User)
		if err := c.Bind(userToInsert); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
		}
		if err := c.Validate(userToInsert); err != nil {
			fmt.Printf("error validating user: %v\n", err)
			return c.JSON(http.StatusBadRequest, err.Error())
		}
		if err := insertUser(*userToInsert); err != nil {
			return c.JSON(http.StatusInternalServerError, err.Error())
		}
		return c.JSON(http.StatusOK, map[string]string{"message": "User inserted"})
	}
}

type GetUserFunc func(int64) (model.User, error)

func GetUser(getUser GetUserFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		userIdStr := c.Param("userId")
		userId, err := strconv.ParseInt(userIdStr, 10, 64)
		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
		}
		user, err := getUser(userId)
		if err != nil {
			if errors.Is(err, model.ErrUserNotFound) {
				return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
			}
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusOK, user)
	}
}

type UpdateUserFunc func(int64, model.User) error

func UpdateUser(updateUser UpdateUserFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		userIdStr := c.Param("userId")
		userId, err := strconv.ParseInt(userIdStr, 10, 64)
		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
		}

		updateData := new(model.User)
		if err := c.Bind(updateData); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
		}
		if err := c.Validate(updateData); err != nil {
			fmt.Printf("error validating user: %v\n", err)
			return c.JSON(http.StatusBadRequest, err.Error())
		}
		if err := updateUser(userId, *updateData); err != nil {
			if errors.Is(err, model.ErrUserNotFound) {
				return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
			}
			return c.JSON(http.StatusInternalServerError, err.Error())
		}
		return c.JSON(http.StatusOK, map[string]string{"message": "User updated"})
	}
}

type DeleteUserFunc func(int64) error

func DeleteUser(delteUser DeleteUserFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		userIdStr := c.Param("userId")
		userId, err := strconv.ParseInt(userIdStr, 10, 64)
		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
		}
		err = delteUser(userId)
		if err != nil {
			if errors.Is(err, model.ErrUserNotFound) {
				return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
			}
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusOK, map[string]string{"message": "User deleted"})
	}
}
