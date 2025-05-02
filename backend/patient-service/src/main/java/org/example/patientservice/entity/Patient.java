package org.example.patientservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Integer patientId;

    @Column(name = "user_id", unique = true)
    private Integer userId;

    @Column(name = "identity_number", unique = true, length = 20)
    private String identityNumber;

    @Column(name = "insurance_number", unique = true, length = 20)
    private String insuranceNumber;

    @Column(name = "full_name")
    private String fullName;

    private LocalDate birthday;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    private Integer height;

    private Integer weight;

    @Column(name = "blood_type", length = 10)
    private String bloodType;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmergencyContact> emergencyContacts = new ArrayList<>();
}
