package org.example.appointmentservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.appointmentservice.dto.AppointmentDto;
import org.example.appointmentservice.entity.Appointment;
import org.example.appointmentservice.repository.AppointmentRepository;
import org.example.appointmentservice.service.AppointmentService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {
    private final AppointmentRepository appointmentRepository;

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
            throw new RuntimeException("Không tìm thấy cuộc hẹn nào với bác sĩ có ID: " + doctorId);
        }
        return appointments.stream()
                .map(AppointmentDto::new)
                .collect(Collectors.toList());
    }

}
