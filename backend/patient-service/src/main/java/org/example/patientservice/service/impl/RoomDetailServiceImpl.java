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
import java.util.stream.Collectors;

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
    public List<RoomDetailDto> getAllRoomDetails(){

        return roomDetailRepository.findAll()
                .stream()
                .map(RoomDetailDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public RoomDetailDto getRoomDetailById(Integer detailId) {
        RoomDetail roomDetail = roomDetailRepository.findById(detailId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết phòng với ID: " + detailId));
        return new RoomDetailDto(roomDetail);
    }

    @Override
    public RoomDetailDto createRoomDetail(RoomDetailDto roomDetailDto) {
        Patient patient = patientRepository.findById(roomDetailDto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        PatientRoom room = patientRoomRepository.findById(roomDetailDto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        RoomDetail roomDetail = RoomDetail.builder()
                .patient(patient)
                .room(room)
                .build();

        RoomDetail savedRoomDetail = roomDetailRepository.save(roomDetail);
        return new RoomDetailDto(savedRoomDetail);
    }

    @Override
    public RoomDetailDto updateRoomDetail(Integer detailId, RoomDetailDto roomDetailDto) {
        RoomDetail roomDetail = roomDetailRepository.findById(detailId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết phòng với ID: " + detailId));

        Patient patient = patientRepository.findById(roomDetailDto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        PatientRoom room = patientRoomRepository.findById(roomDetailDto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        roomDetail.setPatient(patient);
        roomDetail.setRoom(room);

        RoomDetail updatedRoomDetail = roomDetailRepository.save(roomDetail);
        return new RoomDetailDto(updatedRoomDetail);
    }


    @Override
    public List<RoomDetailDto> getRoomDetailsByRoomId(Integer roomId) {
        return roomDetailRepository
                .findByRoom_RoomId(roomId)
                .stream()
                .map(RoomDetailDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteRoomDetail(Integer detailId) {
        RoomDetail roomDetail = roomDetailRepository.findById(detailId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết phòng với ID: " + detailId));

        roomDetailRepository.delete(roomDetail);
    }
}
