package org.example.patientservice.service;

import org.example.patientservice.dto.PatientRoomDto;
import org.example.patientservice.entity.PatientRoom;

import java.util.List;
import java.util.Optional;

public interface PatientRoomService {
    List<PatientRoomDto> getAllPatientRooms();

    PatientRoomDto getPatientRoomById(Integer roomId);

    PatientRoomDto createPatientRoom(PatientRoomDto patientRoomDto);

    PatientRoomDto updatePatientRoom(Integer roomId,PatientRoomDto patientRoomDto);

    void deletePatientRoom(Integer roomId);

    Optional<PatientRoomDto> filterPatientRooms(String roomName, Integer maxCapacity);
}
