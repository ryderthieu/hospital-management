package org.example.doctorservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.doctorservice.dto.ExaminationRoomDto;
import org.example.doctorservice.entity.ExaminationRoom;
import org.example.doctorservice.service.ExaminationRoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors/examination-rooms")
@RequiredArgsConstructor
public class ExaminationRoomController {

    private final ExaminationRoomService examinationRoomService;

    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    @GetMapping
    public ResponseEntity<List<ExaminationRoomDto>> getAllExaminationRooms() {
        return ResponseEntity.ok(examinationRoomService.getAllExaminationRooms());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    @GetMapping("/{roomId}")
    public ResponseEntity<ExaminationRoomDto> getExaminationRoomById(@PathVariable Integer roomId) {
        return ResponseEntity.ok(examinationRoomService.getExaminationRoomById(roomId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @PostMapping
    public ResponseEntity<ExaminationRoomDto> createExaminationRoom(@RequestBody @Valid ExaminationRoomDto examinationRoomDto) {
        return ResponseEntity.ok(examinationRoomService.createExaminationRoom(examinationRoomDto));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @PutMapping("/{roomId}")
    public ResponseEntity<ExaminationRoomDto> updateExaminationRoom(@PathVariable Integer roomId, @RequestBody @Valid ExaminationRoomDto examinationRoomDto) {
        return ResponseEntity.ok(examinationRoomService.updateExaminationRoom(roomId, examinationRoomDto));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @DeleteMapping("/{roomId}")
    public ResponseEntity<String> deleteExaminationRoom(@PathVariable Integer roomId) {
        examinationRoomService.deleteExaminationRoom(roomId);
        return ResponseEntity.ok("Phòng được xóa thành công");
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    @GetMapping("/search")
    public ResponseEntity<List<ExaminationRoomDto>> filterRooms(@RequestParam(required = false) ExaminationRoom.Type type,
                                                                @RequestParam(required = false) String building,
                                                                @RequestParam(required = false) Integer floor) {
        return ResponseEntity.ok(examinationRoomService.filterRooms(type, building, floor));
    }
}