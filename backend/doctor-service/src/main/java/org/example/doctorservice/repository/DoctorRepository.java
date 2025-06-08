package org.example.doctorservice.repository;

import org.example.doctorservice.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByIdentityNumber(String identityNumber);

    @Query("""
            SELECT d 
            FROM Doctor d
            WHERE (d.gender = :gender OR :gender IS NULL)
                AND (d.academicDegree = :academicDegree OR :academicDegree IS NULL)
                AND (d.specialization = :specialization OR :specialization IS NULL)
                AND (d.type = :type OR :type IS NULL)
            """)
    Optional<Doctor> filterDoctors(
            Doctor.Gender gender,
            Doctor.AcademicDegree academicDegree,
            String specialization,
            Doctor.Type type
    );

    List<Doctor> findByDepartment_DepartmentId(Integer departmentId);

    int countByDepartment_DepartmentId(Integer departmentId);

    Optional<Doctor> findByUserId(Integer userId);
}