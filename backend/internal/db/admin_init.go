package db

import (
	"os"

	"github.com/yasinnerten/market/internal/logger"
	"github.com/yasinnerten/market/internal/model"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func InitializeAdmin(db *gorm.DB) error {
	var count int64
	if err := db.Model(&model.User{}).Where("role = ?", "admin").Count(&count).Error; err != nil {
		logger.Error("Failed to check admin existence", zap.Error(err))
		return nil // Don't fail the application, just log the error
	}

	if count > 0 {
		return nil // Admin already exists
	}

	// Create admin user
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(os.Getenv("ADMIN_PASSWORD")), bcrypt.DefaultCost)
	if err != nil {
		logger.Error("Failed to hash password", zap.Error(err))
		return nil
	}

	admin := model.User{
		Name:     os.Getenv("ADMIN_NAME"),
		Email:    os.Getenv("ADMIN_EMAIL"),
		Password: string(hashedPassword),
		Role:     "admin",
	}

	if err := db.Create(&admin).Error; err != nil {
		logger.Error("Failed to create admin user", zap.Error(err))
		return nil
	}

	logger.Info("Admin user created successfully")
	return nil
}
