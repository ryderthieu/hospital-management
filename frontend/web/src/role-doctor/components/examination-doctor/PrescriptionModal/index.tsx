import { usePrescriptionModal } from "./hooks";
import { X, Search, Trash2, Clock, Eye } from "lucide-react";
import { FormField } from "../FormField";
import { ModalProps } from "./types";

export const PrescriptionModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const {
    medications,
    searchInput,
    setSearchInput,
    updateField,
    deleteMed,
    save
  } = usePrescriptionModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50 z-40" />
      <div className="bg-white rounded-lg border shadow-md w-2/3 px-5 py-5 z-50">
        <div className="flex justify-end">
          <button onClick={onClose}>
            <X size={28} className="text-red-600" />
          </button>
        </div>

        <div className="text-center border-b py-2">
          <h1 className="text-xl font-medium">Trần Nhật Trường (BN222521584)</h1>
          <div className="flex justify-center items-center gap-2 text-gray-500">
            <span>Thứ 2, 21 thg 4 2022</span>
            <Clock size={16} />
            <span>09:40</span>
          </div>
        </div>

        <div className="relative my-3">
          <input
            className="w-1/3 pl-10 pr-4 py-2 border rounded-md outline-none focus:ring-base-200 focus:border-base-500"
            placeholder="Tìm kiếm thuốc"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>

        <div className="flex justify-between items-center my-3">
          <button className="flex items-center bg-base-50 text-base-600 px-3 py-1 rounded-md">
            <span className="mr-1 text-xl">+</span>
            <span>Thêm thuốc</span>
          </button>
          <h2 className="text-lg font-bold">TOA THUỐC</h2>
          <button className="flex items-center text-base-600 gap-1">
            <Eye size={20} />
            <span>Xem bản in</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border mb-3">
            <thead className="bg-base-100 text-sm text-left text-gray-700">
              <tr>
                <th className="p-2">Tên thuốc</th>
                <th className="p-2">Liều</th>
                <th className="p-2">Tần suất</th>
                <th className="p-2">Cách dùng</th>
                <th className="p-2">Số lượng</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med, index) => (
                <tr key={index} className="text-sm">
                  <td className="px-2 py-4">{med.name}</td>
                  <td className="px-2 py-4">
                    <input
                      className="w-10 h-10 text-center border rounded-md outline-none focus:ring-base-200 focus:border-base-500"
                      value={med.dosage}
                      onChange={(e) => updateField(index, "dosage", e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-4">
                    <select
                      className="h-10 border rounded-md px-1 outline-none focus:ring-base-200 focus:border-base-500"
                      value={med.frequency}
                      onChange={(e) => updateField(index, "frequency", e.target.value)}
                    >
                        <option value="Ngày 1 lần">Ngày 1 lần, buổi sáng</option>
                        <option value="Ngày 1 lần">Ngày 1 lần, buổi trưa</option>
                        <option value="Ngày 1 lần">Ngày 1 lần, buổi chiều</option>
                        <option value="Ngày 1 lần">Ngày 1 lần, buổi tối</option>
                        <option value="Ngày 2 lần">Ngày 2 lần, sáng tối</option>
                        <option value="Ngày 3 lần">Ngày 3 lần, sáng trưa chiều</option>
                    </select>
                  </td>
                  <td className="px-2 py-4">
                    <select
                      className="h-10 border rounded-md px-1 outline-none focus:ring-base-200 focus:border-base-500"
                      value={med.instructions}
                      onChange={(e) => updateField(index, "instructions", e.target.value)}
                    >
                        <option value="Trước ăn">Trước ăn</option>
                        <option value="Trước ăn">Trước ăn 30 phút</option>
                        <option value="Sau ăn">Sau ăn</option>
                        <option value="Sau ăn">Sau ăn 30 phút</option>
                        <option value="Trong bữa ăn">Trong bữa ăn</option>
                        <option value="Sau ăn">Trước khi ngủ 30 phút</option>
                        <option value="Khi cần">Khi cần</option>
                    </select>
                  </td>
                  <td className="px-2 py-4">
                    <input
                      className="w-10 h-10 text-center border rounded-md outline-none focus:ring-base-200 focus:border-base-500"
                      value={med.quantity}
                      onChange={(e) => updateField(index, "quantity", e.target.value)}
                    />
                  </td>
                  <td className="text-center p-2">
                    <button onClick={() => deleteMed(index)} className="text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <FormField
          label="Lời dặn của bác sĩ"
          isEditable={true}
          type="textarea"
          rows={3}
          value="Không dùng thuốc này cho trẻ em dưới"
        />

        <div className="flex justify-end gap-2 mt-4 pt-2">
          <button onClick={onClose} className="border px-4 py-2 rounded-md">Hủy</button>
          <button onClick={save} className="bg-base-600 text-white px-4 py-2 rounded-md">Lưu</button>
        </div>
      </div>
    </div>
  );
};
