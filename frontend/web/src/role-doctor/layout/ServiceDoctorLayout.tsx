import type React from "react"
import { Layout } from "antd"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/common/Sidebar"
import Header from "../components/common/Header"
import { ServiceOrderProvider } from "../contexts/ServiceOrderContext"
import { ScheduleProvider } from "../contexts/ScheduleContext"

const { Content } = Layout

const ServiceDoctorLayout: React.FC = () => {
  return (
    <ServiceOrderProvider>
      <ScheduleProvider>
        <Layout className="h-screen">
          <Sidebar role="service" />
          <Layout>
            <Header />
            <Content className="p-4 h-screen overflow-y-auto bg-gray-50">
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </ScheduleProvider>
    </ServiceOrderProvider>
  )
}

export default ServiceDoctorLayout
