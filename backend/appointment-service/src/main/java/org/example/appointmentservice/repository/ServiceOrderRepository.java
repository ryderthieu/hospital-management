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

    @Query("SELECT MAX(s.number) FROM ServiceOrder s WHERE s.roomId = :roomId AND FUNCTION('DATE', s.orderTime) = :currentDate")
    Integer findMaxNumberByRoomIdAndDate(@Param("roomId") Integer roomId, @Param("currentDate") LocalDate currentDate);
}
