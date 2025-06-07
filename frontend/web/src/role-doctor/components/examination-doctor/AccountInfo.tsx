"use client"

import type React from "react"
import { Form, Input, Select, Button, Avatar, Space, Upload, message } from "antd"
import { EditOutlined, UserOutlined } from "@ant-design/icons"
import { useUserProfile } from "../../hooks/useUserProfile"

interface AccountInfoProps {
  editMode: boolean
  setEditMode: (value: boolean) => void
}

const AccountInfo: React.FC<AccountInfoProps> = ({ editMode, setEditMode }) => {
  const { profile, loading, error, handleChange, handleSave, handleCancel } = useUserProfile()
  const [form] = Form.useForm()

  if (loading) return <div className="flex justify-center py-8">Loading...</div>
  if (error) return <div className="text-red-500 py-8">{error}</div>
  if (!profile) return <div className="text-red-500 py-8">No profile data available</div>

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      const success = await handleSave()
      if (success) {
        setEditMode(false)
        message.success("Thông tin đã được cập nhật thành công")
      }
    } catch (error) {
      console.error("Validation failed:", error)
    }
  }

  const cancelEdit = () => {
    handleCancel()
    setEditMode(false)
    form.resetFields()
  }

  return (
    <div className="bg-white px-5 py-3 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Hồ sơ của tôi</h2>
          <p className="text-gray-600">Thông tin này sẽ được hiển thị công khai</p>
        </div>
        {!editMode ? (
          <Button type="primary" onClick={() => setEditMode(true)} icon={<EditOutlined />}>
            Chỉnh sửa
          </Button>
        ) : (
          <Space>
            <Button onClick={cancelEdit}>Huỷ bỏ</Button>
            <Button type="primary" onClick={handleSubmit}>
              Lưu thay đổi
            </Button>
          </Space>
        )}
      </div>

      <Form form={form} layout="vertical" initialValues={profile} onFinish={handleSubmit}>
        {/* Avatar Section */}
        <Form.Item label="Ảnh đại diện">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar src={profile.avatarUrl} size={96} icon={<UserOutlined />} />
              <div className="ml-5">
                <p className="text-sm text-gray-600 mb-1">Định dạng: jpg, jpeg, png.</p>
                <p className="text-sm text-gray-600 mb-3">Kích thước tối đa: 3MB</p>
              </div>
            </div>

            {editMode ? (
              <Space>
                <Button>Gỡ ảnh</Button>
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={(info) => {
                    if (info.file.size && info.file.size > 3 * 1024 * 1024) {
                      message.error("Kích thước ảnh không được vượt quá 3MB!")
                      return
                    }
                    // Handle avatar change
                  }}
                >
                  <Button type="default">Thay đổi ảnh đại diện</Button>
                </Upload>
              </Space>
            ) : (
              <Button type="default">Xem ảnh đại diện</Button>
            )}
          </div>
        </Form.Item>

        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Họ và tên đệm"
            name="lastName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên đệm!" }]}
          >
            <Input disabled={!editMode} onChange={(e) => handleChange("lastName", e.target.value)} />
          </Form.Item>

          <Form.Item label="Tên" name="firstName" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
            <Input disabled={!editMode} onChange={(e) => handleChange("firstName", e.target.value)} />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender">
            <Select
              disabled={!editMode}
              onChange={(value) => handleChange("gender", value)}
              options={[
                { value: "Nam", label: "Nam" },
                { value: "Nữ", label: "Nữ" },
                { value: "Khác", label: "Khác" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Ngày sinh" name="dateOfBirth">
            <Input disabled={!editMode} onChange={(e) => handleChange("dateOfBirth", e.target.value)} />
          </Form.Item>
        </div>

        <Form.Item label="Địa chỉ" name="address">
          <Input disabled={!editMode} onChange={(e) => handleChange("address", e.target.value)} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Số điện thoại" name="phoneNumber">
            <Input disabled={!editMode} onChange={(e) => handleChange("phoneNumber", e.target.value)} />
          </Form.Item>

          <Form.Item label="Khoa trực thuộc" name="department">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item label="Loại tài khoản" name="accountType">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item label="Mã bác sĩ" name="doctorId">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item label="Chức danh" name="title">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item label="Chuyên khoa" name="specialization">
            <Input disabled={true} />
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default AccountInfo
