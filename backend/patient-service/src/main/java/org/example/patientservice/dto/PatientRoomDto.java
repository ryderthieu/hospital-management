package org.example.patientservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PatientRoomDto {
    @NotBlank(message = "Tên phòng không được để trống")
    private String roomName;
    @NotBlank(message = "Số lượng người tối đa không được để trống")
    private Integer maxCapacity;
    private String note;
}
