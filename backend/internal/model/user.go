package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email     string    `gorm:"uniqueIndex:idx_users_email;type:varchar(255)"`
	Password  string    `gorm:"type:varchar(255)"`
	Name      string    `gorm:"type:varchar(100)"`
	IsAdmin   bool      `gorm:"default:false"`
	Role      string    `gorm:"default:user" json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// For user registration
type RegisterInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Name     string `json:"name" binding:"required"`
}

// For user login
type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// For JWT response
type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
