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
    public List<AppointmentNoteDto> getNotesByAppointmentId(Integer appointmentId) {
        List<AppointmentNote> notes = appointmentNoteRepository.findAllByAppointment_AppointmentId(appointmentId);
        return notes.stream()
                .map(AppointmentNoteDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentNoteDto createNote(Integer appointmentId, AppointmentNoteDto appointmentNoteDto) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc hẹn với ID: " + appointmentId));

        AppointmentNote note = AppointmentNote.builder()
                .appointment(appointment)
                .noteType(appointmentNoteDto.getNoteType())
                .noteText(appointmentNoteDto.getContent())
                .build();

        AppointmentNote savedNote = appointmentNoteRepository.save(note);
        return new AppointmentNoteDto(savedNote);
    }

    @Override
    public AppointmentNoteDto updateNote(Integer noteId, AppointmentNoteDto appointmentNoteDto) {
        AppointmentNote note = appointmentNoteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ghi chú với ID: " + noteId));

        note.setNoteType(appointmentNoteDto.getNoteType());
        note.setNoteText(appointmentNoteDto.getContent());

        AppointmentNote updatedNote = appointmentNoteRepository.save(note);
        return new AppointmentNoteDto(updatedNote);
    }

    @Override
    public void deleteNote(Integer noteId) {
        AppointmentNote note = appointmentNoteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ghi chú với ID: " + noteId));

        appointmentNoteRepository.delete(note);
    }
}
