"use client"

import type React from "react"
import { Layout, Badge, Avatar, Dropdown, Space } from "antd"
import { BellOutlined, UserOutlined, DownOutlined } from "@ant-design/icons"
import { useUserProfile } from "../../hooks/useUserProfile"

const { Header: AntHeader } = Layout

const Header: React.FC = () => {
  const { profile } = useUserProfile()

  const items = [
    {
      key: "1",
      label: "Thông tin cá nhân",
    },
    {
      key: "2",
      label: "Cài đặt",
    },
    {
      key: "3",
      label: "Đăng xuất",
    },
  ]

  return (
    <AntHeader
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        height: 77,
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Badge count={3} size="small">
          <div className="p-2 bg-gray-100 rounded-full cursor-pointer">
            <BellOutlined style={{ fontSize: 20 }} />
          </div>
        </Badge>

        <Dropdown menu={{ items }} trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()} className="ml-6 flex items-center">
            <Space>
              <Avatar src={profile?.avatarUrl} icon={<UserOutlined />} size={40} />
              <div>
                <div className="font-medium">
                  Dr. {profile?.firstName} {profile?.lastName}
                </div>
                <div className="text-xs text-gray-500">{profile?.title}</div>
              </div>
              <DownOutlined style={{ fontSize: 12 }} />
            </Space>
          </a>
        </Dropdown>
      </div>
    </AntHeader>
  )
}

export default Header
