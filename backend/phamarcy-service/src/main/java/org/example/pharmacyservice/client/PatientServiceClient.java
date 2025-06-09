package org.example.pharmacyservice.client;

import org.example.pharmacyservice.dto.PatientDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class PatientServiceClient {
    private final RestTemplate restTemplate;
    private static final String PATIENT_SERVICE_URL = "http://patient-service/patients";

    public PatientServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PatientDto getPatientById(Integer patientId) {
        String url = PATIENT_SERVICE_URL + "/" + patientId;
        return restTemplate.getForObject(url, PatientDto.class);
    }
} 