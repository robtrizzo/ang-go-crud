package router

import (
	"server/controller"

	"github.com/labstack/echo/v4"
)

func userRoutes(e *echo.Echo) {

	usersGroup := e.Group("/users")
	usersGroup.GET("", controller.GetAllUsers)
	usersGroup.POST("", controller.InsertUser)

	usersIdGroup := usersGroup.Group("/:id")
	usersIdGroup.GET("", controller.GetUser)
	usersIdGroup.PUT("", controller.UpdateUser)
	usersIdGroup.DELETE("", controller.DeleteUser)
}
