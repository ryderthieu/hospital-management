package org.example.doctorservice.service.Impl;

import lombok.AllArgsConstructor;
import org.example.doctorservice.dto.ExaminationRoomDto;
import org.example.doctorservice.entity.Department;
import org.example.doctorservice.entity.Doctor;
import org.example.doctorservice.entity.ExaminationRoom;
import org.example.doctorservice.repository.DepartmentRepository;
import org.example.doctorservice.repository.ExaminationRoomRepository;
import org.example.doctorservice.service.ExaminationRoomService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ExaminationRoomServiceImpl implements ExaminationRoomService {
    private final ExaminationRoomRepository examinationRoomRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public ExaminationRoomDto getExaminationRoomById(Integer roomId) {
        ExaminationRoom examinationRoom = examinationRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + roomId));

        return new ExaminationRoomDto(examinationRoom);
    }

    @Override
    public List<ExaminationRoomDto> getAllExaminationRooms() {
        List<ExaminationRoom> rooms = examinationRoomRepository.findAll();
        return rooms
                .stream()
                .map(ExaminationRoomDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public ExaminationRoomDto createExaminationRoom(ExaminationRoomDto examinationRoomDto) {
        Department department = departmentRepository.findById(examinationRoomDto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Khoa không được tìm thấy"));
        ExaminationRoom examinationRoom = ExaminationRoom.builder()
                .department(department)
                .type(examinationRoomDto.getType())
                .building(examinationRoomDto.getBuilding())
                .floor(examinationRoomDto.getFloor())
                .note(examinationRoomDto.getNote())
                .build();

        ExaminationRoom savedExaminationRoom = examinationRoomRepository.save(examinationRoom);
        return new ExaminationRoomDto(savedExaminationRoom);
    }

    @Override
    public ExaminationRoomDto updateExaminationRoom(Integer roomId, ExaminationRoomDto examinationRoomDto) {
        ExaminationRoom examinationRoom = examinationRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + roomId));

        if (examinationRoomDto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(examinationRoomDto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Khoa không được tìm thấy"));
            examinationRoom.setDepartment(department);
        }

        examinationRoom.setType(examinationRoomDto.getType());
        examinationRoom.setBuilding(examinationRoomDto.getBuilding());
        examinationRoom.setFloor(examinationRoomDto.getFloor());
        examinationRoom.setNote(examinationRoomDto.getNote());

        ExaminationRoom updatedExaminationRoom = examinationRoomRepository.save(examinationRoom);
        return new ExaminationRoomDto(updatedExaminationRoom);
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
        return rooms
                .stream()
                .map(ExaminationRoomDto::new)
                .collect(Collectors.toList());
    }
}
