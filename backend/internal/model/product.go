package model

import "time"

type Product struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	Name        string     `json:"name" gorm:"not null"`
	Description string     `json:"description"`
	Price       float64    `json:"price" gorm:"not null;type:decimal(10,2)"`
	Stock       int        `json:"stock" gorm:"not null;default:0"`
	ImageURL    string     `json:"image_url"`
	CreatedAt   time.Time  `json:"created_at" gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt   time.Time  `json:"updated_at" gorm:"default:CURRENT_TIMESTAMP"`
	DeletedAt   *time.Time `json:"-" gorm:"index"`
}

// For creating/updating products
type ProductInput struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price" binding:"required,min=0"`
	Stock       int     `json:"stock" binding:"required,min=0"`
	ImageURL    string  `json:"image_url"`
}
