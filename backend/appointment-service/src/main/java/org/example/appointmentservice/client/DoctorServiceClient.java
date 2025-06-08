package org.example.appointmentservice.client;

import org.example.appointmentservice.dto.DoctorDto;
import org.example.appointmentservice.dto.ExaminationRoomDto;
import org.example.appointmentservice.dto.ScheduleDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class DoctorServiceClient {
    private final RestTemplate restTemplate;

    public DoctorServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public DoctorDto getDoctorById(Integer doctorId) {
        String url = "http://doctor-service/doctors/"+doctorId;
        return restTemplate.getForObject(url, DoctorDto.class);
    }

    public ScheduleDto getScheduleById(Integer scheduleId) {
        String url = "http://doctor-service/doctors/schedules/"+scheduleId;
        return restTemplate.getForObject(url, ScheduleDto.class);
    }

    public ExaminationRoomDto getExaminationRoomById(Integer examinationRoomId) {
        String url = "http://doctor-service/doctors/examination-rooms/"+examinationRoomId;
        return restTemplate.getForObject(url, ExaminationRoomDto.class);
    }
}
