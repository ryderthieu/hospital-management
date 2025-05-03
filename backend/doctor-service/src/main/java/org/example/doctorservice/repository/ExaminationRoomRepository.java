package org.example.doctorservice.repository;

import org.example.doctorservice.entity.ExaminationRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExaminationRoomRepository extends JpaRepository<ExaminationRoom, Integer> {
    @Query("SELECT r FROM ExaminationRoom r " +
            "WHERE (:type IS NULL OR r.type = :type) " +
            "AND (:building IS NULL OR r.building = :building) " +
            "AND (:floor IS NULL OR r.floor = :floor)")
    List<ExaminationRoom> findRoomsByFilters(
            @Param("type") ExaminationRoom.Type type,
            @Param("building") String building,
            @Param("floor") Integer floor);
}