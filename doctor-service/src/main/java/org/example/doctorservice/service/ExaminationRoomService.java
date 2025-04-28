package org.example.doctorservice.service;

import org.example.doctorservice.dto.ExaminationRoomDto;
import org.example.doctorservice.entity.ExaminationRoom;

import java.util.List;

public interface ExaminationRoomService {
    ExaminationRoomDto getExaminationRoomById(Integer roomId);

    List<ExaminationRoomDto> getAllExaminationRooms();

    ExaminationRoomDto createExaminationRoom(ExaminationRoomDto examinationRoomDto);

    ExaminationRoomDto updateExaminationRoom(Integer roomId, ExaminationRoomDto examinationRoomDto);

    void deleteExaminationRoom(Integer roomId);

    List<ExaminationRoomDto> filterRooms(ExaminationRoom.Type type, String building, Integer floor);
}
