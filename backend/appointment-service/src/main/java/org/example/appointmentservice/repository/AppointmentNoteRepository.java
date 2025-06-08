package org.example.appointmentservice.repository;

import org.example.appointmentservice.entity.AppointmentNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentNoteRepository extends JpaRepository<AppointmentNote, Integer> {
    List<AppointmentNote> findAllByAppointment_AppointmentId(Integer appointmentId);
}
