import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../../services/appointmentService";
import type { ServiceDto } from "../../types/appointment";
import PageMeta from "../../components/common/PageMeta";
import { Plus, X } from "lucide-react";

export default function AddService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceDto>({
    serviceName: "",
    serviceType: "OTHER",
    price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await appointmentService.createService(formData);
      navigate("/admin/health-services");
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Có lỗi xảy ra khi thêm dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  return (
    <div>
      <PageMeta
        title="Thêm dịch vụ mới | Admin Dashboard"
        description="Thêm dịch vụ mới vào hệ thống"
      />

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Thêm dịch vụ mới
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên dịch vụ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 outline-0"
                placeholder="Nhập tên dịch vụ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loại dịch vụ <span className="text-red-500">*</span>
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 outline-0"
              >
                <option value="">Chọn loại dịch vụ</option>
                <option value="TEST">Xét nghiệm</option>
                <option value="IMAGING">Chẩn đoán hình ảnh</option>
                <option value="CONSULTATION">Khám tư vấn</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giá dịch vụ (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500/20 focus:border-base-500 outline-0"
                placeholder="Nhập giá dịch vụ"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-base-600 text-white rounded-lg hover:bg-base-700 disabled:opacity-50"
            >
              {loading ? "Đang thêm..." : "Thêm dịch vụ"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/services")}
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
