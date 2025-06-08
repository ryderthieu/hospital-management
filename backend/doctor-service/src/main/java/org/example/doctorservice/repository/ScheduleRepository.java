package org.example.doctorservice.repository;

import org.example.doctorservice.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    List<Schedule> findByDoctor_DoctorId(Integer doctorId);

    Optional<Schedule> findByScheduleIdAndDoctor_DoctorId(Integer scheduleId, Integer doctorId);

    Optional<Schedule> findByScheduleId(Integer scheduleId);
}