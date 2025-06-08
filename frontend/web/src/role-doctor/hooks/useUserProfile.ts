"use client"

import { useState, useEffect, useCallback } from "react"
import { message } from "antd"
import { userService } from "../../services/userService"
import { doctorService } from "../../services/doctorService"
import { useAuth } from "../../context/AuthContext"
import type { UserUpdateRequest } from "../../types/user"
import type { DoctorDto } from "../../types/doctor"
import { ACADEMIC_DEGREE_LABELS } from "../../types/doctor"

interface CombinedProfile {
  // User fields
  userId: number
  email?: string | null
  phoneNumber: string
  role: string

  // Doctor fields (if user is a doctor)
  doctorId?: number
  identityNumber?: string
  fullName?: string
  dateOfBirth?: string
  gender?: "MALE" | "FEMALE" 
  address?: string
  academicDegree?: string
  specialization?: string
  type?: "EXAMINATION" | "SERVICE"
  department?: string 

  // UI fields
  avatarUrl?: string
  accountType?: string
  title?: string
}

export const useUserProfile = () => {
  const { user, doctorInfo, updateUser, updateDoctorInfo, getCurrentUserId, getCurrentDoctorId } = useAuth()
  const [profile, setProfile] = useState<CombinedProfile | null>(null)
  const [originalProfile, setOriginalProfile] = useState<CombinedProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Update the fetchProfile method to handle null email properly
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Use getCurrentUser to get fresh user data
      const userData = await userService.getCurrentUser()

      let combinedProfile: CombinedProfile = {
        userId: userData.userId,
        email: userData.email || "", 
        phoneNumber: userData.phone,
        role: userData.role,
      }

      // If user is a doctor, get doctor data
      if (userData.role === "DOCTOR") {
        const doctorData = await doctorService.getDoctorByUserId(userData.userId)
        if (doctorData) {
          combinedProfile = {
            ...combinedProfile,
            doctorId: doctorData.doctorId,
            identityNumber: doctorData.identityNumber,
            fullName: doctorData.fullName,
            dateOfBirth: doctorData.birthday,
            gender: doctorData.gender,
            address: doctorData.address,
            academicDegree: doctorData.academicDegree,
            specialization: doctorData.specialization,
            type: doctorData.type,
            department: doctorData.department?.departmentName || "Chưa gắn API",
            title: ACADEMIC_DEGREE_LABELS[doctorData.academicDegree] || "Bác sĩ",
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

  // Update handleSave to handle null email properly
  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!profile || !originalProfile) return false

    const userId = getCurrentUserId()
    const doctorId = getCurrentDoctorId()

    if (!userId) {
      message.error("Không tìm thấy thông tin người dùng")
      return false
    }

    try {
      setLoading(true)

      // Prepare user update data
      const userUpdates: UserUpdateRequest = {}
      if (profile.email !== originalProfile.email) {
        userUpdates.email = profile.email || null // Handle empty string as null
      }
      if (profile.phoneNumber !== originalProfile.phoneNumber) {
        userUpdates.phone = profile.phoneNumber
      }

      // Update user profile if there are changes
      if (Object.keys(userUpdates).length > 0) {
        const updatedUser = await userService.updateUser(userId, userUpdates)
        updateUser(updatedUser)
      }

      // If user is a doctor, update doctor profile
      if (profile.role === "DOCTOR" && doctorId) {
        const doctorUpdates: Partial<DoctorDto> = {}

        // Combine firstName and lastName back to fullName
        const newFullName = profile.fullName
        if (newFullName !== originalProfile.fullName) {
          doctorUpdates.fullName = newFullName
        }

        if (profile.dateOfBirth !== originalProfile.dateOfBirth) {
          doctorUpdates.birthday = profile.dateOfBirth
        }

        if (profile.gender !== originalProfile.gender) {
          doctorUpdates.gender = profile.gender
        }

        if (profile.address !== originalProfile.address) {
          doctorUpdates.address = profile.address
        }

        // Update doctor profile if there are changes
        if (Object.keys(doctorUpdates).length > 0) {
          const updatedDoctor = await doctorService.updateDoctor(doctorId, doctorUpdates)
          updateDoctorInfo(updatedDoctor)
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
  }, [profile, originalProfile, getCurrentUserId, getCurrentDoctorId, updateUser, updateDoctorInfo, fetchProfile])

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


const getAccountTypeLabel = (role: string): string => {
  const types: Record<string, string> = {
    DOCTOR: "Bác sĩ",
    ADMIN: "Quản trị viên",
    RECEPTIONIST: "Lễ tân",
    PATIENT: "Bệnh nhân",
  }
  return types[role] || role
}
