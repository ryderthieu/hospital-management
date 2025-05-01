package org.example.appointmentservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Integer serviceId;

    @Column(name = "service_name", length = 100)
    private String serviceName;

    @Column(name = "service_type")
    @Enumerated(EnumType.STRING)
    public ServiceType serviceType;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    public enum ServiceType {
        TEST, IMAGING, CONSULTATION, OTHER
    }
}
