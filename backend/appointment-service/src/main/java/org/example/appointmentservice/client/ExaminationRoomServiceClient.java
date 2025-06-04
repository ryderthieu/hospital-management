package org.example.appointmentservice.client;

import org.example.appointmentservice.dto.ExaminationRoomDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ExaminationRoomServiceClient {
    private final RestTemplate restTemplate;

    public ExaminationRoomServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ExaminationRoomDto getRoomById(Integer roomId) {
        String url = "http://doctor-service/doctors/examination-rooms/"+roomId;
        return restTemplate.getForObject(url, ExaminationRoomDto.class);
    }
}
