package org.example.patientservice.service;

import org.example.patientservice.dto.PatientRoomDto;
import org.example.patientservice.entity.PatientRoom;

import java.util.List;

public interface PatientRoomService {
    List<PatientRoom> getAllPatientRooms();

    PatientRoom getPatientRoomById(Integer roomId);

    PatientRoom createPatientRoom(PatientRoomDto patientRoomDto);

    PatientRoom updatePatientRoom(Integer roomId,PatientRoomDto patientRoomDto);

    void deletePatientRoom(Integer roomId);

    List<PatientRoom> searchPatientRoomsByRoomName(String filter);

    List<PatientRoom> searchPatientRoomsByMaxCapacity(Integer filter);
}
