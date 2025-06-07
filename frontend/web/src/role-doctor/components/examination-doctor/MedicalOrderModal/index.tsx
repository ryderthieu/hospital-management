import { Search, X, Eye, Trash2, Clock } from "lucide-react";
import { useMedicalOrderModal } from "./hook";
import { ModalProps } from "./types";


export const MedicalOrderModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const {
    indications,
    searchInput,
    setSearchInput,
    updateField,
    deleteInd,
    save
    } = useMedicalOrderModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay khi cửa sổ mở */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40"></div>}

      <div
        className={`bg-white rounded-lg border shadow-md w-1/2 px-5 py-5  z-50 ${
          isOpen ? "scale-100" : "scale-0"
        } transition-transform duration-300`}
      >
        <div className="flex justify-end items-center">
          <button onClick={onClose} className="text-gray-500">
            <X size={28} className="text-red-600" />
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-3 p-4 border-b">
          <h1 className="text-xl font-medium">
            Trần Nhật Trường (BN222521584)
          </h1>
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
              placeholder="Tìm kiếm chỉ định"
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
            <span>Thêm chỉ định</span>
          </button>
          <h2 className="text-lg font-bold">PHIẾU CHỈ ĐỊNH</h2>
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
                <tr className="bg-base-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Loại chỉ định
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Phòng thực hiện
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Thời gian dự kiến
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {indications.map((ind, index) => (
                  <tr key={index} className="text-sm">
                    <td className="px-2 py-4">
                      <select
                        value={ind.indicationType}
                        onChange={(e) =>
                            updateField(
                            index,
                            "indicationType",
                            e.target.value
                          )
                        }
                        className="w-full h-10 border rounded-md px-2 py-1 text-sm outline-none focus:ring-base-200 focus:border-base-500"
                      >
                        <option value="Xét nghiệm máu">Xét nghiệm máu</option>
                        <option value="Chụp X-Quang ngực">Chụp X-Quang ngực</option>
                        <option value="CT-Scan">CT-Scan</option>
                        <option value="M-Ray">M-Ray</option>
                      </select>
                    </td>
                    <td className="px-2 py-4">
                      <select
                        value={ind.room}
                        onChange={(e) =>
                          updateField(index, "room", e.target.value)
                        }
                        className="w-full h-10 border rounded-md px-2 py-1 text-sm outline-none focus:ring-base-200 focus:border-base-500"
                      >
                        <option value="Blood Test [01]">Blood Test [01] Đang chờ: 10</option>
                        <option value="CT-Scan [02]">CT-Scan [02] Đang chờ: 8</option>
                        <option value="X-Quang [01]">X-Quang [01] Đang chờ: 22</option>
                        <option value="M-Ray [01]">M-Ray [01] Đang chờ: 16</option>
                      </select>
                    </td>
                    <td className="px-2 py-4">
                      <input
                        type="text"
                        value={ind.expectedTime}
                        onChange={(e) =>
                          updateField(index, "expectedTime", e.target.value)
                        }
                        className="w-12 h-10 border rounded-md text-center outline-none focus:ring-base-200 focus:border-base-500"
                      />
                    </td>
                    <td className="px-2 py-4 text-center">
                      <button
                        onClick={() => deleteInd(index)}
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
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-10 ">
          <button onClick={onClose} className="px-6 py-2 border rounded-md">
            Hủy
          </button>
          <button onClick={save} className="px-6 py-2 bg-base-600 text-white rounded-md">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};
