package org.example.appointmentservice.client;

import org.example.appointmentservice.dto.DoctorDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class DoctorServiceClient {
    private final RestTemplate restTemplate;

    public DoctorServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public DoctorDto getDoctorById(Integer doctorId) {
        String url = "http://doctor-service/doctors/"+doctorId;
        return restTemplate.getForObject(url, DoctorDto.class);
    }
}
