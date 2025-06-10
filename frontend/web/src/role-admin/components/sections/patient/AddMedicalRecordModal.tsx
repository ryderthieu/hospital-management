import { useState } from "react";
import { Modal } from "../../ui/modal";
import { CreatePrescriptionRequest } from "../../../types/pharmacy";

interface AddMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePrescriptionRequest) => Promise<void>;
  patientId: number;
  appointmentId?: number;
}

export default function AddMedicalRecordModal({
  isOpen,
  onClose,
  onSubmit,
  patientId,
  appointmentId,
}: AddMedicalRecordModalProps) {
  const [form, setForm] = useState<CreatePrescriptionRequest>({
    appointmentId: appointmentId || 0,
    patientId,
    followUpDate: "",
    isFollowUp: false,
    diagnosis: "",
    systolicBloodPressure: 120,
    diastolicBloodPressure: 80,
    heartRate: 70,
    bloodSugar: 90,
    note: "",
    prescriptionDetails: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Thêm bệnh án mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Chẩn đoán <span className="text-red-500">*</span>
          </label>
          <input
            name="diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            type="text"
            placeholder="Nhập chẩn đoán"
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Lý do khám</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium mb-1">Huyết áp tâm thu</label>
            <input
              type="number"
              name="systolicBloodPressure"
              value={form.systolicBloodPressure}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              min={1}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Huyết áp tâm trương
            </label>
            <input
              type="number"
              name="diastolicBloodPressure"
              value={form.diastolicBloodPressure}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              min={1}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium mb-1">Nhịp tim</label>
            <input
              type="number"
              name="heartRate"
              value={form.heartRate}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              min={1}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Đường huyết</label>
            <input
              type="number"
              name="bloodSugar"
              value={form.bloodSugar}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              min={1}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
