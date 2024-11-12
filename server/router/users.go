package router

import (
	"server/controller"
	"server/model"

	"github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
)

type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		return err
	}
	return nil
}

func userRoutes(e *echo.Echo) {

	e.Validator = &CustomValidator{validator: validator.New()}

	usersGroup := e.Group("/users")
	usersGroup.GET("", controller.GetAllUsers(model.GetAllUsers))
	usersGroup.POST("", controller.InsertUser(model.InsertUser))

	usersIdGroup := usersGroup.Group("/:userId")
	usersIdGroup.GET("", controller.GetUser(model.GetUser))
	usersIdGroup.PUT("", controller.UpdateUser(model.UpdateUser))
	usersIdGroup.DELETE("", controller.DeleteUser(model.DeleteUser))
}
