package org.example.doctorservice.service;

import org.example.doctorservice.dto.DepartmentDto;
import org.example.doctorservice.entity.Department;

import java.util.List;

public interface DepartmentService {
    Department getDepartmentById(Integer departmentId);

    List<Department> getAllDepartments();

    Department createDepartment(DepartmentDto departmentDto);

    Department updateDepartment(Integer departmentId, DepartmentDto departmentDto);

    void deleteDepartment(Integer departmentId);
}
