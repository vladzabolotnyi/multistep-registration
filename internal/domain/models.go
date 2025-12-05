package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID          uuid.UUID `json:"id" db:"id"`
	FirstName   string    `json:"firstName" db:"first_name"`
	LastName    string    `json:"lastName" db:"last_name"`
	Email       string    `json:"email" db:"email"`
	PhoneNumber *string   `json:"phoneNumber,omitempty" db:"phone_number"`

	StreetAddress string `json:"streetAddress" db:"street_address"`
	City          string `json:"city" db:"city"`
	State         string `json:"state" db:"state"`
	Country       string `json:"country" db:"country"`

	Username     string `json:"username" db:"username"`
	PasswordHash []byte `json:"-" db:"password_hash"`

	AcceptTerms bool `json:"acceptTerms" db:"accept_terms"`
	Newsletter  bool `json:"newsletter" db:"newsletter"`

	CreatedAt time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt time.Time `json:"updatedAt" db:"updated_at"`
	Version   int       `json:"-" db:"version"`
}

type RegistrationRequest struct {
	FirstName   string  `json:"firstName" binding:"required,min=1,max=50"`
	LastName    string  `json:"lastName" binding:"required,min=1,max=50"`
	Email       string  `json:"email" binding:"required,email,min=1,max=100"`
	PhoneNumber *string `json:"phoneNumber,omitempty" binding:"omitempty,min=10,max=20"`

	StreetAddress string `json:"streetAddress" binding:"required,min=1,max=200"`
	City          string `json:"city" binding:"required,min=1,max=100"`
	State         string `json:"state" binding:"required,min=1,max=100"`
	Country       string `json:"country" binding:"required,min=1,max=100"`

	Username        string `json:"username" binding:"required,min=6,max=30,alphanum"`
	Password        string `json:"password" binding:"required,min=8,max=50"`
	ConfirmPassword string `json:"confirmPassword" binding:"required,eqfield=Password"`

	AcceptTerms bool `json:"acceptTerms" binding:"required,eq=true"`
	Newsletter  bool `json:"newsletter"`
}

type RegistrationResponse struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
	Message   string    `json:"message"`
}

type AvailabilityRequest struct {
	Value string `json:"value" binding:"required"`
}

type AvailabilityResponse struct {
	Available bool   `json:"available"`
	Message   string `json:"message"`
}

type ErrorResponse struct {
	Code    string            `json:"code"`
	Message string            `json:"message"`
	Errors  map[string]string `json:"errors,omitempty"`
}
