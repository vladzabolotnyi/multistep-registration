package server

import (
	"fmt"
	"multistep-registration/internal/config"
	database "multistep-registration/internal/database/sqlc"
	"multistep-registration/internal/repository"
	"multistep-registration/internal/service"
	"net/http"
	"time"

	_ "github.com/joho/godotenv/autoload"
)

type ServerProps struct {
	Config *config.Config
	DB     database.DBTX
}

type Server struct {
	port int

	userService service.UserService
}

func NewServer(props ServerProps) *http.Server {
	NewServer := &Server{
		port: props.Config.Server.Port,
	}

	userRepo := repository.NewUserRepository(props.DB)
	userService := service.NewUserService(userRepo, props.Config.Security.PasswordCost)
	NewServer.userService = userService

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", NewServer.port),
		Handler:      NewServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}
