package org.example.appointmentservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(name = "room_id")
    private Integer roomId;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Services service;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Column(columnDefinition = "TEXT")
    private String result;

    private Integer number;

    @Column(name = "order_time")
    private LocalDateTime orderTime;

    @Column(name = "result_time")
    private LocalDateTime resultTime;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    public enum OrderStatus {
        ORDERED, COMPLETED
    }
}
