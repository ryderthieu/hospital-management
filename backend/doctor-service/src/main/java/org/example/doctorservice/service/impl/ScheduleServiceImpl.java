package org.example.doctorservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.doctorservice.dto.ScheduleDto;
import org.example.doctorservice.entity.Department;
import org.example.doctorservice.entity.Doctor;
import org.example.doctorservice.entity.ExaminationRoom;
import org.example.doctorservice.entity.Schedule;
import org.example.doctorservice.repository.DoctorRepository;
import org.example.doctorservice.repository.ExaminationRoomRepository;
import org.example.doctorservice.repository.ScheduleRepository;
import org.example.doctorservice.service.ScheduleService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DoctorRepository doctorRepository;
    private final ExaminationRoomRepository examinationRoomRepository;

    @Override
    public List<ScheduleDto> getAllSchedules(Integer doctorId) {
        return scheduleRepository
                .findByDoctor_DoctorId(doctorId)
                .stream()
                .map(ScheduleDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public ScheduleDto getScheduleById(Integer scheduleId, Integer doctorId) {
        Schedule schedule = scheduleRepository.findByScheduleIdAndDoctor_DoctorId(scheduleId, doctorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch với ID: " + scheduleId));
        return new ScheduleDto(schedule);
    }

    @Override
    public ScheduleDto createSchedule(Integer doctorId, ScheduleDto scheduleDto) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Bác sĩ không được tìm thấy"));
        ExaminationRoom examinationRoom = examinationRoomRepository.findById(scheduleDto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Phòng không được tìm thấy"));
        Schedule schedule = Schedule.builder()
                .doctor(doctor)
                .workDate(scheduleDto.getWorkDate())
                .startTime(scheduleDto.getStartTime())
                .endTime(scheduleDto.getEndTime())
                .shift(scheduleDto.getShift())
                .examinationRoom(examinationRoom)
                .build();

        Schedule savedSchedule = scheduleRepository.save(schedule);
        return new ScheduleDto(savedSchedule);
    }

    @Override
    public ScheduleDto updateSchedule(Integer doctorId, Integer scheduleId, ScheduleDto scheduleDto) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch với ID: " + scheduleId));

        if (scheduleDto.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Bác sĩ không được tìm thấy"));
            schedule.setDoctor(doctor);
        }

        if (scheduleDto.getRoomId() != null) {
            ExaminationRoom examinationRoom = examinationRoomRepository.findById(scheduleDto.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Phòng không được tìm thấy"));
            schedule.setExaminationRoom(examinationRoom);
        }

        schedule.setWorkDate(scheduleDto.getWorkDate());
        schedule.setStartTime(scheduleDto.getStartTime());
        schedule.setEndTime(scheduleDto.getEndTime());
        schedule.setShift(scheduleDto.getShift());

        Schedule updatedSchedule = scheduleRepository.save(schedule);
        return new ScheduleDto(updatedSchedule);
    }

    @Override
    public void deleteSchedule(Integer doctorId, Integer scheduleId) {
        Schedule schedule = scheduleRepository.findByScheduleIdAndDoctor_DoctorId(scheduleId, doctorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch của bác sĩ với ID: " + scheduleId));

        scheduleRepository.delete(schedule);
    }

    @Override
    public List<ScheduleDto> getAllSchedulesForAdmin() {
        return scheduleRepository.findAll()
                .stream()
                .map(ScheduleDto::new)
                .collect(Collectors.toList());
    }
}