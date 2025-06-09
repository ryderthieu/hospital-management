package org.example.pharmacyservice.client;

import org.example.pharmacyservice.dto.DoctorDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class DoctorServiceClient {
    private final RestTemplate restTemplate;
    private static final String DOCTOR_SERVICE_URL = "http://doctor-service/doctors";

    public DoctorServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public DoctorDto getDoctorById(Long doctorId) {
        String url = DOCTOR_SERVICE_URL + "/" + doctorId;
        return restTemplate.getForObject(url, DoctorDto.class);
    }
} 