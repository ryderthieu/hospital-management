package org.example.appointmentservice.repository;

import org.example.appointmentservice.entity.AppointmentNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppointmentNoteRepository extends JpaRepository<AppointmentNote, Integer> {
    Optional<AppointmentNote> findByAppointment_AppointmentId(Integer appointmentId);
    Optional<AppointmentNote> findByNoteIdAndAppointment_AppointmentId(Integer noteId, Integer appointmentId);
}
