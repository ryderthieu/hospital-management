import type React from "react"
import { Card, Typography } from "antd"

const { Title } = Typography

const Account: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={2} style={{ marginBottom: 24 }}>
        Tài khoản - Bác sĩ xét nghiệm
      </Title>

      <Card bordered={false}>
        <div>Thông tin tài khoản cho bác sĩ xét nghiệm sẽ được hiển thị ở đây</div>
      </Card>
    </div>
  )
}

export default Account
