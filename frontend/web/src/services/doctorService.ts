import type { Doctor, DoctorDto } from "../types/doctor"
import { api } from "./api"

export const doctorService = {
  // Get all doctors
  async getAllDoctors(): Promise<Doctor[]> {
    const response = await api.get<Doctor[]>("/doctors")
    return response.data
  },

  // Get doctor by ID
  async getDoctorById(doctorId: number): Promise<Doctor> {
    const response = await api.get<Doctor>(`/doctors/${doctorId}`)
    return response.data
  },

  // Create doctor
  async createDoctor(doctorData: DoctorDto): Promise<Doctor> {
    const response = await api.post<Doctor>("/doctors", doctorData)
    return response.data
  },

  // Update doctor
  async updateDoctor(doctorId: number, doctorData: Partial<DoctorDto>): Promise<Doctor> {
    const response = await api.put<Doctor>(`/doctors/${doctorId}`, doctorData)
    return response.data
  },

  // Delete doctor
  async deleteDoctor(doctorId: number): Promise<string> {
    const response = await api.delete<string>(`/doctors/${doctorId}`)
    return response.data
  },

  // Find doctor by identity number
  async findByIdentityNumber(identityNumber: string): Promise<Doctor | null> {
    const response = await api.get<Doctor | null>(`/doctors/search?identityNumber=${identityNumber}`)
    return response.data
  },

  // Filter doctors
  async filterDoctors(params: {
    gender?: "MALE" | "FEMALE" | "OTHER"
    academicDegree?: "BS" | "BS_CKI" | "BS_CKII" | "THS_BS" | "TS_BS" | "PGS_TS_BS" | "GS_TS_BS"
    specialization?: string
    type?: "EXAMINATION" | "SERVICE"
  }): Promise<Doctor | null> {
    const queryParams = new URLSearchParams()

    if (params.gender) queryParams.append("gender", params.gender)
    if (params.academicDegree) queryParams.append("academicDegree", params.academicDegree)
    if (params.specialization) queryParams.append("specialization", params.specialization)
    if (params.type) queryParams.append("type", params.type)

    const response = await api.get<Doctor | null>(`/doctors/filter?${queryParams.toString()}`)
    return response.data
  },

  // Get doctor by user ID (helper method)
  async getDoctorByUserId(userId: number): Promise<Doctor | null> {
    try {
      const doctors = await this.getAllDoctors()
      return doctors.find((doctor) => doctor.userId === userId) || null
    } catch (error) {
      console.error("Error fetching doctor by user ID:", error)
      return null
    }
  },
}
