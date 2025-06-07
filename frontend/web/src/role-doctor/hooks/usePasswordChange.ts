"use client"

import { useState, useCallback } from "react"
import { message } from "antd"
import { userService, type ChangePasswordRequest } from "../services/userService"

export const usePasswordChange = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getCurrentUserId = (): number => {
    return Number.parseInt(localStorage.getItem("currentUserId") || "1")
  }

  const handleSubmit = useCallback(async (values: ChangePasswordRequest) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const userId = getCurrentUserId()
      await userService.changePassword(userId, values)

      setSuccess(true)
      message.success("Đổi mật khẩu thành công!")

      // Auto clear success state after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err: any) {
      let errorMessage = "Không thể đổi mật khẩu"

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const resetState = useCallback(() => {
    setError(null)
    setSuccess(false)
  }, [])

  return {
    loading,
    error,
    success,
    handleSubmit,
    resetState,
  }
}
