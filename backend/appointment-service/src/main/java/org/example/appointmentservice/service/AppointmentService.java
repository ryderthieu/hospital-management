package org.example.appointmentservice.service;

import org.example.appointmentservice.dto.AppointmentDtos;
import org.example.appointmentservice.entity.Appointment;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    List<AppointmentDtos.AppointmentResponse> getAllAppointments();

    AppointmentDtos.AppointmentResponse getAppointmentById(Integer appointmentId);

    AppointmentDtos.AppointmentResponse createAppointment(AppointmentDtos.AppointmentRequest appointmentRequest);

    AppointmentDtos.AppointmentResponse updateAppointment(Integer appointmentId, AppointmentDtos.AppointmentUpdateRequest appointmentRequest);

    void deleteAppointment(Integer appointmentId);

    List<AppointmentDtos.AppointmentResponse> getAppointmentsByDoctorId(Integer doctorId);

    List<AppointmentDtos.AppointmentResponse> getAppointmentsByDoctorIdAndDate(Integer doctorId, LocalDate date);

    List<AppointmentDtos.AppointmentResponse> getTodayAppointmentsByDoctorId(Integer doctorId);

    List<AppointmentDtos.AvailableTimeSlotResponse> getAvailableTimeSlots(Integer scheduleId);

    List<AppointmentDtos.AppointmentResponse> getAppointmentsByScheduleId(Integer scheduleId);
}
