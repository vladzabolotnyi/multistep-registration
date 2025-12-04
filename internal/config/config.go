package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
)

type Config struct {
	Database struct {
		Host           string
		Port           string
		User           string
		Password       string
		DBName         string
		SSLMode        string
		MigrationsPath string
	}
	Server struct {
		Port         int
		ReadTimeout  int
		WriteTimeout int
	}
	Security struct {
		PasswordCost int
	}
}

func Load() *Config {
	var cfg Config

	migrationsPath := getEnv("DB_MIGRATIONS_PATH", "internal/database/migrations/")
	absMigrationsPath, err := filepath.Abs(migrationsPath)
	if err != nil {
		fmt.Printf("could not get absolute path for migrations: %v\n", err)
		absMigrationsPath = migrationsPath
	}

	// Database
	cfg.Database.Host = getEnv("DB_HOST", "localhost")
	cfg.Database.Port = getEnv("DB_PORT", "5432")
	cfg.Database.User = getEnv("DB_USER", "postgres")
	cfg.Database.Password = getEnv("DB_PASSWORD", "postgres")
	cfg.Database.DBName = getEnv("DB_NAME", "registration_db")
	cfg.Database.SSLMode = getEnv("DB_SSLMODE", "disable")
	cfg.Database.MigrationsPath = absMigrationsPath

	// Server
	cfg.Server.Port = getEnvAsInt("PORT", 8080)
	cfg.Server.ReadTimeout = getEnvAsInt("READ_TIMEOUT", 10)
	cfg.Server.WriteTimeout = getEnvAsInt("WRITE_TIMEOUT", 10)

	// Security
	cfg.Security.PasswordCost = getEnvAsInt("PASSWORD_COST", 12)

	return &cfg
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}
