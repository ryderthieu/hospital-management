"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Calendar, Badge, Select, Button, Row, Col, Typography, Modal } from "antd"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import type { Appointment } from "../../types/schedule"
import { generateMockAppointments, getAppointmentsForDay } from "../../services/scheduleService"

const { Title, Text } = Typography
const { Option } = Select

export const ScheduleComponent: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs())
  const [view, setView] = useState<"month" | "week">("month")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null)
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<Appointment[]>([])
  const [totalWeekHours] = useState<number>(32.5)
  const [totalMonthHours] = useState<number>(117)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  // Initialize with mock data
  useEffect(() => {
    const mockAppointments = generateMockAppointments()
    setAppointments(mockAppointments)
  }, [])

  // Update selected day appointments when selectedDay changes
  useEffect(() => {
    if (selectedDay) {
      const dayDate = selectedDay.toDate()
      const dayAppointments = getAppointmentsForDay(appointments, dayDate)
      setSelectedDayAppointments(dayAppointments)
      setModalVisible(true)
    } else {
      setSelectedDayAppointments([])
    }
  }, [selectedDay, appointments])

  const handlePreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"))
  }

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"))
  }

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDay(date)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedDay(null)
  }

  const dateCellRender = (value: Dayjs) => {
    const date = value.toDate()
    const dayAppointments = getAppointmentsForDay(appointments, date)

    return (
      <div>
        {dayAppointments.length > 0 && (
          <Badge
            count={dayAppointments.length}
            style={{ backgroundColor: "#047481" }}
            className="absolute top-1 right-1"
          />
        )}
      </div>
    )
  }

  const formatAppointmentTime = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`
  }

  return (
    <div className="w-full">
      {/* Working hours summary */}
      <Row gutter={24} className="mb-6">
        <Col span={12}>
          <div className="flex items-center">
            <div className="mr-2">
              <Text type="secondary">Tổng số giờ làm việc trong tuần</Text>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600" style={{ width: "75%" }}></div>
                </div>
                <span className="ml-2 font-medium">{totalWeekHours}h</span>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="flex items-center">
            <div className="mr-2">
              <Text type="secondary">Tổng số giờ làm việc trong tháng</Text>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: "85%" }}></div>
                </div>
                <span className="ml-2 font-medium">{totalMonthHours}h</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* View toggle and controls */}
      <Row className="mb-4" justify="space-between" align="middle">
        <Col>
          <div className="flex items-center">
            <Button icon={<LeftOutlined />} onClick={handlePreviousMonth} style={{ marginRight: 8 }} />
            <Title level={4} style={{ margin: 0 }}>
              {currentDate.format("MMMM YYYY")}
            </Title>
            <Button icon={<RightOutlined />} onClick={handleNextMonth} style={{ marginLeft: 8 }} />
          </div>
        </Col>
        <Col>
          <div className="flex items-center">
            <Text style={{ marginRight: 8 }}>Hiển thị theo:</Text>
            <Select defaultValue="month" style={{ width: 120 }} onChange={(value) => setView(value)}>
              <Option value="month">Tháng</Option>
              <Option value="week">Tuần</Option>
            </Select>
          </div>
        </Col>
      </Row>

      {/* Calendar */}
      <Calendar
        value={currentDate}
        onSelect={handleDateSelect}
        dateCellRender={dateCellRender}
        mode={view}
        fullscreen={true}
      />

      {/* Appointment Modal */}
      <Modal title={selectedDay?.format("DD MMMM YYYY")} open={modalVisible} onCancel={handleCloseModal} footer={null}>
        {selectedDayAppointments.length > 0 ? (
          <div className="space-y-4">
            {selectedDayAppointments.map((app, index) => (
              <div key={index} className="border rounded-lg p-3 bg-blue-50">
                <div className="font-medium text-blue-600">{formatAppointmentTime(app.startTime, app.endTime)}</div>
                <div className="flex items-center text-blue-700">{app.title}</div>
                {app.description && <div className="text-sm text-gray-600 mt-1">{app.description}</div>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Không có lịch hẹn cho ngày này</p>
        )}
      </Modal>
    </div>
  )
}
