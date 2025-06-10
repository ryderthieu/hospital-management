import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Avatar,
  Space,
  Upload,
  message,
  Empty,
  DatePicker,
} from "antd";
import { EditOutlined, UserOutlined, UploadOutlined } from "@ant-design/icons";
import WeCareLoading from "../common/WeCareLoading";
import { useUserProfile } from "../../hooks/useUserProfile";
import dayjs from "dayjs";

const AccountInfo = () => {
  const { profile, loading, error, handleChange, handleSave, handleCancel } = useUserProfile();
  const [form] = Form.useForm();
  console.log(profile)

  // Sửa lỗi: Kiểm tra profile tồn tại trước khi set fields
  useEffect(() => {
    if (profile) {
      const formValues = {
        ...profile,
        dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
      };
      form.setFieldsValue(formValues);
    }
  }, [profile, form]);

  if (loading) return <WeCareLoading />;
  if (error)
    return <Empty description="Đã xảy ra lỗi trong quá trình tải dữ liệu" />;
  if (!profile) return <Empty description="Không có dữ liệu hồ sơ" />;

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const success = await handleSave();
      if (success) {
        setEditMode(false);
        message.success("Thông tin đã được cập nhật thành công");
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const cancelEdit = () => {
    handleCancel();
    setEditMode(false);
    // Reset lại form với dữ liệu hiện tại
    if (profile) {
      form.setFieldsValue({
        ...profile,
        dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
      });
    }
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.size && info.file.size > 3 * 1024 * 1024) {
      message.error("Kích thước ảnh không được vượt quá 3MB!");
      return;
    }
    message.info("Tính năng upload ảnh sẽ được triển khai sau");
  };

  // Xử lý thay đổi DatePicker
  const handleDateChange = (date: any) => {
    handleChange("dateOfBirth", date ? date.toISOString() : null);
  };

  const accountTypeMap: Record<string, string> = {
    EXAMINATION: "Bác sĩ khám bệnh",
    SERVICE: "Bác sĩ xét nghiệm",
  };

  return (
    <div className="bg-white px-5 py-3 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Hồ sơ của tôi</h2>
          <p className="text-gray-600">
            Thông tin này sẽ được hiển thị công khai
          </p>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={profile || {}} // Đảm bảo không null
        onFinish={handleSubmit}
      >
        {/* Avatar Section */}
        <Form.Item label="Ảnh đại diện">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar
                src={profile?.avatarUrl}
                size={96}
                icon={<UserOutlined />}
              />
              <div className="ml-5">
                <p className="text-sm text-gray-600 mb-1">
                  Định dạng: jpg, jpeg, png.
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Kích thước tối đa: 3MB
                </p>
              </div>
            </div>

            <Space>
              <Button>Gỡ ảnh</Button>
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleAvatarChange}
              >
                <Button icon={<UploadOutlined />}>
                  Thay đổi ảnh đại diện
                </Button>
              </Upload>
            </Space>
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
              {
                max: 50,
                message: "Họ và tên đệm không được vượt quá 50 ký tự!",
              },
              {
                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: "Họ và tên đệm chỉ được chứa chữ cái và khoảng trắng!",
              },
            ]}
            className="w-full"
            style={{ color: "black" }}
          >
            <Input
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Chưa có dữ liệu"
              style={{ color: "black" }}
            />
          </Form.Item>
          <div></div>

          <Form.Item label="Giới tính" name="gender">
            <Select
              onChange={(value) => handleChange("gender", value)}
              placeholder="Chưa có dữ liệu"
              options={[
                { value: "MALE", label: "Nam" },
                { value: "FEMALE", label: "Nữ" },
              ]}
              style={{ color: "black" }}
              className="custom-disabled-select"
            />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth"
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder="Chưa có dữ liệu"
              onChange={handleDateChange}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[
            { max: 200, message: "Địa chỉ không được vượt quá 200 ký tự!" },
          ]}
        >
          <Input.TextArea
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Chưa có dữ liệu"
            rows={1}
            style={{ color: "black" }}
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
                message:
                  "Số điện thoại không hợp lệ! Định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx",
              },
            ]}
          >
            <Input
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="Chưa có dữ liệu"
              style={{ color: "black" }}
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
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Chưa có dữ liệu"
              allowClear
              style={{ color: "black" }}
            />
          </Form.Item>

          <Form.Item label="Chuyên khoa" name="specialization">
            <Input
              placeholder="Chưa có dữ liệu"
              style={{ color: "black" }}
            />
          </Form.Item>

          <Form.Item label="Số CCCD" name="identityNumber">
            <Input
              placeholder="Chưa có dữ liệu"
              style={{ color: "black" }}
            />
          </Form.Item>

          <Form.Item label="Khoa trực thuộc" name="department">
            <Input
              disabled={true}
              placeholder="Chưa có dữ liệu"
              style={{ color: "black" }}
            />
          </Form.Item>

            <Form.Item label="Loại tài khoản" name="type">
            <Select
              disabled={true}
              onChange={(value) => handleChange("type", value)}
              placeholder="Chưa có dữ liệu"
              options={[
                { value: "EXAMINATION", label: "Bác sĩ khám bệnh" },
                { value: "SERVICE", label: "Bác sĩ xét nghiệm" },
              ]}
              style={{ color: "black" }}
              className="custom-disabled-select"
            />
          </Form.Item>

          <Form.Item label="Mã bác sĩ" name="doctorId">
            <Input
              disabled={true}
              placeholder="Chưa có dữ liệu"
              style={{ color: "black" }}
            />
          </Form.Item>

          <Form.Item label="Chức danh" name="academicDegree">
            <Input
              disabled={true}
              placeholder="Chưa có dữ liệu"
              style={{ color: "black" }}
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AccountInfo;