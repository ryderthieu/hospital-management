"use client"

import { useState, useEffect } from "react"
import type { UserProfile } from "../types/user"

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const data: UserProfile = {
          avatarUrl:
            "https://scontent.fsgn22-1.fna.fbcdn.net/v/t39.30808-6/476834381_1003190531653574_2584131049560639925_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=kRwowaTq_nUQ7kNvwFLXVnI&_nc_oc=AdlZyaM6KYA-D1xUt09TCm2lilAx611Gwf3vDki_tTGhebmP2Zflv6kV8-EboluapVw&_nc_zt=23&_nc_ht=scontent.fsgn22-1.fna&_nc_gid=bFVLyXApF0OPekNm0jpXHQ&oh=00_AfFXHHw-lUYlByPwLQ0Om0klhFcZ7i-Hl5KaHD_yaJlKqg&oe=681AC99C",
          lastName: "Nguyễn Thiên",
          firstName: "Tài",
          gender: "Nam",
          dateOfBirth: "05/11/1995",
          address: "Tòa S3.02, Vinhomes Grand Park, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, Thành phố Hồ Chí Minh",
          phoneNumber: "0901 565 563",
          specialization: "Suy tim",
          doctorId: "BS22521584",
          accountType: "Bác sĩ",
          title: "Thạc sĩ Bác sĩ (Ths.BS)",
          department: "Nội tim mạch",
        }

        setProfile(data)
        setOriginalProfile(data)
        setError(null)
      } catch (err) {
        setError("Failed to load profile data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({
        ...profile,
        [field]: value,
      })
    }
  }

  const handleSave = async () => {
    if (!profile) return false

    try {
      setLoading(true)
      console.log("Updating profile:", profile)
      setOriginalProfile(profile)
      setError(null)
      return true
    } catch (err) {
      setError("Failed to update profile")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setProfile(originalProfile)
  }

  return {
    profile,
    loading,
    error,
    handleChange,
    handleSave,
    handleCancel,
  }
}
