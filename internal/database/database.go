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

const (
	StatusHealthy   = "healthy"
	StatusDegraded  = "degraded"
	StatusUnhealthy = "unhealthy"
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
	poolConfig.ConnConfig.ConnectTimeout = 5 * time.Second

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

func (db *Database) HealthCheck(ctx context.Context) (*HealthStatus, error) {
	status := &HealthStatus{
		Timestamp: time.Now(),
		Checks:    make(map[string]CheckResult),
	}

	start := time.Now()
	err := db.Pool.Ping(ctx)
	status.Checks["connection_pool"] = CheckResult{
		Status:    err == nil,
		Latency:   time.Since(start),
		Error:     errToString(err),
		Timestamp: time.Now(),
	}
	if err != nil {
		status.Status = StatusUnhealthy
		return status, fmt.Errorf("connection pool ping failed: %w", err)
	}

	start = time.Now()
	var result int
	queryCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	err = db.Pool.QueryRow(queryCtx, "SELECT 1").Scan(&result)
	status.Checks["query_execution"] = CheckResult{
		Status:    err == nil && result == 1,
		Latency:   time.Since(start),
		Error:     errToString(err),
		Timestamp: time.Now(),
	}
	if err != nil || result != 1 {
		status.Status = StatusUnhealthy
		return status, fmt.Errorf("basic query test failed: %w", err)
	}

	stats := db.Pool.Stat()
	status.Checks["pool_statistics"] = CheckResult{
		Status: true,
		Details: map[string]any{
			"total_connections": stats.TotalConns(),
			"idle_connections":  stats.IdleConns(),
			"max_connections":   stats.MaxConns(),
			"acquired_count":    stats.AcquiredConns(),
			"empty_slots":       stats.EmptyAcquireCount(),
		},
		Timestamp: time.Now(),
	}

	if status.Status == "" {
		status.Status = StatusHealthy
	}

	return status, nil
}

type HealthStatus struct {
	Status    string                 `json:"status"`
	Timestamp time.Time              `json:"timestamp"`
	Checks    map[string]CheckResult `json:"checks"`
}

type CheckResult struct {
	Status    bool           `json:"status"`
	Latency   time.Duration  `json:"latency,omitempty"`
	Error     string         `json:"error,omitempty"`
	Details   map[string]any `json:"details,omitempty"`
	Timestamp time.Time      `json:"timestamp"`
}

func errToString(err error) string {
	if err == nil {
		return ""
	}
	return err.Error()
}
