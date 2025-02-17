package models

import (
	"gorm.io/gorm"
	"time"
)

type Order struct {
	gorm.Model
	UserID    uint      `gorm:"not null" json:"user_id"`
	ProductID uint      `gorm:"not null" json:"product_id"`
	Quantity  int       `gorm:"not null" json:"quantity"`
	Total     float64   `gorm:"not null" json:"total"`
	CreatedAt time.Time `json:"created_at"`
}
