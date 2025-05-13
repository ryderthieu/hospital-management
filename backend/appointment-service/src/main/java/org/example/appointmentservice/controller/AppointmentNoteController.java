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

    @GetMapping("/{appointmentId}/appointment-notes")
    public ResponseEntity<List<AppointmentNoteDto>> getAllAppointmentNotes(@PathVariable Integer appointmentId) {
        return ResponseEntity.ok(appointmentNoteService.getAllAppointmentNotes(appointmentId));
    }

    @GetMapping("/{appointmentId}/appointment-notes/{noteId}")
    public ResponseEntity<AppointmentNoteDto> getAppointmentNoteById(@PathVariable Integer noteId,
                                                                     @PathVariable Integer appointmentId) {
        return ResponseEntity.ok(appointmentNoteService.getAppointmentNoteById(noteId, appointmentId));
    }

    @PostMapping("/{appointmentId}/appointment-notes")
    public ResponseEntity<AppointmentNoteDto> createAppointmentNote(@PathVariable Integer appointmentId,
                                                                    @RequestBody @Valid AppointmentNoteDto appointmentNoteDto) {
        return ResponseEntity.ok(appointmentNoteService.createAppointmentNote(appointmentId, appointmentNoteDto));
    }

    @PutMapping("/{appointmentId}/appointment-notes/{noteId}")
    public ResponseEntity<AppointmentNoteDto> updateAppointmentNote(@PathVariable Integer appointmentId,
                                                                    @PathVariable Integer noteId,
                                                                    @RequestBody @Valid AppointmentNoteDto appointmentNoteDto) {
        return ResponseEntity.ok(appointmentNoteService.updateAppointmentNote(appointmentId, noteId, appointmentNoteDto));
    }

    @DeleteMapping("/{appointmentId}/appointment-notes/{noteId}")
    public ResponseEntity<String> deleteAppointmentNote(@PathVariable Integer noteId,
                                                        @PathVariable Integer appointmentId) {
        appointmentNoteService.deleteAppointmentNote(noteId, appointmentId);
        return ResponseEntity.ok("Chú thích cuộc hẹn được xóa thành công");
    }
}
