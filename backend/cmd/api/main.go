package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/yasinnerten/market/internal/db"
	"github.com/yasinnerten/market/internal/handler"
	"github.com/yasinnerten/market/internal/logger"
	"github.com/yasinnerten/market/internal/middleware"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

func main() {
	// Initialize logger
	logger.Init()
	defer logger.Sync()

	// Initialize database
	database, err := db.InitDB()
	if err != nil {
		logger.Fatal("Failed to initialize database", zap.Error(err))
	}

	// Create admin user if not exists
	if err := db.InitializeAdmin(database); err != nil {
		logger.Fatal("Failed to create admin user", zap.Error(err))
	}

	// Initialize router
	router := gin.Default()

	// Apply global middleware
	router.Use(middleware.CORS())

	// Initialize handlers
	healthHandler := handler.NewHealthHandler()
	authHandler := handler.NewAuthHandler(database)
	productHandler := handler.NewProductHandler(database)
	cartHandler := handler.NewCartHandler(database)
	orderHandler := handler.NewOrderHandler(database)
	adminHandler := handler.NewAdminHandler(database)
	bannerHandler := handler.NewBannerHandler(database)

	// Health check route
	router.GET("/health", healthHandler.Check)

	// Auth routes
	auth := router.Group("/api/auth")
	{
		auth.POST("/login", authHandler.Login)
		auth.POST("/register", authHandler.Register)
		auth.GET("/me", middleware.AuthRequired(), authHandler.Me)
	}

	// Product routes
	router.GET("/api/products", productHandler.List)
	router.GET("/api/products/:id", productHandler.Get)

	// Protected routes
	protected := router.Group("")
	protected.Use(middleware.AuthRequired())
	{
		// Cart routes
		protected.GET("/cart", cartHandler.Get)
		protected.POST("/cart/items", cartHandler.AddItem)
		protected.PUT("/cart/items/:id", cartHandler.UpdateItem)
		protected.DELETE("/cart/items/:id", cartHandler.RemoveItem)

		// Order routes
		protected.GET("/orders", orderHandler.List)
		protected.POST("/orders", orderHandler.Create)
		protected.GET("/orders/:id", orderHandler.Get)
	}

	// Admin routes
	admin := router.Group("/admin")
	admin.Use(middleware.AuthRequired(), adminHandler.AdminRequired())
	{
		// Product management
		admin.POST("/products", adminHandler.CreateProduct)
		admin.PUT("/products/:id", adminHandler.UpdateProduct)
		admin.DELETE("/products/:id", adminHandler.DeleteProduct)

		// Analytics
		admin.GET("/analytics", adminHandler.GetAnalytics)

		// Content management
		admin.GET("/about", adminHandler.GetAboutContent)
		admin.PUT("/about", adminHandler.UpdateAboutContent)

		// Banner management
		admin.GET("/banners", bannerHandler.GetAll)
		admin.POST("/banners", bannerHandler.Create)
		admin.PUT("/banners/:id", bannerHandler.Update)
		admin.DELETE("/banners/:id", bannerHandler.Delete)
	}

	// Public banner routes
	router.GET("/banners/active", bannerHandler.GetActive)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	logger.Info("Server starting on port " + port)
	if err := router.Run(":" + port); err != nil {
		logger.Fatal("Failed to start server", zap.Error(err))
	}
}

func setupRoutes(r *gin.Engine, db *gorm.DB) {
	// Initialize handlers
	productHandler := handler.NewProductHandler(db)

	// Public routes
	r.GET("/api/products", productHandler.List)
	r.GET("/api/products/:id", productHandler.Get)

	// ... rest of route setup ...
}
