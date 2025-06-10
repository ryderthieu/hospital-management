"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Row, Col, Form, Input, Button, Checkbox, Typography, Spin, Tabs, InputNumber, message } from "antd"
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
} from "@ant-design/icons"
import { PatientStatusSection } from "../../components/examination-doctor/PatientStatusSection"
import { PrescriptionModal } from "../../components/examination-doctor/PrescriptionModal"
import { ServiceOrderModal } from "../../components/examination-doctor/ServiceOrderModal"
import { PrescriptionHistoryModal } from "../../components/examination-doctor/PrescriptionHistoryModal"
import { TestResultDetailModal } from "../../components/examination-doctor/TestResultDetailModal"
import { usePatientDetail } from "../../hooks/usePatientDetail"
import { usePrescriptionHistory } from "../../hooks/usePrescriptionHistory"
import { usePrescriptionModal } from "../../hooks/usePrescription"
import { NoteType } from "../../types/appointmentNote"
import type { Prescription } from "../../types/prescription"
import type { ServiceOrder } from "../../types/serviceOrder"

const { Title, Text } = Typography
const { TabPane } = Tabs

const PatientDetail: React.FC = () => {
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false)
  const [isPrescriptionHistoryModalOpen, setIsPrescriptionHistoryModalOpen] = useState(false)
  const [isTestResultDetailModalOpen, setIsTestResultDetailModalOpen] = useState(false)
  const [selectedServiceOrder, setSelectedServiceOrder] = useState<ServiceOrder | null>(null)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [noteText, setNoteText] = useState("")
  const [form] = Form.useForm()
  const location = useLocation()
  const { appointmentId } = location.state || {}

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
  } = usePatientDetail(appointmentId)

  // Load prescription history
  const {
    prescriptionHistory,
    loading: historyLoading,
    refreshHistory,
  } = usePrescriptionHistory(patientDetail?.patientInfo.patientId)

  // Prescription modal hook
  const { tempPrescription, clearTempPrescription } = usePrescriptionModal(appointmentId)

  // Set form values when patient detail is loaded
  useEffect(() => {
    if (patientDetail) {
      const formValues = {
        name: patientDetail.patientInfo.fullName,
        clinic: patientDetail.schedule.roomNote,
        doctor: patientDetail.doctorInfo.fullName,
        doctorCode: patientDetail.doctorInfo.doctorId,
        appointmentTime: `${patientDetail.slotStart} - ${patientDetail.slotEnd}`,
        appointmentDate: patientDetail.schedule.workDate,
        symptoms: patientDetail?.symptoms,
        diagnosis: prescription?.diagnosis || "",
        doctorNotes: prescription?.note || "",
        hasFollowUp: prescription?.isFollowUp || false,
        followUpDate: prescription?.followUpDate || "",
        // Vital signs
        systolicBloodPressure: prescription?.systolicBloodPressure || undefined,
        diastolicBloodPressure: prescription?.diastolicBloodPressure || undefined,
        heartRate: prescription?.heartRate || undefined,
        bloodSugar: prescription?.bloodSugar || undefined,
        temperature: undefined,
        weight: patientDetail.patientInfo.weight || undefined,
      }
      form.setFieldsValue(formValues)
    }
  }, [patientDetail, prescription, form])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      // Validate vital signs
      const requiredVitalSigns = ["systolicBloodPressure", "diastolicBloodPressure", "heartRate", "bloodSugar"]
      const missingVitalSigns = requiredVitalSigns.filter((field) => !values[field])

      if (missingVitalSigns.length > 0) {
        message.error("Vui lòng nhập đầy đủ thông tin sinh hiệu")
        return
      }

      // Validate required fields
      if (!values.diagnosis?.trim()) {
        message.error("Vui lòng nhập chẩn đoán")
        return
      }

      if (!values.doctorNotes?.trim()) {
        message.error("Vui lòng nhập lời dặn của bác sĩ")
        return
      }

      // Prepare update data
      const updateData = {
        name: values.name,
        symptoms: values.symptoms,
        diagnosis: values.diagnosis,
        doctorNotes: values.doctorNotes,
        hasFollowUp: values.hasFollowUp,
        followUpDate: values.followUpDate,
        systolicBloodPressure: values.systolicBloodPressure,
        diastolicBloodPressure: values.diastolicBloodPressure,
        heartRate: values.heartRate,
        bloodSugar: values.bloodSugar,
        temperature: values.temperature,
        weight: values.weight,
      }

      // Update patient info and vital signs
      await updatePatientInfo(appointmentId, updateData)

      // Update appointment status to COMPLETED
      await updateAppointmentStatus(appointmentId, "COMPLETED")
    } catch (error) {
      console.error("Save failed:", error)
    }
  }

  // Tính trạng thái xét nghiệm dựa trên serviceOrders
  const getTestingStatus = () => {
    if (serviceOrders.length === 0) return "Chưa có chỉ định"
    const hasCompleted = serviceOrders.some((order) => order.orderStatus === "COMPLETED")
    const hasOrdered = serviceOrders.some((order) => order.orderStatus === "ORDERED")

    if (hasCompleted) return "Đã có kết quả"
    if (hasOrdered) return "Đang xét nghiệm"
    return "Chưa có chỉ định"
  }

  // Tính trạng thái cuộc hẹn
  const getAppointmentStatus = () => {
    if (!patientDetail) return "Đang chờ"

    switch (patientDetail.appointmentStatus) {
      case "PENDING":
        return "Đang chờ"
      case "CONFIRMED":
        return "Đang khám"
      case "COMPLETED":
        return "Hoàn thành"
      case "CANCELLED":
        return "Đã hủy"
      default:
        return "Đang chờ"
    }
  }

  const handleTestingStatusChange = (status: string): void => {
    console.log("Testing status changed:", status)
  }

  const handleAppointmentStatusChange = (status: string): void => {
    console.log("Appointment status changed:", status)
  }

  const handleAddNote = () => {
    if (noteText.trim()) {
      createAppointmentNote(appointmentId, {
        noteType: NoteType.DOCTOR,
        noteText: noteText.trim(),
      })
      setNoteText("")
    }
  }

  const handleDeleteNote = (noteId: number) => {
    deleteAppointmentNote(noteId)
  }

  const handleViewPrescriptionHistory = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setIsPrescriptionHistoryModalOpen(true)
  }

  const handleViewTestResult = (serviceOrder: ServiceOrder) => {
    setSelectedServiceOrder(serviceOrder)
    setIsTestResultDetailModalOpen(true)
  }

  const handleViewTempPrescription = () => {
    if (tempPrescription) {
      // Convert temp prescription to Prescription format for viewing
      const prescriptionForView: Prescription = {
        prescriptionId: 0,
        patientId: patientDetail?.patientInfo.patientId || 0,
        appointmentId: appointmentId,
        diagnosis: tempPrescription.diagnosis || "Chẩn đoán tạm thời",
        note: tempPrescription.note || "",
        isFollowUp: false,
        systolicBloodPressure: 0,
        diastolicBloodPressure: 0,
        heartRate: 0,
        bloodSugar: 0,
        createdAt: tempPrescription.createdAt,
        prescriptionDetails: tempPrescription.medications.map((med: any, index: number) => ({
          detailId: index,
          medicine: {
            medicineId: med.medicineId,
            medicineName: med.medicineName,
            price: med.price,
            unit: med.unit,
            category: "",
            usage: "",
            insuranceDiscountPercent: 0,
            createdAt: "",
            prescriptionDetails: [],
          },
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          quantity: med.quantity,
          prescriptionNotes: med.prescriptionNotes,
          createdAt: tempPrescription.createdAt,
          prescription: {} as Prescription,
        })),
      }

      setSelectedPrescription(prescriptionForView)
      setIsPrescriptionHistoryModalOpen(true)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  if (loading && !patientDetail) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!patientDetail) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Text type="danger">Không tìm thấy thông tin bệnh nhân</Text>
          <div className="mt-4">
            <Button onClick={() => refreshAll(appointmentId)}>Thử lại</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <main className="p-6">
        <div className="flex flex-row">
          {/* Left column - Patient info */}
          <div className="flex-[400px] pr-6">
            <div className="flex flex-row justify-between items-center mb-6">
              <div className="flex flex-col items-center mb-6">
                <img src="/placeholder.svg?height=96&width=96" alt="Patient" className="w-24 h-24 rounded-full mb-3" />
                <p className="text-gray-600">BN{patientDetail.patientInfo.patientId}</p>
                <p className="text-gray-600">
                  {patientDetail.patientInfo.gender === "MALE" ? "Nam" : "Nữ"},{" "}
                  {new Date().getFullYear() - new Date(patientDetail.patientInfo.birthday).getFullYear()} tuổi
                </p>
              </div>

              {/* Current status */}
              <PatientStatusSection
                roomNumber={patientDetail.schedule.roomNote}
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
                  <p className="text-black text-sm">{patientDetail.patientInfo.address}</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">CMND/CCCD</span>
                  </div>
                  <p className="text-black text-sm">{patientDetail.patientInfo.identityNumber}</p>
                </div>

                <div className="py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Ngày sinh</span>
                  </div>
                  <p className="text-black text-sm">{formatDate(patientDetail.patientInfo.birthday)}</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">Số BHYT</span>
                  </div>
                  <p className="text-black text-sm">{patientDetail.patientInfo.insuranceNumber || "Không có"}</p>
                </div>

                <div className="py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Chiều cao (cm)</span>
                  </div>
                  <p className="text-black text-sm">{patientDetail.patientInfo.height || "Chưa có dữ liệu"}</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">Dị ứng</span>
                  </div>
                  <p className="text-black text-sm">{patientDetail.patientInfo.allergies || "Không xác định"}</p>
                </div>

                <div className="py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Nhóm máu</span>
                  </div>
                  <p className="text-black text-sm">{patientDetail.patientInfo.bloodType || "Không xác định"}</p>
                </div>
              </div>
            </div>

            <div className="h-[2px] my-4 bg-gray-200"></div>

            {/* Prescription History */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base-700 font-medium">Lịch sử đơn thuốc</h3>
                <button className="text-base-600 flex items-center text-sm" onClick={refreshHistory}>
                  <ReloadOutlined style={{ marginRight: 4 }} /> Làm mới
                </button>
              </div>

              {historyLoading ? (
                <div className="text-center py-4">
                  <Spin />
                </div>
              ) : prescriptionHistory.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Chưa có lịch sử đơn thuốc</div>
              ) : (
                prescriptionHistory.map((prescriptionItem) => (
                  <div
                    key={prescriptionItem.prescriptionId}
                    className="bg-white rounded-lg border border-gray-200 p-4 mb-3"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <MedicineBoxOutlined style={{ fontSize: 16 }} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Đơn thuốc #{prescriptionItem.prescriptionId}</p>
                        <p className="text-xs text-gray-500">Ngày kê: {formatDateTime(prescriptionItem.createdAt)}</p>
                        <p className="text-xs text-gray-500">
                          Số loại thuốc: {prescriptionItem.prescriptionDetails.length}
                        </p>
                      </div>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewPrescriptionHistory(prescriptionItem)}
                      >
                        <EyeOutlined style={{ fontSize: 16 }} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Chẩn đoán: {prescriptionItem.diagnosis}</p>
                    {prescriptionItem.isFollowUp && (
                      <p className="text-xs text-blue-500">
                        Hẹn tái khám: {prescriptionItem.followUpDate ? formatDate(prescriptionItem.followUpDate) : "Có"}
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
                      rules={[{ required: true, message: "Vui lòng nhập tên bệnh nhân!" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Phòng khám" name="clinic">
                      <Input prefix={<EnvironmentOutlined />} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Bác sĩ phụ trách" name="doctor">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Mã bác sĩ" name="doctorCode">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Giờ khám" name="appointmentTime">
                      <Input prefix={<ClockCircleOutlined />} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Ngày khám" name="appointmentDate">
                      <Input prefix={<CalendarOutlined />} disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Triệu chứng" name="symptoms">
                  <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                  label="Chẩn đoán"
                  name="diagnosis"
                  rules={[{ required: true, message: "Vui lòng nhập chẩn đoán!" }]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                  label="Lời dặn của bác sĩ"
                  name="doctorNotes"
                  rules={[{ required: true, message: "Vui lòng nhập lời dặn!" }]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>

                {/* Vital Signs Section */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="text-base font-medium mb-4">Sinh hiệu *</h4>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item
                        label="Huyết áp tâm thu (mmHg)"
                        name="systolicBloodPressure"
                        rules={[{ required: true, message: "Bắt buộc!" }]}
                      >
                        <InputNumber min={0} max={300} className="w-full" placeholder="120" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="Huyết áp tâm trương (mmHg)"
                        name="diastolicBloodPressure"
                        rules={[{ required: true, message: "Bắt buộc!" }]}
                      >
                        <InputNumber min={0} max={200} className="w-full" placeholder="80" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="Nhịp tim (bpm)"
                        name="heartRate"
                        rules={[{ required: true, message: "Bắt buộc!" }]}
                      >
                        <InputNumber min={0} max={200} className="w-full" placeholder="75" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="Đường huyết (mg/dL)"
                        name="bloodSugar"
                        rules={[{ required: true, message: "Bắt buộc!" }]}
                      >
                        <InputNumber min={0} max={500} className="w-full" placeholder="100" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item label="Nhiệt độ (°C)" name="temperature">
                        <InputNumber min={30} max={45} step={0.1} className="w-full" placeholder="36.5" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="Cân nặng (kg)" name="weight">
                        <InputNumber min={0} max={200} className="w-full" placeholder="65" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Form.Item name="hasFollowUp" valuePropName="checked">
                  <Checkbox>Hẹn tái khám</Checkbox>
                </Form.Item>

                <Form.Item label="Ngày tái khám" name="followUpDate">
                  <Input prefix={<CalendarOutlined />} type="date" />
                </Form.Item>
              </Form>

              <div className="h-[2px] my-4 bg-gray-200"></div>

              <Tabs defaultActiveKey="1">
                <TabPane tab="Kết quả xét nghiệm" key="1">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-gray-700 font-medium">Kết quả xét nghiệm</h3>
                      <Button icon={<ReloadOutlined />} onClick={() => refreshAll(appointmentId)}>
                        Làm mới
                      </Button>
                    </div>

                    {serviceOrdersLoading ? (
                      <div className="text-center py-8">
                        <Spin />
                      </div>
                    ) : serviceOrders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Chưa có kết quả xét nghiệm</div>
                    ) : (
                      serviceOrders.map((order) => (
                        <div key={order.orderId} className="border border-gray-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start mb-2">
                            <FileTextOutlined style={{ fontSize: 20 }} className="text-base-600 mr-3 mt-1" />
                            <div className="flex-1">
                              <p className="font-medium">{order.service.serviceName}</p>
                              <p className="text-sm text-gray-500">Loại: {order.service.serviceType}</p>
                              <p className="text-sm text-gray-500">Phòng: {order.roomId}</p>
                              {order.orderTime && (
                                <p className="text-sm text-gray-500">
                                  Thời gian đặt: {new Date(order.orderTime).toLocaleString("vi-VN")}
                                </p>
                              )}
                              {order.resultTime && (
                                <p className="text-sm text-gray-500">
                                  Thời gian trả kết quả: {new Date(order.resultTime).toLocaleString("vi-VN")}
                                </p>
                              )}
                              {order.result && <p className="text-sm font-medium mt-1">Kết luận: {order.result}</p>}
                              <p className="text-sm text-gray-500 mt-1">
                                Trạng thái: {order.orderStatus === "COMPLETED" ? "Đã hoàn thành" : "Đã đặt"}
                              </p>
                            </div>
                            <button className="text-base-600" onClick={() => handleViewTestResult(order)}>
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
                      <Button icon={<ReloadOutlined />} onClick={() => refreshAll(appointmentId)}>
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
                        <Button type="primary" icon={<MessageOutlined />} onClick={handleAddNote}>
                          Thêm ghi chú
                        </Button>
                      </div>
                    </div>

                    {notesLoading ? (
                      <div className="text-center py-4">
                        <Spin />
                      </div>
                    ) : appointmentNotes.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">Chưa có ghi chú</div>
                    ) : (
                      appointmentNotes.map((note) => (
                        <div key={note.noteId} className="border border-gray-200 rounded-lg p-4 mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center mb-2">
                                <MessageOutlined style={{ marginRight: 8 }} />
                                <span className="font-medium">
                                  {note.noteType === NoteType.DOCTOR ? note.doctorName || "Bác sĩ" : "Bệnh nhân"}
                                </span>
                              </div>
                              <p className="text-gray-700">{note.noteText}</p>
                              {note.createdAt && (
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(note.createdAt).toLocaleString("vi-VN")}
                                </p>
                              )}
                            </div>
                            <Button
                              type="text"
                              danger
                              icon={<CloseOutlined />}
                              onClick={() => note.noteId && handleDeleteNote(note.noteId)}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabPane>
              </Tabs>

              <div className="flex flex-wrap justify-end gap-4">
                {tempPrescription && (
                  <Button icon={<EyeOutlined />} onClick={handleViewTempPrescription}>
                    Xem toa thuốc tạm thời
                  </Button>
                )}
                <Button icon={<ClockCircleOutlined />} onClick={() => setIsPrescriptionModalOpen(true)}>
                  {prescription ? "Xem toa thuốc" : "Kê toa thuốc"}
                </Button>
                <Button icon={<PlusOutlined />} onClick={() => setIsMedicalModalOpen(true)}>
                  Thêm chỉ định
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsPrescriptionModalOpen(true)}
                  loading={prescriptionLoading}
                >
                  Kê toa thuốc
                </Button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="primary" size="large" onClick={handleSave} loading={saving}>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => {
          setIsPrescriptionModalOpen(false)
          // Refresh prescription data after modal closes
          refreshAll(appointmentId)
        }}
        appointmentId={appointmentId}
        existingPrescription={prescription}
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
          setIsPrescriptionHistoryModalOpen(false)
          setSelectedPrescription(null)
        }}
        prescription={selectedPrescription}
      />

      {/* Test Result Detail Modal */}
      <TestResultDetailModal
        isOpen={isTestResultDetailModalOpen}
        onClose={() => {
          setIsTestResultDetailModalOpen(false)
          setSelectedServiceOrder(null)
        }}
        serviceOrder={selectedServiceOrder}
      />
    </div>
  )
}

export default PatientDetail
