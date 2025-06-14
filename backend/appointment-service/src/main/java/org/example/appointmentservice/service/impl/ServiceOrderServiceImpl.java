package org.example.appointmentservice.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceOrderServiceImpl implements ServiceOrderService {
    private final ServiceOrderRepository serviceOrderRepository;
    private final ServicesRepository servicesRepository;
    private final AppointmentRepository appointmentRepository;
    private final Cloudinary cloudinary;

    @Override
    public List<ServiceOrderDto> getAllOrders() {
        return serviceOrderRepository.findAll()
                .stream()
                .map(ServiceOrderDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceOrderDto getOrderById(Integer orderId) {
        ServiceOrder serviceOrder = serviceOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt lịch hẹn với ID: " + orderId));

        return new ServiceOrderDto(serviceOrder);
    }

    @Override
    public ServiceOrderDto createOrder(ServiceOrderDto serviceOrderDto) {
        Services services = servicesRepository.findById(serviceOrderDto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ID của dịch vụ"));

        Appointment appointment = appointmentRepository.findById(serviceOrderDto.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));

        Integer maxNumber = serviceOrderRepository.findMaxNumberByRoomIdAndDate(
            serviceOrderDto.getRoomId(), 
            LocalDate.now()
        );
        Integer nextNumber = (maxNumber == null) ? 1 : maxNumber + 1;

        ServiceOrder serviceOrder = ServiceOrder.builder()
                .appointment(appointment)
                .roomId(serviceOrderDto.getRoomId())
                .service(services)
                .orderStatus(ServiceOrder.OrderStatus.ORDERED)
                .orderTime(LocalDateTime.now())
                .number(nextNumber)
                .resultTime(serviceOrderDto.getResultTime())
                .result(serviceOrderDto.getResult())
                .build();

        ServiceOrder savedOrder = serviceOrderRepository.save(serviceOrder);
        return new ServiceOrderDto(savedOrder);
    }

    @Override
    public ServiceOrderDto updateOrder(Integer orderId, ServiceOrderDto serviceOrderDto) {
        ServiceOrder serviceOrder = serviceOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt lịch hẹn với ID: " + orderId));

        if (serviceOrderDto.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(serviceOrderDto.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));
            serviceOrder.setAppointment(appointment);
        }

        if (serviceOrderDto.getServiceId() != null) {
            Services services = servicesRepository.findById(serviceOrderDto.getServiceId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy ID của dịch vụ"));
            serviceOrder.setService(services);
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
    public void deleteOrder(Integer orderId) {
        ServiceOrder serviceOrder = serviceOrderRepository.findById(orderId)
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

    @Override
    public List<ServiceOrderDto> getOrdersByRoomId(Integer roomId) {
        return serviceOrderRepository.findByRoomId(roomId)
                .stream()
                .map(ServiceOrderDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceOrderDto uploadTestResult(Integer orderId, MultipartFile file) {
        // Kiểm tra service order tồn tại
        ServiceOrder serviceOrder = serviceOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt lịch hẹn với ID: " + orderId));

        // Kiểm tra file có phải là PDF không
        if (!file.getContentType().equals("application/pdf")) {
            throw new RuntimeException("Chỉ chấp nhận file PDF");
        }

        try {
            // Tạo tên file duy nhất có đuôi .pdf
            String fileName = String.format("%d_%s_%s",
                    serviceOrder.getOrderId(),
                    serviceOrder.getRoomId(),
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")));

            // Cấu hình upload lên Cloudinary
            Map<String, Object> uploadParams = new HashMap<>();
            uploadParams.put("resource_type", "raw");
            uploadParams.put("public_id", "test-results/" + fileName);
            uploadParams.put("overwrite", true);

            // Upload file lên Cloudinary
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            String fileUrl = (String) uploadResult.get("secure_url");

            // Cập nhật thông tin trong database
            serviceOrder.setResult(fileUrl);
            serviceOrder.setResultTime(LocalDateTime.now());
            serviceOrder.setOrderStatus(ServiceOrder.OrderStatus.COMPLETED);

            ServiceOrder savedOrder = serviceOrderRepository.save(serviceOrder);
            return new ServiceOrderDto(savedOrder);

        } catch (IOException e) {
            throw new RuntimeException("Không thể upload file: " + e.getMessage());
        }
    }
}
