package validation

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Validator is a function that validates a request
type Validator func(c *gin.Context) []Error

// Chain represents a chain of validators
type Chain struct {
	validators []Validator
}

// Error represents a validation error
type Error struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// NewValidationChain creates a new validation chain
func NewValidationChain() *Chain {
	return &Chain{
		validators: []Validator{},
	}
}

func CreateDefaultRegistrationChain() *Chain {
	chain := NewValidationChain()

	// RequiredFieldsValidator is setting request in context, the order matters
	chain.Add(RequiredFieldsValidator())
	chain.Add(EmailFormatValidator())
	chain.Add(PasswordStrengthValidator())
	chain.Add(PasswordMatchValidator())
	chain.Add(UsernameFormatValidator())
	chain.Add(TermsAcceptanceValidator())
	chain.Add(CountryEmailDomainValidator())
	chain.Add(PhoneNumberValidator())

	return chain
}

// Add adds a validator to the chain
func (vc *Chain) Add(validator Validator) {
	vc.validators = append(vc.validators, validator)
}

// Validate runs all validators in the chain
func (vc *Chain) Validate(c *gin.Context) []Error {
	var allErrors []Error

	for _, validator := range vc.validators {
		if errors := validator(c); len(errors) > 0 {
			allErrors = append(allErrors, errors...)
		}
	}

	return allErrors
}

// Middleware creates a Gin middleware from the validation chain
func (vc *Chain) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		errors := vc.Validate(c)

		if len(errors) > 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"code":   "VALIDATION_ERROR",
				"errors": errors,
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
