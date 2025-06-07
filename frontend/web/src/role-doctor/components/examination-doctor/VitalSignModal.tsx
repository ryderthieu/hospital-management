"use client"

import type React from "react"
import { Modal, Form, InputNumber, Button } from "antd"
import { useAddVitalSign } from "../../hooks/useAddVitalSign"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export const VitalSignModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { formData, handleChange, handleSubmit } = useAddVitalSign(onClose)
  const [form] = Form.useForm()

  const onFinish = async () => {
    try {
      await form.validateFields()
      await handleSubmit()
      form.resetFields()
    } catch (error) {
      console.error("Validation failed:", error)
    }
  }

  return (
    <Modal title="Thêm sinh hiệu" open={isOpen} onCancel={onClose} footer={null} width={600}>
      <Form form={form} layout="vertical" initialValues={formData} onFinish={onFinish}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Huyết áp tâm thu (mmHg)"
            name="systolic"
            rules={[{ required: true, message: "Vui lòng nhập huyết áp tâm thu!" }]}
          >
            <InputNumber
              min={0}
              max={300}
              style={{ width: "100%" }}
              onChange={(value) => handleChange("systolic", value as number)}
            />
          </Form.Item>

          <Form.Item label="Mạch (nhịp/phút)" name="pulse" rules={[{ required: true, message: "Vui lòng nhập mạch!" }]}>
            <InputNumber
              min={0}
              max={300}
              style={{ width: "100%" }}
              onChange={(value) => handleChange("pulse", value as number)}
            />
          </Form.Item>

          <Form.Item
            label="Huyết áp tâm trương (mmHg)"
            name="diastolic"
            rules={[{ required: true, message: "Vui lòng nhập huyết áp tâm trương!" }]}
          >
            <InputNumber
              min={0}
              max={200}
              style={{ width: "100%" }}
              onChange={(value) => handleChange("diastolic", value as number)}
            />
          </Form.Item>

          <Form.Item
            label="Đường huyết"
            name="glucose"
            rules={[{ required: true, message: "Vui lòng nhập đường huyết!" }]}
          >
            <InputNumber
              min={0}
              max={500}
              style={{ width: "100%" }}
              onChange={(value) => handleChange("glucose", value as number)}
            />
          </Form.Item>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
