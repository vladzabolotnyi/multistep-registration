package context

import (
	"multistep-registration/internal/domain"

	"github.com/gin-gonic/gin"
)

type Key string

const (
	RegistrationRequestKey Key = "registration_request"
)

func SetRegistrationRequest(c *gin.Context, req *domain.RegistrationRequest) {
	c.Set(string(RegistrationRequestKey), req)
}

func GetRegistrationRequest(c *gin.Context) (*domain.RegistrationRequest, bool) {
	val, exists := c.Get(string(RegistrationRequestKey))
	if !exists {
		return nil, false
	}

	req, ok := val.(*domain.RegistrationRequest)
	if !ok {
		return nil, false
	}

	return req, true
}

func MustGetRegistrationRequest(c *gin.Context) (*domain.RegistrationRequest, error) {
	req, exists := GetRegistrationRequest(c)
	if !exists {
		return nil, gin.Error{
			Err:  ErrRequestNotFound,
			Type: gin.ErrorTypePublic,
			Meta: "Registration request not found in context",
		}
	}
	return req, nil
}

var (
	ErrRequestNotFound = NewContextError("request not found in context")
)

type ContextError struct {
	message string
}

func NewContextError(message string) *ContextError {
	return &ContextError{message: message}
}

func (e *ContextError) Error() string {
	return e.message
}
