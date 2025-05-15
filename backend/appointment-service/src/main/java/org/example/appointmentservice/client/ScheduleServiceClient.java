package org.example.appointmentservice.client;

import org.example.appointmentservice.dto.ScheduleDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ScheduleServiceClient {
    private final RestTemplate restTemplate;

    public ScheduleServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ScheduleDto getScheduleById(Integer scheduleId) {
        String url = "http://doctor-service/doctors/schedules/"+scheduleId;
        return restTemplate.getForObject(url, ScheduleDto.class);
    }
}
