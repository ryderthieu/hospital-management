import type React from "react"
import { Card, Typography } from "antd"

const { Title } = Typography

const Patients: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={2} style={{ marginBottom: 24 }}>
        Bệnh nhân - Bác sĩ xét nghiệm
      </Title>

      <Card bordered={false}>
        <div>Danh sách bệnh nhân cho bác sĩ xét nghiệm sẽ được hiển thị ở đây</div>
      </Card>
    </div>
  )
}

export default Patients
