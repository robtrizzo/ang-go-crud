package router

import (
	"github.com/labstack/echo/v4"

	"server/controller"
)

var e *echo.Echo

func Route() {
	e := echo.New()
	e.GET("/", controller.HealthCheck)
	userRoutes()
	e.Logger.Fatal(e.Start(":1323"))
}
