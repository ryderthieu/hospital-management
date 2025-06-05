package org.example.appointmentservice.service;

import org.example.appointmentservice.dto.ServicesDto;

import java.util.List;

public interface ServicesService {
    List<ServicesDto> getAllServices();

    ServicesDto getServiceById(Integer serviceId);

    ServicesDto createService(ServicesDto servicesDto);

    ServicesDto updateService(Integer serviceId, ServicesDto servicesDto);

    void deleteService(Integer serviceId);
}
