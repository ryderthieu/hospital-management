"use client"

import type React from "react"
import { useState } from "react"
import { Modal, Form, InputNumber, Button, Row, Col } from "antd"

interface VitalSignModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vitalSigns: any) => void
}

export const VitalSignModal: React.FC<VitalSignModalProps> = ({ isOpen, onClose, onSave }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      onSave(values)
      form.resetFields()
    } catch (error) {
      console.error("Validation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="Thêm sinh hiệu"
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSave}>
          Lưu
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Huyết áp tâm thu (mmHg)"
              name="systolicBloodPressure"
              rules={[{ required: true, message: "Vui lòng nhập huyết áp tâm thu" }]}
            >
              <InputNumber min={0} max={300} className="w-full" placeholder="120" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Huyết áp tâm trương (mmHg)"
              name="diastolicBloodPressure"
              rules={[{ required: true, message: "Vui lòng nhập huyết áp tâm trương" }]}
            >
              <InputNumber min={0} max={200} className="w-full" placeholder="80" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nhịp tim (bpm)"
              name="heartRate"
              rules={[{ required: true, message: "Vui lòng nhập nhịp tim" }]}
            >
              <InputNumber min={0} max={200} className="w-full" placeholder="75" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Đường huyết (mg/dL)"
              name="bloodSugar"
              rules={[{ required: true, message: "Vui lòng nhập đường huyết" }]}
            >
              <InputNumber min={0} max={500} className="w-full" placeholder="100" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
