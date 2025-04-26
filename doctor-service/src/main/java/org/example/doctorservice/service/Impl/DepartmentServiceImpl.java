package org.example.doctorservice.service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.doctorservice.dto.DepartmentDto;
import org.springframework.stereotype.Service;
import org.example.doctorservice.entity.Department;
import org.example.doctorservice.repository.DepartmentRepository;
import org.example.doctorservice.service.DepartmentService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;

    @Override
    public Department getDepartmentById(Integer departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + departmentId));
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public Department createDepartment(DepartmentDto departmentDto) {
        Department department = Department.builder()
                .departmentName(departmentDto.getDepartmentName())
                .description(departmentDto.getDescription())
                .build();
        return departmentRepository.save(department);
    }

    @Override
    public Department updateDepartment(Integer departmentId, DepartmentDto departmentDto) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + departmentId));

        department.setDepartmentName(departmentDto.getDepartmentName());
        department.setDescription(departmentDto.getDescription());

        return departmentRepository.save(department);
    }

    @Override
    public void deleteDepartment(Integer departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + departmentId));

        departmentRepository.delete(department);
    }
}
