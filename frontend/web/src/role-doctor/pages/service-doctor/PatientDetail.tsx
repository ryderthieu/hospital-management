import type React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Typography,
  Spin,
  Card,
  message,
  Select,
  DatePicker,
  Space,
  Popconfirm,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExperimentOutlined,
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import type { ServiceOrder } from "../../types/serviceOrder";
import type { ExaminationRoom } from "../../types/examinationRoom";
import {
  getServiceOrderById,
  updateServiceOrder,
  deleteServiceOrder,
} from "../../services/serviceOrderServices";
import { appointmentService } from "../../services/appointmentServices";
import { examinationRoomService } from "../../services/examinationRoomServices";
import type { Appointment } from "../../types/appointment";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const PatientDetail: React.FC = () => {
  // const [serviceOrder, setServiceOrder] = useState<ServiceOrder | null>(null)
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [examinationRoom, setExaminationRoom] =
    useState<ExaminationRoom | null>(null);

  const { orderId, roomId, appointmentData, roomData, serviceOrder } =
    location.state || {};

  // setServiceOrder(data)  //phía dứa tự hiểu là serviceOrder
  // setAppointment(appointmentData)
  // setExaminationRoom(roomData)

  const fetchServiceOrder = async () => {
    if (!orderId || !roomId) {
      message.error("Không tìm thấy thông tin đơn xét nghiệm");
      return;
    }

    setLoading(true);
    try {
      // We need serviceId to get the service order, but we don't have it directly
      // This is a limitation of the current API structure
      // For now, we'll assume we can get it somehow or modify the API
      // const data = await getServiceOrderById(1, orderId) // Using serviceId = 1 as placeholder
      // setServiceOrder(data)

      // // Fetch appointment data to get patient information
      // if (data.appointmentId) {
      //   try {
      //     const appointmentData = await appointmentService.getAppointmentById(data.appointmentId)
      //     setAppointment(appointmentData)
      //   } catch (appointmentError) {
      //     console.error("Error fetching appointment data:", appointmentError)
      //     // Don't show error message for appointment fetch failure, just log it
      //   }
      // }

      // // Fetch examination room data
      // if (data.roomId) {
      //   try {
      //     const roomData = await examinationRoomService.getExaminationRoomById(data.roomId)
      //     setExaminationRoom(roomData)
      //   } catch (roomError) {
      //     console.error("Error fetching room data:", roomError)
      //   }
      // }
      setAppointment(appointmentData);
      setExaminationRoom(roomData);

      console.log("appointmentData", appointmentData);
      console.log("roomData", roomData);
      console.log("serviceOrder", serviceOrder);

      // Set form values
      form.setFieldsValue({
        serviceName: serviceOrder.serviceName || "",
        orderStatus: serviceOrder.orderStatus,
        result: serviceOrder.result || "",
        orderTime: serviceOrder.orderTime
          ? dayjs(serviceOrder.orderTime)
          : null,
        resultTime: serviceOrder.resultTime
          ? dayjs(serviceOrder.resultTime)
          : null,
      });
    } catch (error) {
      console.error("Error fetching service order:", error);
      message.error("Không thể tải thông tin đơn xét nghiệm");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (!serviceOrder) {
        message.error("Không tìm thấy thông tin đơn xét nghiệm");
        return;
      }

      setSaving(true);

      const updateData: Partial<ServiceOrder> = {
        ...serviceOrder,
        orderStatus: values.orderStatus,
        result: values.result || "",
        resultTime:
          values.orderStatus === "COMPLETED"
            ? new Date().toISOString()
            : serviceOrder.resultTime,
      };

      await updateServiceOrder(
        serviceOrder.service.serviceId,
        orderId,
        updateData as ServiceOrder
      );

      message.success("Cập nhật kết quả xét nghiệm thành công");

      // Refresh data
      await fetchServiceOrder();
    } catch (error) {
      console.error("Error updating service order:", error);
      message.error("Có lỗi xảy ra khi cập nhật kết quả");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceOrder) {
      message.error("Không tìm thấy thông tin đơn xét nghiệm");
      return;
    }

    setDeleting(true);
    try {
      await deleteServiceOrder(serviceOrder.service.serviceId, orderId);
      message.success("Xóa đơn xét nghiệm thành công");
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error("Error deleting service order:", error);
      message.error("Có lỗi xảy ra khi xóa đơn xét nghiệm");
    } finally {
      setDeleting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ORDERED":
        return "#d97706";
      case "COMPLETED":
        return "#059669";
      default:
        return "#6b7280";
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Chưa có";
    try {
      return new Date(dateString).toLocaleString("vi-VN");
    } catch (e) {
      return "Định dạng không hợp lệ";
    }
  };

  const getRoomDisplayName = () => {
    if (!examinationRoom) return `Phòng ${roomId}`;
    return `${examinationRoom.note} - Tòa ${examinationRoom.building}, Tầng ${examinationRoom.floor}`;
  };

  useEffect(() => {
    fetchServiceOrder();
  }, [orderId, roomId]);

  if (loading && !serviceOrder) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!serviceOrder) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Text type="danger">Không tìm thấy thông tin đơn xét nghiệm</Text>
          <div className="mt-4">
            <Button onClick={fetchServiceOrder}>Thử lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <main className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              type="text"
            >
              Quay lại
            </Button>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Chi tiết đơn xét nghiệm #{serviceOrder.orderId}
              </Title>
              <Text type="secondary">Quản lý kết quả xét nghiệm</Text>
            </div>
          </div>

          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchServiceOrder}
              loading={loading}
            >
              Làm mới
            </Button>
            <Popconfirm
              title="Xóa đơn xét nghiệm"
              description="Bạn có chắc chắn muốn xóa đơn xét nghiệm này?"
              onConfirm={handleDelete}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />} loading={deleting}>
                Xóa đơn
              </Button>
            </Popconfirm>
          </Space>
        </div>

        <Row gutter={24}>
          {/* Left column - Service Order Info */}
          <Col span={8}>
            {/* Patient Information Card */}
            {appointment?.patientInfo && (
              <div className="flex-[400px] p-6 bg-white rounded-2xl border border-gray-200">
                <div className="flex flex-row justify-between items-center mb-6">
                  <div className="flex flex-col items-center mb-6">
                    <img
                      src={appointment.patientInfo.avatar || "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-440x512-ni4kvfm4.png" }
                      alt="Patient"
                      className="w-24 h-24 rounded-full mb-3"
                    />
                    <p className="text-black font-semibold text-xl">
                     {appointment.patientInfo.fullName}
                    </p>
                    <p className="text-gray-600">
                      Mã bệnh nhân: {appointment.patientInfo.patientId}
                    </p>
                    <p className="text-gray-600">
                      {appointment.patientInfo.gender === "MALE"
                        ? "Nam"
                        : appointment.patientInfo.gender === "FEMALE"
                        ? "Nữ"
                        : "N/A"}
                      ,{" "}
                      {appointment.patientInfo.birthday
                        ? new Date().getFullYear() -
                          new Date(
                            appointment.patientInfo.birthday
                          ).getFullYear()
                        : "N/A"}{" "}
                      tuổi
                    </p>
                  </div>
                </div>

                {/* Contact info */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base-700 font-medium">
                      Thông tin cá nhân
                    </h3>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="w-[200px] py-2">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm">Địa chỉ</span>
                      </div>
                      <p className="text-black text-sm">
                        {appointment.patientInfo.address || "Không có"}
                      </p>
                    </div>

                    <div className="py-2 text-right">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm w-full text-right">
                          CMND/CCCD
                        </span>
                      </div>
                      <p className="text-black text-sm">
                        {appointment.patientInfo.identityNumber || "Không có"}
                      </p>
                    </div>

                    <div className="py-2">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm">Ngày sinh</span>
                      </div>
                      <p className="text-black text-sm">
                        {appointment.patientInfo.birthday
                          ? new Date(
                              appointment.patientInfo.birthday
                            ).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </p>
                    </div>

                    <div className="py-2 text-right">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm w-full text-right">
                          Số BHYT
                        </span>
                      </div>
                      <p className="text-black text-sm">
                        {appointment.patientInfo.insuranceNumber || "Không có"}
                      </p>
                    </div>

                    <div className="py-2">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm">
                          Chiều cao (cm)
                        </span>
                      </div>
                      <p className="text-black text-sm">
                        {appointment.patientInfo.height || "Chưa có dữ liệu"}
                      </p>
                    </div>

                    <div className="py-2 text-right">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm w-full text-right">
                          Cân nặng (kg)
                        </span>
                      </div>
                      <p className="text-black text-sm">
                        {appointment.patientInfo.weight || "Không xác định"}
                      </p>
                    </div>

                    <div className="py-2">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm">Nhóm máu</span>
                      </div>
                      <p className="text-black text-sm">
                        {appointment.patientInfo.bloodType || "Không xác định"}
                      </p>
                    </div>

                    <div className="py-2 text-right">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm w-full text-right">
                          Dị ứng
                        </span>
                      </div>
                      <p className="text-black text-sm">
                        {appointment.patientInfo.allergies || "Không xác định"}
                      </p>
                    </div>

                    <div className="py-2">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm">
                          Số điện thoại
                        </span>
                      </div>
                      <p className="text-black text-sm">
                        {appointment.patientInfo.phoneNumber || "Chưa có"}
                      </p>
                    </div>

                    <div className="py-2 text-right">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm w-full text-right">
                          Email
                        </span>
                      </div>
                      <p className="text-black text-sm">
                        {appointment.patientInfo.email || "Chưa có"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Col>

          {/* Right column - Edit Form */}
          <Col span={16}>
            <Card title="Cập nhật kết quả xét nghiệm">
              <Form form={form} layout="vertical" onFinish={handleSave}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Tên xét nghiệm" name="serviceName">
                      <Input disabled style={{ color: "black" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Nơi thực hiện">
                      <Input
                        value={getRoomDisplayName()}
                        disabled
                        style={{ color: "black" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Thời gian đặt" name="orderTime">
                      <DatePicker
                        showTime
                        disabled
                        className="custom-disabled-picker"
                        style={{ width: "100%" }}
                        format="HH:mm DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Thời gian trả kết quả" name="resultTime">
                      <DatePicker
                        placeholder="Chưa có kết quả"
                        showTime
                        disabled
                        className="custom-disabled-picker"
                        style={{ width: "100%" }}
                        format="HH:mm DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Trạng thái"
                  name="orderStatus"
                  rules={[
                    { required: true, message: "Vui lòng chọn trạng thái!" },
                  ]}
                >
                  <Select style={{ width: "180px" }}>
                    <Option value="ORDERED">Đang chờ</Option>
                    <Option value="COMPLETED">Đã hoàn thành</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Kết quả xét nghiệm"
                  name="result"
                  rules={[
                    {
                      required: true,
                      message: "Trường này là bắt buộc",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          getFieldValue("orderStatus") === "COMPLETED" &&
                          !value
                        ) {
                          return Promise.reject(
                            new Error(
                              "Vui lòng nhập kết quả khi đánh dấu hoàn thành!"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Nhập kết quả xét nghiệm chi tiết..."
                  />
                </Form.Item>

                <div className="flex justify-end space-x-4">
                  <Button onClick={handleBack}>Hủy</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={saving}
                  >
                    Lưu kết quả
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </main>
    </div>
  );
};

export default PatientDetail;
