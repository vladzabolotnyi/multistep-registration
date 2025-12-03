package server

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))
	api := r.Group("/api")
	{
		api.POST("/register", func(c *gin.Context) {
			validationChain := NewMiddlewareChain()
			validationChain.Add(LoggingMiddleware())
			validationChain.Add(s.validateRegistrationMiddleware())

			validationChain.Then(s.Register)(c)
		})

		api.GET("/check-username", s.CheckUsername)
		api.GET("/check-email", s.CheckEmail)
	}

	// // Serve frontend static files
	// r.Static("/static", "./frontend/dist/assets")
	// r.StaticFile("/", "./frontend/dist/index.html")
	// r.StaticFile("/index.html", "./frontend/dist/index.html")
	//
	// // Catch-all for SPA routing
	// r.NoRoute(func(c *gin.Context) {
	// 	c.File("./frontend/dist/index.html")
	// })

	return r
}
