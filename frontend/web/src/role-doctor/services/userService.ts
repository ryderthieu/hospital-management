import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export interface UserProfile {
  userId: number
  email?: string
  phone: string
  role: "ADMIN" | "PATIENT" | "DOCTOR" | "RECEPTIONIST"
  createdAt: string
}

export interface DoctorProfile {
  doctorId: number
  userId: number
  identityNumber: string
  fullName: string
  birthday: string
  gender: "MALE" | "FEMALE" | "OTHER"
  address: string
  academicDegree: "BS" | "BS_CKI" | "BS_CKII" | "THS_BS" | "TS_BS" | "PGS_TS_BS" | "GS_TS_BS"
  specialization: string
  type: "EXAMINATION" | "SERVICE"
  department: {
    departmentId: number
    departmentName: string
  }
  createdAt: string
}

export interface UpdateUserRequest {
  email?: string
  phone?: string
}

export interface UpdateDoctorRequest {
  fullName?: string
  birthday?: string
  gender?: "MALE" | "FEMALE" | "OTHER"
  address?: string
  academicDegree?: "BS" | "BS_CKI" | "BS_CKII" | "THS_BS" | "TS_BS" | "PGS_TS_BS" | "GS_TS_BS"
  specialization?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export const userService = {
  // Get user profile
  async getUserProfile(userId: number): Promise<UserProfile> {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  // Update user profile
  async updateUserProfile(userId: number, data: UpdateUserRequest): Promise<UserProfile> {
    const response = await api.put(`/users/${userId}`, data)
    return response.data
  },

  // Change password
  async changePassword(userId: number, data: ChangePasswordRequest): Promise<void> {
    await api.put(`/users/change-password/${userId}`, data)
  },
}

export const doctorService = {
  // Get doctor profile
  async getDoctorProfile(doctorId: number): Promise<DoctorProfile> {
    const response = await api.get(`/doctors/${doctorId}`)
    return response.data
  },

  // Update doctor profile
  async updateDoctorProfile(doctorId: number, data: UpdateDoctorRequest): Promise<DoctorProfile> {
    const response = await api.put(`/doctors/${doctorId}`, data)
    return response.data
  },

  // Get all doctors (for admin/receptionist)
  async getAllDoctors(): Promise<DoctorProfile[]> {
    const response = await api.get("/doctors")
    return response.data
  },

  // Find doctor by identity number
  async findByIdentityNumber(identityNumber: string): Promise<DoctorProfile | null> {
    const response = await api.get(`/doctors/search?identityNumber=${identityNumber}`)
    return response.data
  },
}
