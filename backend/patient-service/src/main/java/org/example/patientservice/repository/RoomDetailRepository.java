package org.example.patientservice.repository;

import org.example.patientservice.entity.RoomDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomDetailRepository extends JpaRepository<RoomDetail, Integer> {
    List<RoomDetail> findByRoom_RoomId(Integer roomId);
}
