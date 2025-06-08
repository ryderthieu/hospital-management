package org.example.doctorservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.doctorservice.dto.DepartmentDto;
import org.springframework.stereotype.Service;
import org.example.doctorservice.entity.Department;
import org.example.doctorservice.repository.DepartmentRepository;
import org.example.doctorservice.service.DepartmentService;
import org.example.doctorservice.dto.DoctorDto;
import org.example.doctorservice.repository.DoctorRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    @Override
    public DepartmentDto getDepartmentById(Integer departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + departmentId));
        return new DepartmentDto(department);
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository
                .findAll()
                .stream()
                .map(DepartmentDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        Department department = Department.builder()
                .departmentName(departmentDto.getDepartmentName())
                .description(departmentDto.getDescription())
                .build();
        Department savedDepartment = departmentRepository.save(department);
        return new DepartmentDto(savedDepartment);
    }

    @Override
    public DepartmentDto updateDepartment(Integer departmentId,
                                          DepartmentDto departmentDto) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + departmentId));

        department.setDepartmentName(departmentDto.getDepartmentName());
        department.setDescription(departmentDto.getDescription());

        Department updatedDepartment = departmentRepository.save(department);
        return new DepartmentDto(updatedDepartment);
    }

    @Override
    public void deleteDepartment(Integer departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + departmentId));

        departmentRepository.delete(department);
    }

    @Override
    public List<DoctorDto> getDoctorsByDepartmentId(Integer departmentId) {
        // Kiểm tra khoa tồn tại
        departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + departmentId));

        List<DoctorDto> doctors = doctorRepository.findByDepartment_DepartmentId(departmentId)
                .stream()
                .map(DoctorDto::new)
                .collect(Collectors.toList());

        if (doctors.isEmpty()) {
            throw new RuntimeException("Không tìm thấy bác sĩ nào trong khoa có ID: " + departmentId);
        }

        return doctors;
    }
}

