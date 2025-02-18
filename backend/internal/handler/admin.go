package handler

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/yasinnerten/market/internal/model"
	"gorm.io/gorm"
)

type AdminHandler struct {
	db *gorm.DB
}

func NewAdminHandler(db *gorm.DB) *AdminHandler {
	return &AdminHandler{db: db}
}

// Middleware to check admin rights
func (h *AdminHandler) AdminRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		adminUser, ok := user.(*model.AdminUser)
		if !ok || !adminUser.IsAdmin {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin rights required"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// Product Management
func (h *AdminHandler) CreateProduct(c *gin.Context) {
	var product model.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func (h *AdminHandler) UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product model.Product

	if err := h.db.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, product)
}

// Image Upload
func (h *AdminHandler) UploadProductImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)

	// Save file
	path := filepath.Join("uploads", "products", filename)
	if err := c.SaveUploadedFile(file, path); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Update product image URL
	id := c.Param("id")
	var product model.Product
	if err := h.db.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	imageURL := fmt.Sprintf("/uploads/products/%s", filename)
	product.ImageURL = imageURL

	if err := h.db.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": imageURL})
}

// About Page Management
func (h *AdminHandler) GetAboutContent(c *gin.Context) {
	var content model.AboutContent
	if err := h.db.First(&content).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"content": ""}) // Return empty if not found
		return
	}

	c.JSON(http.StatusOK, content)
}

func (h *AdminHandler) UpdateAboutContent(c *gin.Context) {
	var content model.AboutContent
	if err := c.ShouldBindJSON(&content); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Upsert content
	if err := h.db.Where("id = ?", 1).FirstOrCreate(&content).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update content"})
		return
	}

	if err := h.db.Save(&content).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save content"})
		return
	}

	c.JSON(http.StatusOK, content)
}

func (h *AdminHandler) DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	if err := h.db.Delete(&model.Product{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

// GetAnalytics returns dashboard analytics data
func (h *AdminHandler) GetAnalytics(c *gin.Context) {
	// Get time range from query params, default to last 30 days
	days := c.DefaultQuery("days", "30")
	daysInt, _ := strconv.Atoi(days)
	startDate := time.Now().AddDate(0, 0, -daysInt)

	var analytics struct {
		TotalRevenue     float64 `json:"totalRevenue"`
		TotalOrders      int64   `json:"totalOrders"`
		AverageOrderSize float64 `json:"averageOrderSize"`
		TopProducts      []struct {
			ID       uint    `json:"id"`
			Name     string  `json:"name"`
			Sold     int     `json:"sold"`
			Revenue  float64 `json:"revenue"`
			ImageURL string  `json:"imageUrl"`
		} `json:"topProducts"`
		RecentOrders []struct {
			ID        uint      `json:"id"`
			UserEmail string    `json:"userEmail"`
			Total     float64   `json:"total"`
			Status    string    `json:"status"`
			CreatedAt time.Time `json:"createdAt"`
		} `json:"recentOrders"`
		DailyRevenue []struct {
			Date    string  `json:"date"`
			Revenue float64 `json:"revenue"`
		} `json:"dailyRevenue"`
	}

	// Get total revenue and orders
	h.db.Model(&model.Order{}).
		Where("created_at >= ?", startDate).
		Select("COALESCE(SUM(total), 0) as total_revenue, COUNT(*) as total_orders").
		Row().Scan(&analytics.TotalRevenue, &analytics.TotalOrders)

	if analytics.TotalOrders > 0 {
		analytics.AverageOrderSize = analytics.TotalRevenue / float64(analytics.TotalOrders)
	}

	// Get top products
	h.db.Model(&model.OrderItem{}).
		Joins("JOIN products ON order_items.product_id = products.id").
		Joins("JOIN orders ON order_items.order_id = orders.id").
		Where("orders.created_at >= ?", startDate).
		Select(`
			products.id,
			products.name,
			products.image_url,
			SUM(order_items.quantity) as sold,
			SUM(order_items.quantity * order_items.price) as revenue
		`).
		Group("products.id, products.name, products.image_url").
		Order("sold DESC").
		Limit(5).
		Scan(&analytics.TopProducts)

	// Get recent orders
	h.db.Model(&model.Order{}).
		Joins("JOIN users ON orders.user_id = users.id").
		Select("orders.id, users.email as user_email, orders.total, orders.status, orders.created_at").
		Order("orders.created_at DESC").
		Limit(10).
		Scan(&analytics.RecentOrders)

	// Get daily revenue for the period
	h.db.Model(&model.Order{}).
		Where("created_at >= ?", startDate).
		Select("DATE(created_at) as date, COALESCE(SUM(total), 0) as revenue").
		Group("DATE(created_at)").
		Order("date").
		Scan(&analytics.DailyRevenue)

	c.JSON(http.StatusOK, analytics)
}
