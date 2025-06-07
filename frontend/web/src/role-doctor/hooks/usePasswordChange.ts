"use client"

import { useState, useCallback } from "react"
import { message } from "antd"
import { userService } from "../../services/userService"
import { useAuth } from "../../context/AuthContext"
import type { ChangePasswordRequest } from "../../types/user"

export const usePasswordChange = () => {
  const { getCurrentUserId } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = useCallback(
    async (values: { currentPassword: string; newPassword: string }) => {
      const userId = getCurrentUserId()

      if (!userId) {
        setError("Người dùng chưa đăng nhập")
        message.error("Người dùng chưa đăng nhập")
        return
      }

      try {
        setLoading(true)
        setError(null)
        setSuccess(false)

        const changePasswordData: ChangePasswordRequest = {
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
        }

        await userService.changePassword(userId, changePasswordData)

        setSuccess(true)
        message.success("Đổi mật khẩu thành công!")

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
    },
    [getCurrentUserId],
  )

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
