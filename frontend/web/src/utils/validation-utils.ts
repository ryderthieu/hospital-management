import type { ValidationRule } from "./validation-types"
import { ValidationMessages, Patterns } from "./validation-messages"

// Validation functions
export const validateField = (
  value: string,
  rules: ValidationRule,
  fieldName: string,
  allValues?: Record<string, string>,
): string => {
  // Required validation
  if (rules.required && (!value || value.trim() === "")) {
    return rules.message || ValidationMessages.required(fieldName)
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === "") {
    return ""
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    return rules.message || ValidationMessages.minLength(fieldName, rules.minLength)
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    return rules.message || ValidationMessages.maxLength(fieldName, rules.maxLength)
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message || ValidationMessages.pattern(fieldName)
  }

  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    return rules.message || ValidationMessages.custom(`${fieldName} không hợp lệ`)
  }

  return ""
}

// Predefined validation rules
export const ValidationRules = {
  phone: {
    required: true,
    pattern: Patterns.phone,
    message: ValidationMessages.phone,
  },
  email: {
    required: true,
    pattern: Patterns.email,
    message: ValidationMessages.email,
  },
  password: {
    required: true,
    minLength: 8,
    pattern: Patterns.password,
    message: ValidationMessages.password,
  },
  confirmPassword: (password: string) => ({
    required: true,
    custom: (value: string) => value === password,
    message: ValidationMessages.confirmPassword,
  }),
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: Patterns.name,
    message: ValidationMessages.name,
  },
  cccd: {
    required: true,
    pattern: Patterns.cccd,
    message: ValidationMessages.cccd,
  },
  age: {
    required: true,
    custom: (value: string) => {
      const age = Number.parseInt(value)
      return age >= 1 && age <= 120
    },
    message: ValidationMessages.age,
  },
}
