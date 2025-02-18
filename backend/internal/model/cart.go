package model

import "time"

type Cart struct {
	ID        uint       `json:"id" gorm:"primaryKey"`
	UserID    uint       `json:"user_id" gorm:"not null"`
	Total     float64    `json:"total" gorm:"not null;default:0;type:decimal(10,2)"`
	CreatedAt time.Time  `json:"created_at" gorm:"default:CURRENT_TIMESTAMP"`
	Items     []CartItem `json:"items" gorm:"foreignKey:CartID"`
}

type CartItem struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	CartID    uint      `json:"cart_id" gorm:"not null"`
	ProductID uint      `json:"product_id" gorm:"not null"`
	Product   Product   `json:"product" gorm:"foreignKey:ProductID"`
	Quantity  int       `json:"quantity" gorm:"not null"`
	Price     float64   `json:"price" gorm:"not null;type:decimal(10,2)"`
	CreatedAt time.Time `json:"created_at" gorm:"default:CURRENT_TIMESTAMP"`
	Cart      Cart      // Add this field for the relationship
}

// For adding items to cart
type AddToCartInput struct {
	ProductID uint `json:"product_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,min=1"`
}

// For updating cart items
type UpdateCartItemInput struct {
	Quantity int `json:"quantity" binding:"required,min=0"` // 0 to remove item
}
