import type { LoginCredentials, LoginResponse, AuthUser, DoctorInfo } from "../types/auths"
import { api } from "./api"
import { doctorService } from "./doctorService"

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<{ token: string; user: AuthUser }>("users/auth/login", credentials)

    const { token, user } = response.data

    // Store token and user info
    localStorage.setItem("authToken", token)
    localStorage.setItem("authUser", JSON.stringify(user))
    localStorage.setItem("currentUserId", user.userId.toString())

    // If user is a doctor, fetch doctor info
    let doctorInfo: DoctorInfo | undefined
    if (user.role === "DOCTOR") {
      try {
        const doctors = await doctorService.getAllDoctors()
        const doctor = doctors.find((d) => d.userId === user.userId)
        if (doctor) {
          doctorInfo = doctor
          localStorage.setItem("doctorInfo", JSON.stringify(doctor))
          localStorage.setItem("currentDoctorId", doctor.doctorId.toString())
        }
      } catch (error) {
        console.error("Failed to fetch doctor info:", error)
      }
    }

    return {
      token,
      user,
      doctorInfo,
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post("users/auth/logout")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem("authToken")
      localStorage.removeItem("authUser")
      localStorage.removeItem("doctorInfo")
      localStorage.removeItem("currentUserId")
      localStorage.removeItem("currentDoctorId")
    }
  },

  // Get current user info using the new endpoint
  async getCurrentUser(): Promise<AuthUser> {
    const response = await api.get<AuthUser>("/users/me")
    return response.data
  },

  // Get current user with doctor info if applicable
  async getCurrentUserWithDoctorInfo(): Promise<{ user: AuthUser; doctorInfo?: DoctorInfo }> {
    const user = await this.getCurrentUser()

    let doctorInfo: DoctorInfo | undefined
    if (user.role === "DOCTOR") {
      try {
        const doctors = await doctorService.getAllDoctors()
        const doctor = doctors.find((d) => d.userId === user.userId)
        if (doctor) {
          doctorInfo = doctor
        }
      } catch (error) {
        console.error("Failed to fetch doctor info:", error)
      }
    }

    return { user, doctorInfo }
  },

  // Refresh token
  async refreshToken(): Promise<string> {
    const response = await api.post<{ token: string }>("users/auth/refresh")

    // Update token in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token)
    }

    return response.data.token
  },

  // Verify token
  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await api.post<{ valid: boolean }>("users/auth/verify", { token })
      return response.data.valid
    } catch (error) {
      return false
    }
  },
}
