package validation

import (
	"multistep-registration/internal/constants"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Validator func(c *gin.Context) []Error

type Chain struct {
	validators []Validator
}

type Error struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

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
	chain.Add(PhoneNumberValidator())

	return chain
}

func (vc *Chain) Add(validator Validator) {
	vc.validators = append(vc.validators, validator)
}

func (vc *Chain) Validate(c *gin.Context) []Error {
	var allErrors []Error

	for _, validator := range vc.validators {
		errors := validator(c)
		if len(errors) > 0 {
			allErrors = append(allErrors, errors...)
			// If first validator fails there is no reason to run next one
			break
		}
	}

	return allErrors
}

func (vc *Chain) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		errors := vc.Validate(c)

		if len(errors) > 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"code":   constants.CodeValidationError,
				"errors": errors,
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
