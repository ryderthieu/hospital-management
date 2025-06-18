import React from "react"
import { useState, useEffect } from "react"
import { Row, Col, Card, Table, Badge, Calendar, Typography, List, Avatar, Progress, Divider } from "antd"
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons"
import {
  appointmentService,
  formatAppointmentDate,
  formatAppointmentTime,
  getAppointmentStatusVietnameseText,
  getAppointmentStatusColor,
} from "../../services/appointmentServices"
import type { Appointment } from "../../types/appointment"
import type { Dayjs } from "dayjs"
import WeCareLoading from "../../components/common/WeCareLoading"

const { Title, Text } = Typography

const Dashboard: React.FC = () => {
  const [recentPatients, setRecentPatients] = useState<Appointment[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [patientStats, setPatientStats] = useState({
    total: 0,
    todayAppointments: 0,
    completed: 0,
    testing: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch recent patients (completed appointments)
      const recentResponse = await appointmentService.getAppointments({
        page: 0,
        size: 8,
        appointmentStatus: "PENDING",
      })

      console.log("recentResponse", recentResponse)

      // Fetch upcoming appointments (confirmed appointments)
      const upcomingResponse = await appointmentService.getAppointments({
        page: 0,
        size: 6,
        appointmentStatus: "PENDING",
      })

      // Fetch today's appointments
      const today = new Date().toISOString().split("T")[0]
      const todayResponse = await appointmentService.getAppointments({
        page: 0,
        size: 50,
        workDate: today,
      })

      // Fetch all appointments for stats
      const allResponse = await appointmentService.getAppointments({
        page: 0,
        size: 100,
      })

      setRecentPatients(recentResponse.content || [])
      setUpcomingAppointments(upcomingResponse.content || [])

      // Calculate stats
      const allAppointments = allResponse.content || []
      const todayAppointments = todayResponse.content || []

      setPatientStats({
        total: allResponse.totalElements || 0,
        todayAppointments: todayAppointments.length,
        completed: allAppointments.filter((apt) => apt.appointmentStatus === "COMPLETED").length,
        testing: allAppointments.filter((apt) => apt.appointmentStatus === "PENDING_TEST_RESULT").length,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAppointmentListData = (value: Dayjs) => {
    return []
  }

  const dateCellRender = (value: Dayjs) => {
    const listData = getAppointmentListData(value)
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge
              status="success"
              text={
                <Text ellipsis className="text-xs">
                  {item}
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
      dataIndex: "patientInfo",
      key: "patientInfo",
      render: (patientInfo: any, record: Appointment) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-3 border-2 border-blue-50">
            {patientInfo?.fullName.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{patientInfo?.fullName}</div>
            <div className="text-xs text-gray-500">#{record.appointmentId}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày khám",
      dataIndex: "schedule",
      key: "schedule",
      render: (schedule: any, record: Appointment) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-2 text-gray-500" />
          <span>{formatAppointmentDate(schedule?.workDate)}</span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "appointmentStatus",
      key: "appointmentStatus",
      render: (status: string) => {
        const { color, bgColor } = getAppointmentStatusColor(status)
        const text = getAppointmentStatusVietnameseText(status)

        return (
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              color,
              backgroundColor: bgColor,
            }}
          >
            {text}
          </span>
        )
      },
    },
  ]

  if (loading) {
    return (
      <div className="flex-1 h-screen w-full bg-slate-50">
        <WeCareLoading mode="parent" />
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại, Dr. Trần Nhật Linh
          </h1>
          <p className="text-gray-600 text-base">Đây là tổng quan về hoạt động hôm nay của bạn</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm opacity-90 mb-2">Tổng số bệnh nhân</div>
                <div className="text-3xl font-bold">{patientStats.total}</div>
                <div className="text-xs opacity-80 mt-1">Tổng cộng</div>
              </div>
              <UserOutlined className="text-5xl opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm opacity-90 mb-2">Lịch hẹn hôm nay</div>
                <div className="text-3xl font-bold">{patientStats.todayAppointments}</div>
                <div className="text-xs opacity-80 mt-1 flex items-center">
                  <ClockCircleOutlined className="mr-1" /> Hôm nay
                </div>
              </div>
              <ClockCircleOutlined className="text-5xl opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-sky-400 to-cyan-500 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm opacity-90 mb-2">Đã hoàn thành</div>
                <div className="text-3xl font-bold">{patientStats.completed}</div>
                <div className="text-xs opacity-80 mt-1 flex items-center">
                  <CheckCircleOutlined className="mr-1" /> Hoàn tất
                </div>
              </div>
              <CheckCircleOutlined className="text-5xl opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-yellow-400 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm opacity-90 mb-2">Chờ kết quả XN</div>
                <div className="text-3xl font-bold">{patientStats.testing}</div>
                <div className="text-xs opacity-80 mt-1 flex items-center">
                  <MedicineBoxOutlined className="mr-1" /> Chờ kết quả
                </div>
              </div>
              <MedicineBoxOutlined className="text-5xl opacity-30" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Patients */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TeamOutlined className="mr-2 text-teal-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Bệnh nhân gần đây</h3>
                  </div>
                  <a
                    href="/doctor/examination/patients"
                    className="text-teal-600 font-medium hover:text-teal-700 transition-colors"
                  >
                    Xem tất cả →
                  </a>
                </div>
              </div>
              <div className="p-6">
                <Table
                  dataSource={recentPatients}
                  columns={patientColumns}
                  pagination={false}
                  rowKey="appointmentId"
                  loading={loading}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-teal-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Lịch làm việc</h3>
                  </div>
                  <a
                    href="/examination/schedule"
                    className="text-teal-600 font-medium hover:text-teal-700 transition-colors"
                  >
                    Xem chi tiết →
                  </a>
                </div>
              </div>
              <div className="p-6">
                <Calendar fullscreen={false} dateCellRender={dateCellRender} />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-teal-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Lịch hẹn sắp tới</h3>
                  </div>
                  <a
                    href="/doctor/examination/patients"
                    className="text-teal-600 font-medium hover:text-teal-700 transition-colors"
                  >
                    Xem tất cả →
                  </a>
                </div>
              </div>
              <div className="p-6">
                <List
                  itemLayout="horizontal"
                  dataSource={upcomingAppointments}
                  loading={loading}
                  renderItem={(item) => (
                    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg border-2 border-blue-50 flex-shrink-0">
                        {item?.patientInfo?.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <a
                          href={`/examination/patient/detail?id=${item.appointmentId}`}
                          className="block font-semibold text-gray-900 hover:text-teal-600 transition-colors"
                        >
                          {item?.patientInfo?.fullName}
                        </a>
                        <div className="mt-1">
                          <div className="text-sm text-gray-600 mb-1 flex items-center">
                            <ClockCircleOutlined className="mr-1" />
                            {formatAppointmentDate(item?.schedule?.workDate)} -
                          </div>
                          <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            {getAppointmentStatusVietnameseText(item.appointmentStatus)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Clinic Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Thông tin phòng khám</h3>
              </div>
              <div className="p-6">
                <div className="mb-5">
                  <p className="text-sm text-gray-600 mb-1">Phòng khám</p>
                  <p className="text-base font-semibold text-gray-900">Phòng khám nội</p>
                </div>

                <div className="border-t border-gray-200 pt-5 mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Tiến độ công việc hôm nay</span>
                    <span className="text-sm font-semibold text-green-600">68%</span>
                  </div>
                  <div className="w-full bg-green-50 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: '68%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Thời gian làm việc</p>
                  <p className="text-base font-semibold text-gray-900">07:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard