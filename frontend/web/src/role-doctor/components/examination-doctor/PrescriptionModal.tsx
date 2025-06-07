"use client"

import type React from "react"
import { Modal, Form, Input, Select, Button, Table, Typography } from "antd"
import { SearchOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons"
import { usePrescriptionModal } from "../../hooks/usePrescriptionModal"

const { Text } = Typography

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export const PrescriptionModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { medications, searchInput, setSearchInput, updateField, deleteMed, save } = usePrescriptionModal()

  const handleSave = async () => {
    await save()
    onClose()
  }

  const columns = [
    {
      title: "Thuốc",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Liều lượng",
      dataIndex: "dosage",
      key: "dosage",
      width: 100,
      render: (text: string, record: any, index: number) => (
        <Input
          value={text}
          onChange={(e) => updateField(index, "dosage", e.target.value)}
          className="w-full text-center"
        />
      ),
    },
    {
      title: "Tần suất",
      dataIndex: "frequency",
      key: "frequency",
      width: 200,
      render: (text: string, record: any, index: number) => (
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
      render: (text: string, record: any, index: number) => (
        <Select
          value={text}
          onChange={(value) => updateField(index, "instructions", value)}
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
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (text: string, record: any, index: number) => (
        <Input
          value={text}
          onChange={(e) => updateField(index, "quantity", e.target.value)}
          className="w-full text-center"
        />
      ),
    },
    {
      title: "",
      key: "action",
      width: 70,
      render: (_: any, record: any, index: number) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteMed(index)} />
      ),
    },
  ]

  return (
    <Modal title="Kê toa thuốc" open={isOpen} onCancel={onClose} footer={null} width={1000}>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <Text strong>Bệnh nhân: Trần Nhật Trường</Text>
            <div>
              <Text type="secondary">Mã bệnh nhân: BN22521584</Text>
            </div>
          </div>
          <div className="text-right">
            <Text strong>Ngày: 21/04/2025</Text>
            <div>
              <Text type="secondary">Giờ: 09:20</Text>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <Input
            placeholder="Tìm thuốc..."
            prefix={<SearchOutlined />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-80"
          />
          <Button type="primary" icon={<PlusOutlined />} className="ml-3">
            Thêm thuốc
          </Button>
          <Button icon={<EyeOutlined />} className="ml-3">
            Xem toa thuốc
          </Button>
        </div>

        <Table columns={columns} dataSource={medications} rowKey="id" pagination={false} className="mb-6" />

        <Form layout="vertical">
          <Form.Item label="Ghi chú của bác sĩ">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </div>

      <div className="flex justify-end space-x-3">
        <Button onClick={onClose}>Hủy</Button>
        <Button type="primary" onClick={handleSave}>
          Lưu
        </Button>
      </div>
    </Modal>
  )
}
