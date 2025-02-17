package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/yasinnerten/market/internal/api"
	"github.com/yasinnerten/market/internal/config"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize router
	router := gin.Default()

	// Setup routes and middleware
	api.SetupRoutes(router)

	// Start server
	if err := router.Run(cfg.Server.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
