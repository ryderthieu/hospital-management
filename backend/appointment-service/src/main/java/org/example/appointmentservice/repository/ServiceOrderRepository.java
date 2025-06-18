package org.example.appointmentservice.repository;

import org.example.appointmentservice.entity.ServiceOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Integer> {
    List<ServiceOrder> findByService_ServiceId(Integer serviceId);

    Optional<ServiceOrder> findByOrderId(Integer orderId);
    
    List<ServiceOrder> findByAppointment_AppointmentId(Integer appointmentId);

    List<ServiceOrder> findByRoomId(Integer roomId);

    List<ServiceOrder> findByRoomIdAndOrderStatus(Integer roomId, org.example.appointmentservice.entity.ServiceOrder.OrderStatus status);

    List<ServiceOrder> findByRoomIdAndOrderTimeBetween(Integer roomId, java.time.LocalDateTime from, java.time.LocalDateTime to);

    List<ServiceOrder> findByRoomIdAndOrderStatusAndOrderTimeBetween(Integer roomId, org.example.appointmentservice.entity.ServiceOrder.OrderStatus status, java.time.LocalDateTime from, java.time.LocalDateTime to);

    @Query("SELECT MAX(s.number) FROM ServiceOrder s WHERE s.roomId = :roomId AND FUNCTION('DATE', s.orderTime) = :currentDate")
    Integer findMaxNumberByRoomIdAndDate(@Param("roomId") Integer roomId, @Param("currentDate") LocalDate currentDate);

    @Query("SELECT s FROM ServiceOrder s WHERE s.roomId = :roomId "
         + "AND (:status IS NULL OR s.orderStatus = :status) "
         + "AND (:orderDate IS NULL OR FUNCTION('DATE', s.orderTime) = :orderDate)")
    List<ServiceOrder> findByRoomIdAndStatusAndOrderDate(
        @Param("roomId") Integer roomId,
        @Param("status") org.example.appointmentservice.entity.ServiceOrder.OrderStatus status,
        @Param("orderDate") java.time.LocalDate orderDate
    );
}
