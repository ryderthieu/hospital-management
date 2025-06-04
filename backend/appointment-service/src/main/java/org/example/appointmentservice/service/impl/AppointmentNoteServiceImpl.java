package org.example.appointmentservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.appointmentservice.dto.AppointmentNoteDto;
import org.example.appointmentservice.entity.Appointment;
import org.example.appointmentservice.entity.AppointmentNote;
import org.example.appointmentservice.repository.AppointmentNoteRepository;
import org.example.appointmentservice.repository.AppointmentRepository;
import org.example.appointmentservice.service.AppointmentNoteService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentNoteServiceImpl implements AppointmentNoteService {
    private final AppointmentNoteRepository appointmentNoteRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public List<AppointmentNoteDto> getAllAppointmentNotes(Integer appointmentId) {
        return appointmentNoteRepository
                .findByAppointment_AppointmentId(appointmentId)
                .stream()
                .map(AppointmentNoteDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentNoteDto getAppointmentNoteById(Integer noteId, Integer appointmentId) {
        AppointmentNote appointmentNote = appointmentNoteRepository.findByNoteIdAndAppointment_AppointmentId(noteId, appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ghi chú cuộc hẹn với ID: " + noteId));
        return new AppointmentNoteDto(appointmentNote);
    }

    @Override
    public AppointmentNoteDto createAppointmentNote(Integer appointmentId, AppointmentNoteDto appointmentNoteDto) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn với ID" + appointmentId));

        AppointmentNote appointmentNote = AppointmentNote.builder()
                .appointment(appointment)
                .noteType(appointmentNoteDto.getNoteType())
                .noteText(appointmentNoteDto.getNoteText())
                .build();

        AppointmentNote savedAppointmentNote = appointmentNoteRepository.save(appointmentNote);
        return new AppointmentNoteDto(savedAppointmentNote);
    }

    @Override
    public AppointmentNoteDto updateAppointmentNote(Integer appointmentId,
                                                    Integer noteId,
                                                    AppointmentNoteDto appointmentNoteDto) {
        AppointmentNote appointmentNote = appointmentNoteRepository.findByNoteIdAndAppointment_AppointmentId(noteId, appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ghi chú cuộc hẹn"));


        appointmentNote.setNoteType(appointmentNoteDto.getNoteType());
        appointmentNote.setNoteText(appointmentNoteDto.getNoteText());

        AppointmentNote updatedAppointmentNote = appointmentNoteRepository.save(appointmentNote);
        return new AppointmentNoteDto(updatedAppointmentNote);
    }

    @Override
    public void deleteAppointmentNote(Integer appointmentId,
                                      Integer noteId) {
        AppointmentNote appointmentNote = appointmentNoteRepository.findByNoteIdAndAppointment_AppointmentId(noteId, appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ghi chú cuộc hẹn"));

        appointmentNoteRepository.delete(appointmentNote);
    }
}
