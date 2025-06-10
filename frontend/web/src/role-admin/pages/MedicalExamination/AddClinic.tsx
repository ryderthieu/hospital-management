import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Link, useNavigate } from "react-router-dom";
import { doctorService } from "../../services/doctorService";
import { ExaminationRoomDto } from "../../types/doctor";
import { ChevronDown, ArrowLeft } from "lucide-react";

const AddClinic: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<ExaminationRoomDto, "roomId">>({
    departmentId: 0,
    type: "examination",
    note: "",
    building: "",
    floor: 1,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doctorService.createExaminationRoom(formData);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/admin/outpatient-clinics");
      }, 1500);
    } catch (error: any) {
      alert(
        "Có lỗi khi thêm phòng khám!\n" +
          JSON.stringify(error.response?.data || error.message)
      );
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 mt-8">
      <PageMeta
        title="Thêm phòng khám | Bệnh viện Đa khoa Trung tâm"
        description="Thêm mới phòng khám"
      />
      <div className="flex items-center mb-6">
        <Link
          to="/admin/outpatient-clinics"
          className="text-base-600 hover:text-base-700 flex items-center"
        >
          <ArrowLeft className="mr-2" size={20} />
          <span className="text-xl font-medium text-base-600">
            Thêm phòng khám
          </span>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-blue-600 mb-6">
          Thông tin phòng khám
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="block text-base-600 font-medium">
                Tên phòng
              </label>
              <input
                type="text"
                name="note"
                value={formData.note || ""}
                onChange={handleChange}
                placeholder="Nhập tên phòng (ví dụ: Phòng gây mê, Phòng xét nghiệm...)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Mã khoa <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                placeholder="Nhập mã khoa"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
                required
                min={1}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Loại phòng <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500 appearance-none"
                  required
                >
                  <option value="EXAMINATION">Khám bệnh</option>
                  <option value="TEST">Xét nghiệm</option>
                  <option value="OTHER">Khác</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Tòa nhà <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="building"
                value={formData.building}
                onChange={handleChange}
                placeholder="Nhập tên tòa nhà"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base-600 font-medium">
                Tầng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                min={1}
                placeholder="Nhập số tầng"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base-500"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="px-4 py-2 bg-base-600 text-white font-medium rounded-md hover:bg-base-700 focus:outline-none focus:ring-2 focus:ring-base-500 focus:ring-offset-2"
            >
              Lưu thông tin
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={() => navigate("/admin/outpatient-clinics")}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4 text-green-600">
              Thêm phòng khám thành công!
            </h2>
            <p className="mb-6">Bạn sẽ được chuyển về danh sách phòng khám.</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/admin/outpatient-clinics");
              }}
              className="px-4 py-2 bg-base-600 text-white rounded hover:bg-base-700"
            >
              Về danh sách phòng khám
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddClinic;
