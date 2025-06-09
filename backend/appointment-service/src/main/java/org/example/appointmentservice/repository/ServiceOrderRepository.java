package org.example.appointmentservice.repository;

import org.example.appointmentservice.entity.ServiceOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Integer> {
    List<ServiceOrder> findByService_ServiceId(Integer serviceId);

    Optional<ServiceOrder> findByOrderIdAndService_ServiceId(Integer orderId, Integer serviceId);
    
    List<ServiceOrder> findByAppointment_AppointmentId(Integer appointmentId);
}
