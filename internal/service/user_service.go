package service

import (
	"context"
	"errors"
	"fmt"
	"multistep-registration/internal/domain"
	"multistep-registration/internal/repository"
	"regexp"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrEmailAlreadyRegistered = errors.New("email already registered")
	ErrUsernameAlreadyTaken   = errors.New("username already taken")
)

type UserService interface {
	Register(ctx context.Context, req *domain.RegistrationRequest) (*domain.RegistrationResponse, error)
	CheckUsernameAvailability(ctx context.Context, username string) (bool, error)
	CheckEmailAvailability(ctx context.Context, email string) (bool, error)
	ValidateRegistration(req *domain.RegistrationRequest) []domain.ValidationError
}

type userService struct {
	repo repository.UserRepository
	cost int
}

func NewUserService(repo repository.UserRepository, cost int) UserService {
	return &userService{
		repo: repo,
		cost: cost,
	}
}

func (s *userService) Register(ctx context.Context, req *domain.RegistrationRequest) (*domain.RegistrationResponse, error) {
	if errors := s.ValidateRegistration(req); len(errors) > 0 {
		return nil, fmt.Errorf("validation failed: %v", errors)
	}

	emailExists, err := s.repo.CheckEmailExists(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to check email: %w", err)
	}
	if emailExists {
		return nil, ErrEmailAlreadyRegistered
	}

	usernameExists, err := s.repo.CheckUsernameExists(ctx, req.Username)
	if err != nil {
		return nil, fmt.Errorf("failed to check username: %w", err)
	}
	if usernameExists {
		return nil, ErrUsernameAlreadyTaken
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), s.cost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	user := &domain.User{
		FirstName:     req.FirstName,
		LastName:      req.LastName,
		Email:         req.Email,
		PhoneNumber:   req.PhoneNumber,
		StreetAddress: req.StreetAddress,
		City:          req.City,
		State:         req.State,
		Country:       req.Country,
		Username:      req.Username,
		PasswordHash:  passwordHash,
		AcceptTerms:   req.AcceptTerms,
		Newsletter:    req.Newsletter,
	}

	if err := s.repo.CreateUser(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to create user in database: %w", err)
	}

	return &domain.RegistrationResponse{
		ID:        user.ID.String(),
		Username:  user.Username,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		Message:   "Registration successful",
	}, nil
}

func (s *userService) CheckUsernameAvailability(ctx context.Context, username string) (bool, error) {
	if !isValidUsername(username) {
		return false, nil
	}

	exists, err := s.repo.CheckUsernameExists(ctx, username)
	if err != nil {
		return false, fmt.Errorf("failed to check username: %w", err)
	}
	return !exists, nil
}

func (s *userService) CheckEmailAvailability(ctx context.Context, email string) (bool, error) {
	if !isValidEmail(email) {
		return false, nil
	}

	exists, err := s.repo.CheckEmailExists(ctx, email)
	if err != nil {
		return false, fmt.Errorf("failed to check email: %w", err)
	}
	return !exists, nil
}

func (s *userService) ValidateRegistration(req *domain.RegistrationRequest) []domain.ValidationError {
	var errors []domain.ValidationError

	if !isStrongPassword(req.Password) {
		errors = append(errors, domain.ValidationError{
			Field:   "password",
			Message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
		})
	}

	// Country/email domain validation (example: if country is US, email should be .com, .org, etc.)
	// if req.Country == "US" && !isValidUSEmail(req.Email) {
	// 	errors = append(errors, domain.ValidationError{
	// 		Field:   "email",
	// 		Message: "For US registrations, please use a .com, .org, .edu, or .gov email address",
	// 	})
	// }

	return errors
}

// Helper functions
func isValidUsername(username string) bool {
	// Alphanumeric, 3-50 characters
	match, _ := regexp.MatchString(`^[a-zA-Z0-9]{3,50}$`, username)
	return match
}

func isValidEmail(email string) bool {
	// Simple email regex for validation
	emailRegex := `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`
	match, _ := regexp.MatchString(emailRegex, email)
	return match
}

func isValidUSEmail(email string) bool {
	// Check if email has a US domain
	usDomains := []string{".com", ".org", ".edu", ".gov", ".net"}
	emailLower := strings.ToLower(email)
	for _, domain := range usDomains {
		if strings.HasSuffix(emailLower, domain) {
			return true
		}
	}
	return false
}

func isStrongPassword(password string) bool {
	if len(password) < 8 {
		return false
	}

	hasUpper := false
	hasLower := false
	hasDigit := false
	hasSpecial := false

	for _, char := range password {
		switch {
		case 'A' <= char && char <= 'Z':
			hasUpper = true
		case 'a' <= char && char <= 'z':
			hasLower = true
		case '0' <= char && char <= '9':
			hasDigit = true
		case strings.ContainsRune("!@#$%^&*()_+-=[]{}|;:,.<>?", char):
			hasSpecial = true
		}
	}

	return hasUpper && hasLower && hasDigit && hasSpecial
}
