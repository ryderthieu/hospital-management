package org.example.patientservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.PatientRoomDto;
import org.example.patientservice.entity.PatientRoom;
import org.example.patientservice.service.PatientRoomService;
import org.example.patientservice.service.impl.PatientRoomServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients/patient-rooms")
@RequiredArgsConstructor
public class PatientRoomController {

    private final PatientRoomService patientRoomService;

    @GetMapping
    public ResponseEntity<List<PatientRoom>> getAllPatientRooms() {
        return ResponseEntity.ok(patientRoomService.getAllPatientRooms());
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<PatientRoom> getPatientRoomById(@PathVariable Integer roomId) {
        return ResponseEntity.ok(patientRoomService.getPatientRoomById(roomId));
    }

    @PostMapping
    public ResponseEntity<PatientRoom> createPatientRoom(@RequestBody @Valid PatientRoomDto patientRoomDto) {
        return ResponseEntity.ok(patientRoomService.createPatientRoom(patientRoomDto));
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<PatientRoom> updatePatientRoom(@PathVariable Integer roomId, @RequestBody @Valid PatientRoomDto patientRoomDto) {
        return ResponseEntity.ok(patientRoomService.updatePatientRoom(roomId, patientRoomDto));
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<String> deletePatientRoom(@PathVariable Integer roomId){
        patientRoomService.deletePatientRoom(roomId);
        return ResponseEntity.ok("Phòng được xóa thành công");
    }

    @GetMapping("/search/room-name")
    public ResponseEntity<List<PatientRoom>> searchPatientRoomsByRoomName(@RequestParam String filter){
        return ResponseEntity.ok(patientRoomService.searchPatientRoomsByRoomName(filter));
    }

    @GetMapping("/search/max-capacity")
    public ResponseEntity<List<PatientRoom>> searchPatientRoomsByMaxCapacity(@RequestParam Integer filter){
        return ResponseEntity.ok(patientRoomService.searchPatientRoomsByMaxCapacity(filter));
    }
}
