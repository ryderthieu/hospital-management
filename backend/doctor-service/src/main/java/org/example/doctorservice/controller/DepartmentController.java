package org.example.doctorservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.doctorservice.dto.DepartmentDto;
import org.example.doctorservice.dto.DoctorDto;
import org.example.doctorservice.entity.Department;
import org.example.doctorservice.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

//    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @GetMapping("/{departmentId}")
    public ResponseEntity<DepartmentDto> getDepartmentById(@PathVariable Integer departmentId) {
        return ResponseEntity.ok(departmentService.getDepartmentById(departmentId));
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<DepartmentDto> createDepartment(@RequestBody @Valid DepartmentDto departmentDto) {
        return ResponseEntity.ok(departmentService.createDepartment(departmentDto));
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{departmentId}")
    public ResponseEntity<DepartmentDto> updateDepartment(@PathVariable Integer departmentId,
                                                          @RequestBody @Valid DepartmentDto departmentDto) {
        return ResponseEntity.ok(departmentService.updateDepartment(departmentId, departmentDto));
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{departmentId}")
    public ResponseEntity<String> deleteDepartment(@PathVariable Integer departmentId) {
        departmentService.deleteDepartment(departmentId);
        return ResponseEntity.ok("Khoa được xóa thành công");
    }

    @GetMapping("/{departmentId}/doctors")
    public ResponseEntity<List<DoctorDto>> getDoctorsByDepartmentId(@PathVariable Integer departmentId) {
        return ResponseEntity.ok(departmentService.getDoctorsByDepartmentId(departmentId));
    }
}
