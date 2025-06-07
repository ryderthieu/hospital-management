import axios from "axios"
import type { LoginCredentials, LoginResponse, AuthUser, DoctorInfo } from "../types/auths"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem("authToken")
      localStorage.removeItem("authUser")
      localStorage.removeItem("doctorInfo")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await authApi.post("/auth/login", credentials)
    return response.data
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await authApi.post("/auth/logout")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem("authToken")
      localStorage.removeItem("authUser")
      localStorage.removeItem("doctorInfo")
    }
  },

  // Get current user info
  async getCurrentUser(): Promise<AuthUser> {
    const response = await authApi.get("/auth/me")
    return response.data
  },

  // Get doctor info for doctor users
  async getDoctorInfo(userId: number): Promise<DoctorInfo | null> {
    try {
      // First, get all doctors and find by userId
      const response = await authApi.get("/doctors")
      const doctors: DoctorInfo[] = response.data
      const doctor = doctors.find((d) => d.userId === userId)
      return doctor || null
    } catch (error) {
      console.error("Error fetching doctor info:", error)
      return null
    }
  },

  // Refresh token
  async refreshToken(): Promise<string> {
    const response = await authApi.post("/auth/refresh")
    return response.data.token
  },

  // Verify token
  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await authApi.post("/auth/verify", { token })
      return response.data.valid
    } catch (error) {
      return false
    }
  },
}
