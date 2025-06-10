import type React from "react"
import { Card, Typography } from "antd"

const { Title } = Typography

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={2} style={{ marginBottom: 24 }}>
        Dashboard - Bác sĩ xét nghiệm
      </Title>

      <Card bordered={false}>
        <div>Dashboard cho bác sĩ xét nghiệm sẽ được hiển thị ở đây</div>
      </Card>
    </div>
  )
}

export default Dashboard
