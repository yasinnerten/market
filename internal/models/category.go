package models

import (
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	ParentID    *uint     `json:"parent_id"`
	Products    []Product `json:"products"`
}
