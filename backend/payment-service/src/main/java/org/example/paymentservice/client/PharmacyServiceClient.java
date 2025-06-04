package org.example.paymentservice.client;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.paymentservice.dto.MedicineDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class PharmacyServiceClient {
    private final RestTemplate restTemplate;

    public PharmacyServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public MedicineDTO getMedicineById(Long medicineId) {
        String url = "http://pharmacy-service/pharmacy/medicines/"+medicineId;
        System.out.println(restTemplate.getForObject(url, MedicineDTO.class));
        return restTemplate.getForObject(url, MedicineDTO.class);
    }
}
