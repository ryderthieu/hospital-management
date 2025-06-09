package org.example.pharmacyservice.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PrescriptionDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatePrescriptionRequest {
        @NotNull(message = "ID cuộc hẹn không được để trống")
        private Long appointmentId;

        @NotNull(message = "ID bệnh nhân không được để trống")
        private Integer patientId;

        private LocalDate followUpDate;

        private boolean isFollowUp;

        @NotBlank(message = "Chẩn đoán không được để trống")
        private String diagnosis;

        @NotNull(message = "Huyết áp tâm thu không được để trống")
        @Min(value = 1, message = "Huyết áp tâm thu phải lớn hơn 0")
        private Integer systolicBloodPressure;

        @NotNull(message = "Huyết áp tâm trương không được để trống")
        @Min(value = 1, message = "Huyết áp tâm trương phải lớn hơn 0")
        private Integer diastolicBloodPressure;

        @NotNull(message = "Nhịp tim không được để trống")
        @Min(value = 1, message = "Nhịp tim phải lớn hơn 0")
        private Integer heartRate;

        @NotNull(message = "Đường huyết không được để trống")
        @Min(value = 1, message = "Đường huyết phải lớn hơn 0")
        private Integer bloodSugar;

        private String note;

        private List<PrescriptionDetailRequest> prescriptionDetails;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdatePrescriptionRequest {
        private LocalDate followUpDate;

        private Boolean isFollowUp;

        private String diagnosis;

        @Min(value = 1, message = "Huyết áp tâm thu phải lớn hơn 0")
        private Integer systolicBloodPressure;

        @Min(value = 1, message = "Huyết áp tâm trương phải lớn hơn 0")
        private Integer diastolicBloodPressure;

        @Min(value = 1, message = "Nhịp tim phải lớn hơn 0")
        private Integer heartRate;

        @Min(value = 1, message = "Đường huyết phải lớn hơn 0")
        private Integer bloodSugar;

        private String note;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrescriptionDetailRequest {
        @NotNull(message = "ID thuốc không được để trống")
        private Long medicineId;

        @NotBlank(message = "Liều lượng không được để trống")
        private String dosage;

        @NotBlank(message = "Tần suất không được để trống")
        private String frequency;

        @NotBlank(message = "Thời gian điều trị không được để trống")
        private String duration;

        @NotNull(message = "Số lượng không được để trống")
        private Integer quantity;

        private String prescriptionNotes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddMedicineToPrescriptionRequest {
        @NotNull(message = "ID đơn thuốc không được để trống")
        private Long prescriptionId;

        @NotNull(message = "ID thuốc không được để trống")
        private Long medicineId;

        @NotBlank(message = "Liều lượng không được để trống")
        private String dosage;

        @NotBlank(message = "Tần suất không được để trống")
        private String frequency;

        @NotBlank(message = "Thời gian điều trị không được để trống")
        private String duration;

        @NotNull(message = "Số lượng không được để trống")
        private Integer quantity;

        private String prescriptionNotes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdatePrescriptionDetailRequest {
        private Long detailId;

        private String dosage;

        private String frequency;

        private String duration;

        private Integer quantity;

        private String prescriptionNotes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrescriptionResponse {
        private Long prescriptionId;
        private Long appointmentId;
        private Integer patientId;
        private LocalDate followUpDate;
        private boolean isFollowUp;
        private String diagnosis;
        private Integer systolicBloodPressure;
        private Integer diastolicBloodPressure;
        private Integer heartRate;
        private Integer bloodSugar;
        private String note;
        private LocalDateTime createdAt;
        private List<PrescriptionDetailResponse> prescriptionDetails;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrescriptionDetailResponse {
        private Long detailId;
        private Long prescriptionId;
        private MedicineDTOs.MedicineResponse medicine;
        private String dosage;
        private String frequency;
        private String duration;
        private String prescriptionNotes;
        private Integer quantity;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrescriptionBasicInfo {
        private Long prescriptionId;
        private Long appointmentId;
        private String diagnosis;
        private LocalDateTime createdAt;
    }
}