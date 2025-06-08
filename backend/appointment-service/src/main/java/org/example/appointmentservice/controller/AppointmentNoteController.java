package org.example.appointmentservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.appointmentservice.dto.AppointmentNoteDto;
import org.example.appointmentservice.service.AppointmentNoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentNoteController {
    private final AppointmentNoteService appointmentNoteService;

    @GetMapping("/{appointmentId}/notes")
    public ResponseEntity<List<AppointmentNoteDto>> getNotesByAppointmentId(@PathVariable Integer appointmentId) {
        return ResponseEntity.ok(appointmentNoteService.getNotesByAppointmentId(appointmentId));
    }

    @PostMapping("/{appointmentId}/notes")
    public ResponseEntity<AppointmentNoteDto> createNote(
            @PathVariable Integer appointmentId,
            @RequestBody @Valid AppointmentNoteDto noteDto) {
        return ResponseEntity.ok(appointmentNoteService.createNote(appointmentId, noteDto));
    }

    @PutMapping("/notes/{noteId}")
    public ResponseEntity<AppointmentNoteDto> updateNote(
            @PathVariable Integer noteId,
            @RequestBody @Valid AppointmentNoteDto noteDto) {
        return ResponseEntity.ok(appointmentNoteService.updateNote(noteId, noteDto));
    }

    @DeleteMapping("/notes/{noteId}")
    public ResponseEntity<Void> deleteNote(@PathVariable Integer noteId) {
        appointmentNoteService.deleteNote(noteId);
        return ResponseEntity.ok().build();
    }
}
