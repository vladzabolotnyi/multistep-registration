package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"multistep-registration/internal/config"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
)

type Database struct {
	Pool *pgxpool.Pool
	SQL  *sql.DB
}

func NewDatabase(ctx context.Context, cfg *config.Config) (*Database, error) {
	connString := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.DBName,
	)

	poolConfig, err := pgxpool.ParseConfig(connString)
	if err != nil {
		return nil, fmt.Errorf("failed to parse database config: %w", err)
	}

	poolConfig.MaxConns = 25
	poolConfig.MinConns = 5
	poolConfig.MaxConnLifetime = time.Hour
	poolConfig.MaxConnIdleTime = 30 * time.Minute
	poolConfig.HealthCheckPeriod = time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// Create sql.DB for migrations (golang-migrate requires database/sql)
	sqlDB, err := sql.Open("postgres", connString)
	if err != nil {
		return nil, fmt.Errorf("failed to create sql.DB for migrations: %w", err)
	}

	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping sql.DB: %w", err)
	}

	log.Println("Database connection established successfully")
	return &Database{Pool: pool, SQL: sqlDB}, nil
}

func (db *Database) Close() {
	if db.Pool != nil {
		db.Pool.Close()
	}
	if db.SQL != nil {
		db.SQL.Close()
	}
}
