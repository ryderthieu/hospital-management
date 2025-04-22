package org.example.patientservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "patient_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detailId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "patient_id")
    @JsonBackReference
    private Patients patient;

    @Column(name = "disease_history", columnDefinition = "TEXT")
    private String diseaseHistory;

    @Column(name = "family_history", columnDefinition = "TEXT")
    private String familyHistory;

    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "medications", columnDefinition = "TEXT")
    private String medications;

    @Column(name = "blood_Type", length = 20)
    private String bloodType;

    @Column(name = "life_style", columnDefinition = "TEXT")
    private String lifeStyle;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private Timestamp createdAt;
}
