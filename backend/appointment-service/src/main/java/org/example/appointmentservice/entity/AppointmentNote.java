package org.example.appointmentservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "appointment_notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "note_id")
    private Integer noteId;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(name = "note_type")
    @Enumerated(EnumType.STRING)
    private NoteType noteType;

    @Column(name = "note_text", columnDefinition = "TEXT")
    private String noteText;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    public enum NoteType {
        DOCTOR, PATIENT
    }
}
