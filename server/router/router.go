package router

import (
	"github.com/labstack/echo/v4"

	"server/controller"
)

func Route() {
	e := echo.New()
	e.GET("/", controller.HealthCheck)
	userRoutes(e)
	e.Logger.Fatal(e.Start(":1323"))
}
