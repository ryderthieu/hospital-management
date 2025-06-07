import type React from "react"
import { Layout } from "antd"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/common/Sidebar"
import Header from "../components/common/Header"

const { Content } = Layout

const TestDoctorLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar role="test" />
      <Layout>
        <Header />
        <Content className="p-4 overflow-y-auto bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default TestDoctorLayout
