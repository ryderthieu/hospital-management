"use client"

import type React from "react"
import { Layout, Badge, Avatar, Dropdown, Space, Button } from "antd"
import { 
  BellOutlined, 
  UserOutlined, 
  DownOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserAddOutlined
} from "@ant-design/icons"
import { useUserProfile } from "../../hooks/useUserProfile"

const { Header: AntHeader } = Layout

const Header: React.FC = () => {
  const { profile } = useUserProfile()

  const menuItems = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <UserAddOutlined className="text-blue-500" />,
    },
    {
      key: "settings", 
      label: "Cài đặt",
      icon: <SettingOutlined className="text-gray-500" />,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined className="text-red-500" />,
      danger: true,
    },
  ]

  return (
    <AntHeader 
      className="shadow-sm border-0 border-b border-gray-200 px-6 lg:px-8"
      style={{ 
        background: "#fff",
        height: 77
      }}
    >
      <div className="h-full w-full flex items-center justify-end  mx-auto">
        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Badge 
              count={3} 
              size="small"
              className="hover:scale-105 transition-transform duration-200"
            >
              <Button
                type="text"
                shape="circle"
                size="large"
                icon={<BellOutlined />}
                className="bg-gray-50 hover:bg-gray-100 border-0 shadow-sm hover:shadow-md transition-all duration-200"
              />
            </Badge>
          </div>

          {/* User Profile Dropdown */}
          <Dropdown
            menu={{ 
              items: menuItems,
              className: "min-w-48 py-2"
            }}
            trigger={["click"]}
            placement="bottomCenter"
            arrow={{ pointAtCenter: true }}
          >
            <div className="flex items-center py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200">
              <Avatar 
                src={profile?.avatarUrl} 
                icon={<UserOutlined />} 
                size={42}
                className="border-2 border-white"
              />
              
              {/* User Info - Ẩn trên mobile nhỏ */}
              <div className="hidden sm:block ml-3">
                <div className="font-semibold text-gray-800 text-sm leading-tight">
                  <span>Dr. {profile?.fullName} </span>
                   <DownOutlined className="text-gray-400 text-xs ml-1 transition-transform duration-200" />
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {profile?.title || "Không xác định"}
                </div>
              </div>
              
             
            </div>
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  )
}

export default Header