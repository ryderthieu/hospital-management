package org.example.doctorservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.example.doctorservice.entity.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
}
