package org.example.appointmentservice.client;

import org.example.appointmentservice.dto.DoctorDto;
import org.example.appointmentservice.dto.ExaminationRoomDto;
import org.example.appointmentservice.dto.ScheduleDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

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

    public ScheduleDto[] getSchedulesByDoctor(Integer doctorId, String shift, String workDate, Integer roomId) {
        StringBuilder url = new StringBuilder("http://doctor-service/doctors/" + doctorId + "/schedules?");
        boolean hasParam = false;
        if (shift != null) {
            url.append("shift=").append(shift);
            hasParam = true;
        }
        if (workDate != null) {
            if (hasParam) url.append("&");
            url.append("workDate=").append(workDate);
            hasParam = true;
        }
        if (roomId != null) {
            if (hasParam) url.append("&");
            url.append("roomId=").append(roomId);
        }
        return restTemplate.getForObject(url.toString(), ScheduleDto[].class);
    }

    public ScheduleDto[] getSchedulesByIds(List<Integer> scheduleIds) {
        String url = "http://doctor-service/doctors/schedules/batch";
        return restTemplate.postForObject(url, scheduleIds, ScheduleDto[].class);
    }
}
