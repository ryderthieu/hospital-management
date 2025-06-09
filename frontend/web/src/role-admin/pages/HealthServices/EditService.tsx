import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appointmentService } from "../../services/appointmentService";
import type { Service, ServiceDto } from "../../types/appointment";
import PageMeta from "../../components/common/PageMeta";
import { Save, X } from "lucide-react";

export default function EditService() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceDto>({
    serviceName: "",
    serviceType: "OTHER",
    price: 0,
  });

  useEffect(() => {
    if (id) {
      loadService(Number(id));
    }
  }, [id]);

  const loadService = async (serviceId: number) => {
    try {
      setLoading(true);
      const data = await appointmentService.getServiceById(serviceId);
      setService(data);
      setFormData({
        serviceName: data.serviceName,
        serviceType: data.serviceType,
        price: data.price,
      });
    } catch (error) {
      console.error("Error loading service:", error);
      alert("Không thể tải thông tin dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setLoading(true);
      await appointmentService.updateService(Number(id), formData);
      navigate("/admin/health-services");
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Có lỗi xảy ra khi cập nhật dịch vụ");
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
      [name]:
        name === "price"
          ? Number(value)
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  if (loading && !service) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải thông tin dịch vụ...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Không tìm thấy dịch vụ</div>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title={`Chỉnh sửa ${service.serviceName} | Admin Dashboard`}
        description="Chỉnh sửa thông tin dịch vụ"
      />

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Chỉnh sửa dịch vụ: {service.serviceName}
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên dịch vụ *
              </label>
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loại dịch vụ *
              </label>
              <select
                name="serviceType"
                value={formData.serviceType || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                Giá dịch vụ (VND) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/health-services")}
              className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              <X className="h-4 w-4" />
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
