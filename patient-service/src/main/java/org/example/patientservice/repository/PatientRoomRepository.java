package org.example.patientservice.repository;

import org.example.patientservice.entity.Patient;
import org.example.patientservice.entity.PatientRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRoomRepository extends JpaRepository<PatientRoom, Integer> {

    @Query("""
            SELECT pr 
            FROM PatientRoom pr 
            WHERE pr.roomName = :roomName 
                OR pr.maxCapacity = :maxCapacity
            """)
    Optional<PatientRoom> findByRoomNameOrMaxCapacity(String roomName, Integer maxCapacity);
}
