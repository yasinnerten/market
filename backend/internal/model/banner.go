package model

import "time"

type Banner struct {
	ID        uint       `json:"id" gorm:"primaryKey"`
	Title     string     `json:"title" gorm:"not null"`
	ImageURL  string     `json:"image_url" gorm:"not null"`
	Link      string     `json:"link"`
	IsActive  bool       `json:"is_active" gorm:"default:false"`
	StartDate time.Time  `json:"start_date"`
	EndDate   time.Time  `json:"end_date"`
	CreatedAt time.Time  `json:"created_at" gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time  `json:"updated_at" gorm:"default:CURRENT_TIMESTAMP"`
	DeletedAt *time.Time `json:"-" gorm:"index"`
}
