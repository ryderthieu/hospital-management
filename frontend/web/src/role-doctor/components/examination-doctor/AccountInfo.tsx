import type React from "react"

import { useState, useEffect } from "react"
import { Form, Input, Select, Button, Avatar, Space, Upload, message, Empty, Modal } from "antd"
import {
  UserOutlined,
  UploadOutlined,
  SaveOutlined,
  EditOutlined,
  CalendarOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import WeCareLoading from "../common/WeCareLoading"
import type { UploadFile, UploadProps } from "antd/es/upload/interface"
import type { RcFile } from "antd/es/upload"
import { api } from "../../../services/api"

// Types
interface Department {
  departmentId: number
  departmentName: string
}

interface Doctor {
  doctorId: number
  userId: number
  identityNumber: string
  fullName: string
  birthday: string
  avatar: string
  gender: "MALE" | "FEMALE"
  address: string
  academicDegree: "BS" | "BS_CKI" | "BS_CKII" | "THS_BS" | "TS_BS" | "PGS_TS_BS" | "GS_TS_BS"
  specialization: string
  type: "EXAMINATION" | "SERVICE"
  department: Department
  profileImage?: string
  createdAt: string
}

// Constants
const ACADEMIC_DEGREE_LABELS: Record<Doctor["academicDegree"], string> = {
  BS: "Bác sĩ",
  BS_CKI: "Bác sĩ chuyên khoa cấp I",
  BS_CKII: "Bác sĩ chuyên khoa cấp II",
  THS_BS: "Thạc sĩ Bác sĩ",
  TS_BS: "Tiến sĩ Bác sĩ",
  PGS_TS_BS: "Phó giáo sư Tiến sĩ Bác sĩ",
  GS_TS_BS: "Giáo sư Tiến sĩ Bác sĩ",
}

const GENDER_LABELS: Record<Doctor["gender"], string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
}

const DOCTOR_TYPE_LABELS: Record<Doctor["type"], string> = {
  EXAMINATION: "Bác sĩ khám bệnh",
  SERVICE: "Bác sĩ xét nghiệm",
}

// Services
const getDoctorId = (): number | null => {
  const doctorId = localStorage.getItem("currentDoctorId")
  return doctorId ? Number.parseInt(doctorId) : null
}

const doctorService = {
  async getDoctorProfile(doctorId: number): Promise<Doctor> {
    console.log("Fetching doctor profile for ID:", doctorId)
    const response = await api.get(`/doctors/${doctorId}`)
    console.log("Doctor profile response:", response.data)
    return response.data
  },

  async updateDoctor(doctorId: number, data: Partial<Doctor>): Promise<Doctor> {
    console.log("Updating doctor with data:", data)
    const response = await api.put(`/doctors/${doctorId}`, data)
    console.log("Update doctor response:", response.data)
    return response.data
  },

  async uploadAvatar(doctorId: number, file: File): Promise<Doctor> {
    console.log("Uploading avatar for doctor ID:", doctorId, "File:", file)
    const formData = new FormData()
    formData.append("file", file)

    // Log FormData contents
    console.log("FormData contents:")
    for (const [key, value] of formData.entries()) {
      console.log(key, value)
    }

    try {
      const response = await api.post(`/doctors/${doctorId}/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log("Upload avatar response:", response.data)
      return response.data
    } catch (error) {
      console.error("Upload avatar error:", error)
      if (error.response) {
        console.error("Error response:", error.response.data)
        console.error("Error status:", error.response.status)
      }
      throw error
    }
  },

  async deleteAvatar(doctorId: number): Promise<Doctor> {
    console.log("Deleting avatar for doctor ID:", doctorId)
    try {
      const response = await api.delete(`/doctors/${doctorId}/avatar`)
      console.log("Delete avatar response:", response.data)
      return response.data
    } catch (error) {
      console.error("Delete avatar error:", error)
      if (error.response) {
        console.error("Error response:", error.response.data)
        console.error("Error status:", error.response.status)
      }
      throw error
    }
  },
}

// Custom Hook
const useUserProfile = () => {
  const [profile, setProfile] = useState<Doctor | null>(null)
  const [originalProfile, setOriginalProfile] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const doctorId = getDoctorId()
      if (!doctorId) {
        throw new Error("Doctor ID not found")
      }

      const doctorData = await doctorService.getDoctorProfile(doctorId)
      setProfile(doctorData)
      setOriginalProfile({ ...doctorData })
      console.log("Profile loaded:", doctorData)
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleChange = (field: keyof Doctor, value: any) => {
    console.log(`Changing ${field}:`, value)
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleSave = async (): Promise<boolean> => {
    try {
      if (!profile || !originalProfile) return false

      const doctorId = getDoctorId()
      if (!doctorId) {
        throw new Error("Doctor ID not found")
      }

      // Find changed fields
      const changes: Partial<Doctor> = {}
      Object.keys(profile).forEach((key) => {
        const field = key as keyof Doctor
        if (profile[field] !== originalProfile[field]) {
          // Skip readonly fields
          if (!["doctorId", "userId", "createdAt", "department"].includes(field)) {
            changes[field] = profile[field] as any
          }
        }
      })

      console.log("Saving changes:", changes)

      if (Object.keys(changes).length > 0) {
        const updatedDoctor = await doctorService.updateDoctor(doctorId, changes)
        setProfile(updatedDoctor)
        setOriginalProfile({ ...updatedDoctor })
      }

      return true
    } catch (error) {
      console.error("Error saving profile:", error)
      message.error("Không thể cập nhật thông tin")
      return false
    }
  }

  const handleCancel = () => {
    if (originalProfile) {
      setProfile({ ...originalProfile })
    }
  }

  const uploadAvatar = async (file: RcFile): Promise<boolean> => {
    try {
      const doctorId = getDoctorId()
      if (!doctorId) {
        throw new Error("Doctor ID not found")
      }

      console.log("Starting avatar upload...")
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
      })

      const updatedDoctor = await doctorService.uploadAvatar(doctorId, file)

      setProfile(updatedDoctor)
      setOriginalProfile({ ...updatedDoctor })
      message.success("Cập nhật ảnh đại diện thành công")
      return true
    } catch (error) {
      console.error("Error uploading avatar:", error)

      // More detailed error handling
      if (error.response) {
        const status = error.response.status
        const data = error.response.data

        if (status === 400) {
          message.error("File không hợp lệ. Vui lòng chọn file ảnh khác.")
        } else if (status === 413) {
          message.error("File quá lớn. Vui lòng chọn file nhỏ hơn 3MB.")
        } else if (status === 415) {
          message.error("Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG.")
        } else {
          message.error(`Lỗi server: ${data?.message || "Không thể tải lên ảnh đại diện"}`)
        }
      } else {
        message.error("Không thể kết nối đến server")
      }
      return false
    }
  }

  const deleteAvatar = async (): Promise<boolean> => {
    try {
      const doctorId = getDoctorId()
      if (!doctorId) {
        throw new Error("Doctor ID not found")
      }

      console.log("Starting avatar deletion...")
      const updatedDoctor = await doctorService.deleteAvatar(doctorId)

      setProfile(updatedDoctor)
      setOriginalProfile({ ...updatedDoctor })
      message.success("Đã xóa ảnh đại diện")
      return true
    } catch (error) {
      console.error("Error deleting avatar:", error)

      if (error.response) {
        const status = error.response.status
        const data = error.response.data

        if (status === 404) {
          message.error("Không tìm thấy ảnh đại diện để xóa")
        } else {
          message.error(`Lỗi server: ${data?.message || "Không thể xóa ảnh đại diện"}`)
        }
      } else {
        message.error("Không thể kết nối đến server")
      }
      return false
    }
  }

  return {
    profile,
    loading,
    error,
    handleChange,
    handleSave,
    handleCancel,
    uploadAvatar,
    deleteAvatar,
  }
}

const AccountInfo = () => {
  const { profile, loading, error, handleChange, handleSave, handleCancel, uploadAvatar, deleteAvatar } =
    useUserProfile()
  const [form] = Form.useForm()
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  console.log("Current profile:", profile)
  console.log("Current fileList:", fileList)
  console.log("Preview image:", previewImage)

  useEffect(() => {
    if (profile) {
      const formValues = {
        ...profile,
        // Chuyển đổi birthday từ ISO string sang DD/MM/YYYY format
        birthday: profile.birthday ? formatDateForDisplay(profile.birthday) : "",
      }
      form.setFieldsValue(formValues)
      setFileList([])
      setPreviewImage(undefined)
    }
  }, [profile, form])

  // Helper functions for date conversion
  const formatDateForDisplay = (isoString: string): string => {
    try {
      const date = new Date(isoString)
      if (isNaN(date.getTime())) return ""

      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch {
      return ""
    }
  }

  const formatDateForAPI = (displayDate: string): string => {
    try {
      if (!displayDate) return ""

      const [day, month, year] = displayDate.split("/")
      if (!day || !month || !year) return ""

      const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
      if (isNaN(date.getTime())) return ""

      return date.toISOString()
    } catch {
      return ""
    }
  }

  const validateAge = (dateString: string): boolean => {
    try {
      if (!dateString) return true

      const [day, month, year] = dateString.split("/")
      if (!day || !month || !year) return false

      const birthDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
      if (isNaN(birthDate.getTime())) return false

      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18 && age - 1 <= 100
      }

      return age >= 18 && age <= 100
    } catch {
      return false
    }
  }

  if (loading) return <WeCareLoading />
  if (error) return <Empty description="Đã xảy ra lỗi trong quá trình tải dữ liệu" />
  if (!profile) return <Empty description="Không có dữ liệu hồ sơ" />

  const handleSubmit = async () => {
    try {
      setSaving(true)
      await form.validateFields()

      // Get form values and update birthday to ISO format
      const values = form.getFieldsValue()
      if (values.birthday) {
        handleChange("birthday", formatDateForAPI(values.birthday))
      }

      const success = await handleSave()
      if (success) {
        setEditMode(false)
        message.success("Thông tin đã được cập nhật thành công")
      } else {
        message.error("Có lỗi xảy ra khi cập nhật thông tin")
      }
    } catch (error) {
      console.error("Validation failed:", error)
      message.error("Vui lòng kiểm tra lại thông tin nhập vào")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = () => {
    setEditMode(true)
  }

  const cancelEdit = () => {
    handleCancel()
    setEditMode(false)
    setFileList([])
    setPreviewImage(undefined)
    if (profile) {
      form.setFieldsValue({
        ...profile,
        birthday: profile.birthday ? formatDateForDisplay(profile.birthday) : "",
      })
    }
  }

  const handleAvatarChange: UploadProps["onChange"] = (info) => {
    console.log("Avatar change event:", info)

    if (!info.file) {
      console.log("No file in info")
      return
    }

    // Validate file size
    if (info.file.size && info.file.size > 3 * 1024 * 1024) {
      message.error("Kích thước ảnh không được vượt quá 3MB!")
      setFileList([])
      setPreviewImage(undefined)
      return
    }

    // Validate file type
    const isImage = info.file.type?.startsWith("image/")
    if (!isImage) {
      message.error("Chỉ chấp nhận file ảnh (JPG, PNG, GIF)!")
      setFileList([])
      setPreviewImage(undefined)
      return
    }

    console.log("File validation passed:", {
      name: info.file.name,
      size: info.file.size,
      type: info.file.type,
    })

    // Set file list and preview
    setFileList([info.file])

    // Preview image
    if (info.file.originFileObj) {
      const reader = new FileReader()
      reader.onload = (e) => {
        console.log("File read successfully")
        setPreviewImage(e.target?.result as string)
      }
      reader.onerror = (e) => {
        console.error("File read error:", e)
        message.error("Không thể đọc file ảnh")
      }
      reader.readAsDataURL(info.file.originFileObj)
    } else {
      console.log("No originFileObj found")
    }
  }

  const handleUploadAvatar = async () => {
    console.log("Upload avatar clicked")
    console.log("FileList:", fileList)

    if (fileList.length === 0) {
      message.error("Vui lòng chọn ảnh để tải lên")
      return
    }

    const file = fileList[0]
    if (!file.originFileObj) {
      message.error("File không hợp lệ")
      return
    }

    try {
      setAvatarLoading(true)
      console.log("Starting upload process...")

      const success = await uploadAvatar(file.originFileObj as RcFile)
      if (success) {
        setFileList([])
        setPreviewImage(undefined)
        console.log("Upload completed successfully")
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setAvatarLoading(false)
    }
  }

  const handleDeleteAvatar = () => {
    Modal.confirm({
      title: "Xác nhận xóa ảnh đại diện",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn xóa ảnh đại diện không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setAvatarLoading(true)
          const success = await deleteAvatar()
          if (success) {
            setFileList([])
            setPreviewImage(undefined)
          }
        } catch (error) {
          console.error("Delete failed:", error)
        } finally {
          setAvatarLoading(false)
        }
      },
    })
  }

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    form.setFieldsValue({ birthday: value })
  }

  // Get current avatar URL
  const currentAvatarUrl = previewImage || profile?.avatar || profile?.profileImage

  return (
    <div className="bg-white px-5 py-3 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Hồ sơ của tôi</h2>
          <p className="text-gray-600">Thông tin này sẽ được hiển thị công khai</p>
        </div>

        <div className="flex gap-2">
          {!editMode ? (
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
              Chỉnh sửa
            </Button>
          ) : (
            <Space>
              <Button onClick={cancelEdit}>Hủy</Button>
              <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSubmit}>
                Lưu thay đổi
              </Button>
            </Space>
          )}
        </div>
      </div>

      <Form form={form} layout="vertical" initialValues={profile || {}} disabled={!editMode}>
        {/* Avatar Section */}
        <Form.Item label="Ảnh đại diện">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar src={currentAvatarUrl} size={96} icon={<UserOutlined />} />
              <div className="ml-5">
                <p className="text-sm text-gray-600 mb-1">Định dạng: JPG, PNG, GIF</p>
                <p className="text-sm text-gray-600 mb-3">Kích thước tối đa: 3MB</p>
                {fileList.length > 0 && <p className="text-sm text-blue-600">Đã chọn: {fileList[0].name}</p>}
              </div>
            </div>

            {editMode && (
              <Space>
                <Button
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteAvatar}
                  disabled={!currentAvatarUrl || avatarLoading}
                  loading={avatarLoading}
                >
                  Gỡ ảnh
                </Button>
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false} // Prevent auto upload
                  onChange={handleAvatarChange}
                  accept="image/*"
                  disabled={avatarLoading}
                  multiple={false}
                >
                  <Button icon={<UploadOutlined />} disabled={avatarLoading}>
                    Chọn ảnh
                  </Button>
                </Upload>
                {fileList.length > 0 && (
                  <Button type="primary" onClick={handleUploadAvatar} loading={avatarLoading} disabled={avatarLoading}>
                    Tải lên
                  </Button>
                )}
              </Space>
            )}
          </div>
        </Form.Item>

        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên!" },
              { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
              { max: 50, message: "Họ và tên không được vượt quá 50 ký tự!" },
              {
                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: "Họ và tên chỉ được chứa chữ cái và khoảng trắng!",
              },
            ]}
          >
            <Input onChange={(e) => handleChange("fullName", e.target.value)} placeholder="Chưa có dữ liệu" />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender">
            <Select
              onChange={(value) => handleChange("gender", value)}
              placeholder="Chưa có dữ liệu"
              options={[
                { value: "MALE", label: "Nam" },
                { value: "FEMALE", label: "Nữ" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="birthday"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve()

                  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
                  if (!dateRegex.test(value)) {
                    return Promise.reject(new Error("Định dạng ngày không hợp lệ (DD/MM/YYYY)"))
                  }

                  if (!validateAge(value)) {
                    return Promise.reject(new Error("Tuổi phải từ 18 đến 100"))
                  }

                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input
              placeholder="DD/MM/YYYY"
              prefix={<CalendarOutlined />}
              onChange={handleBirthdayChange}
              maxLength={10}
              onKeyPress={(e) => {
                if (!/[\d/]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                  e.preventDefault()
                }
              }}
              onInput={(e) => {
                let value = e.currentTarget.value.replace(/\D/g, "")
                if (value.length >= 2) {
                  value = value.substring(0, 2) + "/" + value.substring(2)
                }
                if (value.length >= 5) {
                  value = value.substring(0, 5) + "/" + value.substring(5, 9)
                }
                e.currentTarget.value = value
              }}
            />
          </Form.Item>

          <Form.Item label="Số CCCD" name="identityNumber">
            <Input onChange={(e) => handleChange("identityNumber", e.target.value)} placeholder="Chưa có dữ liệu" />
          </Form.Item>
        </div>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ max: 200, message: "Địa chỉ không được vượt quá 200 ký tự!" }]}
        >
          <Input.TextArea
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Chưa có dữ liệu"
            rows={2}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Chuyên khoa" name="specialization">
            <Input onChange={(e) => handleChange("specialization", e.target.value)} placeholder="Chưa có dữ liệu" />
          </Form.Item>

          <Form.Item label="Khoa trực thuộc" name="department">
            <Input disabled value={profile?.department?.departmentName} placeholder="Chưa có dữ liệu" />
          </Form.Item>

          <Form.Item label="Loại tài khoản" name="type">
            <Select
              disabled
              placeholder="Chưa có dữ liệu"
              options={[
                { value: "EXAMINATION", label: "Bác sĩ khám bệnh" },
                { value: "SERVICE", label: "Bác sĩ xét nghiệm" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Mã bác sĩ" name="doctorId">
            <Input disabled placeholder="Chưa có dữ liệu" />
          </Form.Item>

          <Form.Item label="Chức danh" name="academicDegree">
            <Input disabled value={ACADEMIC_DEGREE_LABELS[profile?.academicDegree]} placeholder="Chưa có dữ liệu" />
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default AccountInfo
