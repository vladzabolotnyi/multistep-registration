package server

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

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
