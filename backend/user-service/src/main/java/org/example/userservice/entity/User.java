package org.example.userservice.entity;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id") // ánh xạ cột chính xác
    private Long userId;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", nullable = true, unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    public enum Role {
        ADMIN, PATIENT, DOCTOR, RECEPTIONIST;
    }
}

