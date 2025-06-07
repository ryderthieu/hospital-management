"use client"

import type React from "react"
import { Modal, Form, Input, Select, Button, Table, Typography } from "antd"
import { SearchOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons"
import { useMedicalOrderModal } from "../../hooks/useMedicalOrderModal"

const { Text } = Typography

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export const MedicalOrderModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { indications, searchInput, setSearchInput, updateField, deleteIndication, save } = useMedicalOrderModal()

  const handleSave = async () => {
    await save()
    onClose()
  }

  const columns = [
    {
      title: "Chỉ định",
      dataIndex: "indicationType",
      key: "indicationType",
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      width: 200,
      render: (text: string, record: any, index: number) => (
        <Select
          value={text}
          onChange={(value) => updateField(index, "room", value)}
          style={{ width: "100%" }}
          options={[
            { value: "CT-Scan [01]", label: "CT-Scan [01]" },
            { value: "CT-Scan [02]", label: "CT-Scan [02]" },
            { value: "MRI [01]", label: "MRI [01]" },
            { value: "MRI [02]", label: "MRI [02]" },
            { value: "X-Ray [01]", label: "X-Ray [01]" },
            { value: "X-Ray [02]", label: "X-Ray [02]" },
            { value: "Blood Test [01]", label: "Blood Test [01]" },
            { value: "Blood Test [02]", label: "Blood Test [02]" },
          ]}
        />
      ),
    },
    {
      title: "Thời gian dự kiến",
      dataIndex: "expectedTime",
      key: "expectedTime",
      width: 200,
      render: (text: string, record: any, index: number) => (
        <Input value={text} onChange={(e) => updateField(index, "expectedTime", e.target.value)} className="w-full" />
      ),
    },
    {
      title: "",
      key: "action",
      width: 70,
      render: (_: any, record: any, index: number) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteIndication(index)} />
      ),
    },
  ]

  return (
    <Modal title="Thêm chỉ định" open={isOpen} onCancel={onClose} footer={null} width={1000}>
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
            placeholder="Tìm chỉ định..."
            prefix={<SearchOutlined />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-80"
          />
          <Button type="primary" icon={<PlusOutlined />} className="ml-3">
            Thêm chỉ định
          </Button>
          <Button icon={<EyeOutlined />} className="ml-3">
            Xem chỉ định
          </Button>
        </div>

        <Table columns={columns} dataSource={indications} rowKey="id" pagination={false} className="mb-6" />

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
