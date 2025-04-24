package org.example.patientservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.PatientRoomDto;
import org.example.patientservice.entity.PatientRoom;
import org.example.patientservice.repository.PatientRoomRepository;
import org.example.patientservice.service.PatientRoomService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientRoomServiceImpl implements PatientRoomService {

    private final PatientRoomRepository patientRoomRepository;

    @Override
    public List<PatientRoom> getAllPatientRooms() {
        return patientRoomRepository.findAll();
    }

    @Override
    public PatientRoom getPatientRoomById(Integer roomId){
        return patientRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + roomId));
    }

    @Override
    public PatientRoom createPatientRoom(PatientRoomDto patientRoomDto) {
        PatientRoom patientRoom = PatientRoom.builder()
                .roomName(patientRoomDto.getRoomName())
                .maxCapacity(patientRoomDto.getMaxCapacity())
                .note(patientRoomDto.getNote())
                .build();

        return patientRoomRepository.save(patientRoom);
    }

    @Override
    public PatientRoom updatePatientRoom(Integer roomId, PatientRoomDto patientRoomDto) {
        PatientRoom patientRoom = patientRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + roomId));

        patientRoom.setRoomName(patientRoomDto.getRoomName());
        patientRoom.setMaxCapacity(patientRoomDto.getMaxCapacity());
        patientRoom.setNote(patientRoomDto.getNote());

        return patientRoomRepository.save(patientRoom);
    }

    @Override
    public void deletePatientRoom(Integer roomId) {
        PatientRoom patientRoom = patientRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + roomId));

        patientRoomRepository.delete(patientRoom);
    }

    @Override
    public List<PatientRoom> searchPatientRoomsByRoomName(String filter) {
        if (filter != null) {
            return patientRoomRepository.findByRoomName(filter);
        }
        return new ArrayList<>();
    }

    @Override
    public List<PatientRoom> searchPatientRoomsByMaxCapacity(Integer filter) {
        if (filter != null) {
            return patientRoomRepository.findByMaxCapacity(filter);
        }
        return new ArrayList<>();
    }
}
