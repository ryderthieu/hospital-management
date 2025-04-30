import { useState } from "react";
import { Search, X, Eye, Trash2, AlertCircle, Clock } from "lucide-react";
import { FormField } from "./FormField"

type Medication = {
  name: string;
  dosage: string;
  unit: string;
  frequency: string;
  instructions: string;
  quantity: string;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const PrescriptionModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  // State cho danh sách thuốc
  const [medications, setMedications] = useState<Medication[]>([
    {
      name: "Ebastine Normon 10mg Orodisperside Tablets",
      dosage: "1",
      unit: "Viên",
      frequency: "Ngày 2 lần",
      instructions: "Sau khi ăn",
      quantity: "56"
    },
    {
      name: "EPA + DHA (Dashbrain)",
      dosage: "1",
      unit: "Viên",
      frequency: "Ngày 2 lần",
      instructions: "Sau khi ăn",
      quantity: "56"
    },
    {
      name: "Paracetamol 500mg",
      dosage: "1",
      unit: "Viên",
      frequency: "Ngày 1 lần",
      instructions: "Sau khi ăn",
      quantity: "28"
    }
  ]);

  // State cho ô tìm kiếm
  const [searchInput, setSearchInput] = useState("");


  // Cập nhật giá trị của một trường trong thuốc
  const updateMedicationField = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  // Xóa thuốc khỏi danh sách
  const handleDelete = (index: number) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay khi cửa sổ mở */}
      {isOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
      )}

      <div className={`bg-white rounded-lg border shadow-md w-2/3 px-5 py-5  z-50 ${isOpen ? "scale-100" : "scale-0"} transition-transform duration-300`}>
        <div className="flex justify-end items-center">
          <button onClick={onClose} className="text-gray-500">
              <X size={28} className="text-red-600" />
          </button>
        </div>
        

       {/* Header */}
       <div className="flex flex-col items-center justify-center gap-3 p-4 border-b">
          <h1 className="text-xl font-medium">Trần Nhật Trường (BN222521584)</h1>
          <div className="flex flex-row gap-3">
            <span className="text-gray-600">Thứ 2, 21 thg 4 2022</span>
            <span className="h-[20px] w-[2px] bg-gray-400"></span>
            <Clock size={24} className="text-gray-400" />
            <span className="text-gray-600">09:40</span>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-2">
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Tìm kiếm thuốc"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-2/5 pl-10 pr-4 py-2 border rounded-md outline-none focus:ring-base-200 focus:border-base-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
        </div>


        <div className="flex justify-between items-center px-4 py-3">
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


        {/* Medication Table */}
        <div className="px-4 py-2">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Thuốc</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Liều lượng</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tần suất</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cách dùng</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Số lượng</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 text-sm">{med.name}</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => updateMedicationField(index, "dosage", e.target.value)}
                        className="w-12 h-8 border rounded-md text-center"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={med.frequency}
                        onChange={(e) => updateMedicationField(index, "frequency", e.target.value)}
                        className="w-full border rounded-md px-2 py-1 text-sm"
                      >
                        <option value="Ngày 1 lần">Ngày 1 lần</option>
                        <option value="Ngày 2 lần">Ngày 2 lần</option>
                        <option value="Ngày 3 lần">Ngày 3 lần</option>
                        <option value="Cách ngày">Cách ngày</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={med.instructions}
                        onChange={(e) => updateMedicationField(index, "instructions", e.target.value)}
                        className="w-full border rounded-md px-2 py-1 text-sm"
                      >
                        <option value="Trước ăn">Trước ăn</option>
                        <option value="Sau ăn">Sau ăn</option>
                        <option value="Trong bữa ăn">Trong bữa ăn</option>
                        <option value="Khi cần">Khi cần</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={med.quantity}
                        onChange={(e) => updateMedicationField(index, "quantity", e.target.value)}
                        className="w-12 h-8 border rounded-md text-center"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Medication warning */}
          <div className="mt-4 text-red-500 flex items-center justify-end">
            <AlertCircle size={16} />
            <span className="ml-1">Không còn đủ thuốc</span>
          </div>
          <div className="text-right text-red-500">
            <span>Số lượng còn lại: 16</span>
          </div>
        </div>

        <FormField
                label="Lời dặn của bác sĩ"
                isEditable={true}
                type="textarea"
                rows={4}
                value="Không dùng thuốc này cho trẻ em dưới"

              />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2  border-t">
          <button  onClick={onClose} className="px-6 py-2 border rounded-md">Hủy</button>
          <button className="px-6 py-2 bg-base-600 text-white rounded-md">Lưu</button>
        </div>
      </div>
    </div>
  );
};
