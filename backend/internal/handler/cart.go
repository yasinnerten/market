package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yasinnerten/market/internal/db"
	"github.com/yasinnerten/market/internal/model"
	"gorm.io/gorm"
)

type CartHandler struct {
	db *gorm.DB
}

func NewCartHandler(db *gorm.DB) *CartHandler {
	return &CartHandler{db: db}
}

func (h *CartHandler) Get(c *gin.Context) {
	userID := c.GetUint("user_id")
	var cart model.Cart
	if err := h.db.Preload("Items.Product").Where("user_id = ?", userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}
	c.JSON(http.StatusOK, cart)
}

func (h *CartHandler) AddItem(c *gin.Context) {
	userID := c.GetUint("user_id")
	var cartItem model.CartItem
	if err := c.ShouldBindJSON(&cartItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get or create cart
	var cart model.Cart
	result := h.db.Where("user_id = ?", userID).First(&cart)
	if result.Error == gorm.ErrRecordNotFound {
		cart = model.Cart{UserID: userID}
		if err := h.db.Create(&cart).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
			return
		}
	}

	// Check if product exists and has sufficient stock
	var product model.Product
	if err := h.db.First(&product, cartItem.ProductID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if product.Stock < cartItem.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	cartItem.CartID = cart.ID
	if err := h.db.Create(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item to cart"})
		return
	}

	c.JSON(http.StatusCreated, cartItem)
}

func (h *CartHandler) UpdateItem(c *gin.Context) {
	userID := c.GetUint("user_id")
	itemID := c.Param("id")

	var updateData struct {
		Quantity int `json:"quantity" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cartItem model.CartItem
	if err := h.db.Joins("Cart").Where("cart_items.id = ? AND cart.user_id = ?", itemID, userID).First(&cartItem).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	// Check product stock
	var product model.Product
	if err := h.db.First(&product, cartItem.ProductID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if product.Stock < updateData.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	cartItem.Quantity = updateData.Quantity
	if err := h.db.Save(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
		return
	}

	c.JSON(http.StatusOK, cartItem)
}

func (h *CartHandler) RemoveItem(c *gin.Context) {
	userID := c.GetUint("user_id")
	itemID := c.Param("id")

	result := h.db.Joins("Cart").Where("cart_items.id = ? AND cart.user_id = ?", itemID, userID).Delete(&model.CartItem{})
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item removed from cart"})
}

func GetCart(c *gin.Context) {
	userID := c.GetUint("user_id")

	var cart model.Cart
	if err := db.FindBy(&cart, "user_id = ? AND status = 'active'", userID); err != nil {
		// Create new cart if not exists
		cart = model.Cart{
			UserID: userID,
			Total:  0,
		}
		if err := db.Create(&cart); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
			return
		}
	}

	// Load cart items with products
	if err := db.GetDB().Preload("Items.Product").First(&cart, cart.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load cart items"})
		return
	}

	c.JSON(http.StatusOK, cart)
}

func AddToCart(c *gin.Context) {
	var input model.AddToCartInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetUint("user_id")

	// Get or create active cart
	var cart model.Cart
	if err := db.FindBy(&cart, "user_id = ? AND status = 'active'", userID); err != nil {
		cart = model.Cart{UserID: userID}
		if err := db.Create(&cart); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
			return
		}
	}

	// Check product
	var product model.Product
	if err := db.Find(&product, input.ProductID); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Check stock
	if product.Stock < input.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	// Add or update cart item
	err := db.Transaction(func(tx *gorm.DB) error {
		var cartItem model.CartItem
		result := tx.Where("cart_id = ? AND product_id = ?", cart.ID, input.ProductID).First(&cartItem)

		if result.Error == nil {
			// Update existing item
			cartItem.Quantity += input.Quantity
			cartItem.Price = product.Price
			if err := tx.Save(&cartItem).Error; err != nil {
				return err
			}
		} else {
			// Create new item
			cartItem = model.CartItem{
				CartID:    cart.ID,
				ProductID: input.ProductID,
				Quantity:  input.Quantity,
				Price:     product.Price,
			}
			if err := tx.Create(&cartItem).Error; err != nil {
				return err
			}
		}

		// Update cart total
		return updateCartTotal(tx, cart.ID)
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item to cart"})
		return
	}

	// Return updated cart
	if err := db.GetDB().Preload("Items.Product").First(&cart, cart.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load updated cart"})
		return
	}

	c.JSON(http.StatusOK, cart)
}

func updateCartTotal(tx *gorm.DB, cartID uint) error {
	var total float64
	if err := tx.Model(&model.CartItem{}).
		Where("cart_id = ?", cartID).
		Select("SUM(price * quantity)").
		Scan(&total).Error; err != nil {
		return err
	}

	return tx.Model(&model.Cart{}).
		Where("id = ?", cartID).
		Update("total", total).Error
}

func UpdateCartItem(c *gin.Context) {
	var input model.UpdateCartItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetUint("user_id")
	itemID := c.Param("id")

	var cartItem model.CartItem
	if err := db.GetDB().Preload("Cart").First(&cartItem, itemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	// Verify ownership
	if cartItem.Cart.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not your cart"})
		return
	}

	// Check if we should remove the item
	if input.Quantity <= 0 {
		if err := db.Delete(&cartItem); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove item"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Item removed"})
		return
	}

	// Update quantity
	cartItem.Quantity = input.Quantity
	if err := db.Update(&cartItem); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item"})
		return
	}

	// Update cart total
	if err := updateCartTotal(db.GetDB(), cartItem.CartID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart total"})
		return
	}

	c.JSON(http.StatusOK, cartItem)
}

func RemoveCartItem(c *gin.Context) {
	userID := c.GetUint("user_id")
	itemID := c.Param("id")

	var cartItem model.CartItem
	if err := db.GetDB().Preload("Cart").First(&cartItem, itemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	// Verify ownership
	if cartItem.Cart.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not your cart"})
		return
	}

	if err := db.Delete(&cartItem); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove item"})
		return
	}

	// Update cart total
	if err := updateCartTotal(db.GetDB(), cartItem.CartID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart total"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item removed"})
}
