import type React from "react"
import { Layout } from "antd"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/common/Sidebar"
import Header from "../components/common/Header"

const { Content } = Layout

const ExaminationDoctorLayout: React.FC = () => {
  return (
    <Layout className="h-screen">
      <Sidebar role="examination" />
      <Layout>
        <Header />
        <Content
          className="p-4 h-screen overflow-y-auto bg-gray-50"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}


export default ExaminationDoctorLayout
