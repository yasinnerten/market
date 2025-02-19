package model

import "time"

// AboutContent represents the about page content
type AboutContent struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Initial admin credentials
const (
	DefaultAdminEmail    = "yasinnerten@hotmail.com"
	DefaultAdminPassword = "Deneme01"
)
