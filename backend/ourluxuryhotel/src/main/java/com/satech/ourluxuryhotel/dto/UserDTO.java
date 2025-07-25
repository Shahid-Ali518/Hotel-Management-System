package com.satech.ourluxuryhotel.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@Component
public class UserDTO {

    private Long id;

    private String name;

    private String email;

    private String password;

    private String phoneNumber;

    private String role;

    private List<BookingDTO> bookings = new ArrayList<>();
}
