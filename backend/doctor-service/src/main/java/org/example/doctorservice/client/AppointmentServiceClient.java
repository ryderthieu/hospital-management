package org.example.doctorservice.client;

import org.example.doctorservice.dto.AppointmentDto;
import org.example.doctorservice.entity.Schedule;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
public class AppointmentServiceClient {
    private final RestTemplate restTemplate;

    public AppointmentServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<AppointmentDto> getAppointmentsByDoctorId(Integer doctorId) {
        String url = "http://appointment-service/appointments/doctor/"+doctorId;
        AppointmentDto[] appointments = restTemplate.getForObject(url, AppointmentDto[].class);
        return Arrays.asList(appointments);
    }
}
