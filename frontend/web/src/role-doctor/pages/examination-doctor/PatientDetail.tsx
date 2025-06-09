import type React from "react"
import { useState, useEffect } from "react"
import { Row, Col, Form, Input, Button, Checkbox, Typography, Space, Spin, Tabs } from "antd"
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  MessageOutlined,
  ReloadOutlined,
} from "@ant-design/icons"
import { useLocation } from "react-router-dom"
import { PatientStatusSection } from "../../components/examination-doctor/PatientStatusSection"
import { VitalSignModal } from "../../components/examination-doctor/VitalSignModal"
import { PrescriptionModal } from "../../components/examination-doctor/PrescriptionModal"
import { MedicalOrderModal } from "../../components/examination-doctor/MedicalOrderModal"
import { usePatientDetail } from "../../hooks/usePatientDetail"
import { useServiceOrder } from "../../hooks/useServiceOrder"
import { useAppointmentNote } from "../../hooks/useAppointmentNote"
import { NoteType } from "../../types/appointmentNote"

const { Title, Text } = Typography
const { TabPane } = Tabs

const PatientDetail: React.FC = () => {
  const location = useLocation()
  const { appointmentId, patientData, appointmentData } = location.state || {}

  const [isEditing, setIsEditing] = useState(false)
  const [isVitalSignModalOpen, setIsVitalSignModalOpen] = useState(false)
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [form] = Form.useForm()

  const {
    patientDetail,
    vitalSigns,
    medicalHistory,
    loading: patientLoading,
    error: patientError,
    updatePatientInfo,
    addVitalSigns,
    updatePatientStatus,
    refreshData,
  } = usePatientDetail(appointmentId)

  const { testResults, loading: testResultsLoading, refreshTestResults } = useServiceOrder(appointmentId)

  const { notes, loading: notesLoading, addNote, deleteNote, refreshNotes } = useAppointmentNote(appointmentId)

  useEffect(() => {
    if (patientDetail) {
      form.setFieldsValue(patientDetail)
    }
  }, [patientDetail, form])

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        updatePatientInfo(values)
        setIsEditing(false)
      })
      .catch((error) => {
        console.error("Validation failed:", error)
      })
  }

  const handleCancel = () => {
    form.resetFields()
    setIsEditing(false)
  }

  const handleTestingStatusChange = (status: string): void => {
    updatePatientStatus("testing", status)
  }

  const handleMedicationStatusChange = (status: string): void => {
    updatePatientStatus("medication", status)
  }

  const handleVitalSignsSave = (vitalSigns: any) => {
    addVitalSigns(vitalSigns)
    setIsVitalSignModalOpen(false)
  }

  const handleAddNote = () => {
    if (noteText.trim()) {
      addNote(NoteType.DOCTOR, noteText)
      setNoteText("")
    }
  }

  const loading = patientLoading || testResultsLoading || notesLoading
  const error = patientError

  if (loading && !patientDetail) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (error || !patientDetail) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Text type="danger">{error || "Không tìm thấy thông tin bệnh nhân"}</Text>
          <div className="mt-4">
            <Button onClick={refreshData}>Thử lại</Button>
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
                <img
                  src={patientDetail.avatar || "/placeholder.svg"}
                  alt="Patient"
                  className="w-24 h-24 rounded-full mb-3"
                />
                <p className="text-gray-600">{patientDetail.id}</p>
                <p className="text-gray-600">
                  {patientDetail.gender}, {patientDetail.age} tuổi
                </p>
              </div>

              {/* Current status */}
              <PatientStatusSection
                roomNumber={patientDetail.roomNumber}
                initialTestingStatus={patientDetail.testingStatus}
                initialMedicationStatus={patientDetail.medicationStatus}
                onTestingStatusChange={handleTestingStatusChange}
                onMedicationStatusChange={handleMedicationStatusChange}
              />
            </div>

            {/* Contact info */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base-700 font-medium">Thông tin cá nhân</h3>
                <button className="text-base-600 flex items-center text-sm">
                  <EditOutlined style={{ marginRight: 4 }} /> Chỉnh sửa
                </button>
              </div>

              <div className="grid grid-cols-2">
                <div className="w-[200px] py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Địa chỉ email</span>
                  </div>
                  <p className="text-black text-sm">{patientDetail.email}</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">Số điện thoại</span>
                  </div>
                  <p className="text-black text-sm">{patientDetail.phone}</p>
                </div>

                <div className="py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Ngày sinh</span>
                  </div>
                  <p className="text-black text-sm">{patientDetail.birthDate}</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">Tiền sử bệnh lý</span>
                  </div>
                  <p className="text-black text-sm">{patientDetail.medicalHistory}</p>
                </div>

                <div className="py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Chiều cao (cm)</span>
                  </div>
                  <p className="text-black text-sm">{patientDetail.height}</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">Cân nặng (kg)</span>
                  </div>
                  <p className="text-black text-sm">{patientDetail.weight}</p>
                </div>
              </div>
            </div>

            <div className="h-[2px] my-4 bg-gray-200"></div>

            {/* Medical indicators */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base-700 font-medium">Sinh hiệu</h3>
                <button
                  className="text-base-600 flex items-center text-sm"
                  onClick={() => setIsVitalSignModalOpen(true)}
                >
                  <PlusOutlined style={{ marginRight: 4 }} /> Thêm sinh hiệu
                </button>
              </div>
              <div className="grid grid-cols-2">
                <div className="w-[200px] py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Huyết áp tâm thu (mmHg)</span>
                  </div>
                  <p className="text-black text-sm">{vitalSigns?.systolicBloodPressure || "Chưa có dữ liệu"}</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">Mạch (Nhịp/phút)</span>
                  </div>
                  <p className="text-black text-sm">{vitalSigns?.heartRate || "Chưa có dữ liệu"}</p>
                </div>

                <div className="mb-4 w-[210px] py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Huyết áp tâm trương (mmHg)</span>
                  </div>
                  <p className="text-black text-sm">{vitalSigns?.diastolicBloodPressure || "Chưa có dữ liệu"}</p>
                </div>

                <div className="mb-4 py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">Đường huyết</span>
                  </div>
                  <p className="text-black text-sm">{vitalSigns?.bloodSugar || "Chưa có dữ liệu"}</p>
                </div>
              </div>
            </div>

            <div className="h-[2px] my-4 bg-gray-200"></div>

            {/* Medical history */}
            <div>
              <h3 className="text-base-700 font-medium mb-4">Lịch sử khám</h3>

              {medicalHistory.map((history, index) => (
                <div key={history.id} className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-base-100 rounded-full flex items-center justify-center mr-3">
                      <EnvironmentOutlined style={{ fontSize: 16 }} className="text-base-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{history.clinic}</p>
                      <p className="text-xs text-gray-500">Ngày khám: {history.date}</p>
                    </div>
                    <button className="ml-auto text-base-600">
                      <EyeOutlined style={{ fontSize: 16 }} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Chẩn đoán: {history.diagnosis}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Examination details */}
          <div className="w-full lg:w-3/4 mt-6 lg:mt-0">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-end mb-4">
                {!isEditing ? (
                  <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Space>
                    <Button icon={<CloseOutlined />} onClick={handleCancel} danger>
                      Hủy
                    </Button>
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                      Lưu
                    </Button>
                  </Space>
                )}
              </div>

              <Form form={form} layout="vertical" initialValues={patientDetail}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      label="Tên bệnh nhân"
                      name="name"
                      rules={[{ required: true, message: "Vui lòng nhập tên bệnh nhân!" }]}
                    >
                      <Input disabled={!isEditing} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Phòng khám" name="clinic">
                      <Input disabled={!isEditing} prefix={<EnvironmentOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Bác sĩ phụ trách" name="doctor">
                      <Input disabled={!isEditing} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Mã bác sĩ" name="doctorCode">
                      <Input disabled={!isEditing} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Giờ khám" name="appointmentTime">
                      <Input disabled={!isEditing} prefix={<ClockCircleOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Ngày khám" name="appointmentDate">
                      <Input disabled={!isEditing} prefix={<CalendarOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Chẩn đoán" name="diagnosis">
                  <Input.TextArea disabled={!isEditing} rows={4} />
                </Form.Item>

                <Form.Item label="Lời dặn của bác sĩ" name="doctorNotes">
                  <Input.TextArea disabled={!isEditing} rows={4} />
                </Form.Item>

                <Form.Item>
                  <Checkbox checked={patientDetail.hasFollowUp} disabled={!isEditing}>
                    Hẹn tái khám
                  </Checkbox>
                </Form.Item>

                <Form.Item label="" name="followUpDate">
                  <Input disabled={!isEditing || !patientDetail.hasFollowUp} prefix={<CalendarOutlined />} style={{width: 150}} />
                </Form.Item>
              </Form>

              <div className="h-[2px] my-4 bg-gray-200"></div>

              <Tabs defaultActiveKey="1">
                <TabPane tab="Kết quả xét nghiệm" key="1">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-gray-700 font-medium">Kết quả xét nghiệm</h3>
                      <Button icon={<ReloadOutlined />} onClick={refreshTestResults}>
                        Làm mới
                      </Button>
                    </div>

                    {testResultsLoading ? (
                      <div className="text-center py-8">
                        <Spin />
                      </div>
                    ) : testResults.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Chưa có kết quả xét nghiệm</div>
                    ) : (
                      testResults.map((result) => (
                        <div key={result.orderId} className="border border-gray-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start mb-2">
                            <FileTextOutlined style={{ fontSize: 20 }} className="text-base-600 mr-3 mt-1" />
                            <div className="flex-1">
                              <p className="font-medium">{result.serviceName}</p>
                              <p className="text-sm text-gray-500">
                                Thời gian trả kết quả dự kiến: {result.expectedTime}
                              </p>
                              {result.actualTime && (
                                <p className="text-sm text-gray-500">
                                  Thời gian trả kết quả thực tế: {result.actualTime}
                                </p>
                              )}
                              {result.result && <p className="text-sm font-medium mt-1">Kết luận: {result.result}</p>}
                              <p className="text-sm text-gray-500 mt-1">
                                Trạng thái: {result.status === "COMPLETED" ? "Đã hoàn thành" : "Đang xử lý"}
                              </p>
                            </div>
                            <button className="text-base-600">
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
                      <Button icon={<ReloadOutlined />} onClick={refreshNotes}>
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
                    ) : notes.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">Chưa có ghi chú</div>
                    ) : (
                      notes.map((note) => (
                        <div key={note.noteId} className="border border-gray-200 rounded-lg p-4 mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center mb-2">
                                <MessageOutlined style={{ marginRight: 8 }} />
                                <span className="font-medium">
                                  {note.noteType === NoteType.DOCTOR ? "Bác sĩ" : "Bệnh nhân"}
                                </span>
                              </div>
                              <p className="text-gray-700">{note.noteText}</p>
                              {note.createdAt && (
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(note.createdAt).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <Button
                              type="text"
                              danger
                              icon={<CloseOutlined />}
                              onClick={() => note.noteId && deleteNote(note.noteId)}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabPane>
              </Tabs>

              <div className="flex flex-wrap justify-end gap-4">
                <Button icon={<ClockCircleOutlined />}>Xem toa thuốc</Button>
                <Button icon={<PlusOutlined />} onClick={() => setIsMedicalModalOpen(true)}>
                  Thêm chỉ định
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsPrescriptionModalOpen(true)}>
                  Kê toa thuốc
                </Button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="primary" size="large" onClick={handleSave}>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <VitalSignModal
        isOpen={isVitalSignModalOpen}
        onClose={() => setIsVitalSignModalOpen(false)}
        onSave={handleVitalSignsSave}
      />
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        appointmentId={appointmentId}
      />
      <MedicalOrderModal
        isOpen={isMedicalModalOpen}
        onClose={() => setIsMedicalModalOpen(false)}
        appointmentId={appointmentId}
      />
    </div>
  )
}

export default PatientDetail
