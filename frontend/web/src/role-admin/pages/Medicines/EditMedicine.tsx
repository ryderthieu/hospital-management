"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { medicineService } from "../../services/pharmacyService"
import type { Medicine, MedicineUpdateRequest } from "../../types/pharmacy"
import PageMeta from "../../components/common/PageMeta"
import { Save, X } from "lucide-react"

export default function EditMedicine() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [formData, setFormData] = useState<MedicineUpdateRequest>({})

  useEffect(() => {
    if (id) {
      loadMedicine(Number(id))
    }
  }, [id])

  const loadMedicine = async (medicineId: number) => {
    try {
      setLoading(true)
      const data = await medicineService.getMedicineById(medicineId)
      setMedicine(data)
      setFormData({
        medicineName: data.medicineName,
        manufactor: data.manufactor,
        category: data.category,
        description: data.description,
        usage: data.usage,
        unit: data.unit,
        insuranceDiscountPercent: data.insuranceDiscountPercent,
        sideEffects: data.sideEffects,
        price: data.price,
        quantity: data.quantity,
      })
    } catch (error) {
      console.error("Error loading medicine:", error)
      alert("Không thể tải thông tin thuốc")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      setLoading(true)
      await medicineService.updateMedicine(Number(id), formData)
      navigate("/admin/medicines")
    } catch (error) {
      console.error("Error updating medicine:", error)
      alert("Có lỗi xảy ra khi cập nhật thuốc")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" || name === "insuranceDiscountPercent" ? Number(value) : value,
    }))
  }

  if (loading && !medicine) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải thông tin thuốc...</div>
      </div>
    )
  }

  if (!medicine) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Không tìm thấy thuốc</div>
      </div>
    )
  }

  return (
    <div>
      <PageMeta
        title={`Chỉnh sửa ${medicine.medicineName} | Admin Dashboard`}
        description="Chỉnh sửa thông tin thuốc"
      />

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Chỉnh sửa thuốc: {medicine.medicineName}
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tên thuốc *</label>
              <input
                type="text"
                name="medicineName"
                value={formData.medicineName || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nhà sản xuất</label>
              <input
                type="text"
                name="manufactor"
                value={formData.manufactor || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Danh mục *</label>
              <select
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn danh mục</option>
                <option value="Pain Reliever">Thuốc giảm đau</option>
                <option value="Antibiotic">Thuốc kháng sinh</option>
                <option value="Vitamin">Vitamin</option>
                <option value="Cough Medicine">Thuốc ho</option>
                <option value="Digestive">Thuốc tiêu hóa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Đơn vị *</label>
              <select
                name="unit"
                value={formData.unit || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn đơn vị</option>
                <option value="Viên">Viên</option>
                <option value="Chai">Chai</option>
                <option value="Tuýp">Tuýp</option>
                <option value="Hộp">Hộp</option>
                <option value="Gói">Gói</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Giá (VND) *</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Số lượng *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity || ""}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tỷ lệ bảo hiểm (0-1)
              </label>
              <input
                type="number"
                name="insuranceDiscountPercent"
                value={formData.insuranceDiscountPercent || ""}
                onChange={handleChange}
                min="0"
                max="1"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mô tả</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cách sử dụng *</label>
            <textarea
              name="usage"
              value={formData.usage || ""}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tác dụng phụ</label>
            <textarea
              name="sideEffects"
              value={formData.sideEffects || ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
              onClick={() => navigate("/admin/medicines")}
              className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              <X className="h-4 w-4" />
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
