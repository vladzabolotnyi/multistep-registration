package server

import (
	"fmt"
)

func getAvailabilityMessage(field, value string, available bool) string {
	if available {
		return fmt.Sprintf("%s '%s' is available", field, value)
	}
	return fmt.Sprintf("%s '%s' is already taken", field, value)
}
