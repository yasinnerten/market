package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yasinnerten/market/internal/db"
	"github.com/yasinnerten/market/internal/model"
	"gorm.io/gorm"
)

type OrderHandler struct {
	db *gorm.DB
}

func NewOrderHandler(db *gorm.DB) *OrderHandler {
	return &OrderHandler{db: db}
}

func (h *OrderHandler) List(c *gin.Context) {
	userID := c.GetUint("user_id")
	var orders []model.Order
	if err := h.db.Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}
	c.JSON(http.StatusOK, orders)
}

func (h *OrderHandler) Get(c *gin.Context) {
	userID := c.GetUint("user_id")
	orderID := c.Param("id")

	var order model.Order
	if err := h.db.Preload("Items.Product").Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, order)
}

func (h *OrderHandler) Create(c *gin.Context) {
	userID := c.GetUint("user_id")

	// Start transaction
	err := h.db.Transaction(func(tx *gorm.DB) error {
		// Get cart with items
		var cart model.Cart
		if err := tx.Preload("Items.Product").Where("user_id = ?", userID).First(&cart).Error; err != nil {
			return err
		}

		if len(cart.Items) == 0 {
			return fmt.Errorf("cart is empty")
		}

		// Create order
		order := model.Order{
			UserID: userID,
			Status: "pending",
		}

		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		// Create order items and update product stock
		var total float64
		for _, cartItem := range cart.Items {
			// Check stock availability
			if cartItem.Product.Stock < cartItem.Quantity {
				return fmt.Errorf("insufficient stock for product: %s", cartItem.Product.Name)
			}

			// Create order item
			orderItem := model.OrderItem{
				OrderID:   order.ID,
				ProductID: cartItem.ProductID,
				Quantity:  cartItem.Quantity,
				Price:     cartItem.Product.Price,
			}

			if err := tx.Create(&orderItem).Error; err != nil {
				return err
			}

			// Update product stock
			cartItem.Product.Stock -= cartItem.Quantity
			if err := tx.Save(&cartItem.Product).Error; err != nil {
				return err
			}

			total += float64(cartItem.Quantity) * cartItem.Product.Price
		}

		// Update order total
		order.Total = total
		if err := tx.Save(&order).Error; err != nil {
			return err
		}

		// Clear cart
		if err := tx.Delete(&cart.Items).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Order created successfully"})
}

func CreateOrder(c *gin.Context) {
	var input model.CreateOrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetUint("user_id")

	// Get cart
	var cart model.Cart
	if err := db.GetDB().Preload("Items.Product").First(&cart, input.CartID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	if cart.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not your cart"})
		return
	}

	// Create order in transaction
	var order model.Order
	err := db.Transaction(func(tx *gorm.DB) error {
		// Create order
		order = model.Order{
			UserID: userID,
			Total:  cart.Total,
			Status: model.OrderStatusPending,
		}
		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		// Create order items
		for _, cartItem := range cart.Items {
			orderItem := model.OrderItem{
				OrderID:   order.ID,
				ProductID: cartItem.ProductID,
				Quantity:  cartItem.Quantity,
				Price:     cartItem.Price,
			}
			if err := tx.Create(&orderItem).Error; err != nil {
				return err
			}

			// Update product stock
			if err := tx.Model(&cartItem.Product).
				Update("stock", cartItem.Product.Stock-cartItem.Quantity).Error; err != nil {
				return err
			}
		}

		// Clear cart
		return tx.Delete(&cart).Error
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Load complete order with items
	if err := db.GetDB().Preload("Items.Product").First(&order, order.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load order"})
		return
	}

	c.JSON(http.StatusCreated, order)
}

func GetOrder(c *gin.Context) {
	var order model.Order
	if err := db.GetDB().Preload("Items.Product").First(&order, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	if order.UserID != c.GetUint("user_id") {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not your order"})
		return
	}

	c.JSON(http.StatusOK, order)
}

func ListOrders(c *gin.Context) {
	userID := c.GetUint("user_id")
	var orders []model.Order

	if err := db.GetDB().Preload("Items.Product").
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	c.JSON(http.StatusOK, orders)
}
