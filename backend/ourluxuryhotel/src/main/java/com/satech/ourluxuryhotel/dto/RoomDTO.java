package com.satech.ourluxuryhotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.satech.ourluxuryhotel.entity.Booking;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@Component
public class RoomDTO {

    private Long id;

    private String roomType;
    private Double roomPrice;
    private String description;
    private String imageUrl;
    private String imageId;
//    private byte[] imageData;
    private Booking booking;
}
