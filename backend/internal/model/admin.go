package model

import "gorm.io/gorm"

type AboutContent struct {
	gorm.Model
	Content string `json:"content"`
}

type AdminUser struct {
	gorm.Model
	Email    string `json:"email" gorm:"unique"`
	Password string `json:"-"` // Password hash
	IsAdmin  bool   `json:"is_admin" gorm:"default:false"`
}

// Initial admin credentials will be set via environment variables
const (
	DefaultAdminEmail    = "admin@market.com"
	DefaultAdminPassword = "admin123" // This should be changed after first login
)
