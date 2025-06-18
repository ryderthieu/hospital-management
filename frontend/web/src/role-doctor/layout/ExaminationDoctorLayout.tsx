import type React from "react"
import { Layout } from "antd"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/common/Sidebar"
import Header from "../components/common/Header"
import { AppointmentProvider } from "../contexts/AppointmentContext"
import { ScheduleProvider } from "../contexts/ScheduleContext"

const { Content } = Layout

const ExaminationDoctorLayout: React.FC = () => {
  return (
    <AppointmentProvider>
      <ScheduleProvider>
        <Layout className="h-screen">
          <Sidebar role="examination" />
          <Layout>
            <Header />
            <Content className="p-4 h-screen overflow-y-auto bg-gray-50">
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </ScheduleProvider>
    </AppointmentProvider>
  )
}

export default ExaminationDoctorLayout
