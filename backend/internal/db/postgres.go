package db

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/yasinnerten/market/internal/logger"
	"github.com/yasinnerten/market/internal/model"
	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() error {
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	logger.Info("Connecting to database",
		zap.String("host", host),
		zap.String("port", port),
		zap.String("database", dbname),
	)

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbname, port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: gormlogger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			gormlogger.Config{
				SlowThreshold:             time.Second,
				LogLevel:                  gormlogger.Info,
				IgnoreRecordNotFoundError: true,
				Colorful:                  false,
			},
		),
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		logger.Error("Failed to connect to database",
			zap.Error(err),
			zap.String("dsn", dsn),
		)
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	// Set connection pool settings
	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("failed to get database instance: %w", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)

	// Skip AutoMigrate if tables already exist
	var count int64
	db.Raw("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = current_schema() AND table_name = 'users'").Scan(&count)

	if count == 0 {
		if err := db.AutoMigrate(&model.User{}); err != nil {
			return fmt.Errorf("failed to migrate database: %w", err)
		}
	}

	DB = db
	logger.Info("Connected to database successfully")
	return nil
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
	err := Connect()
	if err != nil {
		return nil, err
	}
	return GetDB(), nil
}
