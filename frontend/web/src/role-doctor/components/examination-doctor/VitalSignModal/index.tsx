import { X } from "lucide-react"
import { useAddVitalSign } from "./hooks"
import { FormField } from "../FormField"
import { ModalProps } from "./types"


export const VitalSignModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { formData, handleChange, handleSubmit } = useAddVitalSign(onClose)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

      <div className="bg-white rounded-xl p-6 w-full max-w-xl relative shadow-lg z-10">
        <button className="absolute top-4 right-4 text-red-600" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Thêm sinh hiệu</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Huyết áp tâm thu (mmHg)"
            type="number"
            isEditable={true}
            value={formData.systolic}
            onChange={(val) => handleChange("systolic", Number(val))}
          />
          <FormField
            label="Mạch (nhịp/phút)"
            type="number"
            isEditable={true}
            value={formData.pulse}
            onChange={(val) => handleChange("pulse", Number(val))}
          />
          <FormField
            label="Huyết áp tâm trương (mmHg)"
            type="number"
            isEditable={true}
            value={formData.diastolic}
            onChange={(val) => handleChange("diastolic", Number(val))}
          />
          <FormField
            label="Đường huyết"
            type="number"
            isEditable={true}
            value={formData.glucose}
            onChange={(val) => handleChange("glucose", Number(val))}
          />
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            className="border border-base-700 text-base-700 px-4 py-2 rounded hover:bg-base-50"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-base-700 text-white px-4 py-2 rounded hover:bg-base-800"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}
