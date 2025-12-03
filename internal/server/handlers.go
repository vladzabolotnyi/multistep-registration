package server

import (
	"fmt"
	"multistep-registration/internal/domain"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func (s *Server) Register(c *gin.Context) {
	var req domain.RegistrationRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Code:    "VALIDATION_ERROR",
			Message: "Invalid request data",
			Errors:  parseValidationErrors(err),
		})
		return
	}

	if validationErrors := s.userService.ValidateRegistration(&req); len(validationErrors) > 0 {
		errors := make(map[string]string)
		for _, err := range validationErrors {
			errors[err.Field] = err.Message
		}

		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Code:    "VALIDATION_ERROR",
			Message: "Validation failed",
			Errors:  errors,
		})
		return
	}

	resp, err := s.userService.Register(c.Request.Context(), &req)
	if err != nil {
		if strings.Contains(err.Error(), "already") {
			c.JSON(http.StatusConflict, domain.ErrorResponse{
				Code:    "DUPLICATE_ERROR",
				Message: err.Error(),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Code:    "INTERNAL_ERROR",
			Message: "Failed to process registration",
		})
		return
	}

	c.JSON(http.StatusCreated, resp)
}

// CheckUsername handles username availability check
func (s *Server) CheckUsername(c *gin.Context) {
	username := c.Query("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Code:    "VALIDATION_ERROR",
			Message: "Username is required",
		})
		return
	}

	available, err := s.userService.CheckUsernameAvailability(c.Request.Context(), username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Code:    "INTERNAL_ERROR",
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
			Code:    "VALIDATION_ERROR",
			Message: "Email is required",
		})
		return
	}

	available, err := s.userService.CheckEmailAvailability(c.Request.Context(), email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Code:    "INTERNAL_ERROR",
			Message: "Failed to check email availability",
		})
		return
	}

	c.JSON(http.StatusOK, domain.AvailabilityResponse{
		Available: available,
		Message:   getAvailabilityMessage("email", email, available),
	})
}

func getAvailabilityMessage(field, value string, available bool) string {
	if available {
		return fmt.Sprintf("%s '%s' is available", field, value)
	}
	return fmt.Sprintf("%s '%s' is already taken", field, value)
}

func parseValidationErrors(err error) map[string]string {
	errors := make(map[string]string)

	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, fieldErr := range validationErrors {
			field := strings.ToLower(fieldErr.Field())
			switch fieldErr.Tag() {
			case "required":
				errors[field] = "This field is required"
			case "email":
				errors[field] = "Invalid email format"
			case "min":
				errors[field] = fmt.Sprintf("Minimum length is %s", fieldErr.Param())
			case "max":
				errors[field] = fmt.Sprintf("Maximum length is %s", fieldErr.Param())
			case "alphanum":
				errors[field] = "Must contain only letters and numbers"
			case "eqfield":
				errors[field] = fmt.Sprintf("Must match %s field", fieldErr.Param())
			default:
				errors[field] = "Invalid value"
			}
		}
	} else {
		errors["general"] = err.Error()
	}

	return errors
}
