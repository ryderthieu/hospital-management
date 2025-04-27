package org.example.doctorservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.doctorservice.entity.ExaminationRoom;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class ExaminationRoomDto {
    private Integer roomId;

    private Integer departmentId;

    @NotNull(message = "Loại phòng không được để trống")
    private String type;

    @NotBlank(message = "Tòa không được để trống")
    private String building;

    @NotNull(message = "Tầng không được để trống")
    private Integer floor;

    private String note;

    private String createdAt;

    public ExaminationRoomDto(ExaminationRoom examinationRoom) {
        this.roomId = examinationRoom.getRoomId();
        this.departmentId = examinationRoom.getDepartment() != null ? examinationRoom.getDepartment().getDepartmentId() : null;
        this.type = examinationRoom.getType() != null ? examinationRoom.getType().name() : null;
        this.building = examinationRoom.getBuilding();
        this.floor = examinationRoom.getFloor();
        this.note = examinationRoom.getNote();
        this.createdAt = examinationRoom.getCreatedAt() != null ? examinationRoom.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
    }
}
