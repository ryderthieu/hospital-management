package org.example.doctorservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.doctorservice.client.AppointmentServiceClient;
import org.example.doctorservice.client.PatientServiceClient;
import org.example.doctorservice.dto.AppointmentDto;
import org.example.doctorservice.dto.DoctorDto;
import org.example.doctorservice.dto.PatientDto;
import org.example.doctorservice.entity.Department;
import org.example.doctorservice.entity.Doctor;
import org.example.doctorservice.repository.DepartmentRepository;
import org.example.doctorservice.repository.DoctorRepository;
import org.example.doctorservice.service.DoctorService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final AppointmentServiceClient appointmentServiceClient;
    private final PatientServiceClient patientServiceClient;

    @Override
    public List<DoctorDto> getAllDoctors() {
        return doctorRepository
                .findAll()
                .stream()
                .map(DoctorDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDto getDoctorById(Integer doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ với ID:" + doctorId));
        return new DoctorDto(doctor);
    }

    @Override
    public DoctorDto createDoctor(DoctorDto doctorDto) {
        Department department = departmentRepository.findById(doctorDto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Phòng không được tìm thấy"));
        Doctor doctor = Doctor.builder()
                .userId(doctorDto.getUserId())
                .identityNumber(doctorDto.getIdentityNumber())
                .fullName(doctorDto.getFullName())
                .birthday(doctorDto.getBirthday())
                .gender(doctorDto.getGender())
                .address(doctorDto.getAddress())
                .academicDegree(doctorDto.getAcademicDegree())
                .specialization(doctorDto.getSpecialization())
                .type(doctorDto.getType())
                .department(department)
                .build();

        Doctor createdDoctor = doctorRepository.save(doctor);
        return new DoctorDto(createdDoctor);
    }

    @Override
    public DoctorDto updateDoctor(Integer doctorId, DoctorDto doctorDto) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ với ID:" + doctorId));

        if (!doctor.getIdentityNumber().equals(doctor.getIdentityNumber())) {
            doctor.setIdentityNumber(doctor.getIdentityNumber());
        }

        doctor.setFullName(doctorDto.getFullName());
        doctor.setBirthday(doctorDto.getBirthday());
        doctor.setGender(doctorDto.getGender());
        doctor.setAddress(doctorDto.getAddress());
        doctor.setAcademicDegree(doctorDto.getAcademicDegree());
        doctor.setSpecialization(doctorDto.getSpecialization());
        doctor.setType(doctorDto.getType());

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return new DoctorDto(updatedDoctor);
    }

    @Override
    public void deleteDoctor(Integer doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ với ID:" + doctorId));

        doctorRepository.delete(doctor);
    }

    @Override
    public Optional<DoctorDto> findByIdentityNumber(String identityNumber) {
        if (identityNumber != null && !identityNumber.isEmpty()) {
            return doctorRepository
                    .findByIdentityNumber(identityNumber)
                    .map(DoctorDto::new);
        }
        return Optional.empty();
    }

    @Override
    public Optional<DoctorDto> filterDoctors(Doctor.Gender gender,
                                             Doctor.AcademicDegree academicDegree,
                                             String specialization,
                                             Doctor.Type type) {
        return doctorRepository.filterDoctors(gender, academicDegree, specialization, type)
                .map(DoctorDto::new);
    }

    @Override
    public List<PatientDto> getPatientsByDoctor(Integer doctorId) {
        List<AppointmentDto> appointments = appointmentServiceClient.getAppointmentsByDoctorId(doctorId);

        if (appointments == null || appointments.isEmpty()) {
            return Collections.emptyList();
        }

        Set<Integer> patientIds = appointments.stream()
                .map(AppointmentDto::getPatientId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<PatientDto> patients = new ArrayList<>();
        for (Integer patientId : patientIds) {
            try {
                PatientDto patient = patientServiceClient.getPatientById(patientId);
                if (patient != null) {
                    patients.add(patient);
                }
            } catch (Exception e) {
//                logger.error("Error getting patient id: " + patientId, e);
            }
        }

        return patients;
    }

}

