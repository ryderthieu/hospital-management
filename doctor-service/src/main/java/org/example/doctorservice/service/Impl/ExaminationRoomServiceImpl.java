package org.example.doctorservice.service.Impl;

import lombok.AllArgsConstructor;
import org.example.doctorservice.dto.ExaminationRoomDto;
import org.example.doctorservice.entity.ExaminationRoom;
import org.example.doctorservice.repository.ExaminationRoomRepository;
import org.example.doctorservice.service.ExaminationRoomService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ExaminationRoomServiceImpl implements ExaminationRoomService {
    private ExaminationRoomRepository examinationRoomRepository;

    @Override
    public ExaminationRoomDto getExaminationRoomById(Integer roomId) {
        ExaminationRoom examinationRoom = examinationRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + roomId));

        return new ExaminationRoomDto(examinationRoom);
    }

    @Override
    public List<ExaminationRoomDto> getAllExaminationRooms() {
        List<ExaminationRoom> rooms = examinationRoomRepository.findAll();
        return rooms.stream()
                .map(ExaminationRoomDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public ExaminationRoom createExaminationRoom(ExaminationRoomDto examinationRoomDto) {
        ExaminationRoom examinationRoom = ExaminationRoom.builder()
                .type(examinationRoomDto.getType() != null ? ExaminationRoom.Type.valueOf(examinationRoomDto.getType()) : null)
                .building(examinationRoomDto.getBuilding())
                .floor(examinationRoomDto.getFloor())
                .note(examinationRoomDto.getNote())
                .build();

        return examinationRoomRepository.save(examinationRoom);
    }

    @Override
    public ExaminationRoom updateExaminationRoom(Integer roomId, ExaminationRoomDto examinationRoomDto) {
        ExaminationRoom examinationRoom = examinationRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + roomId));

        examinationRoom.setType(examinationRoomDto.getType() != null ? ExaminationRoom.Type.valueOf(examinationRoomDto.getType()) : null);
        examinationRoom.setBuilding(examinationRoomDto.getBuilding());
        examinationRoom.setFloor(examinationRoomDto.getFloor());
        examinationRoom.setNote(examinationRoomDto.getNote());

        return examinationRoomRepository.save(examinationRoom);
    }

    @Override
    public void deleteExaminationRoom(Integer roomId) {
        ExaminationRoom examinationRoom = examinationRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + roomId));

        examinationRoomRepository.delete(examinationRoom);
    }

    @Override
    public List<ExaminationRoomDto> filterRooms(ExaminationRoom.Type type, String building, Integer floor) {
        List<ExaminationRoom> rooms = examinationRoomRepository.findRoomsByFilters(type, building, floor);
        return rooms.stream()
                .map(room -> new ExaminationRoomDto(room))
                .collect(Collectors.toList());
    }
}
