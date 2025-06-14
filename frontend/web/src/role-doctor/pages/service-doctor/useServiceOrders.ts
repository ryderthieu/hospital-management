import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import type { ServiceOrder } from "../../types/serviceOrder";
import type { Services } from "../../types/services";
import type { ExaminationRoom } from "../../types/examinationRoom"; // Thêm import này
import { servicesService } from "../../services/servicesServices";
import { getServiceOrdersByRoomId } from "../../services/serviceOrderServices";
import { appointmentService } from "../../services/appointmentServices"; // Thêm import này
import { examinationRoomService } from "../../services/examinationRoomServices"; // Thêm import này

export interface ServiceOrderFilters {
  status?: string;
  searchTerm?: string;
  serviceType?: string;
}

export const useServiceOrders = (roomId: number) => {
  const [serviceOrdersTable, setServiceOrdersTable] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ServiceOrderFilters>({});

  // Tách riêng logic fetch services và cache kết quả
  const [services, setServices] = useState<Services[]>([]);
  const [serviceMap, setServiceMap] = useState<Map<number, string>>(new Map());
  
  // Thêm state cho related data
  const [appointmentsData, setAppointmentsData] = useState<{ [key: number]: any }>({});
  const [roomsData, setRoomsData] = useState<{ [key: number]: ExaminationRoom }>({});

  const fetchServices = useCallback(async () => {
    try {
      const data = await servicesService.getAllServices();
      console.log("danh sach service", data);
      setServices(data || []);

      // Tạo map để tra cứu nhanh
      const map = new Map();
      (data || []).forEach((service) => {
        map.set(service.serviceId, service.serviceName);
      });
      setServiceMap(map);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  }, []);

  // Gọi fetchServices một lần khi component mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const fetchServiceOrdersTable = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getServiceOrdersByRoomId(roomId);

      if (!data || data.length === 0) {
        setServiceOrdersTable([]);
        setAppointmentsData({});
        setRoomsData({});
        return;
      }

      // Sử dụng serviceMap đã có sẵn để enrich service orders
      const enrichedServiceOrders = data.map((order) => ({
        ...order,
        serviceName: serviceMap.get(order.serviceId) || "Không xác định",
      }));

      // Fetch appointments data
      const appointmentPromises = enrichedServiceOrders.map(async (order) => {
        try {
          const appointment = await appointmentService.getAppointmentById(order.appointmentId);
          return { appointmentId: order.appointmentId, data: appointment };
        } catch (error) {
          console.error(`Error fetching appointment ${order.appointmentId}:`, error);
          return { appointmentId: order.appointmentId, data: null };
        }
      });

      // Fetch rooms data
      const uniqueRoomIds = [...new Set(enrichedServiceOrders.map((order) => order.roomId))];
      const roomPromises = uniqueRoomIds.map(async (roomId) => {
        try {
          const room = await examinationRoomService.getExaminationRoomById(roomId);
          return { roomId, data: room };
        } catch (error) {
          console.error(`Error fetching room ${roomId}:`, error);
          return { roomId, data: null };
        }
      });

      // Chờ tất cả promises hoàn thành
      const [appointmentResults, roomResults] = await Promise.all([
        Promise.all(appointmentPromises),
        Promise.all(roomPromises),
      ]);

      // Tạo appointments map
      const appointmentsMap = appointmentResults.reduce(
        (acc, result) => {
          acc[result.appointmentId] = result.data;
          return acc;
        },
        {} as { [key: number]: any }
      );

      // Tạo rooms map
      const roomsMap = roomResults.reduce(
        (acc, result) => {
          if (result.data) {
            acc[result.roomId] = result.data;
          }
          return acc;
        },
        {} as { [key: number]: ExaminationRoom }
      );

      // Cập nhật tất cả state
      setServiceOrdersTable(enrichedServiceOrders);
      setAppointmentsData(appointmentsMap);
      setRoomsData(roomsMap);
      
      console.log("danh sach service da ghep", enrichedServiceOrders);
      console.log("appointments data", appointmentsMap);
      console.log("rooms data", roomsMap);

    } catch (err) {
      console.error("Error fetching service orders:", err);
      setError("Không thể tải danh sách xét nghiệm");
      message.error("Không thể tải danh sách xét nghiệm");
    } finally {
      setLoading(false);
    }
  }, [roomId, serviceMap]);

  const updateFilters = useCallback(
    (newFilters: Partial<ServiceOrderFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const refreshServiceOrders = useCallback(() => {
    fetchServiceOrdersTable();
  }, [fetchServiceOrdersTable]);

  // Filter service orders based on current filters
  // const filteredServiceOrders = serviceOrdersTable.filter((order) => {
  //   if (
  //     filters.status &&
  //     filters.status !== "all" &&
  //     order.orderStatus !== filters.status
  //   ) {
  //     return false;
  //   }

  //   if (
  //     filters.serviceType &&
  //     filters.serviceType !== "all" &&
  //     order.service?.serviceType !== filters.serviceType
  //   ) {
  //     return false;
  //   }

  //   if (filters.searchTerm) {
  //     const searchLower = filters.searchTerm.toLowerCase();
  //     // You would need to add patient info to ServiceOrder type or fetch it separately
  //     // For now, searching by service name and order ID
  //     return (
  //       order.service?.serviceName?.toLowerCase().includes(searchLower) ||
  //       order.orderId.toString().includes(searchLower)
  //     );
  //   }

  //   return true;
  // });

  const filteredServiceOrders = serviceOrdersTable.filter((order) => {
  if (
    filters.status &&
    filters.status !== "all" &&
    order.orderStatus !== filters.status
  ) {
    return false;
  }

  if (
    filters.serviceType &&
    filters.serviceType !== "all" &&
    order.service?.serviceType !== filters.serviceType
  ) {
    return false;
  }

  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    
    // Lấy thông tin appointment để tìm tên bệnh nhân
    const appointment = appointmentsData[order.appointmentId];
    const patientName = appointment?.patientInfo?.fullName || "";
    
    return (
      // Tìm theo tên dịch vụ
      order.serviceName?.toLowerCase().includes(searchLower) ||
      // Tìm theo mã đơn hàng
      order.orderId.toString().includes(searchLower) ||
      // Tìm theo tên bệnh nhân
      patientName.toLowerCase().includes(searchLower) 
    );
  }

  return true;
});

  const stats = {
    total: serviceOrdersTable.length,
    ordered: serviceOrdersTable.filter((order) => order.orderStatus === "ORDERED")
      .length,
    completed: serviceOrdersTable.filter(
      (order) => order.orderStatus === "COMPLETED"
    ).length,
  };

  // Chỉ gọi fetchServiceOrdersTable khi serviceMap đã được load
  useEffect(() => {
    if (serviceMap.size > 0) {
      fetchServiceOrdersTable();
    }
  }, [fetchServiceOrdersTable, serviceMap]);

  return {
    serviceOrdersTable: filteredServiceOrders,
    allServiceOrdersTable: serviceOrdersTable,
    appointmentsData,
    roomsData,
    loading,
    error,
    stats,
    filters,
    updateFilters,
    clearFilters,
    refreshServiceOrders,
  };
};