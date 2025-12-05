package server

import (
	"context"
	"net/http"
	"time"

	"multistep-registration/internal/database"

	"github.com/gin-gonic/gin"
)

type HealthResponse struct {
	Status    string         `json:"status"`
	Timestamp time.Time      `json:"timestamp"`
	Services  map[string]any `json:"services"`
	Version   string         `json:"version,omitempty"`
}

func (s *Server) healthHandler(c *gin.Context) {
	response := HealthResponse{
		Status:    "healthy",
		Timestamp: time.Now(),
		Services:  make(map[string]any),
	}

	if s.db != nil {
		ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
		defer cancel()

		dbHealth, err := s.db.HealthCheck(ctx)
		if err != nil {
			response.Status = "unhealthy"
			response.Services["database"] = map[string]any{
				"status":  "unhealthy",
				"error":   err.Error(),
				"details": dbHealth,
			}
		} else {
			response.Services["database"] = map[string]any{
				"status":  dbHealth.Status,
				"details": dbHealth,
			}
			if dbHealth.Status != database.StatusHealthy {
				response.Status = "degraded"
			}
		}
	} else {
		response.Services["database"] = map[string]any{
			"status": "not_configured",
		}
	}

	statusCode := http.StatusOK
	switch response.Status {
	case "unhealthy":
		statusCode = http.StatusServiceUnavailable
	case "degraded":
		statusCode = http.StatusOK
	}

	c.JSON(statusCode, response)
}

func (s *Server) readinessHandler(c *gin.Context) {
	response := gin.H{
		"status":    "ready",
		"timestamp": time.Now().Format(time.RFC3339),
	}

	if s.db != nil {
		ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
		defer cancel()

		if err := s.db.Pool.Ping(ctx); err != nil {
			response["status"] = "not_ready"
			response["database"] = "unavailable"
			c.JSON(http.StatusServiceUnavailable, response)
			return
		}
		response["database"] = "ready"
	} else {
		response["database"] = "not_configured"
	}

	c.JSON(http.StatusOK, response)
}
