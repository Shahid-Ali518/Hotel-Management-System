package com.satech.ourluxuryhotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.satech.ourluxuryhotel.entity.Booking;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int statusCode;
    private String message;

    private String token;
    private String role;
    private String expirationTime;
    private String confirmationCode;

    private UserDTO user;
    private RoomDTO room;
    private BookingDTO booking;
    private List<UserDTO> userList;
    private List<RoomDTO> roomList;
    private List<BookingDTO> bookingList;

}
