"use client"

import { useState, useEffect } from "react"
import { Form, Input, Select, Button, Avatar, Space, Upload, message } from "antd"
import { EditOutlined, UserOutlined, UploadOutlined } from "@ant-design/icons"
import { useUserProfile } from "../../hooks/useUserProfile"

const AccountInfo = () => {
  const [editMode, setEditMode] = useState(false)
  const { profile, loading, error, handleChange, handleSave, handleCancel } = useUserProfile()
  const [form] = Form.useForm()
  useEffect(() => {
  if (profile) {
    form.setFieldsValue(profile)
  }
}, [profile, form])

  if (loading) return <div className="flex justify-center py-8">Đang tải...</div>
  if (error) return <div className="text-red-500 py-8">{error}</div>
  if (!profile) return <div className="text-red-500 py-8">Không có dữ liệu hồ sơ</div>

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

  const handleAvatarChange = (info: any) => {
    if (info.file.size && info.file.size > 3 * 1024 * 1024) {
      message.error("Kích thước ảnh không được vượt quá 3MB!")
      return
    }
    message.info("Tính năng upload ảnh sẽ được triển khai sau")
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
                <Upload showUploadList={false} beforeUpload={() => false} onChange={handleAvatarChange}>
                  <Button icon={<UploadOutlined />}>Thay đổi ảnh đại diện</Button>
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
            label="Họ và tên"
            name="fullName"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên đệm!" },
              { min: 2, message: "Họ và tên đệm phải có ít nhất 2 ký tự!" },
              { max: 50, message: "Họ và tên đệm không được vượt quá 50 ký tự!" },
              { pattern: /^[a-zA-ZÀ-ỹ\s]+$/, message: "Họ và tên đệm chỉ được chứa chữ cái và khoảng trắng!" },
            ]}
            className="w-full"
          >
            <Input
              disabled={!editMode}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Nhập họ và tên"
            />
          </Form.Item>
          <div></div>

          

          <Form.Item label="Giới tính" name="gender">
            <Select
              disabled={!editMode}
              onChange={(value) => handleChange("gender", value)}
              placeholder="Chọn giới tính"
              options={[
                { value: "MALE", label: "Nam" },
                { value: "FEMALE", label: "Nữ" },
              ]}
            />
          </Form.Item>
          

          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth"
            rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
          >
            <Input type="date" disabled={!editMode} onChange={(e) => handleChange("dateOfBirth", e.target.value)} />
          </Form.Item>
        </div>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ max: 200, message: "Địa chỉ không được vượt quá 200 ký tự!" }]}
        >
          <Input.TextArea
            disabled={!editMode}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Nhập địa chỉ"
            rows={3}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^(\+84|0)\d{9,10}$/,
                message: "Số điện thoại không hợp lệ! Định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx",
              },
            ]}
          >
            <Input
              disabled={!editMode}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="Nhập số điện thoại (VD: 0987654321)"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "Email không đúng định dạng!",
              },
            ]}
          >
            <Input
              type="email"
              disabled={!editMode}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Nhập email"
              allowClear
            />
          </Form.Item>

          <Form.Item label="Khoa trực thuộc" name="department">
            <Input disabled={true} placeholder="Khoa trực thuộc" />
          </Form.Item>

          <Form.Item label="Loại tài khoản" name="type">
            <Input disabled={true} placeholder="Loại tài khoản" />
          </Form.Item>

          <Form.Item label="Mã bác sĩ" name="doctorId">
            <Input disabled={true} placeholder="Mã bác sĩ" />
          </Form.Item>

          <Form.Item label="Chức danh" name="academicDegree">
            <Input disabled={true} placeholder="Chức danh" />
          </Form.Item>

          <Form.Item label="Chuyên khoa" name="specialization">
            <Input disabled={true} placeholder="Chuyên khoa" />
          </Form.Item>

          <Form.Item label="Số CCCD" name="identityNumber">
            <Input disabled={true} placeholder="Số CCCD" />
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default AccountInfo
