import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientService } from "../../services/patientService";
import PageMeta from "../../components/common/PageMeta";

const AddRoom: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    roomName: string;
    maxCapacity: number | "";
    note?: string;
  }>({
    roomName: "",
    maxCapacity: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await patientService.createPatientRoom({
        roomName: formData.roomName,
        maxCapacity: Number(formData.maxCapacity),
        note: formData.note,
      });
      navigate("/admin/inpatients-rooms");
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Có lỗi xảy ra khi thêm phòng");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "maxCapacity" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  return (
    <div>
      <PageMeta
        title="Thêm phòng bệnh | Admin Dashboard"
        description="Thêm phòng bệnh vào hệ thống"
      />

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Thêm phòng bệnh
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên phòng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="roomName"
                value={formData.roomName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 outline-0"
                placeholder="Nhập tên phòng"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sức chứa tối đa <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 outline-0"
                placeholder="Nhập sức chứa tối đa"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ghi chú
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 outline-0"
              placeholder="Nhập ghi chú (nếu có)"
              rows={3}
            />
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-base-600 text-white rounded-lg hover:bg-base-700 disabled:opacity-50"
            >
              {loading ? "Đang thêm..." : "Thêm phòng"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/patient-rooms")}
              className="flex items-center gap-2 px-6 py-2 bg-gray-500/70 text-white rounded-lg hover:bg-gray-600/70"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
