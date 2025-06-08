package org.example.doctorservice.client;

import org.example.doctorservice.dto.PatientDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class PatientServiceClient {
    private final RestTemplate restTemplate;

    public PatientServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PatientDto getPatientById(Integer patientId) {
        String url = "http://patient-service/patients/"+patientId;
        return restTemplate.getForObject(url, PatientDto.class);
    }
}
