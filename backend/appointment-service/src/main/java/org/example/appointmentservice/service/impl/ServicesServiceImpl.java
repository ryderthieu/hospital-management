package org.example.appointmentservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.appointmentservice.dto.ServicesDto;
import org.example.appointmentservice.entity.Services;
import org.example.appointmentservice.repository.ServicesRepository;
import org.example.appointmentservice.service.ServicesService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicesServiceImpl implements ServicesService {
    private final ServicesRepository servicesRepository;

    @Override
    public List<ServicesDto> getAllServices() {
        return servicesRepository.findAll()
                .stream()
                .map(ServicesDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public ServicesDto getServiceById(Integer serviceId) {
        Services services = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + serviceId));

        return new ServicesDto(services);
    }

    @Override
    public ServicesDto createService(ServicesDto servicesDto) {
        Services services = Services.builder()
                .serviceName(servicesDto.getServiceName())
                .serviceType(servicesDto.getServiceType())
                .price(servicesDto.getPrice())
                .build();

        Services savedServices = servicesRepository.save(services);
        return new ServicesDto(savedServices);
    }

    @Override
    public ServicesDto updateService(Integer serviceId, ServicesDto servicesDto) {
        Services services = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + serviceId));

        services.setServiceName(servicesDto.getServiceName());
        services.setServiceType(servicesDto.getServiceType());
        services.setPrice(servicesDto.getPrice());

        Services updatedServices = servicesRepository.save(services);
        return new ServicesDto(updatedServices);
    }

    @Override
    public void deleteService(Integer serviceId) {
        Services services = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + serviceId));

        servicesRepository.delete(services);
    }
}
