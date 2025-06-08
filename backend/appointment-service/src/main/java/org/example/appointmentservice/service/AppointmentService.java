package org.example.appointmentservice.service;

import org.example.appointmentservice.dto.AppointmentDto;

import java.util.List;

public interface AppointmentService {
    List<AppointmentDto> getAllAppointments();

    AppointmentDto getAppointmentById(Integer appointmentId);

    AppointmentDto createAppointment(AppointmentDto appointmentDto);

    AppointmentDto updateAppointment(Integer appointmentId, AppointmentDto appointmentDto);

    void deleteAppointment(Integer appointmentId);

    List<AppointmentDto> getAppointmentsByDoctorId(Integer doctorId);
}
