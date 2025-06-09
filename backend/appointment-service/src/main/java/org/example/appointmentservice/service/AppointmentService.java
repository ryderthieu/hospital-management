package org.example.appointmentservice.service;

import org.example.appointmentservice.dto.AppointmentDtos;
import org.example.appointmentservice.dto.AppointmentResponseTypes;
import org.example.appointmentservice.entity.Appointment;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    List<AppointmentDtos.AppointmentResponse> getAllAppointments();

    AppointmentDtos.AppointmentResponse getAppointmentById(Integer appointmentId);

    AppointmentDtos.AppointmentResponse createAppointment(AppointmentDtos.AppointmentRequest request);

    AppointmentDtos.AppointmentResponse updateAppointment(Integer appointmentId, AppointmentDtos.AppointmentUpdateRequest request);

    void deleteAppointment(Integer appointmentId);

    List<AppointmentResponseTypes.DoctorViewResponse> getAppointmentsByDoctorIdOptimized(Integer doctorId);

    List<AppointmentResponseTypes.PatientViewResponse> getAppointmentsByPatientIdOptimized(Integer patientId);

    List<AppointmentDtos.AppointmentResponse> getAppointmentsByDoctorId(Integer doctorId);

    List<AppointmentDtos.AppointmentResponse> getAppointmentsByDoctorIdAndDate(Integer doctorId, LocalDate date);

    List<AppointmentDtos.AppointmentResponse> getTodayAppointmentsByDoctorId(Integer doctorId);

    List<AppointmentDtos.AvailableTimeSlotResponse> getAvailableTimeSlots(Integer scheduleId);

    List<AppointmentDtos.AppointmentResponse> getAppointmentsByScheduleId(Integer scheduleId);

    List<AppointmentDtos.AppointmentResponse> getAppointmentsByPatientId(Integer patientId);
}
