package org.example.doctorservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.doctorservice.dto.DepartmentDto;
import org.example.doctorservice.entity.Department;
import org.example.doctorservice.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping("/{departmentId}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Integer departmentId) {
        return ResponseEntity.ok(departmentService.getDepartmentById(departmentId));
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody @Valid DepartmentDto departmentDto) {
        return ResponseEntity.ok(departmentService.createDepartment(departmentDto));
    }

    @PutMapping("/{departmentId}")
    public ResponseEntity<Department> updateDepartment(@PathVariable Integer departmentId, @RequestBody @Valid DepartmentDto departmentDto) {
        return ResponseEntity.ok(departmentService.updateDepartment(departmentId, departmentDto));
    }

    @DeleteMapping("/{departmentId}")
    public ResponseEntity<String> deleteDepartment(@PathVariable Integer departmentId) {
        departmentService.deleteDepartment(departmentId);
        return ResponseEntity.ok("Khoa được xóa thành công");
    }
}
