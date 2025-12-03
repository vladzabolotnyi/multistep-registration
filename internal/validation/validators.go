package validation

import (
	"fmt"
	"multistep-registration/internal/context"
	"multistep-registration/internal/domain"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// FIX: If request is missing in context I should handle this. Because now if its missing everything is skipped.
// I'd live to avoid it.

// RequiredFieldsValidator validates that required fields are present
func RequiredFieldsValidator() Validator {
	return func(c *gin.Context) []Error {
		var req domain.RegistrationRequest

		if err := c.ShouldBindJSON(&req); err != nil {
			var errors []Error
			if validationErrors, ok := err.(validator.ValidationErrors); ok {
				for _, fieldErr := range validationErrors {
					errors = append(errors, Error{
						Field:   strings.ToLower(fieldErr.Field()),
						Message: getValidationMessage(fieldErr),
					})
				}
			}
			return errors
		}

		context.SetRegistrationRequest(c, &req)

		return nil
	}
}

// EmailFormatValidator validates email format
func EmailFormatValidator() Validator {
	return func(c *gin.Context) []Error {
		req, exists := context.GetRegistrationRequest(c)
		if !exists {
			return nil
		}

		emailRegex := `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`

		if match, _ := regexp.MatchString(emailRegex, req.Email); !match {
			return []Error{{
				Field:   "email",
				Message: "Invalid email format",
			}}
		}

		return nil
	}
}

// PasswordStrengthValidator validates password strength
func PasswordStrengthValidator() Validator {
	return func(c *gin.Context) []Error {
		req, exists := context.GetRegistrationRequest(c)
		if !exists {
			return nil
		}

		if len(req.Password) < 8 {
			return []Error{{
				Field:   "password",
				Message: "Password must be at least 8 characters long",
			}}
		}

		hasUpper := false
		hasLower := false
		hasDigit := false
		hasSpecial := false

		for _, char := range req.Password {
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

		var errors []Error
		if !hasUpper {
			errors = append(errors, Error{
				Field:   "password",
				Message: "Password must contain at least one uppercase letter",
			})
		}
		if !hasLower {
			errors = append(errors, Error{
				Field:   "password",
				Message: "Password must contain at least one lowercase letter",
			})
		}
		if !hasDigit {
			errors = append(errors, Error{
				Field:   "password",
				Message: "Password must contain at least one number",
			})
		}
		if !hasSpecial {
			errors = append(errors, Error{
				Field:   "password",
				Message: "Password must contain at least one special character",
			})
		}

		return errors
	}
}

// PasswordMatchValidator validates password confirmation
func PasswordMatchValidator() Validator {
	return func(c *gin.Context) []Error {
		req, exists := context.GetRegistrationRequest(c)
		if !exists {
			return nil
		}

		if req.Password != req.ConfirmPassword {
			return []Error{{
				Field:   "confirmPassword",
				Message: "Passwords do not match",
			}}
		}

		return nil
	}
}

// UsernameFormatValidator validates username format
func UsernameFormatValidator() Validator {
	return func(c *gin.Context) []Error {
		req, exists := context.GetRegistrationRequest(c)
		if !exists {
			return nil
		}

		usernameRegex := `^[a-zA-Z0-9]{6,50}$`

		if match, _ := regexp.MatchString(usernameRegex, req.Username); !match {
			return []Error{{
				Field:   "username",
				Message: "Username must be 6-50 characters and contain only letters and numbers",
			}}
		}

		return nil
	}
}

// TermsAcceptanceValidator validates terms acceptance
func TermsAcceptanceValidator() Validator {
	return func(c *gin.Context) []Error {
		req, exists := context.GetRegistrationRequest(c)
		if !exists {
			return nil
		}

		if !req.AcceptTerms {
			return []Error{{
				Field:   "acceptTerms",
				Message: "You must accept the terms and conditions",
			}}
		}

		return nil
	}
}

// CountryEmailDomainValidator validates country/email domain match (cross-field validation)
// FIX: Fix this validator
func CountryEmailDomainValidator() Validator {
	return func(c *gin.Context) []Error {
		// req, exists := c.Get("registrationRequest")
		// if !exists {
		// 	return nil
		// }

		// registrationReq := req.(domain.RegistrationRequest)

		// // Example: If country is US, require common US domains
		// if registrationReq.Country == "US" {
		// 	usDomains := []string{".com", ".org", ".edu", ".gov", ".net"}
		// 	emailLower := strings.ToLower(registrationReq.Email)
		//
		// 	hasValidDomain := false
		// 	for _, domain := range usDomains {
		// 		if strings.HasSuffix(emailLower, domain) {
		// 			hasValidDomain = true
		// 			break
		// 		}
		// 	}
		//
		// 	if !hasValidDomain {
		// 		return []Error{{
		// 			Field:   "email",
		// 			Message: "For US registrations, please use a .com, .org, .edu, .gov, or .net email address",
		// 			Code:    "INVALID_EMAIL_DOMAIN_FOR_COUNTRY",
		// 		}}
		// 	}
		// }

		return nil
	}
}

// PhoneNumberValidator validates phone number format
func PhoneNumberValidator() Validator {
	return func(c *gin.Context) []Error {
		req, exists := context.GetRegistrationRequest(c)
		if !exists {
			return nil
		}

		if req.PhoneNumber != nil && *req.PhoneNumber != "" {
			phoneRegex := `^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$`
			if match, _ := regexp.MatchString(phoneRegex, *req.PhoneNumber); !match {
				return []Error{{
					Field:   "phoneNumber",
					Message: "Invalid phone number format",
				}}
			}
		}

		return nil
	}
}

func getValidationMessage(fieldErr validator.FieldError) string {
	switch fieldErr.Tag() {
	case "required":
		return "This field is required"
	case "email":
		return "Invalid email format"
	case "min":
		return fmt.Sprintf("Minimum length is %s", fieldErr.Param())
	case "max":
		return fmt.Sprintf("Maximum length is %s", fieldErr.Param())
	case "alphanum":
		return "Must contain only letters and numbers"
	case "eqfield":
		return fmt.Sprintf("Must match %s field", fieldErr.Param())
	case "eq":
		return "Must be accepted"
	default:
		return "Invalid value"
	}
}
