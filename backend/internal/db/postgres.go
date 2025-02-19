package db

import (
	"fmt"
	"os"

	"github.com/yasinnerten/market/internal/logger"
	"github.com/yasinnerten/market/internal/model"
	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() (*gorm.DB, error) {
	host := os.Getenv("POSTGRES_HOST")
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	dbname := os.Getenv("POSTGRES_DB")
	port := os.Getenv("POSTGRES_PORT")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbname, port,
	)

	logger.Info("Connecting to database",
		zap.String("host", host),
		zap.String("port", port),
		zap.String("database", dbname),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		logger.Error("Failed to connect to database",
			zap.Error(err),
			zap.String("dsn", dsn),
		)
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	return db, nil
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return DB
}

// Transaction executes operations in a transaction
func Transaction(fn func(tx *gorm.DB) error) error {
	return DB.Transaction(func(tx *gorm.DB) error {
		return fn(tx)
	})
}

func InitDB() (*gorm.DB, error) {
	db, err := Connect()
	if err != nil {
		return nil, err
	}

	// Run migrations
	if err := RunMigrations(db); err != nil {
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	// Initialize admin user
	if err := InitializeAdmin(db); err != nil {
		return nil, fmt.Errorf("failed to initialize admin: %w", err)
	}

	return db, nil
}

func RunMigrations(db *gorm.DB) error {
	// Auto-migrate models
	if err := db.AutoMigrate(
		&model.User{},
		&model.Product{},
		&model.Cart{},
		&model.CartItem{},
		&model.Order{},
		&model.OrderItem{},
		&model.Banner{},
	); err != nil {
		return fmt.Errorf("failed to auto-migrate: %w", err)
	}

	return nil
}
