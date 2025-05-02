package org.example.patientservice.repository;

import org.example.patientservice.entity.PatientRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRoomRepository extends JpaRepository<PatientRoom, Integer> {
}
