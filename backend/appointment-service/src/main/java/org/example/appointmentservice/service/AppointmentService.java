package org.example.appointmentservice.service;

import org.example.appointmentservice.dto.AppointmentDtos;
import org.example.appointmentservice.dto.AppointmentResponseTypes;
import org.example.appointmentservice.dto.PageResponse;
import org.example.appointmentservice.dto.ScheduleTimeDto;
import org.example.appointmentservice.entity.Appointment;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    PageResponse<AppointmentDtos.AppointmentResponse> getAllAppointments(int pageNo, int pageSize);

    AppointmentDtos.AppointmentResponse getAppointmentById(Integer appointmentId);

    AppointmentDtos.AppointmentResponse createAppointment(AppointmentDtos.AppointmentRequest request);

    AppointmentDtos.AppointmentResponse updateAppointment(Integer appointmentId, AppointmentDtos.AppointmentUpdateRequest request);

    void deleteAppointment(Integer appointmentId);

    PageResponse<AppointmentResponseTypes.DoctorViewResponse> getAppointmentsByDoctorIdOptimized(Integer doctorId, String shift, LocalDate workDate, Appointment.AppointmentStatus appointmentStatus, Integer roomId, int pageNo, int pageSize);

    PageResponse<AppointmentResponseTypes.PatientViewResponse> getAppointmentsByPatientIdOptimized(Integer patientId, int pageNo, int pageSize);

    List<AppointmentDtos.AppointmentResponse> getAppointmentsByDoctorId(Integer doctorId);

    List<AppointmentDtos.AppointmentResponse> getAppointmentsByDoctorIdAndDate(Integer doctorId, LocalDate date);

    List<AppointmentDtos.AppointmentResponse> getTodayAppointmentsByDoctorId(Integer doctorId);

    List<AppointmentDtos.AvailableTimeSlotResponse> getAvailableTimeSlots(Integer scheduleId, ScheduleTimeDto scheduleTime);

    List<AppointmentDtos.AppointmentResponse> getAppointmentsByScheduleId(Integer scheduleId);

    List<AppointmentDtos.AppointmentResponse> getAppointmentsByPatientId(Integer patientId);
}
