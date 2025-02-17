#!/bin/bash

# Create directory structure
mkdir -p cmd/api
mkdir -p config
mkdir -p internal/{api/{handlers,routes},config,middleware,models,repository,service,utils}
mkdir -p pkg/logger
mkdir -p migrations

# Create main.go
cat > cmd/api/main.go << 'EOF'
package main

import (
    "log"

    "github.com/yasinnerten/market/internal/config"
    "github.com/yasinnerten/market/internal/api"
    "github.com/gin-gonic/gin"
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
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Binaries
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary, built with `go test -c`
*.test

# Output of the go coverage tool
*.out

# Dependency directories
vendor/

# IDE specific files
.idea/
.vscode/
*.swp
*.swo

# Environment variables
.env

# Build directory
build/
EOF

# Create empty Dockerfile
touch Dockerfile

# Create empty docker-compose.yml
touch docker-compose.yml

# Make the script executable
chmod +x setup.sh

echo "Project structure created successfully!" 