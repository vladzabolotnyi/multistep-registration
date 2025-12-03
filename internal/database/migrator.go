package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

type Migrator struct {
	migrationsPath string
}

func NewMigrator(migrationsPath string) *Migrator {
	return &Migrator{
		migrationsPath: migrationsPath,
	}
}

func (m *Migrator) ValidateMigrationsPath() error {
	absPath, err := filepath.Abs(m.migrationsPath)
	if err != nil {
		return fmt.Errorf("failed to get absolute path: %w", err)
	}

	if _, err := os.Stat(absPath); os.IsNotExist(err) {
		return fmt.Errorf("migrations directory does not exist: %s", absPath)
	}

	dir, err := os.Open(absPath)
	if err != nil {
		return fmt.Errorf("cannot open migrations directory: %w", err)
	}
	defer dir.Close()

	files, err := dir.Readdirnames(-1)
	if err != nil {
		return fmt.Errorf("cannot read migration files: %w", err)
	}

	hasMigrations := false
	for _, file := range files {
		if filepath.Ext(file) == ".sql" {
			hasMigrations = true
			break
		}
	}

	if !hasMigrations {
		return fmt.Errorf("no .sql migration files found in: %s", absPath)
	}

	log.Printf("Migrations path validated: %s", absPath)
	return nil
}

func (m *Migrator) RunMigrations(db *sql.DB, dbName string) error {
	if err := m.ValidateMigrationsPath(); err != nil {
		return fmt.Errorf("migration path validation failed: %w", err)
	}

	driver, err := postgres.WithInstance(db, &postgres.Config{
		DatabaseName: dbName,
	})
	if err != nil {
		return fmt.Errorf("failed to create migration driver: %w", err)
	}

	absPath, err := filepath.Abs(m.migrationsPath)
	if err != nil {
		return fmt.Errorf("failed to get absolute path: %w", err)
	}

	migrateInstance, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", absPath),
		dbName,
		driver,
	)
	if err != nil {
		return fmt.Errorf("failed to create migration instance: %w", err)
	}

	migrateInstance.Log = &MigrationLogger{}

	// Run migrations
	log.Println("Running database migrations...")
	if err := migrateInstance.Up(); err != nil {
		if err == migrate.ErrNoChange {
			log.Println("No new migrations to run")
			return nil
		}
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	log.Println("Migrations completed successfully")
	return nil
}

func (m *Migrator) CheckMigrationsStatus(db *sql.DB, dbName string) (version uint, dirty bool, err error) {
	driver, err := postgres.WithInstance(db, &postgres.Config{
		DatabaseName: dbName,
	})
	if err != nil {
		return 0, false, fmt.Errorf("failed to create migration driver: %w", err)
	}

	absPath, err := filepath.Abs(m.migrationsPath)
	if err != nil {
		return 0, false, fmt.Errorf("failed to get absolute path: %w", err)
	}

	migrateInstance, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", absPath),
		dbName,
		driver,
	)
	if err != nil {
		return 0, false, fmt.Errorf("failed to create migration instance: %w", err)
	}

	return migrateInstance.Version()
}

type MigrationLogger struct{}

func (ml *MigrationLogger) Printf(format string, v ...any) {
	log.Printf("[MIGRATION] "+format, v...)
}

func (ml *MigrationLogger) Verbose() bool {
	return true
}
