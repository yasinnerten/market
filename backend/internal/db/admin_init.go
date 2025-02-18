package db

import (
	"fmt"
	"os"

	"github.com/yasinnerten/market/internal/model"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func InitializeAdmin(db *gorm.DB) error {
	var count int64
	if err := db.Model(&model.User{}).Where("is_admin = ?", true).Count(&count).Error; err != nil {
		return fmt.Errorf("failed to check admin existence: %w", err)
	}

	if count > 0 {
		return nil // Admin already exists
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(os.Getenv("ADMIN_PASSWORD")), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash admin password: %w", err)
	}

	admin := model.User{
		Email:    os.Getenv("ADMIN_EMAIL"),
		Password: string(hashedPassword),
		Name:     "Admin User",
		IsAdmin:  true,
	}

	if err := db.Create(&admin).Error; err != nil {
		return fmt.Errorf("failed to create admin user: %w", err)
	}

	return nil
}

func CreateAdminUser() error {
	var count int64
	DB.Model(&model.User{}).Where("is_admin = ?", true).Count(&count)

	if count == 0 {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		if err != nil {
			return err
		}

		admin := model.User{
			Email:    "admin@gmail.com",
			Password: string(hashedPassword),
			Name:     "Admin User",
			IsAdmin:  true,
		}

		return DB.Create(&admin).Error
	}
	return nil
}
