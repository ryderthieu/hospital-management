package org.example.patientservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.RoomDetailDto;
import org.example.patientservice.entity.RoomDetail;
import org.example.patientservice.service.RoomDetailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients/room-details")
@RequiredArgsConstructor
public class RoomDetailController {

    private final RoomDetailService roomDetailService;

    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    @PostMapping
    public ResponseEntity<RoomDetailDto> createRoomDetail(@RequestBody @Valid RoomDetailDto roomDetailDto) {
        return ResponseEntity.ok(roomDetailService.createRoomDetail(roomDetailDto));
    }

    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN', 'DOCTOR')")
    @GetMapping
    public ResponseEntity<List<RoomDetailDto>> getAllRoomDetails() {
        return ResponseEntity.ok(roomDetailService.getAllRoomDetails());
    }

    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN', 'DOCTOR')")
    @GetMapping("/{detailId}")
    public ResponseEntity<RoomDetailDto> getRoomDetailById(@PathVariable Integer detailId) {
        return ResponseEntity.ok(roomDetailService.getRoomDetailById(detailId));
    }

    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<List<RoomDetailDto>> getRoomDetailsByRoomId(@RequestParam Integer roomId) {
        return ResponseEntity.ok(roomDetailService.getRoomDetailsByRoomId(roomId));
    }

    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    @DeleteMapping("/{detailId}")
    public ResponseEntity<String> deleteRoomDetail(@PathVariable Integer detailId) {
        roomDetailService.deleteRoomDetail(detailId);
        return ResponseEntity.ok("Chi tiết phòng được xóa thành công");
    }
}
