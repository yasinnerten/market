package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/yasinnerten/market/internal/handlers"
	"github.com/yasinnerten/market/internal/repository"
	"github.com/yasinnerten/market/internal/services"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Ensure JWT secret is set
	if os.Getenv("JWT_SECRET") == "" {
		log.Fatal("JWT_SECRET is not set in .env file")
	}

	// Initialize database
	db := repository.InitDB()
	db.AutoMigrate(&repository.UserRepository{})

	// Initialize dependencies
	userRepo := repository.NewUserRepository(db)
	authService := services.NewAuthService(userRepo)
	authHandler := handlers.NewAuthHandler(authService)

	// Create router
	r := gin.Default()

	// Health check
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "E-commerce API is running!"})
	})

	// Auth routes
	authRoutes := r.Group("/auth")
	{
		authRoutes.POST("/register", authHandler.RegisterUser)
		authRoutes.POST("/login", authHandler.LoginUser)
	}

	// Start server
	port := "8080"
	fmt.Println("Server is running on port:", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
