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

func GetRegistrationRequestOrError(c *gin.Context) (*domain.RegistrationRequest, error) {
	req, exists := GetRegistrationRequest(c)
	if !exists {
		return nil, ErrRequestNotFound
	}
	return req, nil
}

// MustGetRegistrationRequest gets registration request from context or panics
// Use only when you're 100% sure the request should be there
func MustGetRegistrationRequest(c *gin.Context) *domain.RegistrationRequest {
	req, err := GetRegistrationRequestOrError(c)
	if err != nil {
		panic(err)
	}
	return req
}

var (
	ErrRequestNotFound = NewContextError("request not found in context")
)

type Error struct {
	message string
}

func NewContextError(message string) *Error {
	return &Error{message: message}
}

func (e *Error) Error() string {
	return e.message
}
