"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { message } from "antd"
import { authService } from "@/services/authService"
import type { AuthState, AuthUser, DoctorInfo, LoginCredentials } from "@/types/auth"

// Action types
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: AuthUser; doctorInfo?: DoctorInfo; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "UPDATE_USER"; payload: AuthUser }
  | { type: "UPDATE_DOCTOR_INFO"; payload: DoctorInfo }

// Initial state
const initialState: AuthState = {
  user: null,
  doctorInfo: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        doctorInfo: action.payload.doctorInfo || null,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }

    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        doctorInfo: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }

    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      }

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      }

    case "UPDATE_DOCTOR_INFO":
      return {
        ...state,
        doctorInfo: action.payload,
      }

    default:
      return state
  }
}

// Context type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  updateUser: (user: AuthUser) => void
  updateDoctorInfo: (doctorInfo: DoctorInfo) => void
  isAdmin: () => boolean
  isDoctor: () => boolean
  isReceptionist: () => boolean
  hasRole: (role: string) => boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load auth data from localStorage on mount
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const userStr = localStorage.getItem("authUser")
        const doctorInfoStr = localStorage.getItem("doctorInfo")

        if (token && userStr) {
          const user: AuthUser = JSON.parse(userStr)
          const doctorInfo: DoctorInfo | null = doctorInfoStr ? JSON.parse(doctorInfoStr) : null

          // Verify token is still valid
          const isValid = await authService.verifyToken(token)
          if (isValid) {
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user, doctorInfo: doctorInfo || undefined, token },
            })
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("authToken")
            localStorage.removeItem("authUser")
            localStorage.removeItem("doctorInfo")
            dispatch({ type: "LOGOUT" })
          }
        } else {
          dispatch({ type: "SET_LOADING", payload: false })
        }
      } catch (error) {
        console.error("Error loading auth data:", error)
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadAuthData()
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      dispatch({ type: "LOGIN_START" })

      const response = await authService.login(credentials)
      const { token, user, doctorInfo } = response

      // Store in localStorage
      localStorage.setItem("authToken", token)
      localStorage.setItem("authUser", JSON.stringify(user))
      if (doctorInfo) {
        localStorage.setItem("doctorInfo", JSON.stringify(doctorInfo))
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, doctorInfo, token },
      })

      message.success(`Chào mừng ${user.role === "DOCTOR" ? "Bác sĩ" : "Quản trị viên"}!`)
      return true
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Đăng nhập thất bại"
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage })
      message.error(errorMessage)
      return false
    }
  }, [])

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout()
      dispatch({ type: "LOGOUT" })
      message.success("Đăng xuất thành công")
    } catch (error) {
      console.error("Logout error:", error)
      // Still logout locally even if API call fails
      dispatch({ type: "LOGOUT" })
    }
  }, [])

  // Refresh auth data
  const refreshAuth = useCallback(async (): Promise<void> => {
    try {
      if (!state.user) return

      dispatch({ type: "SET_LOADING", payload: true })

      // Refresh user data
      const user = await authService.getCurrentUser()
      dispatch({ type: "UPDATE_USER", payload: user })

      // Refresh doctor info if user is a doctor
      if (user.role === "DOCTOR") {
        const doctorInfo = await authService.getDoctorInfo(user.userId)
        if (doctorInfo) {
          dispatch({ type: "UPDATE_DOCTOR_INFO", payload: doctorInfo })
          localStorage.setItem("doctorInfo", JSON.stringify(doctorInfo))
        }
      }

      localStorage.setItem("authUser", JSON.stringify(user))
    } catch (error) {
      console.error("Error refreshing auth data:", error)
      dispatch({ type: "SET_ERROR", payload: "Không thể làm mới thông tin đăng nhập" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [state.user])

  // Update user info
  const updateUser = useCallback((user: AuthUser) => {
    dispatch({ type: "UPDATE_USER", payload: user })
    localStorage.setItem("authUser", JSON.stringify(user))
  }, [])

  // Update doctor info
  const updateDoctorInfo = useCallback((doctorInfo: DoctorInfo) => {
    dispatch({ type: "UPDATE_DOCTOR_INFO", payload: doctorInfo })
    localStorage.setItem("doctorInfo", JSON.stringify(doctorInfo))
  }, [])

  // Role checking functions
  const isAdmin = useCallback(() => state.user?.role === "ADMIN", [state.user])
  const isDoctor = useCallback(() => state.user?.role === "DOCTOR", [state.user])
  const isReceptionist = useCallback(() => state.user?.role === "RECEPTIONIST", [state.user])
  const hasRole = useCallback((role: string) => state.user?.role === role, [state.user])

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshAuth,
    updateUser,
    updateDoctorInfo,
    isAdmin,
    isDoctor,
    isReceptionist,
    hasRole,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// HOC for protected routes
export const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>, allowedRoles?: string[]) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading, user } = useAuth()

    if (isLoading) {
      return <div className="flex justify-center items-center h-screen">Đang tải...</div>
    }

    if (!isAuthenticated) {
      window.location.href = "/login"
      return null
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      return <div className="flex justify-center items-center h-screen">Bạn không có quyền truy cập trang này</div>
    }

    return <WrappedComponent {...props} />
  }

  return AuthenticatedComponent
}
