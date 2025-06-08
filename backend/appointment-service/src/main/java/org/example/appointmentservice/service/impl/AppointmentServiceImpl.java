package org.example.appointmentservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.appointmentservice.client.PatientServiceClient;
import org.example.appointmentservice.client.ScheduleServiceClient;
import org.example.appointmentservice.dto.AppointmentDto;
import org.example.appointmentservice.dto.AppointmentNoteDto;
import org.example.appointmentservice.dto.PatientDto;
import org.example.appointmentservice.dto.ScheduleDto;
import org.example.appointmentservice.entity.Appointment;
import org.example.appointmentservice.repository.AppointmentRepository;
import org.example.appointmentservice.service.AppointmentService;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentServiceImpl implements AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientServiceClient patientServiceClient;
    private final ScheduleServiceClient scheduleServiceClient;

    @Override
    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(AppointmentDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentDto getAppointmentById(Integer appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn với ID: " + appointmentId));

        return new AppointmentDto(appointment);
    }

    @Override
    public AppointmentDto createAppointment(AppointmentDto appointmentDto) {
        Appointment appointment = Appointment.builder()
                .doctorId(appointmentDto.getDoctorId())
                .patientId(appointmentDto.getPatientId())
                .scheduleId(appointmentDto.getScheduleId())
                .symptoms(appointmentDto.getSymptoms())
                .number(appointmentDto.getNumber())
                .appointmentStatus(appointmentDto.getAppointmentStatus())
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return new AppointmentDto(savedAppointment);
    }

    @Override
    public AppointmentDto updateAppointment(Integer appointmentId, AppointmentDto appointmentDto) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn với ID: " + appointmentId));

        appointment.setDoctorId(appointmentDto.getDoctorId());
        appointment.setPatientId(appointmentDto.getPatientId());
        appointment.setScheduleId(appointmentDto.getScheduleId());
        appointment.setSymptoms(appointmentDto.getSymptoms());
        appointment.setNumber(appointmentDto.getNumber());
        appointment.setAppointmentStatus(appointmentDto.getAppointmentStatus());

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return new AppointmentDto(updatedAppointment);
    }

    @Override
    public void deleteAppointment(Integer appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn với ID: " + appointmentId));

        appointmentRepository.delete(appointment);
    }

    @Override
    public List<AppointmentDto> getAppointmentsByDoctorId(Integer doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        if (appointments.isEmpty()) {
            return Collections.emptyList();
        }
        return appointments.stream()
                .map(this::enrichAppointmentWithInfo)
                .sorted(Comparator.comparing(AppointmentDto::getScheduleId))
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getTodayAppointmentsByDoctorId(Integer doctorId) {
        log.info("Lấy danh sách cuộc hẹn trong ngày của bác sĩ ID: {}", doctorId);
        
        LocalDate today = LocalDate.now();
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndDate(doctorId, today);
        
        if (appointments.isEmpty()) {
            log.info("Không có cuộc hẹn nào trong ngày {} cho bác sĩ ID: {}", today, doctorId);
            return Collections.emptyList();
        }

        return appointments.stream()
                .map(this::enrichAppointmentWithInfo)
                .sorted(Comparator.comparing(AppointmentDto::getNumber))
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getAppointmentsByDoctorIdAndDate(Integer doctorId, LocalDate date) {
        log.info("Lấy danh sách cuộc hẹn của bác sĩ ID: {} vào ngày: {}", doctorId, date);
        
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndDate(doctorId, date);
        if (appointments.isEmpty()) {
            log.info("Không tìm thấy cuộc hẹn nào cho bác sĩ ID: {} vào ngày: {}", doctorId, date);
            return Collections.emptyList();
        }

        return appointments.stream()
                .map(this::enrichAppointmentWithInfo)
                .sorted(Comparator.comparing(AppointmentDto::getScheduleId))
                .collect(Collectors.toList());
    }

    private AppointmentDto enrichAppointmentWithInfo(Appointment appointment) {
        AppointmentDto.AppointmentDtoBuilder builder = AppointmentDto.builder()
                .appointmentId(appointment.getAppointmentId())
                .doctorId(appointment.getDoctorId())
                .patientId(appointment.getPatientId())
                .scheduleId(appointment.getScheduleId())
                .symptoms(appointment.getSymptoms())
                .number(appointment.getNumber())
                .appointmentStatus(appointment.getAppointmentStatus())
                .createdAt(appointment.getCreatedAt());

        // Lấy thông tin bệnh nhân
        try {
            PatientDto patientInfo = patientServiceClient.getPatientById(appointment.getPatientId());
            if (patientInfo != null) {
                builder.patientInfo(patientInfo);
            }
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin bệnh nhân ID: {}", appointment.getPatientId(), e);
        }

        // Lấy thông tin lịch khám
        try {
            ScheduleDto scheduleInfo = scheduleServiceClient.getScheduleById(appointment.getScheduleId());
            if (scheduleInfo != null) {
                if (scheduleInfo.getWorkDate() != null) {
                    builder.appointmentDate(scheduleInfo.getWorkDate());
                }
                if (scheduleInfo.getStartTime() != null) {
                    builder.appointmentTime(scheduleInfo.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")));
                }
            } else {
                log.warn("Không tìm thấy thông tin lịch khám ID: {}", appointment.getScheduleId());
            }
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin lịch khám ID: {}", appointment.getScheduleId(), e);
        }

        // Lấy thông tin ghi chú nếu có
        if (appointment.getAppointmentNotes() != null && !appointment.getAppointmentNotes().isEmpty()) {
            List<AppointmentNoteDto> notes = appointment.getAppointmentNotes().stream()
                    .map(AppointmentNoteDto::new)
                    .collect(Collectors.toList());
            builder.appointmentNotes(notes);
        }

        return builder.build();
    }
}
