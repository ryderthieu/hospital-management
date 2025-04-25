package org.example.patientservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.patientservice.entity.RoomDetail;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class RoomDetailDto {
    private Integer detailId;

    private Integer roomId;

    private Integer patientId;

    private String createdAt;

    public RoomDetailDto(RoomDetail roomDetail) {
        this.detailId = roomDetail.getDetailId();
        this.roomId = roomDetail.getRoom() != null ? roomDetail.getRoom().getRoomId() : null;
        this.patientId = roomDetail.getPatient() != null ? roomDetail.getPatient().getPatientId() : null;
        this.createdAt = roomDetail.getCreatedAt() != null ? roomDetail.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
    }
}
