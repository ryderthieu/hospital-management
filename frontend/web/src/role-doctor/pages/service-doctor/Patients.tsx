"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Avatar,
  Space,
  Card,
  Select,
  Tooltip,
  Empty,
  Tag,
} from "antd";
import {
  EditOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  CalendarOutlined,
  ReloadOutlined,
  ClearOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import WeCareLoading from "../../components/common/WeCareLoading";
import { useNavigate } from "react-router-dom";
import { useServiceOrders } from "./useServiceOrders";
import type { ServiceOrder } from "../../types/serviceOrder";


const { Search } = Input;
const { Option } = Select;

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const navigate = useNavigate();

  // Using roomId = 1 as default (you can get this from user context)
  const roomId = 1;

  const {
    serviceOrdersTable,
    appointmentsData,
    roomsData,
    loading,
    error,
    stats,
    filters,
    updateFilters,
    clearFilters,
    refreshServiceOrders,
  } = useServiceOrders(roomId);


  const handleViewServiceOrder = (record: ServiceOrder) => {
    const appointment = appointmentsData[record.appointmentId];
    const room = roomsData[record.roomId];
    navigate("/doctor/service/patient/detail", {
      state: {
        orderId: record.orderId,
        roomId: record.roomId,
        appointmentData: appointment,
        roomData: room,
        serviceOrder: record
      },
    });
  };

  const handleRefresh = () => {
    refreshServiceOrders();
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    updateFilters({ status: value === "all" ? undefined : value });
  };

  const handleServiceTypeFilterChange = (value: string) => {
    setServiceTypeFilter(value);
    updateFilters({ serviceType: value === "all" ? undefined : value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateFilters({ searchTerm: value || undefined });
  };

  const getStatusBadge = (orderStatus: string) => {
    const statusConfig = {
      ORDERED: { color: "#d97706", bgColor: "#fef3c7", text: "Đang chờ" },
      COMPLETED: {
        color: "#059669",
        bgColor: "#d1fae5",
        text: "Đã hoàn thành",
      },
    };

    const config = statusConfig[orderStatus as keyof typeof statusConfig] || {
      color: "#6b7280",
      bgColor: "#f3f4f6",
      text: "Không xác định",
    };

    return (
      <span
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        {config.text}
      </span>
    );
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Chưa có";
    try {
      const date = new Date(dateString);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${hours}:${minutes} ${day}/${month}/${year}`;
    } catch (e) {
      return "Định dạng không hợp lệ";
    }
  };

  const getRoomDisplayName = (roomId: number) => {
    const room = roomsData[roomId];
    if (!room) return `Phòng ${roomId}`;
    return `Tòa ${room.building} - Tầng ${room.floor}`;
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "number",
      key: "number",
      width: 70,
      render: (number: number) => (
        <span style={{ fontWeight: 500, color: "#6b7280" }}>{number}</span>
      ),
    },
    {
      title: "Bệnh nhân",
      dataIndex: "appointmentId",
      key: "patient",
      render: (appointmentId: number, record: ServiceOrder) => {
        const appointment = appointmentsData[appointmentId];
        const patientInfo = appointment?.patientInfo;

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={
                patientInfo?.avatar ||
                "https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg"
              }
              size={48}
              style={{ marginRight: 12, border: "2px solid #f0f9ff" }}
              icon={<UserOutlined />}
            />
            <div>
              <div
                style={{
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "2px",
                }}
              >
                {patientInfo?.fullName || "Đang tải..."}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Mã BN: {patientInfo?.patientId || "N/A"}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                <div>
                  {patientInfo?.birthday
                    ? new Date(patientInfo.birthday).toLocaleDateString(
                        "vi-VN"
                      )
                    : "N/A"}
                </div>
                <div>
                  {patientInfo?.gender === "MALE"
                    ? "Nam"
                    : patientInfo?.gender === "FEMALE"
                    ? "Nữ"
                    : "N/A"}{" "}
                  -
                  {patientInfo?.birthday
                    ? ` ${
                        new Date().getFullYear() -
                        new Date(patientInfo.birthday).getFullYear()
                      } tuổi`
                    : " N/A"}
                </div>
              </div>
              {/* Contact info */}
              <div
                style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}
              >
                {patientInfo?.phoneNumber && (
                  <span style={{ marginRight: "8px" }}>
                    <PhoneOutlined style={{ marginRight: "2px" }} />
                    {patientInfo.phoneNumber}
                  </span>
                )}
                {patientInfo?.email && (
                  <span>
                    <MailOutlined style={{ marginRight: "2px" }} />
                    {patientInfo.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Tên chỉ định",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (serviceName: any) => (
        <div>
          <div
            style={{ fontWeight: 500, color: "#374151", marginBottom: "4px" }}
          >
            {serviceName || "Không có tên"}
          </div>
          {/* {getServiceTypeBadge(service?.serviceType || "OTHER")} */}
        </div>
      ),
    },
    {
      title: "Nơi thực hiện",
      dataIndex: "roomId",
      key: "roomId",
      render: (roomId: number) => (
        <div>
          <div style={{ color: "#374151", fontWeight: 500 }}>
            {getRoomDisplayName(roomId)}
          </div>
          {roomsData[roomId]?.note && (
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              {roomsData[roomId].note}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Thời gian đặt",
      dataIndex: "orderTime",
      key: "orderTime",
      render: (orderTime: string) => (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            <CalendarOutlined style={{ marginRight: 8, color: "#6b7280" }} />
            <span style={{ color: "#374151", fontSize: "16px" }}>
              {formatDateTime(orderTime)}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      key: "result",
      ellipsis: true,
      render: (result: string) => (
        <Tooltip title={result || "Chưa có kết quả"}>
          <span style={{ color: result ? "#374151" : "#9ca3af" }}>
            {result || "Chưa có kết quả"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: any, record: ServiceOrder) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EditOutlined />}
              type="text"
              size="small"
              onClick={() => handleViewServiceOrder(record)}
              style={{ color: "#047481" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ padding: "24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#111827",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            Danh sách chỉ định - {getRoomDisplayName(roomId)}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>
            Quản lý và theo dõi các đơn xét nghiệm
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <Card size="small" style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}
            >
              {stats.total}
            </div>
            <div style={{ color: "#6b7280" }}>Tổng đơn xét nghiệm</div>
          </Card>
          <Card size="small" style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#d97706" }}
            >
              {stats.ordered}
            </div>
            <div style={{ color: "#6b7280" }}>Đang chờ</div>
          </Card>
          <Card size="small" style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#059669" }}
            >
              {stats.completed}
            </div>
            <div style={{ color: "#6b7280" }}>Đã hoàn thành</div>
          </Card>
        </div>

        {/* Filters */}
        <Card
          bordered={false}
          style={{
            borderRadius: "16px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Search
              placeholder="Tìm kiếm theo tên xét nghiệm, mã đơn, tên bệnh nhân..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ width: 600 }}
              prefix={<SearchOutlined style={{ color: "#6b7280" }} />}
            />

            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={{ width: 200 }}
              suffixIcon={<FilterOutlined style={{ color: "#6b7280" }} />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="ORDERED">Đang chờ</Option>
              <Option value="COMPLETED">Đã hoàn thành</Option>
            </Select>

            <Button icon={<ClearOutlined />} onClick={clearFilters} type="text">
              Xóa bộ lọc
            </Button>

            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              style={{ marginLeft: "auto" }}
            >
              Làm mới
            </Button>
          </div>
        </Card>

        {/* Service Orders table */}
        <Card
          bordered={false}
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Danh sách các chỉ định được yêu cầu
              </h2>
              <span
                style={{
                  backgroundColor: "#dbeafe",
                  color: "#1d4ed8",
                  fontSize: "14px",
                  fontWeight: 500,
                  padding: "4px 12px",
                  borderRadius: "20px",
                }}
              >
                {serviceOrdersTable.length} đơn
              </span>
            </div>
          </div>

          {loading ? (
            <WeCareLoading mode="parent" />
          ) : error ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Empty description={error} />
            </div>
          ) : serviceOrdersTable.length === 0 ? (
            <Empty
              description="Không tìm thấy đơn xét nghiệm nào"
              style={{ padding: "60px 0" }}
            />
          ) : (
            <Table
              columns={columns}
              dataSource={serviceOrdersTable}
              rowKey="orderId"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) =>
                  `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} đơn xét nghiệm`,
                style: { marginTop: "16px" },
              }}
              style={{ borderRadius: "12px" }}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
              }
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Patients;
