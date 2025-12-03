package server

import (
	"log"
	"net/http"
	"time"

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

// LoggingMiddleware logs request details
func LoggingMiddleware() Middleware {
	return func(c *gin.Context) {
		start := time.Now()

		// Process request
		c.Next()

		// Log after request is processed
		latency := time.Since(start)
		log.Printf("%s %s %d %s",
			c.Request.Method,
			c.Request.URL.Path,
			c.Writer.Status(),
			latency,
		)
	}
}

// CORSMiddleware handles CORS headers
func CORSMiddleware() Middleware {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

// JSONMiddleware sets content type to JSON
func JSONMiddleware() Middleware {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Content-Type", "application/json")
		c.Next()
	}
}

// ErrorHandlerMiddleware catches panics and returns proper error responses
func ErrorHandlerMiddleware() Middleware {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("Panic recovered: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{
					"code":    "INTERNAL_ERROR",
					"message": "An unexpected error occurred",
				})
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
