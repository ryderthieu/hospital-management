package org.example.userservice.client;

import org.example.userservice.dto.PatientDTO;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class PatientServiceClient {
    private final RestTemplate restTemplate;

    public PatientServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PatientDTO createPatient(PatientDTO patientDTO) {
        String url = "http://patient-service/patients";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<PatientDTO> request = new HttpEntity<>(patientDTO, headers);
            
            System.out.println("Gọi patient service với URL: " + url);
            System.out.println("PatientDTO: " + patientDTO);
            return restTemplate.postForObject(url, request, PatientDTO.class);
        } catch (Exception e) {
            System.out.println("Error calling patient service: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
} 