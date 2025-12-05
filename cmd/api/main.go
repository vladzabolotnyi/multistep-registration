package main

import (
	"context"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"multistep-registration/internal/config"
	"multistep-registration/internal/database"
	"multistep-registration/internal/server"
)

func gracefulShutdown(apiServer *http.Server, done chan bool) {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	<-ctx.Done()

	log.Println("shutting down gracefully, press Ctrl+C again to force")
	stop()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := apiServer.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown with error: %v", err)
	}

	log.Println("Server exiting")

	done <- true
}

func main() {
	cfg := config.Load()

	db, err := database.NewDatabase(context.Background(), cfg)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	migrator := database.NewMigrator(cfg.Database.MigrationsPath)
	if version, dirty, err := migrator.CheckMigrationsStatus(db.SQL, cfg.Database.DBName); err == nil {
		log.Printf("Current migration version: %d, dirty: %v", version, dirty)
	}

	if err := migrator.RunMigrations(db.SQL, cfg.Database.DBName); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	server := server.NewServer(server.Props{Config: cfg, Database: db})

	done := make(chan bool, 1)

	go gracefulShutdown(server, done)

	err = server.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		log.Panicf("http server error: %s\n", err)
	}

	<-done
	log.Println("Graceful shutdown complete.")
}
