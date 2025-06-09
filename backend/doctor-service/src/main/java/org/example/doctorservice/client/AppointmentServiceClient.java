package org.example.doctorservice.client;

import org.example.doctorservice.dto.AppointmentDto;
import org.example.doctorservice.dto.TimeSlotDto;
import org.example.doctorservice.entity.Schedule;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public List<TimeSlotDto> getTimeSlotsByScheduleId(Integer scheduleId, Schedule schedule) {
        String url = "http://appointment-service/appointments/schedule/"+scheduleId + "/available-slots";
        
        Map<String, Object> scheduleTime = new HashMap<>();
        scheduleTime.put("startTime", schedule.getStartTime());
        scheduleTime.put("endTime", schedule.getEndTime());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(scheduleTime, headers);
        TimeSlotDto[] timeSlots = restTemplate.postForObject(url, scheduleTime, TimeSlotDto[].class);
        return Arrays.asList(timeSlots);
    }
}
