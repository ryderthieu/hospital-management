package org.example.patientservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "emergency_contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyContacts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer contactId;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    @JsonBackReference
    private Patients patient;

    @Column(name = "contact_name", length = 255)
    private String contactName;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship")
    private RelationshipType relationship;

    @Column(name = "created_at", updatable = false, nullable = false)
    @CreationTimestamp
    private Timestamp createdAt;

    public enum RelationshipType{
        FAMILY, FRIEND, OTHERS;
    }
}
