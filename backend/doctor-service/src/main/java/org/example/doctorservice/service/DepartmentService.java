package org.example.doctorservice.service;

import org.example.doctorservice.dto.DepartmentDto;
import org.example.doctorservice.entity.Department;

import java.util.List;

public interface DepartmentService {
    DepartmentDto getDepartmentById(Integer departmentId);

    List<DepartmentDto> getAllDepartments();

    DepartmentDto createDepartment(DepartmentDto departmentDto);

    DepartmentDto updateDepartment(Integer departmentId, DepartmentDto departmentDto);

    void deleteDepartment(Integer departmentId);
}
