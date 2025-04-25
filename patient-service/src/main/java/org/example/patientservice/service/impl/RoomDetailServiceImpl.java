package org.example.patientservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.RoomDetailDto;
import org.example.patientservice.entity.Patient;
import org.example.patientservice.entity.PatientRoom;
import org.example.patientservice.entity.RoomDetail;
import org.example.patientservice.repository.PatientRepository;
import org.example.patientservice.repository.PatientRoomRepository;
import org.example.patientservice.repository.RoomDetailRepository;
import org.example.patientservice.service.RoomDetailService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoomDetailServiceImpl implements RoomDetailService {

    private final RoomDetailRepository roomDetailRepository;
    private final PatientRepository patientRepository;
    private final PatientRoomRepository patientRoomRepository;

    public RoomDetailServiceImpl(RoomDetailRepository roomDetailRepository,
                                 PatientRoomRepository patientRoomRepository,
                                 PatientRepository patientRepository) {
        this.roomDetailRepository = roomDetailRepository;
        this.patientRoomRepository = patientRoomRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public List<RoomDetail> getAllRoomDetails(){
        return roomDetailRepository.findAll();
    }

    @Override
    public RoomDetail getRoomDetailById(Integer detailId) {
        return roomDetailRepository.findById(detailId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết phòng với ID: " + detailId));
    }

    @Override
    public RoomDetail createRoomDetail(RoomDetailDto roomDetailDto) {
        Patient patient = patientRepository.findById(roomDetailDto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        PatientRoom room = patientRoomRepository.findById(roomDetailDto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        RoomDetail roomDetail = RoomDetail.builder()
                .patient(patient)
                .room(room)
                .build();

        return roomDetailRepository.save(roomDetail);
    }

    @Override
    public List<RoomDetail> getRoomDetailsByRoomId(Integer roomId) {
        return roomDetailRepository.findByRoom_RoomId(roomId);
    }

    @Override
    public void deleteRoomDetail(Integer detailId) {
        RoomDetail roomDetail = roomDetailRepository.findById(detailId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết phòng với ID: " + detailId));

        roomDetailRepository.delete(roomDetail);
    }
}
