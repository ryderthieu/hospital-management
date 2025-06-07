"use client"

import type React from "react"
import { useState } from "react"
import { Row, Col, Form, Input, Button, Checkbox, Typography, Space } from "antd"
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
} from "@ant-design/icons"
import { PatientStatusSection } from "../../components/examination-doctor/PatientStatusSection"
import { VitalSignModal } from "../../components/examination-doctor/VitalSignModal"
import { PrescriptionModal } from "../../components/examination-doctor/PrescriptionModal"
import { MedicalOrderModal } from "../../components/examination-doctor/MedicalOrderModal"

const { Title, Text } = Typography

const PatientDetail: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [isVitalSignModalOpen, setIsVitalSignModalOpen] = useState(false)
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false)
  const [form] = Form.useForm()

  // Mock patient data
  const patientData = {
    id: "BN22521584",
    name: "Trần Nhật Trường",
    avatar:
      "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/476834381_1003190531653574_2584131049560639925_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGagn_fHUIov5-_0LLI0Vv3DrW-N58VWPcOtb43nxVY99Uq6WML4MsEIREYbrVtr9gHtzFDjN8rgGC3Z-hNx-3D&_nc_ohc=ZVnoEqkKLHQQ7kNvwESX1Nf&_nc_oc=AdmzadAZEmSvMkU6UEJd6p3I7q7gpbwtaNqcVWQbpkp4YOBHsZKYrykGYloWgF5_dj0&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=lPEaw2dpBBs_XLyGFeuCLw&oh=00_AfJTZlN6dDk08r7xeVhOPP3RbkNtq02aEQ376nvdo3GBvg&oe=68464B1C",
    clinic: "Dị Ứng - Miễn Dịch Lâm Sàng",
    doctor: "Ths.BS Nguyễn Thiên Tài",
    doctorCode: "BS22521424",
    appointmentTime: "09:20",
    appointmentDate: "2025-04-21",
    appointmentDateTime: "2025-04-21T09:20",
    diagnosis: "MẨY DAY MẨN",
    doctorNotes: "Kiêng ăn trứng, thịt gà. Nếu mẩy day xuất hiện kèm triệu chứng tức ngực, khó thở phải nhập viện gấp.",
    followUpDate: "2025-05-21",
    hasFollowUp: true,
    email: "truontn@gmail.com",
    phone: "0961 565 563",
    birthDate: "17/10/2004",
    medicalHistory: "Dị ứng",
    height: "168",
    weight: "60",
    roomNumber: "P124",
    testingStatus: "Đang xét nghiệm",
    medicationStatus: "Chưa kê thuốc",
  }

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Saving patient data:", values)
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

  // Handle testing status changes
  const handleTestingStatusChange = (status: string): void => {
    console.log(`Cập nhật trạng thái xét nghiệm: ${status}`)
  }

  // Handle medication status changes
  const handleMedicationStatusChange = (status: string): void => {
    console.log(`Cập nhật trạng thái kê thuốc: ${status}`)
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
                  src={patientData.avatar || "/placeholder.svg"}
                  alt="Patient"
                  className="w-24 h-24 rounded-full mb-3"
                />
                <p className="text-gray-600">{patientData.id}</p>
                <p className="text-gray-600">Nam, 21 tuổi</p>
              </div>

              {/* Current status */}
              <PatientStatusSection
                roomNumber={patientData.roomNumber}
                initialTestingStatus={patientData.testingStatus}
                initialMedicationStatus={patientData.medicationStatus}
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
                  <p className="text-black text-sm">{patientData.email}</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">Số điện thoại</span>
                  </div>
                  <p className="text-black text-sm">{patientData.phone}</p>
                </div>

                <div className="py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Ngày sinh</span>
                  </div>
                  <p className="text-black text-sm">{patientData.birthDate}</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">Tiền sử bệnh lý</span>
                  </div>
                  <p className="text-black text-sm">{patientData.medicalHistory}</p>
                </div>

                <div className="py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Chiều cao (cm)</span>
                  </div>
                  <p className="text-black text-sm">{patientData.height}</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">Cân nặng (kg)</span>
                  </div>
                  <p className="text-black text-sm">{patientData.weight}</p>
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
                  <p className="text-black text-sm">Chưa có dữ liệu</p>
                </div>

                <div className="py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">Mạch (Nhịp/phút)</span>
                  </div>
                  <p className="text-black text-sm">Chưa có dữ liệu</p>
                </div>

                <div className="mb-4 w-[210px] py-2">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm">Huyết áp tâm trương (mmHg)</span>
                  </div>
                  <p className="text-black text-sm">Chưa có dữ liệu</p>
                </div>

                <div className="mb-4 py-2 text-right">
                  <div className="mb-1">
                    <span className="text-gray-500 text-sm w-full text-right">Đường huyết</span>
                  </div>
                  <p className="text-black text-sm">Chưa có dữ liệu</p>
                </div>
              </div>
            </div>

            <div className="h-[2px] my-4 bg-gray-200"></div>

            {/* Medical history */}
            <div>
              <h3 className="text-base-700 font-medium mb-4">Lịch sử khám</h3>

              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-base-100 rounded-full flex items-center justify-center mr-3">
                    <EnvironmentOutlined style={{ fontSize: 16 }} className="text-base-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dị Ứng - Miễn Dịch Lâm Sàng</p>
                    <p className="text-xs text-gray-500">Ngày khám: 21/03/2025</p>
                  </div>
                  <button className="ml-auto text-base-600">
                    <EyeOutlined style={{ fontSize: 16 }} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Chẩn đoán: MẨY DAY MẨN</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-base-100 rounded-full flex items-center justify-center mr-3">
                    <EnvironmentOutlined style={{ fontSize: 16 }} className="text-base-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dị Ứng - Miễn Dịch Lâm Sàng</p>
                    <p className="text-xs text-gray-500">Ngày khám: 21/02/2025</p>
                  </div>
                  <button className="ml-auto text-base-600">
                    <EyeOutlined style={{ fontSize: 16 }} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Chẩn đoán: MẨY DAY MẨN</p>
              </div>
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

              <Form form={form} layout="vertical" initialValues={patientData}>
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
                  <Checkbox checked={patientData.hasFollowUp} disabled={!isEditing}>
                    Hẹn tái khám
                  </Checkbox>
                </Form.Item>

                <Form.Item label="" name="followUpDate">
                  <Input disabled={!isEditing || !patientData.hasFollowUp} prefix={<CalendarOutlined />} />
                </Form.Item>
              </Form>

              <div className="h-[2px] my-4 bg-gray-200"></div>

              <div className="mb-6">
                <h3 className="text-gray-700 font-medium mb-4">Kết quả xét nghiệm</h3>

                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start mb-2">
                    <FileTextOutlined style={{ fontSize: 20 }} className="text-base-600 mr-3 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">BN22521584 - Chụp CLVT sọ não không tiêm thuốc cản quang</p>
                      <p className="text-sm text-gray-500">Thời gian trả kết quả dự kiến: 10:00 ngày 21/04/2025</p>
                      <p className="text-sm text-gray-500">Thời gian trả kết quả thực tế: 10:20 ngày 21/04/2025</p>
                      <p className="text-sm font-medium mt-1">
                        Kết luận: Không thấy tụ máu nội sọ. Veo vách ngăn mũi sang phải.
                      </p>
                    </div>
                    <button className="text-base-600">
                      <EyeOutlined style={{ fontSize: 18 }} />
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start mb-2">
                    <FileTextOutlined style={{ fontSize: 20 }} className="text-base-600 mr-3 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">BN22521584 - Tổng phân tích tế bào máu</p>
                      <p className="text-sm text-gray-500">Thời gian trả kết quả dự kiến: 10:30 ngày 21/04/2025</p>
                      <p className="text-sm text-gray-500">Thời gian trả kết quả thực tế:</p>
                      <p className="text-sm font-medium mt-1">Kết luận:</p>
                    </div>
                    <button className="text-base-600">
                      <EyeOutlined style={{ fontSize: 18 }} />
                    </button>
                  </div>
                </div>
              </div>

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
              <Button type="primary" size="large">
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <VitalSignModal isOpen={isVitalSignModalOpen} onClose={() => setIsVitalSignModalOpen(false)} />
      <PrescriptionModal isOpen={isPrescriptionModalOpen} onClose={() => setIsPrescriptionModalOpen(false)} />
      <MedicalOrderModal isOpen={isMedicalModalOpen} onClose={() => setIsMedicalModalOpen(false)} />
    </div>
  )
}

export default PatientDetail
