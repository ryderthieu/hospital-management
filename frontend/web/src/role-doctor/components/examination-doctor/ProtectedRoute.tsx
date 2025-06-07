"use client"

import type { ReactNode } from "react"
import { useAuth } from "../../../context/AuthContext"
import { Spin } from "antd"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
  fallback?: ReactNode
}

const ProtectedRoute = ({ children, allowedRoles, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }

    // Redirect to login
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-600">Bạn không có quyền truy cập trang này</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
