package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"market/internal/models"
	"market/internal/repository"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize database connection
	db := repository.InitDB()
	db.AutoMigrate(&models.User{}, &models.Product{}, &models.Order{})

	// Create a new Gin router
	r := gin.Default()

	// Health check endpoint
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "E-commerce API is running!"})
	})

	// Start the server
	port := "8080"
	fmt.Println("Server is running on port:", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
