package org.example.appointmentservice.dto;

import lombok.Data;

@Data
public class ExaminationRoomDto {
    private Integer roomId;
    private Integer departmentId;
    private String type;
    private String building;
    private Integer floor;
    private String note;
}
