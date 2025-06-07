"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const LoginForm = () => {
  const [form] = Form.useForm();
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onFinish = async (values: { phone: string; password: string }) => {
    try {
      setLoginError(null);
      const success = await login(values);
      if (success) {
        const userStr = localStorage.getItem("authUser");
        if (userStr) {
          const user = JSON.parse(userStr);
          switch (user.role) {
            case "ADMIN":
              navigate("/admin");
              break;
            case "DOCTOR":
              navigate("/doctor/examination");
              break;
            case "RECEPTIONIST":
              navigate("/receptionist/");
              break;
            default:
              navigate("/");
              break;
          }
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      setLoginError("Đăng nhập thất bại. Vui lòng thử lại.");
      console.log(error);
    }
  };

  return (
    <div className="flex-1">
      <div className="h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <div className="text-center mb-8">
            <Title level={2}>Đăng nhập</Title>
          </div>

          {(error || loginError) && (
            <Alert
              message={error || loginError}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^(\+84|0)\d{9,10}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Nhập số điện thoại"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={isLoading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center text-sm text-gray-600">
            <p>Hệ thống quản lý bệnh viện</p>
            <p>Dành cho Admin và Bác sĩ</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
