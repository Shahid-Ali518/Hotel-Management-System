package com.satech.ourluxuryhotel.service.interfac;

import com.satech.ourluxuryhotel.dto.Response;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface IRoomService {


    Response addNewRoom(MultipartFile photo, String roomType, String description, Double roomPrice);

    Response getAllRooms();

    List<String> getAllRoomTypes();

    Response deleteRoom(Long roomId);

    Response updateRoom(Long roomId, MultipartFile photo, String roomType, String description, Double roomPrice );

    Response getRoomById(Long roomId);

    Response getAvailableRoomsByDateAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType);

    Response getAvailableRooms();


}
