package org.example.patientservice.service;

import org.example.patientservice.dto.RoomDetailDto;
import org.example.patientservice.entity.RoomDetail;

import java.util.List;

public interface RoomDetailService {

    List<RoomDetail> getAllRoomDetails();

    RoomDetail getRoomDetailById(Integer detailId);

    RoomDetail createRoomDetail(RoomDetailDto roomDetailDto);

    List<RoomDetail> getRoomDetailsByRoomId(Integer roomId);

    void deleteRoomDetail(Integer detailId);
}
