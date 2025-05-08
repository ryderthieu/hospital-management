package org.example.paymentservice.client;

import org.example.paymentservice.dto.ServiceDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AppointmentServiceClient {
    private final RestTemplate restTemplate;

    public AppointmentServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ServiceDTO getServiceById(Long serviceId) {
        String url = "http://pharmacy-service/pharmacy/services/"+serviceId;
        return restTemplate.getForObject(url, ServiceDTO.class);
    }
}
