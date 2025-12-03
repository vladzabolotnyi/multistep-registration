package server

import (
	"fmt"
	database "multistep-registration/internal/database/sqlc"
	"multistep-registration/internal/repository"
	"multistep-registration/internal/service"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
)

type ServerProps struct {
	DB database.DBTX
}

type Server struct {
	port int

	userService service.UserService
}

func NewServer(props ServerProps) *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	NewServer := &Server{
		port: port,
	}

	userRepo := repository.NewUserRepository(props.DB)
	userService := service.NewUserService(userRepo, 12)
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
