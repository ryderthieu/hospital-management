package org.example.appointmentservice.repository;

import org.example.appointmentservice.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByDoctorId(Integer doctorId);

    List<Appointment> findByPatientId(Integer patientId);

    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId AND DATE(a.scheduleId) = :date")
    List<Appointment> findByDoctorIdAndDate(@Param("doctorId") Integer doctorId, @Param("date") LocalDate date);

    Integer countByScheduleIdAndSlotStart(Integer scheduleId, LocalTime slotStart);

    List<Appointment> findByScheduleIdOrderBySlotStartAsc(Integer scheduleId);
}
