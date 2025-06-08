package org.example.doctorservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.doctorservice.dto.DoctorDto;
import org.example.doctorservice.dto.PatientDto;
import org.example.doctorservice.entity.Doctor;
import org.example.doctorservice.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

//    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @GetMapping
    public ResponseEntity<List<DoctorDto>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @GetMapping("/{doctorId}")
    public ResponseEntity<DoctorDto> getDoctorById(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(doctorService.getDoctorById(doctorId));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping
    public ResponseEntity<DoctorDto> createDoctor(@RequestBody @Valid DoctorDto doctorDto) {
        return ResponseEntity.ok(doctorService.createDoctor(doctorDto));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PutMapping("/{doctorId}")
    public ResponseEntity<DoctorDto> updateDoctor(@PathVariable Integer doctorId, @RequestBody DoctorDto doctorDto) {
        return ResponseEntity.ok(doctorService.updateDoctor(doctorId, doctorDto));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{doctorId}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Integer doctorId) {
        doctorService.deleteDoctor(doctorId);
        return ResponseEntity.ok("Bác sĩ được xóa thành công");
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @GetMapping("/search")
    public ResponseEntity<Optional<DoctorDto>> findByIdentityNumber(@RequestParam String identityNumber) {
        return ResponseEntity.ok(doctorService.findByIdentityNumber(identityNumber));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @GetMapping("/filter")
    public ResponseEntity<Optional<DoctorDto>> filterDoctors(@RequestParam(required = false) Doctor.Gender gender,
                                                             @RequestParam(required = false) Doctor.AcademicDegree academicDegree,
                                                             @RequestParam(required = false) String specialization,
                                                             @RequestParam(required = false) Doctor.Type type) {
        return ResponseEntity.ok(doctorService.filterDoctors(gender, academicDegree, specialization, type));
    }

   // @PreAuthorize("hasAnyRole('DOCTOR', 'RECEPTIONIST', 'ADMIN')")
    @GetMapping("/{doctorId}/patients")
    public ResponseEntity<List<PatientDto>> getPatientsByDoctor(@PathVariable Integer doctorId) {
        List<PatientDto> patients = doctorService.getPatientsByDoctor(doctorId);
        return ResponseEntity.ok(patients);
    }
}