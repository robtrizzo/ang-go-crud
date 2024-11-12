package router

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"server/controller"
)

func Route() {
	e := echo.New()
	e.Use(middleware.CORS())
	e.GET("/", controller.HealthCheck)
	userRoutes(e)
	e.Logger.Fatal(e.Start(":1323"))
}
