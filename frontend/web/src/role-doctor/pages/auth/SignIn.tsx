import type React from "react"
import { Form, Input, Button, Card, Typography, Checkbox, Layout } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

const { Title, Text } = Typography
const { Content } = Layout

const SignIn: React.FC = () => {
  const navigate = useNavigate()

  const onFinish = (values: any) => {
    console.log("Success:", values)
    navigate("/examination/")
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card style={{ width: 400, borderRadius: 12, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              <span style={{ color: "#047481" }}>We</span>
              <span>Care</span>
            </Title>
            <Text type="secondary">Đăng nhập vào hệ thống</Text>
          </div>

          <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
            <Form.Item name="username" rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}>
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Tên đăng nhập"
                size="large"
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
                <a href="#" style={{ color: "#047481" }}>
                  Quên mật khẩu?
                </a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: "100%", height: 40 }}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  )
}

export default SignIn
