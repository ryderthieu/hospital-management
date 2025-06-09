import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Alert,
  ConfigProvider,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../../role-admin/components/common/PageMeta";

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

    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#036672",
        },
      }}
    >
          <PageMeta
        title="SignIn Dashboard | Admin Dashboard"
        description="This is SignIn Tables Dashboard"
      />
      <div className="flex-1">
        <div className="h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Title level={2} className="text-gray-800 mb-2">Đăng nhập</Title>
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
              className="space-y-4"
            >
              <Form.Item
                name="phone"
                label={<span className="text-gray-700 font-medium">Số điện thoại</span>}
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
                  className="h-12 rounded-lg border-gray-200 hover:border-cyan-400 focus:border-cyan-500"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="text-gray-700 font-medium">Mật khẩu</span>}
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  className="h-12 rounded-lg border-gray-200 hover:border-cyan-400 focus:border-cyan-500"
                />
              </Form.Item>

              <Form.Item className="mb-0 pt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-cyan-600 to-base-600 hover:from-cyan-700 hover:to-base-700 border-none shadow-lg font-medium text-base"
                  loading={isLoading}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center text-sm text-gray-500 mt-6">
              <p className="text-gray-500">Hệ thống quản lý bệnh viện</p>
              <p>Dành cho Admin và Bác sĩ</p>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LoginForm;
