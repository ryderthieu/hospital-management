package org.example.appointmentservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.appointmentservice.dto.ServiceOrderDto;
import org.example.appointmentservice.entity.Appointment;
import org.example.appointmentservice.entity.ServiceOrder;
import org.example.appointmentservice.entity.Services;
import org.example.appointmentservice.repository.AppointmentRepository;
import org.example.appointmentservice.repository.ServiceOrderRepository;
import org.example.appointmentservice.repository.ServicesRepository;
import org.example.appointmentservice.service.ServiceOrderService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceOrderServiceImpl implements ServiceOrderService {
    private final ServiceOrderRepository serviceOrderRepository;
    private final ServicesRepository servicesRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public List<ServiceOrderDto> getAllOrders(Integer serviceId){
        return serviceOrderRepository.findByService_ServiceId(serviceId)
                .stream()
                .map(ServiceOrderDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceOrderDto getOrderById(Integer serviceId, Integer orderId) {
        ServiceOrder serviceOrder = serviceOrderRepository.findByOrderIdAndService_ServiceId(orderId, serviceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt lịch hẹn với ID: " + orderId));

        return new ServiceOrderDto(serviceOrder);
    }

    @Override
    public ServiceOrderDto createOrder(Integer serviceId, ServiceOrderDto serviceOrderDto) {
        Services services = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ID của dịch vụ"));

        Appointment appointment = appointmentRepository.findById(serviceOrderDto.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));

        ServiceOrder serviceOrder = ServiceOrder.builder()
                .appointment(appointment)
                .roomId(serviceOrderDto.getRoomId())
                .service(services)
                .orderStatus(serviceOrderDto.getOrderStatus())
                .orderTime(serviceOrderDto.getOrderTime())
                .number(serviceOrderDto.getNumber())
                .resultTime(serviceOrderDto.getResultTime())
                .result(serviceOrderDto.getResult())
                .build();

        ServiceOrder savedOrder = serviceOrderRepository.save(serviceOrder);
        return new ServiceOrderDto(savedOrder);
    }

    @Override
    public ServiceOrderDto updateOrder(Integer serviceId,
                                       Integer orderId,
                                       ServiceOrderDto serviceOrderDto) {
        ServiceOrder serviceOrder = serviceOrderRepository.findByOrderIdAndService_ServiceId(orderId, serviceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt lịch hẹn với ID: " + orderId));

        if (serviceOrderDto.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(serviceOrderDto.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));
            serviceOrder.setAppointment(appointment);
        }

        serviceOrder.setRoomId(serviceOrderDto.getRoomId());
        serviceOrder.setOrderStatus(serviceOrderDto.getOrderStatus());
        serviceOrder.setOrderTime(serviceOrderDto.getOrderTime());
        serviceOrder.setNumber(serviceOrderDto.getNumber());
        serviceOrder.setResultTime(serviceOrderDto.getResultTime());
        serviceOrder.setResult(serviceOrderDto.getResult());

        ServiceOrder updatedOrder = serviceOrderRepository.save(serviceOrder);
        return new ServiceOrderDto(updatedOrder);
    }

    @Override
    public void deleteOrder(Integer serviceId, Integer orderId) {
        ServiceOrder serviceOrder = serviceOrderRepository.findByOrderIdAndService_ServiceId(orderId, serviceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt lịch hẹn với ID: " + orderId));

        serviceOrderRepository.delete(serviceOrder);
    }

    @Override
    public List<ServiceOrderDto> getOrdersByAppointmentId(Integer appointmentId) {
        return serviceOrderRepository.findByAppointment_AppointmentId(appointmentId)
                .stream()
                .map(ServiceOrderDto::new)
                .collect(Collectors.toList());
    }
}
