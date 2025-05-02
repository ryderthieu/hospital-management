package org.example.patientservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.PatientDto;
import org.example.patientservice.dto.PatientRoomDto;
import org.example.patientservice.entity.Patient;
import org.example.patientservice.entity.PatientRoom;
import org.example.patientservice.repository.PatientRoomRepository;
import org.example.patientservice.service.PatientRoomService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientRoomServiceImpl implements PatientRoomService {

    private final PatientRoomRepository patientRoomRepository;

    @Override
    public List<PatientRoomDto> getAllPatientRooms() {
        return patientRoomRepository
                .findAll()
                .stream()
                .map(PatientRoomDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public PatientRoomDto getPatientRoomById(Integer roomId){
        PatientRoom patientRoom = patientRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + roomId));
        return new PatientRoomDto(patientRoom);
    }

    @Override
    public PatientRoomDto createPatientRoom(PatientRoomDto patientRoomDto) {
        PatientRoom patientRoom = PatientRoom.builder()
                .roomName(patientRoomDto.getRoomName())
                .maxCapacity(patientRoomDto.getMaxCapacity())
                .note(patientRoomDto.getNote())
                .build();

        PatientRoom savedPatientRoom = patientRoomRepository.save(patientRoom);
        return new PatientRoomDto(savedPatientRoom);
    }

    @Override
    public PatientRoomDto updatePatientRoom(Integer roomId, PatientRoomDto patientRoomDto) {
        PatientRoom patientRoom = patientRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + roomId));

        patientRoom.setRoomName(patientRoomDto.getRoomName());
        patientRoom.setMaxCapacity(patientRoomDto.getMaxCapacity());
        patientRoom.setNote(patientRoomDto.getNote());

        PatientRoom updatedPatientRoom = patientRoomRepository.save(patientRoom);

        return new PatientRoomDto(updatedPatientRoom);
    }

    @Override
    public void deletePatientRoom(Integer roomId) {
        PatientRoom patientRoom = patientRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + roomId));

        patientRoomRepository.delete(patientRoom);
    }

    @Override
    public Optional<PatientRoomDto> filterPatientRooms(String roomName, Integer maxCapacity) {
        return patientRoomRepository.findByRoomNameOrMaxCapacity(roomName, maxCapacity)
                .map(PatientRoomDto::new);
    }
}
