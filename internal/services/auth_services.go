package services

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/yasinnerten/market/internal/models"
	"github.com/yasinnerten/market/internal/repository"
)

type AuthService struct {
	UserRepo *repository.UserRepository
}

func NewAuthService(userRepo *repository.UserRepository) *AuthService {
	return &AuthService{UserRepo: userRepo}
}

// Generate JWT Token
func GenerateToken(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := os.Getenv("JWT_SECRET")
	return token.SignedString([]byte(secret))
}

// Register User
func (s *AuthService) RegisterUser(user *models.User) (string, error) {
	// Hash password
	if err := user.HashPassword(); err != nil {
		return "", err
	}

	// Save user
	err := s.UserRepo.CreateUser(user)
	if err != nil {
		return "", err
	}

	// Generate JWT
	token, err := GenerateToken(user.ID)
	return token, err
}

// Login User
func (s *AuthService) LoginUser(email, password string) (string, error) {
	user, err := s.UserRepo.GetUserByEmail(email)
	if err != nil {
		return "", errors.New("invalid email or password")
	}

	// Check password
	if !user.CheckPassword(password) {
		return "", errors.New("invalid email or password")
	}

	// Generate JWT
	token, err := GenerateToken(user.ID)
	return token, err
}
