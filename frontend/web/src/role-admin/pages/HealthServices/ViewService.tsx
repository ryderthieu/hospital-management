"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appointmentService } from "../../services/appointmentService";
import type { Service } from "../../types/appointment";
import PageMeta from "../../components/common/PageMeta";
import { ArrowLeft, Edit, HeartPulse } from "lucide-react";
import { format } from "date-fns";
import type { ServiceOrder } from "../../types/appointment";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

export default function ViewService() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (id) {
      loadService(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (service?.serviceId) {
      fetchOrders(service.serviceId);
    }
  }, [service?.serviceId]);

  const loadService = async (serviceId: number) => {
    try {
      setLoading(true);
      const data = await appointmentService.getServiceById(serviceId);
      setService(data);
    } catch (error) {
      console.error("Error loading service:", error);
      alert("Không thể tải thông tin dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (serviceId: number) => {
    setLoadingOrders(true);
    try {
      const data = await appointmentService.getAllOrders(serviceId);
      setOrders(data);
    } catch (error) {
      console.error("Không thể tải đơn đặt dịch vụ:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case "TEST":
        return "Xét nghiệm";
      case "IMAGING":
        return "Chẩn đoán hình ảnh";
      case "CONSULTATION":
        return "Khám tư vấn";
      case "OTHER":
        return "Khác";
      default:
        return type;
    }
  };

  if (loading) {
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
        title={`${service.serviceName} | Admin Dashboard`}
        description="Chi tiết thông tin dịch vụ"
      />

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Chi tiết dịch vụ
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate(`/admin/health-services/edit/${service.serviceId}`)
            }
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </button>
          <button
            onClick={() => navigate("/admin/health-services")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin cơ bản */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <HeartPulse className="h-10 w-10 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
                  {service.serviceName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Mã dịch vụ: S{service.serviceId.toString().padStart(4, "0")}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-2">
                Thông tin giá
              </h4>
              <div className="space-y-2">
                <div className="flex gap-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    Giá dịch vụ:
                  </span>
                  <span className="font-medium">
                    {formatPrice(service.price)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-2">
                Mô tả dịch vụ
              </h4>
              <div className="space-y-2">
                <div className="flex gap-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    Loại dịch vụ:
                  </span>
                  <span className="font-medium">
                    {getServiceTypeLabel(service.serviceType)}
                  </span>
                </div>
              </div>
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
                    Mã dịch vụ
                  </span>
                  <p className="font-medium">
                    S{service.serviceId.toString().padStart(4, "0")}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Ngày tạo dịch vụ
                  </span>
                  <p className="font-medium">
                    {service.createdAt &&
                    !isNaN(new Date(service.createdAt).getTime())
                      ? format(new Date(service.createdAt), "dd-MM-yyyy")
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Tables */}
        <div className="mt-10">
          <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">
            Danh sách đơn đặt dịch vụ
          </h4>
          {loadingOrders ? (
            <div className="text-gray-500">Đang tải...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-500">Chưa có đơn đặt dịch vụ nào.</div>
          ) : (
            <Table>
              {/* Table Header */}
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Mã đơn
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Mã lịch hẹn
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Ngày tạo
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Trạng thái
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Số thứ tự
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Thời gian đặt
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Kết quả
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Thời gian trả kết quả
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      DH{order.orderId.toString().padStart(4, "0")}
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        LH{order.appointmentId.toString().padStart(4, "0")}
                      </p>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.createdAt &&
                      !isNaN(new Date(order.createdAt).getTime())
                        ? format(new Date(order.createdAt), "dd-MM-yyyy")
                        : ""}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.orderStatus === "ORDERED"
                        ? "Đã đặt"
                        : order.orderStatus === "COMPLETED"
                        ? "Đã hoàn thành"
                        : "Chưa xác định"}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.number}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.orderTime &&
                      !isNaN(new Date(order.orderTime).getTime())
                        ? format(new Date(order.orderTime), "dd-MM-yyyy")
                        : ""}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.result}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {order.resultTime &&
                      !isNaN(new Date(order.resultTime).getTime())
                        ? format(new Date(order.resultTime), "dd-MM-yyyy")
                        : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
