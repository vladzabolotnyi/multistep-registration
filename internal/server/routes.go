package server

import (
	"multistep-registration/internal/validation"
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

	apiGroup := r.Group("/api")
	apiGroup.Use(RecoveryMiddleware(), LoggingMiddleware())
	{
		registrationChain := validation.CreateDefaultRegistrationChain()
		apiGroup.POST("/register", registrationChain.Middleware(), s.Register)

		apiGroup.GET("/check-username", s.CheckUsername)
		apiGroup.GET("/check-email", s.CheckEmail)
	}

	r.GET("/health", s.healthHandler)
	r.GET("/ready", s.readinessHandler)

	return r
}
