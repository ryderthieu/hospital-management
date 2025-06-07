"use client"

import { useState, useEffect, useCallback } from "react"
import { message } from "antd"
import { userService, doctorService, type UpdateUserRequest, type UpdateDoctorRequest } from "../services/userService"

interface CombinedProfile {
  // User fields
  userId: number
  email?: string
  phoneNumber: string // Changed from phone to phoneNumber
  role: string

  // Doctor fields (if user is a doctor)
  doctorId?: number
  identityNumber?: string
  fullName?: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string // Changed from birthday to dateOfBirth
  gender?: string
  address?: string
  academicDegree?: string
  specialization?: string
  type?: string
  department?: string

  // UI fields
  avatarUrl?: string
  accountType?: string
  title?: string
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<CombinedProfile | null>(null)
  const [originalProfile, setOriginalProfile] = useState<CombinedProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get current user ID from auth context or localStorage
  const getCurrentUserId = (): number => {
    return Number.parseInt(localStorage.getItem("currentUserId") || "1")
  }

  const getCurrentDoctorId = (): number | null => {
    const doctorId = localStorage.getItem("currentDoctorId")
    return doctorId ? Number.parseInt(doctorId) : null
  }

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const userId = getCurrentUserId()
      const userProfile = await userService.getUserProfile(userId)

      let combinedProfile: CombinedProfile = {
        userId: userProfile.userId,
        email: userProfile.email,
        phoneNumber: userProfile.phone, // Map phone to phoneNumber
        role: userProfile.role,
        accountType: getAccountTypeLabel(userProfile.role),
      }

      // If user is a doctor, fetch doctor profile
      if (userProfile.role === "DOCTOR") {
        const doctorId = getCurrentDoctorId()
        if (doctorId) {
          try {
            const doctorProfile = await doctorService.getDoctorProfile(doctorId)

            // Split fullName into firstName and lastName
            const nameParts = doctorProfile.fullName.split(" ")
            const firstName = nameParts[nameParts.length - 1]
            const lastName = nameParts.slice(0, -1).join(" ")

            combinedProfile = {
              ...combinedProfile,
              doctorId: doctorProfile.doctorId,
              identityNumber: doctorProfile.identityNumber,
              fullName: doctorProfile.fullName,
              firstName,
              lastName,
              dateOfBirth: doctorProfile.birthday, // Map birthday to dateOfBirth
              gender: mapGenderToVietnamese(doctorProfile.gender),
              address: doctorProfile.address,
              academicDegree: doctorProfile.academicDegree,
              specialization: doctorProfile.specialization,
              type: doctorProfile.type,
              department: doctorProfile.department?.departmentName,
              title: getAcademicDegreeLabel(doctorProfile.academicDegree),
            }
          } catch (doctorError) {
            console.error("Failed to fetch doctor profile:", doctorError)
          }
        }
      }

      setProfile(combinedProfile)
      setOriginalProfile({ ...combinedProfile })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải thông tin hồ sơ"
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleChange = useCallback((field: keyof CombinedProfile, value: string) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null))
  }, [])

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!profile || !originalProfile) return false

    try {
      setLoading(true)

      // Prepare user update data
      const userUpdates: UpdateUserRequest = {}
      if (profile.email !== originalProfile.email) {
        userUpdates.email = profile.email
      }
      if (profile.phoneNumber !== originalProfile.phoneNumber) {
        userUpdates.phone = profile.phoneNumber // Map phoneNumber back to phone
      }

      // Update user profile if there are changes
      if (Object.keys(userUpdates).length > 0) {
        await userService.updateUserProfile(profile.userId, userUpdates)
      }

      // If user is a doctor, update doctor profile
      if (profile.role === "DOCTOR" && profile.doctorId) {
        const doctorUpdates: UpdateDoctorRequest = {}

        // Combine firstName and lastName back to fullName
        const newFullName = `${profile.lastName} ${profile.firstName}`.trim()
        if (newFullName !== originalProfile.fullName) {
          doctorUpdates.fullName = newFullName
        }

        if (profile.dateOfBirth !== originalProfile.dateOfBirth) {
          doctorUpdates.birthday = profile.dateOfBirth // Map dateOfBirth back to birthday
        }

        if (profile.gender !== originalProfile.gender) {
          doctorUpdates.gender = mapVietnameseToGender(profile.gender)
        }

        if (profile.address !== originalProfile.address) {
          doctorUpdates.address = profile.address
        }

        // Update doctor profile if there are changes
        if (Object.keys(doctorUpdates).length > 0) {
          await doctorService.updateDoctorProfile(profile.doctorId, doctorUpdates)
        }
      }

      // Refresh profile data
      await fetchProfile()
      message.success("Cập nhật thông tin thành công!")
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật thông tin"
      setError(errorMessage)
      message.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [profile, originalProfile, fetchProfile])

  const handleCancel = useCallback(() => {
    if (originalProfile) {
      setProfile({ ...originalProfile })
    }
  }, [originalProfile])

  return {
    profile,
    loading,
    error,
    handleChange,
    handleSave,
    handleCancel,
    refetch: fetchProfile,
  }
}

// Helper functions
const mapGenderToVietnamese = (gender: "MALE" | "FEMALE" | "OTHER"): string => {
  switch (gender) {
    case "MALE":
      return "Nam"
    case "FEMALE":
      return "Nữ"
    default:
      return "Khác"
  }
}

const mapVietnameseToGender = (gender?: string): "MALE" | "FEMALE" | "OTHER" => {
  switch (gender) {
    case "Nam":
      return "MALE"
    case "Nữ":
      return "FEMALE"
    default:
      return "OTHER"
  }
}

const getAccountTypeLabel = (role: string): string => {
  const types: Record<string, string> = {
    DOCTOR: "Bác sĩ",
    ADMIN: "Quản trị viên",
    RECEPTIONIST: "Lễ tân",
    PATIENT: "Bệnh nhân",
  }
  return types[role] || role
}

const getAcademicDegreeLabel = (degree?: string): string => {
  const titles: Record<string, string> = {
    BS: "Bác sĩ",
    BS_CKI: "Bác sĩ Chuyên khoa I",
    BS_CKII: "Bác sĩ Chuyên khoa II",
    THS_BS: "Thạc sĩ Bác sĩ",
    TS_BS: "Tiến sĩ Bác sĩ",
    PGS_TS_BS: "Phó Giáo sư Tiến sĩ Bác sĩ",
    GS_TS_BS: "Giáo sư Tiến sĩ Bác sĩ",
  }
  return titles[degree || ""] || "Bác sĩ"
}
