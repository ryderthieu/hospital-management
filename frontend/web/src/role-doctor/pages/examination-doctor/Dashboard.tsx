import type React from "react"
import { Row, Col, Card, Table, Badge, Calendar, Typography, List, Avatar, Progress, Divider } from "antd"
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons"
import { useDashboardData } from "../../hooks/useDashboardData"
import type { Dayjs } from "dayjs"

const { Title, Text } = Typography

const Dashboard: React.FC = () => {
  const { patientStats, recentPatients, upcomingAppointments, todayAppointments } = useDashboardData()

  const getAppointmentListData = (value: Dayjs) => {
    const day = value.date()
    const month = value.month()

    const matchingAppointments = todayAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      return appointmentDate.getDate() === day && appointmentDate.getMonth() === month
    })

    return matchingAppointments.map((appointment) => ({
      type: appointment.status,
      content: appointment.patientName,
    }))
  }

  const dateCellRender = (value: Dayjs) => {
    const listData = getAppointmentListData(value)

    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge
              status={
                item.type === "confirmed"
                  ? "success"
                  : item.type === "pending"
                    ? "warning"
                    : item.type === "cancelled"
                      ? "error"
                      : "default"
              }
              text={
                <Text ellipsis style={{ fontSize: "12px" }}>
                  {item.content}
                </Text>
              }
            />
          </li>
        ))}
      </ul>
    )
  }

  const patientColumns = [
    {
      title: "Bệnh nhân",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={record.avatar} size={40} style={{ marginRight: 12, border: "2px solid #f0f9ff" }} />
          <div>
            <div style={{ fontWeight: 600, color: "#111827" }}>{text}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>{record.code}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày khám",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <CalendarOutlined style={{ marginRight: 8, color: "#6b7280" }} />
          <Text>{date}</Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = ""
        let text = ""
        let bgColor = ""

        switch (status) {
          case "completed":
            color = "#059669"
            bgColor = "#d1fae5"
            text = "Hoàn thành"
            break
          case "pending":
            color = "#d97706"
            bgColor = "#fef3c7"
            text = "Đang chờ"
            break
          case "testing":
            color = "#2563eb"
            bgColor = "#dbeafe"
            text = "Xét nghiệm"
            break
          default:
            color = "#6b7280"
            bgColor = "#f3f4f6"
            text = status
        }

        return (
          <span
            style={{
              color,
              backgroundColor: bgColor,
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {text}
          </span>
        )
      },
    },
  ]

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ padding: "24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <Title level={2} style={{ margin: 0, color: "#111827" }}>
            Chào mừng trở lại, Dr. Nguyễn Thiên Tài
          </Title>
          <Text style={{ color: "#6b7280", fontSize: "16px" }}>Đây là tổng quan về hoạt động hôm nay của bạn</Text>
        </div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                borderRadius: "16px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Tổng số bệnh nhân</div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>{patientStats.total}</div>
                  <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
                     +12% so với tuần trước
                  </div>
                </div>
                <UserOutlined style={{ fontSize: "48px", opacity: 0.3 }} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                borderRadius: "16px",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Lịch hẹn hôm nay</div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>{patientStats.todayAppointments}</div>
                  <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
                    <ClockCircleOutlined /> 3 lịch hẹn sắp tới
                  </div>
                </div>
                <ClockCircleOutlined style={{ fontSize: "48px", opacity: 0.3 }} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                borderRadius: "16px",
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Đã hoàn thành</div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>{patientStats.completed}</div>
                  <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
                    <CheckCircleOutlined /> Hiệu suất tốt
                  </div>
                </div>
                <CheckCircleOutlined style={{ fontSize: "48px", opacity: 0.3 }} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                borderRadius: "16px",
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                color: "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Đang xét nghiệm</div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>{patientStats.testing}</div>
                  <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
                    <MedicineBoxOutlined /> Chờ kết quả
                  </div>
                </div>
                <MedicineBoxOutlined style={{ fontSize: "48px", opacity: 0.3 }} />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          {/* Left Column */}
          <Col xs={24} lg={16}>
            {/* Recent Patients */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TeamOutlined style={{ marginRight: "8px", color: "#047481" }} />
                  <span style={{ fontWeight: 600 }}>Bệnh nhân gần đây</span>
                </div>
              }
              extra={
                <a
                  href="/examination/patients"
                  style={{
                    color: "#047481",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Xem tất cả →
                </a>
              }
              bordered={false}
              style={{
                borderRadius: "16px",
                marginBottom: "24px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Table
                dataSource={recentPatients}
                columns={patientColumns}
                pagination={false}
                rowKey="id"
                style={{ borderRadius: "12px" }}
              />
            </Card>

            {/* Calendar */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CalendarOutlined style={{ marginRight: "8px", color: "#047481" }} />
                  <span style={{ fontWeight: 600 }}>Lịch làm việc</span>
                </div>
              }
              extra={
                <a
                  href="/examination/schedule"
                  style={{
                    color: "#047481",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Xem chi tiết →
                </a>
              }
              bordered={false}
              style={{
                borderRadius: "16px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Calendar fullscreen={false} dateCellRender={dateCellRender} />
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Upcoming Appointments */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ClockCircleOutlined style={{ marginRight: "8px", color: "#047481" }} />
                  <span style={{ fontWeight: 600 }}>Lịch hẹn sắp tới</span>
                </div>
              }
              extra={
                <a
                  href="/examination/appointment"
                  style={{
                    color: "#047481",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Xem tất cả →
                </a>
              }
              bordered={false}
              style={{
                borderRadius: "16px",
                marginBottom: "24px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <List
                itemLayout="horizontal"
                dataSource={upcomingAppointments}
                renderItem={(item) => (
                  <List.Item style={{ padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} size={48} style={{ border: "2px solid #f0f9ff" }} />}
                      title={
                        <a
                          href={`/examination/patient/detail?id=${item.id}`}
                          style={{
                            fontWeight: 600,
                            color: "#111827",
                            textDecoration: "none",
                          }}
                        >
                          {item.patientName}
                        </a>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: "4px", color: "#6b7280" }}>
                            <ClockCircleOutlined style={{ marginRight: "4px" }} />
                            {item.date} - {item.time}
                          </div>
                          <span
                            style={{
                              color: item.status === "confirmed" ? "#059669" : "#d97706",
                              backgroundColor: item.status === "confirmed" ? "#d1fae5" : "#fef3c7",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          >
                            {item.status === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
                          </span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Clinic Info */}
            <Card
              title={<span style={{ fontWeight: 600 }}>Thông tin phòng khám</span>}
              bordered={false}
              style={{
                borderRadius: "16px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <Text style={{ color: "#6b7280", fontSize: "14px" }}>Phòng khám</Text>
                <div style={{ fontWeight: 600, fontSize: "16px", color: "#111827" }}>Dị Ứng - Miễn Dịch Lâm Sàng</div>
              </div>

              <Divider style={{ margin: "16px 0" }} />

              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <Text style={{ color: "#6b7280" }}>Số bệnh nhân đang chờ</Text>
                  <Text style={{ fontWeight: 600, color: "#d97706" }}>12</Text>
                </div>
                <Progress percent={75} strokeColor="#f59e0b" trailColor="#fef3c7" showInfo={false} />
              </div>

              <div>
                <Text style={{ color: "#6b7280", fontSize: "14px" }}>Thời gian làm việc</Text>
                <div style={{ fontWeight: 600, fontSize: "16px", color: "#111827" }}>07:00 - 18:00</div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Dashboard
