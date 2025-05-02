package org.example.patientservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.PatientDto;
import org.example.patientservice.dto.PatientRoomDto;
import org.example.patientservice.entity.PatientRoom;
import org.example.patientservice.service.PatientRoomService;
import org.example.patientservice.service.impl.PatientRoomServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients/patient-rooms")
@RequiredArgsConstructor
public class PatientRoomController {

    private final PatientRoomService patientRoomService;

    @GetMapping
    public ResponseEntity<List<PatientRoomDto>> getAllPatientRooms() {
        return ResponseEntity.ok(patientRoomService.getAllPatientRooms());
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<PatientRoomDto> getPatientRoomById(@PathVariable Integer roomId) {
        return ResponseEntity.ok(patientRoomService.getPatientRoomById(roomId));
    }

    @PostMapping
    public ResponseEntity<PatientRoomDto> createPatientRoom(@RequestBody @Valid PatientRoomDto patientRoomDto) {
        return ResponseEntity.ok(patientRoomService.createPatientRoom(patientRoomDto));
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<PatientRoomDto> updatePatientRoom(@PathVariable Integer roomId, @RequestBody @Valid PatientRoomDto patientRoomDto) {
        return ResponseEntity.ok(patientRoomService.updatePatientRoom(roomId, patientRoomDto));
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<String> deletePatientRoom(@PathVariable Integer roomId){
        patientRoomService.deletePatientRoom(roomId);
        return ResponseEntity.ok("Phòng được xóa thành công");
    }

    @GetMapping("/search")
    public ResponseEntity<Optional<PatientRoomDto>> filterPatientRooms(@RequestParam(required = false) String roomName,
                                                                       @RequestParam(required = false) Integer maxCapacity){
        Optional<PatientRoomDto> patientRoomDto = patientRoomService.filterPatientRooms(roomName, maxCapacity);
        return patientRoomDto.isPresent() ? ResponseEntity.ok(patientRoomDto) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
