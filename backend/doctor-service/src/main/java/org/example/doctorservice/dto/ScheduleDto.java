package org.example.doctorservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.doctorservice.entity.Schedule;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@NoArgsConstructor
public class ScheduleDto {
    private Integer scheduleId;

    private Integer doctorId;

    @NotNull(message = "Ngày làm việc không được để trống")
    private LocalDate workDate;

    @NotNull(message = "Giờ bắt đầu làm việc không được để trống")
    private LocalTime startTime;

    @NotNull(message = "Giờ kết thúc làm việc không được để trống")
    private LocalTime endTime;

    @NotNull(message = "Ca làm việc không được để trống")
    private Schedule.Shift shift;

    private Integer roomId;

    private String roomNote;

    private Integer floor;

    private String building;

    private String createdAt;

    private List<TimeSlotDto> availableTimeSlots;

    public ScheduleDto(Schedule schedule) {
        this.scheduleId = schedule.getScheduleId();
        this.doctorId = schedule.getDoctor().getDoctorId();
        this.workDate = schedule.getWorkDate();
        this.startTime = schedule.getStartTime();
        this.endTime = schedule.getEndTime();
        this.shift = schedule.getShift();
        this.roomId = schedule.getExaminationRoom().getRoomId();
        this.roomNote = schedule.getExaminationRoom().getNote();
        this.floor = schedule.getExaminationRoom().getFloor();
        this.building = schedule.getExaminationRoom().getBuilding();
        this.createdAt = schedule.getCreatedAt() != null ? schedule.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
    }
}