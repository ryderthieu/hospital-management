"use client"

import { useState } from "react"
import { Card, Tabs } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import AccountInfo from "../../components/examination-doctor/AccountInfo"
import ChangePassword from "../../components/examination-doctor/ChangePassword"

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile")

  const items = [
    {
      key: "profile",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UserOutlined />
          Cài đặt hồ sơ
        </span>
      ),
      children: <AccountInfo />,
    },
    {
      key: "password",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LockOutlined />
          Đổi mật khẩu
        </span>
      ),
      children: <ChangePassword />,
    },
  ]

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ padding: "24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#111827",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            Tài khoản & Bảo mật
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>Quản lý thông tin cá nhân và cài đặt bảo mật</p>
        </div>

        {/* Content */}
        <Card
          bordered={false}
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
            size="large"
            tabBarStyle={{
              marginBottom: "32px",
              borderBottom: "2px solid #f3f4f6",
            }}
          />
        </Card>
      </div>
    </div>
  )
}

export default Account
