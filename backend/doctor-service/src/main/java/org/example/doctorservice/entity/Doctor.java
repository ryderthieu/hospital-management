package org.example.doctorservice.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "doctors")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Integer doctorId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "identity_number", unique = true, length = 20)
    private String identityNumber;

    @Column(name = "full_name")
    private String fullName;

    private LocalDate birthday;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "academic_degree")
    @Enumerated(EnumType.STRING)
    private AcademicDegree academicDegree;

    @Column(length = 100)
    private String specialization;

    @Column(name = "avatar")
    private String avatar;

    @Enumerated(EnumType.STRING)
    private Type type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "consultation_fee")
    private BigDecimal consultationFee;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;


    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum AcademicDegree {
        BS("BS"),
        BS_CKI("BS CKI"),
        BS_CKII("BS CKII"),
        THS_BS("ThS.BS"),
        TS_BS("TS.BS"),
        PGS_TS_BS("PGS.TS.BS"),
        GS_TS_BS("GS.TS.BS");

        private final String value;

        AcademicDegree(String value) {
            this.value = value;
        }

        @JsonValue
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static AcademicDegree fromValue(String value) {
            for (AcademicDegree degree : values()) {
                if (degree.value.equalsIgnoreCase(value)) {
                    return degree;
                }
            }
            throw new IllegalArgumentException("Không có giá trị: " + value);
        }
    }

    public enum Type {
        EXAMINATION, SERVICE
    }
    @PrePersist
    public void prePersist() {
        if (this.avatar == null || this.avatar.trim().isEmpty()) {
            this.avatar = "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg";
        }
        if (this.consultationFee == null) {
            this.consultationFee = new BigDecimal("200000");
        }
    }
}