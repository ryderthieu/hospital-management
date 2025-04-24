package org.example.patientservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "patient_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer roomId;

    @Column(name = "room_name")
    private String roomName;

    @Column(name = "max_capacity")
    private Integer maxCapacity;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;
}
