import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { patientService } from "../../services/patientService";
import PageMeta from "../../components/common/PageMeta";

export default function EditPatientRoom() {
  const navigate = useNavigate();
  const { detailId } = useParams<{ detailId: string }>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    roomId: number | "";
    patientId: number | "";
  }>({
    roomId: "",
    patientId: "",
  });

  useEffect(() => {
    if (detailId) {
      loadRoomDetail(Number(detailId));
    }
  }, [detailId]);

  const loadRoomDetail = async (id: number) => {
    try {
      setLoading(true);
      const data = await patientService.getRoomDetailById(id);
      setFormData({
        roomId: data.roomId,
        patientId: data.patientId,
      });
    } catch (error) {
      console.error("Không tìm thấy thông tin nội trú:", error);
      alert("Không tìm thấy thông tin nội trú!");
      navigate("/admin/inpatients");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailId) return;
    try {
      setLoading(true);
      await patientService.updateRoomDetail(Number(detailId), {
        roomId: Number(formData.roomId),
        patientId: Number(formData.patientId),
      });
      navigate("/admin/inpatients");
    } catch (error: any) {
      console.error("Error updating inpatient room:", error);
      alert(
        "Có lỗi xảy ra khi cập nhật nội trú: " +
          (error.response?.data?.message || JSON.stringify(error.response?.data) || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  return (
    <div>
      <PageMeta
        title="Chỉnh sửa bệnh nhân nội trú | Admin Dashboard"
        description="Chỉnh sửa thông tin bệnh nhân nội trú"
      />

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Chỉnh sửa bệnh nhân nội trú
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã phòng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 outline-0"
                placeholder="Nhập mã phòng"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mã bệnh nhân <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 outline-0"
                placeholder="Nhập mã bệnh nhân"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-base-600 text-white rounded-lg hover:bg-base-700 disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/inpatients")}
              className="flex items-center gap-2 px-6 py-2 bg-gray-500/70 text-white rounded-lg hover:bg-gray-600/70"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
