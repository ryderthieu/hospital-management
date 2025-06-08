package org.example.doctorservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "department_name", length = 100)
    private String departmentName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "head_doctor_id")
    private Integer headDoctorId;

    @Column(name = "founded_year")
    private Integer foundedYear;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ExaminationRoom> examinationRooms = new ArrayList<>();
}
