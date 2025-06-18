import axios from "axios"
import type { DoctorDto } from "../types/doctor"

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

export const doctorService = {
  // Get doctor by ID
  async getDoctor(doctorId: number): Promise<DoctorDto> {
    const response = await api.get(`/doctors/${doctorId}`)
    return response.data
  },

  // Get doctor by user ID
  async getDoctorByUserId(userId: number): Promise<DoctorDto> {
    const response = await api.get(`/doctors/user/${userId}`)
    return response.data
  },

  // Update doctor
  async updateDoctor(doctorId: number, doctorData: Partial<DoctorDto>): Promise<DoctorDto> {
    console.log("Sending update to API:", doctorData)
    const response = await api.put(`/doctors/${doctorId}`, doctorData)
    return response.data
  },

  // Upload avatar
  async uploadAvatar(doctorId: number, file: File): Promise<DoctorDto> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post(`/doctors/${doctorId}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Delete avatar
  async deleteAvatar(doctorId: number): Promise<DoctorDto> {
    const response = await api.delete(`/doctors/${doctorId}/avatar`)
    return response.data
  },
}
