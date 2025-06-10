"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Form, Input, Select, Button, Table, Typography, InputNumber, Spin, message } from "antd"
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons"
import { usePatientDetail } from "../../hooks/usePatientDetail"
import type { Medicine } from "../../types/medicin"
import type { PrescriptionDetail } from "../../types/prescriptionDetail"
import type { Prescription } from "../../types/prescription"

const { Text } = Typography

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId?: number
  existingPrescription?: Prescription | null
  onPrescriptionSaved?: () => void // Callback to refresh parent data
  formParent: any
}

export const PrescriptionModal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  appointmentId, 
  existingPrescription,
  onPrescriptionSaved,
  formParent
}) => {
  // Use the combined hook instead of usePrescriptionModal
  const {
    // Patient data
    patientDetail,
    prescription,
    
    // Prescription management data
    medications,
    currentPrescriptionId,
    searchInput,
    searchLoading,
    saving,
    
    // Prescription management actions
    searchMedicines,
    addMedicine,
    updateMedicationField,
    deleteMedication,
    savePrescription,
    loadExistingPrescription,
    checkExistingPrescription,
    resetPrescriptionLoadState,
    setSearchInput,
    setMedications,
  } = usePatientDetail(appointmentId)

  const [form] = Form.useForm()
  const [searchResults, setSearchResults] = useState<Medicine[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Get patient info from patientDetail
  const patientName = patientDetail?.patientInfo?.fullName || "Bệnh nhân không xác định"
  const patientCode = patientDetail?.patientInfo?.patientId || "Mã bệnh nhân không xác định"

 

  // Check for existing prescription when modal opens
  useEffect(() => {
    if (isOpen && appointmentId) {
      if (existingPrescription) {
        // Load existing prescription
        loadExistingPrescription(existingPrescription)
        form.setFieldsValue({
          doctorNotes: existingPrescription.note || "",
        })
      } else if (prescription) {
        // Use prescription from the combined hook
        loadExistingPrescription(prescription)
        form.setFieldsValue({
          doctorNotes: prescription.note || "",
        })
      } else {
        // Check if prescription exists
        checkExistingPrescription()
          .then((existing) => {
            if (existing) {
              loadExistingPrescription(existing)
              form.setFieldsValue({
                doctorNotes: existing.note || "",
              })
            }
          })
          .catch((err) => {
            console.error("Error checking existing prescription:", err)
          })
      }
    }

    // Reset load state when modal closes
    return () => {
      if (!isOpen) {
        resetPrescriptionLoadState()
      }
    }
  }, [
    isOpen,
    appointmentId,
    existingPrescription,
    prescription,
    form,
    loadExistingPrescription,
    checkExistingPrescription,
    resetPrescriptionLoadState,
  ])

  // Search medicines when input changes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchInput && searchInput.trim()) {
        try {
          const results = await searchMedicines(searchInput)
          setSearchResults(results || [])
          setShowSearchResults(true)
        } catch (error) {
          console.error("Error searching medicines:", error)
          setSearchResults([])
          setShowSearchResults(false)
        }
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchInput, searchMedicines])

  const handleAddMedicine = (medicine: Medicine) => {
    if (!medicine) return

    addMedicine(medicine)
    setShowSearchResults(false)
    setSearchInput("")
  }

  // Function to calculate quantity based on frequency and duration
  const calculateQuantity = (frequency: string, duration: string): number => {
    if (!frequency || !duration) return 1

    // Extract number from frequency (e.g., "Ngày 2 lần" -> 2)
    const frequencyMatch = frequency.match(/(\d+)/)
    const timesPerDay = frequencyMatch ? Number.parseInt(frequencyMatch[1]) : 1

    // Extract number from duration (e.g., "7 ngày" -> 7)
    const durationMatch = duration.match(/(\d+)/)
    const days = durationMatch ? Number.parseInt(durationMatch[1]) : 1

    return timesPerDay * days
  }

  const handleFrequencyChange = (index: number, frequency: string) => {
    if (index < 0 || index >= (medications?.length || 0)) return

    updateMedicationField(index, "frequency", frequency)
    // Auto calculate quantity
    const medication = medications[index]
    if (medication && medication.duration) {
      const newQuantity = calculateQuantity(frequency, medication.duration)
      updateMedicationField(index, "quantity", newQuantity)
    }
  }

  const handleDurationChange = (index: number, duration: string) => {
    if (index < 0 || index >= (medications?.length || 0)) return

    updateMedicationField(index, "duration", duration)
    // Auto calculate quantity
    const medication = medications[index]
    if (medication && medication.frequency) {
      const newQuantity = calculateQuantity(medication.frequency, duration)
      updateMedicationField(index, "quantity", newQuantity)
    }
  }

  const handleSave = async () => {
    try {
      const formValues = await form.validateFields()

      if (!medications || medications.length === 0) {
        message.warning("Chưa có thuốc nào trong toa thuốc")
        return
      }

      // Prepare prescription data with vital signs from patientDetail
      const prescriptionData = {
        appointmentId: appointmentId || undefined,
        patientId: patientDetail?.patientInfo.patientId,
        note: formParent?.getFieldValue('doctorNotes') || "",
        diagnosis: formParent?.getFieldValue('diagnosis') || "",
        systolicBloodPressure: formParent?.getFieldValue('systolicBloodPressure') || 120,
        diastolicBloodPressure: formParent?.getFieldValue('diastolicBloodPressure') || 80,
        heartRate: formParent?.getFieldValue('heartRate') || 75,
        bloodSugar: formParent?.getFieldValue('bloodSugar') || 100,
        prescriptionDetails: medications
        // isFollowUp: false,  tạm thời bỏ qua
      }

      console.log("dữ liệu save:", prescriptionData )

      const savedPrescription = await savePrescription(prescriptionData)

      if (savedPrescription) {
        // Call parent callback to refresh data
        if (onPrescriptionSaved) {
          onPrescriptionSaved()
        }
        
        // Close modal
        handleClose()
      }
    } catch (error) {
      console.error("Form validation failed:", error)
    }
  }

  const handleUpdate = async () => {
    try {
      const formValues = await form.validateFields()

      if (!medications || medications.length === 0) {
        message.warning("Chưa có thuốc nào trong toa thuốc")
        return
      }

      // Prepare prescription data with vital signs from patientDetail
      const prescriptionData = {
        appointmentId: appointmentId || undefined,
        patientId: patientDetail?.patientInfo.patientId,
        note: formParent?.getFieldValue('doctorNotes') || "",
        diagnosis: formParent?.getFieldValue('diagnosis') || "",
        systolicBloodPressure: formParent?.getFieldValue('systolicBloodPressure') || 120,
        diastolicBloodPressure: formParent?.getFieldValue('diastolicBloodPressure') || 80,
        heartRate: formParent?.getFieldValue('heartRate') || 75,
        bloodSugar: formParent?.getFieldValue('bloodSugar') || 100,
        prescriptionDetails: medications
        // isFollowUp: false,  tạm thời bỏ qua
      }

      console.log("dữ liệu cập nhật:", prescriptionData )

      const updatedPrescription = await updatePrescription(prescriptionData)

      if (updatedPrescription) {
        // Call parent callback to refresh data
        if (onPrescriptionSaved) {
          onPrescriptionSaved()
        }
        
        // Close modal
        handleClose()
      }
    } catch (error) {
      console.error("Form validation failed:", error)
    }
  }

  const handleClose = () => {
    resetPrescriptionLoadState()
    form.resetFields()
    setSearchInput("")
    setSearchResults([])
    setShowSearchResults(false)
    onClose()
  }

  const columns = [
    {
      title: "Thuốc",
      dataIndex: ["medicine", "medicineName"],
      key: "medicineName",
      render: (text: string, record: PrescriptionDetail) => {
        if (!record.medicine) return <div>Không có thông tin</div>

        return (
          <div>
            <div className="font-medium">{record.medicine.medicineName || "Không có tên"}</div>
            <div className="text-sm text-gray-500">{record.medicine.category || "Không phân loại"}</div>
            <div className="text-xs text-gray-400">
              {(record.medicine.price || 0).toLocaleString("vi-VN")} VNĐ/{record.medicine.unit || "Đơn vị"}
            </div>
            {record.medicine.quantity && <div className="text-xs text-gray-400">Còn: {record.medicine.quantity}</div>}
          </div>
        )
      },
    },
    {
      title: "Liều lượng",
      dataIndex: "dosage",
      key: "dosage",
      width: 100,
      render: (text: string, record: PrescriptionDetail, index: number) => (
        <Input
          value={text || ""}
          onChange={(e) => updateMedicationField(index, "dosage", e.target.value)}
          className="w-full text-center"
          placeholder="1"
        />
      ),
    },
    {
      title: "Tần suất",
      dataIndex: "frequency",
      key: "frequency",
      width: 200,
      render: (text: string, record: PrescriptionDetail, index: number) => (
        <Select
          value={text || "Ngày 1 lần, buổi sáng"}
          onChange={(value) => handleFrequencyChange(index, value)}
          style={{ width: "100%" }}
          options={[
            { value: "Ngày 1 lần, buổi sáng", label: "Ngày 1 lần, buổi sáng" },
            { value: "Ngày 1 lần, buổi trưa", label: "Ngày 1 lần, buổi trưa" },
            { value: "Ngày 1 lần, buổi chiều", label: "Ngày 1 lần, buổi chiều" },
            { value: "Ngày 1 lần, buổi tối", label: "Ngày 1 lần, buổi tối" },
            { value: "Ngày 2 lần, sáng tối", label: "Ngày 2 lần, sáng tối" },
            { value: "Ngày 3 lần, sáng trưa chiều", label: "Ngày 3 lần, sáng trưa chiều" },
          ]}
        />
      ),
    },
    {
      title: "Cách dùng",
      dataIndex: "prescriptionNotes",
      key: "prescriptionNotes",
      width: 150,
      render: (text: string, record: PrescriptionDetail, index: number) => (
        <Select
          value={text || "Trước ăn"}
          onChange={(value) => updateMedicationField(index, "prescriptionNotes", value)}
          style={{ width: "100%" }}
          options={[
            { value: "Trước ăn", label: "Trước ăn" },
            { value: "Trước ăn 30 phút", label: "Trước ăn 30 phút" },
            { value: "Sau ăn", label: "Sau ăn" },
            { value: "Sau ăn 30 phút", label: "Sau ăn 30 phút" },
            { value: "Trong bữa ăn", label: "Trong bữa ăn" },
            { value: "Trước khi ngủ 30 phút", label: "Trước khi ngủ 30 phút" },
            { value: "Khi cần", label: "Khi cần" },
          ]}
        />
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      width: 120,
      render: (text: string, record: PrescriptionDetail, index: number) => (
        <Input
          value={text || ""}
          onChange={(e) => handleDurationChange(index, e.target.value)}
          className="w-full text-center"
          placeholder="7 ngày"
        />
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (text: number, record: PrescriptionDetail, index: number) => (
        <InputNumber
          value={text || 1}
          onChange={(value) => updateMedicationField(index, "quantity", value || 1)}
          className="w-full text-center"
          min={1}
          placeholder="1"
        />
      ),
    },
    {
      title: "",
      key: "action",
      width: 70,
      render: (_: any, record: PrescriptionDetail, index: number) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteMedication(index)} />
      ),
    },
  ]

  return (
    <Modal
      title={currentPrescriptionId ? "Chỉnh sửa toa thuốc" : "Kê toa thuốc"}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={1200}
      destroyOnClose={true}
    >
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <Text strong>Bệnh nhân: {patientName}</Text>
            <div>
              <Text type="secondary">Mã bệnh nhân: {patientCode}</Text>
            </div>
            {patientDetail?.age && (
              <div>
                <Text type="secondary">Tuổi: {patientDetail.age}</Text>
              </div>
            )}
            {currentPrescriptionId && (
              <div>
                <Text type="secondary">Đang chỉnh sửa toa thuốc #{currentPrescriptionId}</Text>
              </div>
            )}
          </div>
          <div className="text-right">
            <Text strong>Ngày: {new Date().toLocaleDateString("vi-VN")}</Text>
            <div>
              <Text type="secondary">
                Giờ: {new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Tìm thuốc..."
              prefix={<SearchOutlined />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full"
              suffix={searchLoading ? <Spin size="small" /> : null}
            />

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {searchResults.map((medicine) => (
                  <div
                    key={medicine.medicineId}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleAddMedicine(medicine)}
                  >
                    <div className="font-medium">{medicine.medicineName}</div>
                    <div className="text-sm text-gray-500">{medicine.category}</div>
                    <div className="text-xs text-gray-400">
                      {medicine.price.toLocaleString("vi-VN")} VNĐ/{medicine.unit}
                      {medicine.quantity && ` - Còn: ${medicine.quantity}`}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showSearchResults && (!searchResults || searchResults.length === 0) && searchInput && !searchLoading && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-3">
                <div className="text-gray-500 text-center">Không tìm thấy thuốc</div>
              </div>
            )}
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={medications || []}
          rowKey={(record, index) => `${record.medicine?.medicineId || 0}-${index}`}
          pagination={false}
          className="mb-6"
          loading={saving}
          locale={{
            emptyText: "Chưa có thuốc nào trong toa thuốc"
          }}
        />

        <Form form={form} layout="vertical">
          <Form.Item label="Ghi chú của bác sĩ" name="doctorNotes">
            <Input.TextArea rows={4} placeholder="Nhập ghi chú..." />
          </Form.Item>
          
          {/* Display current vital signs if available */}
          {/* {patientDetail && (
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <Text strong className="block mb-2">Thông tin sinh hiệu hiện tại:</Text>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Huyết áp: {formValue.systolicBloodPressure || 'N/A'}/{patientDetail.diastolicBloodPressure || 'N/A'} mmHg</div>
                <div>Nhịp tim: {patientDetail.heartRate || 'N/A'} bpm</div>
                <div>Đường huyết: {patientDetail.bloodSugar || 'N/A'} mg/dL</div>
                <div>Nhiệt độ: {patientDetail.temperature || 'N/A'}°C</div>
              </div>
            </div>
          )} */}
        </Form>
      </div>

      <div className="flex justify-end space-x-3">
        <Button onClick={handleClose} disabled={saving}>
          Hủy
        </Button>
        <Button
          type="primary"
          onClick={handleSave}
          loading={saving}
          disabled={!medications || medications.length === 0}
        >
          {currentPrescriptionId ? "Cập nhật toa thuốc" : "Lưu toa thuốc"}
        </Button>
      </div>
    </Modal>
  )
}