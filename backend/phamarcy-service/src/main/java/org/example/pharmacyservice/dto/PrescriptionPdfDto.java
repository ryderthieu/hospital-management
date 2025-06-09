package org.example.pharmacyservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionPdfDto {
    // Thông tin bệnh nhân
    private Integer patientId;
    private String patientName;
    private String patientGender;
    private LocalDate patientBirthday;
    private String patientPhone;
    private String patientEmail;
    private String patientAvatar;
    private String patientAddress;
    private String patientIdentityNumber;
    private String patientInsuranceNumber;
    
    // Thông tin bác sĩ
    private Integer doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String doctorAcademicDegree;
    private String doctorDepartment;
    
    // Thông tin đơn thuốc
    private Long prescriptionId;
    private LocalDate prescriptionDate;
    private String diagnosis;
    private Integer systolicBloodPressure;
    private Integer diastolicBloodPressure;
    private Integer heartRate;
    private Integer bloodSugar;
    private String note;
    private LocalDate followUpDate;
    private boolean isFollowUp;
    
    // Chi tiết thuốc
    private List<PrescriptionDetailInfo> prescriptionDetails;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrescriptionDetailInfo {
        private String medicineName;
        private String unit;
        private String dosage;
        private String frequency;
        private String duration;
        private String prescriptionNotes;
        private Integer quantity;
    }
} 