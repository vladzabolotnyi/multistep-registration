package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"multistep-registration/internal/database"
	"multistep-registration/internal/server"
)

func gracefulShutdown(apiServer *http.Server, done chan bool) {
	// Create context that listens for the interrupt signal from the OS.
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	// Listen for the interrupt signal.
	<-ctx.Done()

	log.Println("shutting down gracefully, press Ctrl+C again to force")
	stop() // Allow Ctrl+C to force shutdown

	// The context is used to inform the server it has 5 seconds to finish
	// the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := apiServer.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown with error: %v", err)
	}

	log.Println("Server exiting")

	// Notify the main goroutine that the shutdown is complete
	done <- true
}

func main() {

	ctx := context.Background()
	dbConfig := database.LoadConfig()
	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbConfig.Host, dbConfig.Port, dbConfig.User, dbConfig.Password,
		dbConfig.DBName, dbConfig.SSLMode,
	)
	sqlDB, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to open database connection:", err)
	}
	defer sqlDB.Close()

	// migrationsPath := os.Getenv("MIGRATIONS_PATH")
	// if migrationsPath == "" {
	// 	cwd, err := os.Getwd()
	// 	if err != nil {
	// 		log.Fatal("Failed to get current directory:", err)
	// 	}
	// 	migrationsPath = filepath.Join(cwd, "migrations")
	//
	// 	if _, err := os.Stat(migrationsPath); os.IsNotExist(err) {
	// 		migrationsPath = "/app/migrations"
	// 	}
	// }
	//
	// log.Printf("Using migrations path: %s", migrationsPath)
	//
	// migrator := database.NewMigrator("../../internal/database/migrations")
	// if err := migrator.RunMigrations(sqlDB, dbConfig.DBName); err != nil {
	// 	panic(fmt.Sprintf("failed to run migrations: %s", err))
	// }

	pool, err := database.NewPool(ctx, dbConfig)
	if err != nil {
		panic(fmt.Sprintf("database error: %s", err))
	}
	defer pool.Close()

	server := server.NewServer(server.ServerProps{DB: pool})

	// Create a done channel to signal when the shutdown is complete
	done := make(chan bool, 1)

	// Run graceful shutdown in a separate goroutine
	go gracefulShutdown(server, done)

	err = server.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		panic(fmt.Sprintf("http server error: %s", err))
	}

	// Wait for the graceful shutdown to complete
	<-done
	log.Println("Graceful shutdown complete.")
}
