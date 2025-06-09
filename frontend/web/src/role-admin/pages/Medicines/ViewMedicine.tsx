"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { medicineService } from "../../services/pharmacyService";
import type { Medicine } from "../../types/pharmacy";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { ArrowLeft, Edit, Pill } from "lucide-react";
import ReturnButton from "../../components/ui/button/ReturnButton";

export default function ViewMedicine() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [medicine, setMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    if (id) {
      loadMedicine(Number(id));
    }
  }, [id]);

  const loadMedicine = async (medicineId: number) => {
    try {
      setLoading(true);
      const data = await medicineService.getMedicineById(medicineId);
      setMedicine(data);
    } catch (error) {
      console.error("Error loading medicine:", error);
      alert("Không thể tải thông tin thuốc");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatus = (quantity: number): "Có sẵn" | "Hết" => {
    return quantity > 0 ? "Có sẵn" : "Hết";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải thông tin thuốc...</div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Không tìm thấy thuốc</div>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title={`${medicine.medicineName} | Admin Dashboard`}
        description="Chi tiết thông tin thuốc"
      />

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <ReturnButton />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Chi tiết thuốc
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate(`/admin/medicines/edit/${medicine.medicineId}`)
            }
            className="flex items-center gap-2 px-4 py-2 bg-base-600 text-white rounded-lg hover:bg-base-700"
          >
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin cơ bản */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <Pill className="h-10 w-10 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-2">
                  {medicine.medicineName}
                  {medicine.insuranceDiscountPercent > 0 && (
                    <span className="bg-purple-500/30 ml-3 text-sm px-3 py-1 rounded-full font-bold text-purple-500">
                      BHYT{" "}
                      {(medicine.insuranceDiscountPercent * 100).toFixed(0)}%
                    </span>
                  )}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Nhà sản xuất: {medicine.manufactor}
                </p>
                <div className="flex gap-3">
                  <Badge size="sm" color="info">
                    {medicine.category}
                  </Badge>
                  <Badge
                    size="sm"
                    color={
                      getStatus(medicine.quantity) === "Có sẵn"
                        ? "success"
                        : "error"
                    }
                  >
                    {getStatus(medicine.quantity)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-2">
                  Thông tin giá
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Giá gốc:
                    </span>
                    <span className="font-medium">
                      {formatPrice(medicine.price)}
                    </span>
                  </div>
                  {medicine.insuranceDiscountPercent > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Giảm BHYT:
                      </span>
                      <span className="font-medium text-green-600">
                        -{formatPrice(medicine.insuranceDiscount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-2">
                  Thông tin kho
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tồn kho:
                    </span>
                    <span className="font-medium">
                      {medicine.quantity} {medicine.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Đơn vị:
                    </span>
                    <span className="font-medium">{medicine.unit}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-2">
                Mô tả
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {medicine.description || "Chưa có mô tả"}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-2">
                Cách sử dụng
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {medicine.usage}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-2">
                Tác dụng phụ
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {medicine.sideEffects || "Chưa có thông tin"}
              </p>
            </div>
          </div>

          {/* Thông tin bổ sung */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-3">
                Thông tin nhanh
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Mã thuốc
                  </span>
                  <p className="font-medium">
                    T{medicine.medicineId.toString().padStart(4, "0")}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Danh mục
                  </span>
                  <p className="font-medium">{medicine.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Nhà sản xuất
                  </span>
                  <p className="font-medium">{medicine.manufactor}</p>
                </div>
              </div>
            </div>

            {medicine.insuranceDiscountPercent > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">
                  Thông tin bảo hiểm
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-600 dark:text-purple-400">
                      Tỷ lệ BHYT:
                    </span>
                    <span className="font-medium text-purple-800 dark:text-purple-300">
                      {(medicine.insuranceDiscountPercent * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-600 dark:text-purple-400">
                      Số tiền giảm:
                    </span>
                    <span className="font-medium text-purple-800 dark:text-purple-300">
                      {formatPrice(medicine.insuranceDiscount)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
