"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Button,
  Checkbox,
  Typography,
  Spin,
  Tabs,
  InputNumber,
  message,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  MessageOutlined,
  ReloadOutlined,
  CloseOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { PatientStatusSection } from "../../components/examination-doctor/PatientStatusSection";
import { PrescriptionModal } from "../../components/examination-doctor/PrescriptionModal";
import { ServiceOrderModal } from "../../components/examination-doctor/ServiceOrderModal";
import { PrescriptionHistoryModal } from "../../components/examination-doctor/PrescriptionHistoryModal";
import { TestResultDetailModal } from "../../components/examination-doctor/TestResultDetailModal";
import { usePatientDetail } from "../../hooks/usePatientDetail";
import { usePrescriptionHistory } from "../../hooks/usePrescriptionHistory";
import { usePrescriptionModal } from "../../hooks/usePrescription";
import { NoteType } from "../../types/appointmentNote";
import type { Prescription } from "../../types/prescription";
import type { ServiceOrder } from "../../types/serviceOrder";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PatientDetail: React.FC = () => {
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isPrescriptionHistoryModalOpen, setIsPrescriptionHistoryModalOpen] =
    useState(false);
  const [isTestResultDetailModalOpen, setIsTestResultDetailModalOpen] =
    useState(false);
  const [selectedServiceOrder, setSelectedServiceOrder] =
    useState<ServiceOrder | null>(null);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [noteText, setNoteText] = useState("");
  const [form] = Form.useForm();
  const location = useLocation();
  const { appointmentId } = location.state || {};

  const {
    patientDetail,
    prescription,
    serviceOrders,
    appointmentNotes,
    loading,
    prescriptionLoading,
    serviceOrdersLoading,
    notesLoading,
    saving,
    updateAppointmentStatus,
    createAppointmentNote,
    deleteAppointmentNote,
    updatePatientInfo,
    updateVitalSigns,
    refreshAll,
    fetchPrescription,
  } = usePatientDetail(appointmentId);

  // Load prescription history
  const {
    prescriptionHistory,
    loading: historyLoading,
    refreshHistory,
  } = usePrescriptionHistory(patientDetail?.patientInfo?.patientId);

  const handlePrescriptionSaved = async () => {
    // Refresh tất cả data sau khi lưu prescription
    await refreshAll(appointmentId);
  };

  // Set form values when patient detail is loaded
  useEffect(() => {
    if (patientDetail) {
      const formValues = {
        name: patientDetail.patientInfo?.fullName || "",
        clinic: patientDetail.schedule?.roomNote || "",
        doctor: patientDetail.doctorInfo?.fullName || "",
        doctorCode: patientDetail.doctorInfo?.doctorId || "",
        appointmentTime: `${(patientDetail.slotStart || "").slice(0, 5)} - ${(patientDetail.slotEnd || "").slice(0, 5)}`,
        appointmentDate: patientDetail.schedule?.workDate || "",
        symptoms: patientDetail?.symptoms || "",
        diagnosis: prescription?.diagnosis || "",
        doctorNotes: prescription?.note || "",
        hasFollowUp: prescription?.isFollowUp || false,
        followUpDate: prescription?.followUpDate || "",
        // Vital signs
        systolicBloodPressure: prescription?.systolicBloodPressure || undefined,
        diastolicBloodPressure:
          prescription?.diastolicBloodPressure || undefined,
        heartRate: prescription?.heartRate || undefined,
        bloodSugar: prescription?.bloodSugar || undefined,
        temperature: undefined,
        weight: patientDetail.patientInfo?.weight || undefined,
      };
      form.setFieldsValue(formValues);
    }
  }, [patientDetail, prescription, form]);

  const handleCompleteExamination = async () => {
    if (!appointmentId) {
      message.error("Không tìm thấy thông tin cuộc hẹn");
      return;
    }

    try {
      const values = await form.validateFields();

      // Validate vital signs
      const requiredVitalSigns = [
        "systolicBloodPressure",
        "diastolicBloodPressure",
        "heartRate",
        "bloodSugar",
      ];
      const missingVitalSigns = requiredVitalSigns.filter(
        (field) => !values[field]
      );

      if (missingVitalSigns.length > 0) {
        message.error("Vui lòng nhập đầy đủ thông tin sinh hiệu");
        return;
      }

      // Validate required fields
      if (!values.diagnosis?.trim()) {
        message.error("Vui lòng nhập chẩn đoán");
        return;
      }

      if (!values.doctorNotes?.trim()) {
        message.error("Vui lòng nhập lời dặn của bác sĩ");
        return;
      }

      // Prepare update data
      const updateData = {
        name: values.name || "",
        symptoms: values.symptoms || "",
        diagnosis: values.diagnosis || "",
        doctorNotes: values.doctorNotes || "",
        isFollowUp: values.isFollowUp || false,
        followUpDate: values.followUpDate || "Không hẹn tái khám",
        systolicBloodPressure: values.systolicBloodPressure,
        diastolicBloodPressure: values.diastolicBloodPressure,
        heartRate: values.heartRate,
        bloodSugar: values.bloodSugar,
      };

      // Update patient info and vital signs
      await updatePatientInfo(appointmentId, updateData);

      // Update appointment status to COMPLETED
      await updateAppointmentStatus(appointmentId, "COMPLETED");
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  // Tính trạng thái xét nghiệm dựa trên serviceOrders
  const getTestingStatus = () => {
    if (!serviceOrders || serviceOrders.length === 0) return "Chưa có chỉ định";
    const hasCompleted = serviceOrders.some(
      (order) => order.orderStatus === "COMPLETED"
    );
    const hasOrdered = serviceOrders.some(
      (order) => order.orderStatus === "ORDERED"
    );

    if (hasCompleted) return "Đã có kết quả";
    if (hasOrdered) return "Đang xét nghiệm";
    return "Chưa có chỉ định";
  };

  // Tính trạng thái cuộc hẹn
  const getAppointmentStatus = () => {
    if (!patientDetail) return "Đang chờ";

    switch (patientDetail.appointmentStatus) {
      case "PENDING":
        return "Đang chờ";
      case "CONFIRMED":
        return "Đang khám";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Đang chờ";
    }
  };

  const handleTestingStatusChange = (status: string): void => {
    console.log("Testing status changed:", status);
  };

  const handleAppointmentStatusChange = (status: string): void => {
    console.log("Appointment status changed:", status);
  };

  const handleAddNote = () => {
    if (!appointmentId) {
      message.error("Không tìm thấy thông tin cuộc hẹn");
      return;
    }

    if (noteText.trim()) {
      createAppointmentNote(appointmentId, {
        noteType: NoteType.DOCTOR,
        noteText: noteText.trim(),
      });
      setNoteText("");
    }
  };

  const handleDeleteNote = (noteId?: number) => {
    if (!noteId) {
      message.error("Không tìm thấy ID ghi chú");
      return;
    }

    deleteAppointmentNote(noteId);
  };

  const handleViewPrescriptionHistory = (prescription: Prescription) => {
    if (!prescription) return;

    setSelectedPrescription(prescription);
    setIsPrescriptionHistoryModalOpen(true);
  };

  const handleViewTestResult = (serviceOrder: ServiceOrder) => {
    if (!serviceOrder) return;

    setSelectedServiceOrder(serviceOrder);
    setIsTestResultDetailModalOpen(true);
  };

  // Chỉ cập nhật toa thuốc khi đóng modal toa thuốc
  const handleClosePrescriptionModal = useCallback(() => {
    setIsPrescriptionModalOpen(false);
    // Chỉ refresh toa thuốc, không refresh toàn bộ dữ liệu
    if (appointmentId) {
      fetchPrescription(appointmentId);
    }
    console.log("ID của cuộc hẹn", appointmentId);
  }, [appointmentId, fetchPrescription]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch (e) {
      return "Định dạng không hợp lệ";
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleString("vi-VN");
    } catch (e) {
      return "Định dạng không hợp lệ";
    }
  };

  if (loading && !patientDetail) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!patientDetail) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Text type="danger">Không tìm thấy thông tin bệnh nhân</Text>
          <div className="mt-4">
            <Button onClick={() => appointmentId && refreshAll(appointmentId)}>
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const patientAge = patientDetail.patientInfo?.birthday
    ? new Date().getFullYear() -
      new Date(patientDetail.patientInfo.birthday).getFullYear()
    : "N/A";

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <main className="p-6">
        <div className="flex flex-row">
          {/* Left column - Patient info */}
          <div className="flex-[400px] pr-6">
            <div className="flex flex-row justify-between items-center mb-6">
              <div className="flex flex-col items-center mb-6">
                <img
                  src="/placeholder.svg?height=96&width=96"
                  alt="Patient"
                  className="w-24 h-24 rounded-full mb-3"
                />
                <p className="text-gray-600">
                  BN{patientDetail.patientInfo?.patientId || "N/A"}
                </p>
                <p className="text-gray-600">
                  {patientDetail.patientInfo?.gender === "MALE" ? "Nam" : "Nữ"},{" "}
                  {patientAge} tuổi
                </p>
              </div>

              {/* Current status */}
              <PatientStatusSection
                roomNumber={patientDetail.schedule?.roomNote || "N/A"}
                initialTestingStatus={getTestingStatus()}
                initialAppointmentStatus={getAppointmentStatus()}
                onTestingStatusChange={handleTestingStatusChange}
                onAppointmentStatusChange={handleAppointmentStatusChange}
              />
            </div>

            {/* Contact info */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base-700 font-medium">Thông tin cá nhân</h3>
              </div>

              <div className="grid grid-cols-2">
                <div className="w-[200px] py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Địa chỉ</span>
                  </div>
                  <p className="text-black text-sm">
                    {patientDetail.patientInfo?.address || "Không có"}
                  </p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">
                      CMND/CCCD
                    </span>
                  </div>
                  <p className="text-black text-sm">
                    {patientDetail.patientInfo?.identityNumber || "Không có"}
                  </p>
                </div>

                <div className="py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Ngày sinh</span>
                  </div>
                  <p className="text-black text-sm">
                    {formatDate(patientDetail.patientInfo?.birthday)}
                  </p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">
                      Số BHYT
                    </span>
                  </div>
                  <p className="text-black text-sm">
                    {patientDetail.patientInfo?.insuranceNumber || "Không có"}
                  </p>
                </div>

                <div className="py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">
                      Chiều cao (cm)
                    </span>
                  </div>
                  <p className="text-black text-sm">
                    {patientDetail.patientInfo?.height || "Chưa có dữ liệu"}
                  </p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">
                      Cân nặng (kg)
                    </span>
                  </div>
                  <p className="text-black text-sm">
                    {patientDetail.patientInfo?.weight || "Không xác định"}
                  </p>
                </div>

                <div className="py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Nhóm máu</span>
                  </div>
                  <p className="text-black text-sm">
                    {patientDetail.patientInfo?.bloodType || "Không xác định"}
                  </p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">
                      Dị ứng
                    </span>
                  </div>
                  <p className="text-black text-sm">
                    {patientDetail.patientInfo?.allergies || "Không xác định"}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-[2px] my-4 bg-gray-200"></div>

            {/* Prescription History */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base-700 font-medium">Lịch sử đơn thuốc</h3>
                <button
                  className="text-base-600 flex items-center text-sm"
                  onClick={refreshHistory}
                >
                  <ReloadOutlined style={{ marginRight: 4 }} /> Làm mới
                </button>
              </div>

              {historyLoading ? (
                <div className="text-center py-4">
                  <Spin />
                </div>
              ) : !prescriptionHistory || prescriptionHistory.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Chưa có lịch sử đơn thuốc
                </div>
              ) : (
                prescriptionHistory.map((prescriptionItem) => (
                  <div
                    key={prescriptionItem.prescriptionId}
                    className="bg-white rounded-lg border border-gray-200 p-4 mb-3"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <MedicineBoxOutlined
                          style={{ fontSize: 16 }}
                          className="text-blue-600"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Đơn thuốc #{prescriptionItem.prescriptionId}
                        </p>
                        <p className="text-xs text-gray-500">
                          Ngày kê: {formatDateTime(prescriptionItem.createdAt)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Số loại thuốc:{" "}
                          {prescriptionItem.prescriptionDetails?.length || 0}
                        </p>
                      </div>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() =>
                          handleViewPrescriptionHistory(prescriptionItem)
                        }
                      >
                        <EyeOutlined style={{ fontSize: 16 }} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Chẩn đoán: {prescriptionItem.diagnosis || "Không có"}
                    </p>
                    {prescriptionItem.isFollowUp && (
                      <p className="text-xs text-blue-500">
                        Hẹn tái khám:{" "}
                        {prescriptionItem.followUpDate
                          ? formatDate(prescriptionItem.followUpDate)
                          : "Có"}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right column - Examination details */}
          <div className="w-full lg:w-3/4 mt-6 lg:mt-0">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Form form={form} layout="vertical">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      label="Tên bệnh nhân"
                      name="name"
                    >
                      <Input disabled style={{color: 'black'}} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Phòng khám" name="clinic">
                      <Input prefix={<EnvironmentOutlined />} disabled style={{color: 'black'}} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Bác sĩ phụ trách" name="doctor">
                      <Input disabled style={{color: 'black'}} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Mã bác sĩ" name="doctorCode">
                      <Input disabled style={{color: 'black'}} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Giờ đặt khám" name="appointmentTime">
                      <Input disabled style={{color: 'black'}} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Ngày khám" name="appointmentDate">
                      <Input disabled style={{color: 'black'}} />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item
                      label="Huyết áp tâm thu (mmHg)"
                      name="systolicBloodPressure"
                      rules={[
                        { required: true, message: "Không được bỏ trống!" },
                      ]}
                    >
                      <InputNumber min={0} max={300} className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      label="Huyết áp tâm trương (mmHg)"
                      name="diastolicBloodPressure"
                      rules={[
                        { required: true, message: "Không được bỏ trống!" },
                      ]}
                    >
                      <InputNumber min={0} max={200} className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      label="Nhịp tim"
                      name="heartRate"
                      rules={[
                        { required: true, message: "Không được bỏ trống!" },
                      ]}
                    >
                      <InputNumber min={0} max={200} className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      label="Đường huyết"
                      name="bloodSugar"
                      rules={[
                        { required: true, message: "Không được bỏ trống!" },
                      ]}
                    >
                      <InputNumber min={0} max={500} className="w-full" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Triệu chứng" name="symptoms">
                  <Input.TextArea rows={1} />
                </Form.Item>

                <Form.Item
                  label="Chẩn đoán"
                  name="diagnosis"
                  rules={[
                    { required: true, message: "Vui lòng nhập chẩn đoán!" },
                  ]}
                >
                  <Input.TextArea rows={1} />
                </Form.Item>

                <Form.Item
                  label="Lời dặn của bác sĩ"
                  name="doctorNotes"
                  rules={[
                    { required: true, message: "Vui lòng nhập lời dặn!" },
                  ]}
                >
                  <Input.TextArea rows={1} />
                </Form.Item>

                <Form.Item name="isFollowUp" valuePropName="checked">
                  <Checkbox>Hẹn tái khám</Checkbox>
                </Form.Item>

                <Form.Item
                  shouldUpdate={(prev, curr) =>
                    prev.isFollowUp !== curr.isFollowUp
                  }
                >
                  {({ getFieldValue }) => {
                    const isFollowUp = getFieldValue("isFollowUp");
                    return (
                      <Form.Item
                        label="Ngày tái khám"
                        name="followUpDate"
                        rules={
                          isFollowUp
                            ? [
                                {
                                  required: true,
                                  message: "Vui lòng chọn ngày tái khám!",
                                },
                              ]
                            : []
                        }
                      >
                        <DatePicker
                          style={{ width: 200 }}
                          placeholder="Chọn ngày"
                          format="DD/MM/YYYY"
                          disabled={!isFollowUp}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Form>

              <div className="flex flex-wrap justify-end gap-4">
                <Button type="default" size="large" loading={saving}>
                  Chờ bệnh nhân xét nghiệm
                </Button>
                <Button onClick={() => setIsPrescriptionModalOpen(true)}>
                  {prescription ? "Chỉnh sửa toa thuốc đã kê" : "Kê toa thuốc"}
                </Button>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setIsMedicalModalOpen(true)}
                >
                  Thêm chỉ định
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleCompleteExamination}
                  loading={saving}
                >
                  Hoàn thành khám
                </Button>
              </div>

              <div className="h-[2px] my-4 bg-gray-200"></div>

              <Tabs defaultActiveKey="1">
                <TabPane tab="Kết quả xét nghiệm" key="1">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-gray-700 font-medium">
                        Kết quả xét nghiệm
                      </h3>
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={() =>
                          appointmentId && refreshAll(appointmentId)
                        }
                      >
                        Làm mới
                      </Button>
                    </div>

                    {serviceOrdersLoading ? (
                      <div className="text-center py-8">
                        <Spin />
                      </div>
                    ) : !serviceOrders || serviceOrders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Chưa có kết quả xét nghiệm
                      </div>
                    ) : (
                      serviceOrders.map((order) => (
                        <div
                          key={order.orderId}
                          className="border border-gray-200 rounded-lg p-4 mb-4"
                        >
                          <div className="flex items-start mb-2">
                            <FileTextOutlined
                              style={{ fontSize: 20 }}
                              className="text-base-600 mr-3 mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-medium">
                                {order.service?.serviceName || "Không có tên"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Loại:{" "}
                                {order.service?.serviceType || "Không xác định"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Phòng: {order.roomId || "Không xác định"}
                              </p>
                              {order.orderTime && (
                                <p className="text-sm text-gray-500">
                                  Thời gian đặt:{" "}
                                  {new Date(order.orderTime).toLocaleString(
                                    "vi-VN"
                                  )}
                                </p>
                              )}
                              {order.resultTime && (
                                <p className="text-sm text-gray-500">
                                  Thời gian trả kết quả:{" "}
                                  {new Date(order.resultTime).toLocaleString(
                                    "vi-VN"
                                  )}
                                </p>
                              )}
                              {order.result && (
                                <p className="text-sm font-medium mt-1">
                                  Kết luận: {order.result}
                                </p>
                              )}
                              <p className="text-sm text-gray-500 mt-1">
                                Trạng thái:{" "}
                                {order.orderStatus === "COMPLETED"
                                  ? "Đã hoàn thành"
                                  : "Đã đặt"}
                              </p>
                            </div>
                            <button
                              className="text-base-600"
                              onClick={() => handleViewTestResult(order)}
                            >
                              <EyeOutlined style={{ fontSize: 18 }} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabPane>

                <TabPane tab="Ghi chú" key="2">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-gray-700 font-medium">Ghi chú</h3>
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={() =>
                          appointmentId && refreshAll(appointmentId)
                        }
                      >
                        Làm mới
                      </Button>
                    </div>

                    <div className="mb-4">
                      <Input.TextArea
                        rows={4}
                        placeholder="Thêm ghi chú mới..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          type="primary"
                          icon={<MessageOutlined />}
                          onClick={handleAddNote}
                        >
                          Thêm ghi chú
                        </Button>
                      </div>
                    </div>

                    {notesLoading ? (
                      <div className="text-center py-4">
                        <Spin />
                      </div>
                    ) : !appointmentNotes || appointmentNotes.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        Chưa có ghi chú
                      </div>
                    ) : (
                      appointmentNotes.map((note) => (
                        <div
                          key={note.noteId}
                          className="border border-gray-200 rounded-lg p-4 mb-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center mb-2">
                                <MessageOutlined style={{ marginRight: 8 }} />
                                <span className="font-medium">
                                  {note.noteType === NoteType.DOCTOR
                                    ? note.doctorName || "Bác sĩ"
                                    : "Bệnh nhân"}
                                </span>
                              </div>
                              <p className="text-gray-700">
                                {note.noteText || ""}
                              </p>
                              {note.createdAt && (
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(note.createdAt).toLocaleString(
                                    "vi-VN"
                                  )}
                                </p>
                              )}
                            </div>
                            <Button
                              type="text"
                              danger
                              icon={<CloseOutlined />}
                              onClick={() =>
                                note.noteId && handleDeleteNote(note.noteId)
                              }
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={handleClosePrescriptionModal}
        appointmentId={appointmentId}
        existingPrescription={prescription}
        onPrescriptionSaved={handlePrescriptionSaved}
        formParent={form}
      />
      <ServiceOrderModal
        isOpen={isMedicalModalOpen}
        onClose={() => setIsMedicalModalOpen(false)}
        appointmentId={appointmentId}
      />

      {/* Prescription History Modal */}
      <PrescriptionHistoryModal
        isOpen={isPrescriptionHistoryModalOpen}
        onClose={() => {
          setIsPrescriptionHistoryModalOpen(false);
          setSelectedPrescription(null);
        }}
        prescription={selectedPrescription}
      />

      {/* Test Result Detail Modal */}
      <TestResultDetailModal
        isOpen={isTestResultDetailModalOpen}
        onClose={() => {
          setIsTestResultDetailModalOpen(false);
          setSelectedServiceOrder(null);
        }}
        serviceOrder={selectedServiceOrder}
      />
    </div>
  );
};

export default PatientDetail;
