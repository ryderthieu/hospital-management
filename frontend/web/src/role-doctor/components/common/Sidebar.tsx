import type React from "react"
import { Layout, Menu } from "antd"
import { useLocation, Link } from "react-router-dom"
import {
  BarChartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons"

const { Sider } = Layout

interface SidebarProps {
  role: "examination" | "test"
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation()
  const basePath = `/${role}`

  const menuItems = [
    {
      key: `${basePath}/`,
      icon: <BarChartOutlined />,
      label: "Dashboard",
      link: `${basePath}/`,
    },
    {
      key: `${basePath}/schedule`,
      icon: <CalendarOutlined />,
      label: "Lịch làm việc",
      link: `${basePath}/schedule`,
    },
    {
      key: `${basePath}/appointment`,
      icon: <ClockCircleOutlined />,
      label: "Lịch hẹn",
      link: `${basePath}/appointment`,
    },
    {
      key: `${basePath}/patients`,
      icon: <TeamOutlined />,
      label: "Bệnh nhân",
      link: `${basePath}/patients`,
    },
    {
      key: `${basePath}/account`,
      icon: <UserOutlined />,
      label: "Tài khoản",
      link: `${basePath}/account`,
    },
    {
      key: "/",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      link: "/",
    },
  ]

  return (
    <Sider
      width={208}
      style={{
        background: "#ffffff",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        zIndex: 10,
      }}
    >
      <div className="p-6 border-b border-gray-200 text-center">
        <h1 className="text-xl font-bold">
          <span className="text-base-600">We</span>
          <span className="text-black">Care</span>
        </h1>
      </div>

      <Menu mode="inline" selectedKeys={[location.pathname]} style={{ border: "none", padding: "8px" }}>
        {menuItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.link}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  )
}

export default Sidebar
