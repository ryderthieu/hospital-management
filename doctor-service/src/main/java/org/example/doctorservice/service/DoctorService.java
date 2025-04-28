package org.example.doctorservice.service;


import org.example.doctorservice.dto.DoctorDto;
import org.example.doctorservice.entity.Doctor;

import java.util.List;
import java.util.Optional;

public interface DoctorService {
    List<DoctorDto> getAllDoctors();

    DoctorDto getDoctorById(Integer doctorId);

    DoctorDto createDoctor(DoctorDto doctorDto);

    DoctorDto updateDoctor(Integer doctorId, DoctorDto doctorDto);

    void deleteDoctor(Integer doctorId);

    Optional<DoctorDto> findByIdentityNumber(String identityNumber);

    Optional<DoctorDto> filterDoctors(Doctor.Gender gender,
                                      Doctor.AcademicDegree academicDegree,
                                      String specialization,
                                      Doctor.Type type);
}
