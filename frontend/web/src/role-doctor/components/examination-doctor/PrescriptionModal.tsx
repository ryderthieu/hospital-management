"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Form, Input, Select, Button, Table, Typography, InputNumber, message } from "antd"
import { SearchOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons"
import { usePrescriptionModal } from "../../hooks/usePrescription"
import type { Medicine, PrescriptionDetail } from "../../types/prescription"

const { Text } = Typography

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId?: number
}

export const PrescriptionModal: React.FC<ModalProps> = ({ isOpen, onClose, appointmentId }) => {
  const { medications, loading, searchInput, setSearchInput, updateField, deleteMed, save } =
    usePrescriptionModal(appointmentId)

  const [form] = Form.useForm()
  const [availableMedicines, setAvailableMedicines] = useState<Medicine[]>([])
  const [searchResults, setSearchResults] = useState<Medicine[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Mock medicine search - replace with actual API call
  const searchMedicines = async (searchTerm: string) => {
    if (!searchTerm) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    // Mock data - replace with actual API call to medicineService.searchMedicines
    const mockMedicines: Medicine[] = [
      {
        medicineId: 1,
        medicineName: "Paracetamol 500mg",
        category: "Giảm đau",
        usage: "Uống",
        unit: "Viên",
        price: 2000,
        insuranceDiscountPercent: 80,
        quantity: 100,
      },
      {
        medicineId: 2,
        medicineName: "Amoxicillin 250mg",
        category: "Kháng sinh",
        usage: "Uống",
        unit: "Viên",
        price: 5000,
        insuranceDiscountPercent: 70,
        quantity: 50,
      },
      {
        medicineId: 3,
        medicineName: "Vitamin C 1000mg",
        category: "Vitamin",
        usage: "Uống",
        unit: "Viên",
        price: 3000,
        insuranceDiscountPercent: 50,
        quantity: 200,
      },
    ]

    const filtered = mockMedicines.filter(
      (med) =>
        med.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setSearchResults(filtered)
    setShowSearchResults(true)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMedicines(searchInput)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchInput])

  const addMedicine = (medicine: Medicine) => {
    const newMedication: PrescriptionDetail = {
      medicine,
      dosage: "1",
      frequency: "Ngày 1 lần, buổi sáng",
      duration: "7 ngày",
      prescriptionNotes: "",
    }

    // Add to medications list
    const currentMeds = [...medications, newMedication]
    // This would be handled by the hook's internal state management

    setShowSearchResults(false)
    setSearchInput("")
    message.success(`Đã thêm ${medicine.medicineName}`)
  }

  const handleSave = async () => {
    try {
      const formValues = await form.validateFields()

      // Prepare prescription data
      const prescriptionData = {
        diagnosis: formValues.diagnosis || "Chẩn đoán",
        isFollowUp: formValues.isFollowUp || false,
        systolicBloodPressure: formValues.systolicBloodPressure || 120,
        diastolicBloodPressure: formValues.diastolicBloodPressure || 80,
        heartRate: formValues.heartRate || 75,
        bloodSugar: formValues.bloodSugar || 100,
        note: formValues.doctorNotes,
        followUpDate: formValues.followUpDate,
      }

      await save()
      onClose()
    } catch (error) {
      console.error("Form validation failed:", error)
    }
  }

  const columns = [
    {
      title: "Thuốc",
      dataIndex: ["medicine", "medicineName"],
      key: "medicineName",
      render: (text: string, record: PrescriptionDetail) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.medicine.category}</div>
          <div className="text-xs text-gray-400">
            {record.medicine.price.toLocaleString("vi-VN")} VNĐ/{record.medicine.unit}
          </div>
        </div>
      ),
    },
    {
      title: "Liều lượng",
      dataIndex: "dosage",
      key: "dosage",
      width: 100,
      render: (text: string, record: PrescriptionDetail, index: number) => (
        <Input
          value={text}
          onChange={(e) => updateField(index, "dosage", e.target.value)}
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
          value={text}
          onChange={(value) => updateField(index, "frequency", value)}
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
      dataIndex: "instructions",
      key: "instructions",
      width: 200,
      render: (text: string, record: PrescriptionDetail, index: number) => (
        <Select
          value={record.prescriptionNotes || "Trước ăn"}
          onChange={(value) => updateField(index, "prescriptionNotes", value)}
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
          value={text}
          onChange={(e) => updateField(index, "duration", e.target.value)}
          className="w-full text-center"
          placeholder="7 ngày"
        />
      ),
    },
    {
      title: "",
      key: "action",
      width: 70,
      render: (_: any, record: PrescriptionDetail, index: number) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteMed(index)} />
      ),
    },
  ]

  return (
    <Modal title="Kê toa thuốc" open={isOpen} onCancel={onClose} footer={null} width={1200}>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <Text strong>Bệnh nhân: Trần Nhật Trường</Text>
            <div>
              <Text type="secondary">Mã bệnh nhân: BN22521584</Text>
            </div>
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
            />

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {searchResults.map((medicine) => (
                  <div
                    key={medicine.medicineId}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => addMedicine(medicine)}
                  >
                    <div className="font-medium">{medicine.medicineName}</div>
                    <div className="text-sm text-gray-500">{medicine.category}</div>
                    <div className="text-xs text-gray-400">
                      {medicine.price.toLocaleString("vi-VN")} VNĐ/{medicine.unit} - Còn: {medicine.quantity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="primary" icon={<PlusOutlined />} className="ml-3">
            Thêm thuốc
          </Button>
          <Button icon={<EyeOutlined />} className="ml-3">
            Xem toa thuốc
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={medications}
          rowKey={(record, index) => `${record.medicine.medicineId}-${index}`}
          pagination={false}
          className="mb-6"
          loading={loading}
        />

        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Form.Item label="Chẩn đoán" name="diagnosis">
              <Input.TextArea rows={3} placeholder="Nhập chẩn đoán..." />
            </Form.Item>
            <Form.Item label="Ghi chú của bác sĩ" name="doctorNotes">
              <Input.TextArea rows={3} placeholder="Nhập ghi chú..." />
            </Form.Item>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <Form.Item label="Huyết áp tâm thu (mmHg)" name="systolicBloodPressure">
              <InputNumber min={0} max={300} className="w-full" placeholder="120" />
            </Form.Item>
            <Form.Item label="Huyết áp tâm trương (mmHg)" name="diastolicBloodPressure">
              <InputNumber min={0} max={200} className="w-full" placeholder="80" />
            </Form.Item>
            <Form.Item label="Nhịp tim (bpm)" name="heartRate">
              <InputNumber min={0} max={200} className="w-full" placeholder="75" />
            </Form.Item>
            <Form.Item label="Đường huyết (mg/dL)" name="bloodSugar">
              <InputNumber min={0} max={500} className="w-full" placeholder="100" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="isFollowUp" valuePropName="checked">
              <input type="checkbox" className="mr-2" />
              <span>Hẹn tái khám</span>
            </Form.Item>
            <Form.Item label="Ngày tái khám" name="followUpDate">
              <Input type="date" />
            </Form.Item>
          </div>
        </Form>
      </div>

      <div className="flex justify-end space-x-3">
        <Button onClick={onClose}>Hủy</Button>
        <Button type="primary" onClick={handleSave} loading={loading}>
          Lưu toa thuốc
        </Button>
      </div>
    </Modal>
  )
}
