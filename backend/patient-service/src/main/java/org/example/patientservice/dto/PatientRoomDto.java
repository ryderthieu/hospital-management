package org.example.patientservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.patientservice.entity.PatientRoom;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class PatientRoomDto {
    private Integer roomId;

    @NotBlank(message = "Tên phòng không được để trống")
    private String roomName;

    @NotNull(message = "Số lượng người tối đa không được để trống")
    private Integer maxCapacity;

    private String note;

    private String createdAt;

    public PatientRoomDto(PatientRoom patientRoom) {
        this.roomId = patientRoom.getRoomId();
        this.roomName = patientRoom.getRoomName();
        this.maxCapacity = patientRoom.getMaxCapacity();
        this.note = patientRoom.getNote();
        this.createdAt = patientRoom.getCreatedAt() != null ? patientRoom.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
    }
}
