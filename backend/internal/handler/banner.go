package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/yasinnerten/market/internal/model"
	"gorm.io/gorm"
)

type BannerHandler struct {
	db *gorm.DB
}

func NewBannerHandler(db *gorm.DB) *BannerHandler {
	return &BannerHandler{db: db}
}

// GetActive returns currently active banner
func (h *BannerHandler) GetActive(c *gin.Context) {
	var banner model.Banner
	now := time.Now()

	err := h.db.Where("is_active = ? AND start_date <= ? AND (end_date IS NULL OR end_date >= ?)",
		true, now, now).First(&banner).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No active banner found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banner})
}

// GetAll returns all banners (admin only)
func (h *BannerHandler) GetAll(c *gin.Context) {
	var banners []model.Banner
	if err := h.db.Find(&banners).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch banners"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": banners})
}

// Create creates a new banner (admin only)
func (h *BannerHandler) Create(c *gin.Context) {
	var banner model.Banner
	if err := c.ShouldBindJSON(&banner); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Create(&banner).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create banner"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": banner})
}

// Update updates a banner (admin only)
func (h *BannerHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var banner model.Banner

	if err := h.db.First(&banner, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Banner not found"})
		return
	}

	if err := c.ShouldBindJSON(&banner); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Save(&banner).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update banner"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banner})
}

// Delete deletes a banner (admin only)
func (h *BannerHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.db.Delete(&model.Banner{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete banner"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": "Banner deleted successfully"})
}
