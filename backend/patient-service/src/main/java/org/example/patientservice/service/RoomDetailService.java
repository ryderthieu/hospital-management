package org.example.patientservice.service;

import org.example.patientservice.dto.RoomDetailDto;
import org.example.patientservice.entity.RoomDetail;

import java.util.List;

public interface RoomDetailService {

    List<RoomDetailDto> getAllRoomDetails();

    RoomDetailDto getRoomDetailById(Integer detailId);

    RoomDetailDto createRoomDetail(RoomDetailDto roomDetailDto);

    RoomDetailDto updateRoomDetail(Integer detailId, RoomDetailDto roomDetailDto);

    List<RoomDetailDto> getRoomDetailsByRoomId(Integer roomId);

    void deleteRoomDetail(Integer detailId);
}
