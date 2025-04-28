package org.example.patientservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.RoomDetailDto;
import org.example.patientservice.entity.RoomDetail;
import org.example.patientservice.service.RoomDetailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients/room-details")
@RequiredArgsConstructor
public class RoomDetailController {

    private final RoomDetailService roomDetailService;

    @PostMapping
    public ResponseEntity<RoomDetailDto> createRoomDetail(@RequestBody @Valid RoomDetailDto roomDetailDto) {
        return ResponseEntity.ok(roomDetailService.createRoomDetail(roomDetailDto));
    }

    @GetMapping
    public ResponseEntity<List<RoomDetailDto>> getAllRoomDetails() {
        return ResponseEntity.ok(roomDetailService.getAllRoomDetails());
    }

    @GetMapping("/{detailId}")
    public ResponseEntity<RoomDetailDto> getRoomDetailById(@PathVariable Integer detailId) {
        return ResponseEntity.ok(roomDetailService.getRoomDetailById(detailId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RoomDetailDto>> getRoomDetailsByRoomId(@RequestParam Integer roomId) {
        return ResponseEntity.ok(roomDetailService.getRoomDetailsByRoomId(roomId));
    }

    @DeleteMapping("{detailId}")
    public ResponseEntity<String> deleteRoomDetail(@PathVariable Integer detailId) {
        roomDetailService.deleteRoomDetail(detailId);
        return ResponseEntity.ok("Chi tiết phòng được xóa thành công");
    }
}
