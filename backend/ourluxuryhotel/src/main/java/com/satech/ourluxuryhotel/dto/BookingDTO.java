package com.satech.ourluxuryhotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.satech.ourluxuryhotel.entity.User;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@Component
public class BookingDTO {

    private Long id;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private int numOfAdults;

    private int numOfChildren;

    private int numOfGuests;

    private String bookingConfirmationCode;

    private User user;

    private List<RoomDTO> rooms;
}
