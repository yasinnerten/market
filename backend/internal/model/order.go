package model

import "time"

type Order struct {
	ID        uint        `json:"id" gorm:"primaryKey"`
	UserID    uint        `json:"user_id" gorm:"not null"`
	Total     float64     `json:"total" gorm:"not null;type:decimal(10,2)"`
	Status    string      `json:"status" gorm:"not null;default:'pending'"`
	CreatedAt time.Time   `json:"created_at" gorm:"default:CURRENT_TIMESTAMP"`
	Items     []OrderItem `json:"items" gorm:"foreignKey:OrderID"`
}

type OrderItem struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	OrderID   uint      `json:"order_id" gorm:"not null"`
	ProductID uint      `json:"product_id" gorm:"not null"`
	Product   Product   `json:"product" gorm:"foreignKey:ProductID"`
	Quantity  int       `json:"quantity" gorm:"not null"`
	Price     float64   `json:"price" gorm:"not null;type:decimal(10,2)"`
	CreatedAt time.Time `json:"created_at" gorm:"default:CURRENT_TIMESTAMP"`
}

// For creating orders
type CreateOrderInput struct {
	CartID uint `json:"cart_id" binding:"required"`
}

// Order statuses
const (
	OrderStatusPending   = "pending"
	OrderStatusPaid      = "paid"
	OrderStatusShipped   = "shipped"
	OrderStatusDelivered = "delivered"
	OrderStatusCancelled = "cancelled"
)
