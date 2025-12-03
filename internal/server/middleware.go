package server

import (
	"log"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
)

// Middleware represents a HTTP middleware function
type Middleware func(c *gin.Context)

// MiddlewareChain represents a chain of middlewares
type MiddlewareChain struct {
	middlewares []Middleware
}

// NewMiddlewareChain creates a new middleware chain
func NewMiddlewareChain() *MiddlewareChain {
	return &MiddlewareChain{
		middlewares: []Middleware{},
	}
}

// Add adds a middleware to the chain
func (mc *MiddlewareChain) Add(middleware Middleware) {
	mc.middlewares = append(mc.middlewares, middleware)
}

// Then executes the chain with the final handler
func (mc *MiddlewareChain) Then(handler gin.HandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Create a wrapper that runs all middlewares
		for i := len(mc.middlewares) - 1; i >= 0; i-- {
			middleware := mc.middlewares[i]
			next := handler
			handler = func(currentMiddleware Middleware, currentHandler gin.HandlerFunc) gin.HandlerFunc {
				return func(c *gin.Context) {
					currentMiddleware(c)
					if !c.IsAborted() {
						currentHandler(c)
					}
				}
			}(middleware, next)
		}
		handler(c)
	}
}

func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Printf("Request: %s %s", c.Request.Method, c.Request.URL.Path)

		c.Next()

		log.Printf("Response: %s %s - %d",
			c.Request.Method, c.Request.URL.Path, c.Writer.Status())
	}
}

func RecoveryMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				stack := debug.Stack()
				log.Printf("PANIC RECOVERED: %v\n%s", err, stack)

				c.JSON(http.StatusInternalServerError, gin.H{
					"code":    "INTERNAL_ERROR",
					"message": "An unexpected error occurred",
				})

				c.Abort()
			}
		}()

		c.Next()
	}
}

func (s *Server) validateRegistrationMiddleware() Middleware {
	return func(c *gin.Context) {
		// This middleware would run before the actual registration handler
		// You can add custom validation logic here
		c.Next()
	}
}
