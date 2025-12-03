package server

import (
	"errors"
	"multistep-registration/internal/context"
	"multistep-registration/internal/domain"
	"multistep-registration/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Register handles user creation
func (s *Server) Register(c *gin.Context) {
	req, exists := context.GetRegistrationRequest(c)

	if !exists {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Code:    CodeValidationError,
			Message: "Invalid request data",
		})
		return
	}

	resp, err := s.userService.Register(c.Request.Context(), req)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrUsernameAlreadyTaken) || errors.Is(err, service.ErrEmailAlreadyRegistered):
			c.JSON(http.StatusConflict, domain.ErrorResponse{
				Code:    CodeDuplicateError,
				Message: err.Error(),
			})
		default:
			c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
				Code:    CodeInternalError,
				Message: "Failed to process registration",
			})
		}
		return
	}

	c.JSON(http.StatusCreated, resp)
}

// CheckUsername handles username availability check
func (s *Server) CheckUsername(c *gin.Context) {
	username := c.Query("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Code:    CodeValidationError,
			Message: "Username is required",
		})
		return
	}

	available, err := s.userService.CheckUsernameAvailability(c.Request.Context(), username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Code:    CodeInternalError,
			Message: "Failed to check username availability",
		})
		return
	}

	c.JSON(http.StatusOK, domain.AvailabilityResponse{
		Available: available,
		Message:   getAvailabilityMessage("username", username, available),
	})
}

// CheckEmail handles email availability check
func (s *Server) CheckEmail(c *gin.Context) {
	email := c.Query("email")
	if email == "" {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Code:    CodeValidationError,
			Message: "Email is required",
		})
		return
	}

	available, err := s.userService.CheckEmailAvailability(c.Request.Context(), email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Code:    CodeInternalError,
			Message: "Failed to check email availability",
		})
		return
	}

	c.JSON(http.StatusOK, domain.AvailabilityResponse{
		Available: available,
		Message:   getAvailabilityMessage("email", email, available),
	})
}
