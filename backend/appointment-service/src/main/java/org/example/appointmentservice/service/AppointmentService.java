package org.example.appointmentservice.service;

import org.example.appointmentservice.dto.AppointmentDto;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    List<AppointmentDto> getAllAppointments();

    AppointmentDto getAppointmentById(Integer appointmentId);

    AppointmentDto createAppointment(AppointmentDto appointmentDto);

    AppointmentDto updateAppointment(Integer appointmentId, AppointmentDto appointmentDto);

    void deleteAppointment(Integer appointmentId);

    List<AppointmentDto> getAppointmentsByDoctorId(Integer doctorId);

    List<AppointmentDto> getAppointmentsByDoctorIdAndDate(Integer doctorId, LocalDate date);

    List<AppointmentDto> getTodayAppointmentsByDoctorId(Integer doctorId);
}
