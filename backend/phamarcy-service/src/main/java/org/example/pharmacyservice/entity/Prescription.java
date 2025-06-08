package org.example.pharmacyservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "prescriptions")
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prescription_id")
    Long prescriptionId;

    @Column(name = "patient_id", nullable = false)
    Integer patientId;

    @Column(name = "appointment_id", nullable = false)
    Long appointmentId;

    @Column(name = "follow_up_date")
    LocalDate followUpDate;

    @Column(name = "is_follow_up")
    boolean isFollowUp;

    @Column(name = "diagnosis", columnDefinition = "TEXT", nullable = false)
    String diagnosis;

    @Column(name = "systolic_blood_pressure", nullable = false)
    Integer systolicBloodPressure;

    @Column(name = "diastolic_blood_pressure", nullable = false)
    Integer diastolicBloodPressure;

    @Column(name = "heart_rate", nullable = false)
    Integer heartRate;

    @Column(name = "blood_sugar", nullable = false)
    Integer bloodSugar;

    @Column(name = "note", columnDefinition = "TEXT", nullable = false)
    String note;

    @Column(name = "created_at")
    Timestamp createdAt;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PrescriptionDetail> prescriptionDetails = new ArrayList<>();
}
