package org.example.appointmentservice.service;

import org.example.appointmentservice.dto.AppointmentNoteDto;

import java.util.List;

public interface AppointmentNoteService {

    List<AppointmentNoteDto> getAllAppointmentNotes(Integer appointmentId);

    AppointmentNoteDto getAppointmentNoteById(Integer noteId, Integer appointmentId);

    AppointmentNoteDto createAppointmentNote(Integer appointmentId, AppointmentNoteDto appointmentNoteDto);

    AppointmentNoteDto updateAppointmentNote(Integer appointmentId,
                                             Integer noteId,
                                             AppointmentNoteDto appointmentNoteDto);

    void deleteAppointmentNote(Integer appointmentId,
                               Integer noteId);
}
