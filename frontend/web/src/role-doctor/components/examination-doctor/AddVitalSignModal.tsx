import { FormField } from "./FormField"
import { X } from "lucide-react"

export default function AddVitalSignModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay tối nền */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

      {/* Modal content */}
      <div className="bg-white rounded-xl p-6 w-full max-w-xl relative shadow-lg z-10">
        {/* Nút đóng */}
        <button className="absolute top-4 right-4 text-red-600" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Tiêu đề */}
        <h2 className="text-xl font-semibold mb-6">Thêm sinh hiệu</h2>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Huyết áp tâm thu (mmHg)"
            type="number"
            isEditable={true}
            placeholder=""
          />
          <FormField
            label="Mạch (nhịp/phút)"
            type="number"
            isEditable={true}
            placeholder=""
          />
          <FormField
            label="Huyết áp tâm trương (mmHg)"
            type="number"
            isEditable={true}
            placeholder=""
          />
          <FormField
            label="Đường huyết"
            type="number"
            isEditable={true}
            placeholder=""
          />
        </div>

        {/* Hành động */}
        <div className="flex justify-end mt-6 space-x-3">
          <button
            className="border border-teal-700 text-teal-700 px-4 py-2 rounded hover:bg-teal-50"
            onClick={onClose}
          >
            Hủy
          </button>
          <button className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800">
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}
