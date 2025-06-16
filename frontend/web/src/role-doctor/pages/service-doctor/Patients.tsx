"use client";

import type React from "react";
import { useState, useEffect, useMemo, useCallback } from "react"; // Add useCallback
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
  DatePicker,
  message,
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
import { api } from "../../../services/api";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Interface for work schedule
interface WorkSchedule {
  workDate: string;
  roomId: number;
  startTime: string;
  endTime: string;
}

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  // Thay đổi dateRange thành single date cho việc chọn lịch làm việc theo ngày
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs()); // Mặc định là ngày hiện tại
  const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(undefined); // Phòng được chọn từ lịch làm việc

  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const navigate = useNavigate();

  const doctorId = localStorage.getItem("currentDoctorId");

  // Fetch work schedules
  const fetchWorkSchedules = async () => {
    if (!doctorId) {
      message.error("Không tìm thấy ID bác sĩ.");
      return;
    }
    setScheduleLoading(true);
    try {
      const response = await api.get(`/doctors/${doctorId}/schedules`);
      setWorkSchedules(response.data);
      // Sau khi tải lịch làm việc, cập nhật selectedRoomId nếu có lịch cho ngày đã chọn
      // Ưu tiên chọn roomId đầu tiên tìm thấy cho ngày hiện tại nếu chưa có gì được chọn
      if (selectedDate && !selectedRoomId && response.data.length > 0) {
        const todaySchedule = response.data.find((schedule: WorkSchedule) =>
          dayjs(schedule.workDate).isSame(selectedDate, 'day')
        );
        if (todaySchedule) {
          setSelectedRoomId(todaySchedule.roomId);
        }
      }
    } catch (error) {
      console.error('Error fetching work schedules:', error);
      message.error('Không thể tải lịch làm việc');
    } finally {
      setScheduleLoading(false);
    }
  };

  // Load work schedules on component mount and when doctorId changes
  useEffect(() => {
    fetchWorkSchedules();
  }, [doctorId, selectedDate]); // Thêm selectedDate vào dependency để khi đổi ngày sẽ thử chọn lại phòng

  // Use useServiceOrders with the selectedRoomId
  const {
    serviceOrdersTable,
    appointmentsData,
    roomsData,
    loading,
    error,
    refreshServiceOrders,
  } = useServiceOrders(selectedRoomId); // Truyền roomId duy nhất hoặc undefined

    const getRoomDisplayName = (roomId: number) => {
    const room = roomsData[roomId];
    if (!room) return `Phòng ${roomId}`;
    return `${room.note} - Tòa ${room.building} - Tầng ${room.floor}`;
  };

  // Lấy danh sách các phòng mà bác sĩ có lịch làm việc trong ngày đã chọn
  const getRoomsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateFormatted = selectedDate.format('YYYY-MM-DD');
    const roomsToday = workSchedules.filter(schedule =>
      schedule.workDate === dateFormatted
    ).map(schedule => schedule.roomId);
    const uniqueRoomIds = [...new Set(roomsToday)];
    console.log("test danh sach phong lam viec: ", uniqueRoomIds)
    return uniqueRoomIds.map(roomId => ({
      roomId,
      displayName: getRoomDisplayName(roomId)
    }));
  }, [selectedDate, workSchedules, roomsData]);

  // Bộ lọc service orders dựa trên lịch làm việc của phòng được chọn và ngày
  const getFilteredServiceOrders = useMemo(() => {
    let filtered = [...serviceOrdersTable];

    if (!selectedDate || selectedRoomId === undefined) {
        return []; // Không có ngày hoặc phòng được chọn thì không hiển thị gì
    }

    const selectedDateFormatted = selectedDate.format('YYYY-MM-DD');

    // Lọc theo lịch làm việc của phòng đã chọn và ngày đã chọn
    filtered = filtered.filter(order => {
      if (!order.orderTime) return false;

      const orderDateTime = dayjs(order.orderTime);
      const orderDate = orderDateTime.format('YYYY-MM-DD');
      const orderTime = orderDateTime.format('HH:mm');

      // Chỉ hiển thị các đơn hàng trong phòng và ngày đã chọn
      if (order.roomId !== selectedRoomId || orderDate !== selectedDateFormatted) {
          return false;
      }

      // Tìm lịch làm việc khớp với ngày và phòng 
      const matchingSchedule = workSchedules.find(schedule =>
        schedule.workDate === orderDate &&
        schedule.roomId === order.roomId
      );

      if (!matchingSchedule) return false; // Nếu không có lịch làm việc thì loại bỏ

      // Kiểm tra thời gian đơn hàng có nằm trong ca làm việc không
      return orderTime >= matchingSchedule.startTime &&
             orderTime <= matchingSchedule.endTime;
    });

    // Apply search term filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const patientInfo = appointmentsData[order.appointmentId]?.patientInfo;
        return (
          order.serviceName?.toLowerCase().includes(lowerCaseSearchTerm) ||
          order.orderId.toString().includes(lowerCaseSearchTerm) ||
          patientInfo?.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
          patientInfo?.patientId?.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Note: serviceTypeFilter is present in state but not used in the original filter logic
    // If you need to filter by serviceType, add similar logic here.

    return filtered.map((order, index) => ({ ...order, number: index + 1 })); // Add sequential number
  }, [serviceOrdersTable, workSchedules, selectedDate, selectedRoomId, searchTerm, statusFilter, appointmentsData]); // Dependencies for memoization

  // Calculate filtered stats
  const getFilteredStats = useMemo(() => {
    const filtered = getFilteredServiceOrders; // Use the already filtered orders
    return {
      total: filtered.length,
      ordered: filtered.filter(order => order.orderStatus === 'ORDERED').length,
      completed: filtered.filter(order => order.orderStatus === 'COMPLETED').length,
    };
  }, [getFilteredServiceOrders]);

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
    refreshServiceOrders(); // This will re-fetch based on `selectedRoomId`
    fetchWorkSchedules(); // Also re-fetch work schedules
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleServiceTypeFilterChange = (value: string) => {
    setServiceTypeFilter(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Handler for changing the selected date
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    // Khi ngày thay đổi, reset selectedRoomId và để useEffect xử lý chọn lại phòng
    setSelectedRoomId(undefined);
  };

  // Handler for changing the selected room
  const handleRoomChange = (value: number) => {
    setSelectedRoomId(value);
  };

  const handleClearFilters = () => {
    // clearFilters(); // Có thể không cần nếu filters được quản lý hoàn toàn ở client-side
    setSelectedDate(dayjs()); // Quay về ngày hiện tại
    setSelectedRoomId(undefined); // Reset phòng
    setSearchTerm("");
    setStatusFilter("all");
    setServiceTypeFilter("all");
    // Gọi refresh nếu việc clear filters cần kích hoạt lại việc fetch data từ hook
    handleRefresh();
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
            Danh sách chỉ định theo lịch làm việc
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>
            Quản lý và theo dõi các đơn xét nghiệm theo lịch làm việc
            {selectedRoomId !== undefined && (
              <span style={{ marginLeft: "8px" }}>
                - Phòng: {getRoomDisplayName(selectedRoomId)} (Ngày: {selectedDate?.format('DD/MM/YYYY')})
              </span>
            )}
            {selectedRoomId === undefined && selectedDate && (
                <span style={{ marginLeft: "8px", color: '#ef4444' }}>
                    - Không có phòng nào được chọn cho ngày {selectedDate.format('DD/MM/YYYY')}
                </span>
            )}
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
              {getFilteredStats.total}
            </div>
            <div style={{ color: "#6b7280" }}>Tổng đơn xét nghiệm</div>
          </Card>
          <Card size="small" style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#d97706" }}
            >
              {getFilteredStats.ordered}
            </div>
            <div style={{ color: "#6b7280" }}>Đang chờ</div>
          </Card>
          <Card size="small" style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#059669" }}
            >
              {getFilteredStats.completed}
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
              style={{ width: 400 }}
              prefix={<SearchOutlined style={{ color: "#6b7280" }} />}
            />

            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              placeholder="Chọn ngày"
              format="DD/MM/YYYY"
              style={{ width: 150 }}
            />

            <Select
              placeholder="Chọn phòng"
              value={selectedRoomId}
              onChange={handleRoomChange}
              style={{ width: 300 }}
              disabled={getRoomsForSelectedDate.length === 0} // Disable if no rooms available for the date
            >
              {getRoomsForSelectedDate.length > 0 ? (
                getRoomsForSelectedDate.map(room => (
                  <Option key={room.roomId} value={room.roomId}>
                    {room.displayName}
                  </Option>
                ))
              ) : (
                <Option value={undefined} disabled>
                  Không có phòng có lịch làm việc
                </Option>
              )}
            </Select>

            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={{ width: 150 }}
              suffixIcon={<FilterOutlined style={{ color: "#6b7280" }} />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="ORDERED">Đang chờ</Option>
              <Option value="COMPLETED">Đã hoàn thành</Option>
            </Select>

            <Button icon={<ClearOutlined />} onClick={handleClearFilters} type="text">
              Xóa bộ lọc
            </Button>

            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading || scheduleLoading}
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
                  flexShrink: 0,
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
                  flexShrink: 0,
                }}
              >
                {getFilteredServiceOrders.length} đơn
              </span>
            </div>
          </div>

          {loading || scheduleLoading ? (
            <WeCareLoading mode="parent" />
          ) : error ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Empty description={error} />
            </div>
          ) : getFilteredServiceOrders.length === 0 ? (
            <Empty
              description="Không tìm thấy đơn xét nghiệm nào trong lịch làm việc cho lựa chọn này."
              style={{ padding: "60px 0" }}
            />
          ) : (
            <Table
              columns={columns}
              dataSource={getFilteredServiceOrders}
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