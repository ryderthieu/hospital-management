package org.example.doctorservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "examination_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExaminationRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer roomId;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(length = 100)
    private String building;

    private Integer floor;

    private String roomName;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    public enum Type {
        EXAMINATION, TEST
    }
}
