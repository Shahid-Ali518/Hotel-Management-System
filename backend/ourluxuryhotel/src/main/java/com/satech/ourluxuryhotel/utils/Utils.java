package com.satech.ourluxuryhotel.utils;

import com.satech.ourluxuryhotel.dto.BookingDTO;
import com.satech.ourluxuryhotel.dto.RoomDTO;
import com.satech.ourluxuryhotel.dto.UserDTO;
import com.satech.ourluxuryhotel.entity.Booking;
import com.satech.ourluxuryhotel.entity.Room;
import com.satech.ourluxuryhotel.entity.User;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Utils {

    private static final String ALPHANUMERIC_STRING =  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private static final SecureRandom secureRandom = new SecureRandom();

    // method to generate confirmation code
    public static String generateRandomConfirmationCode(int length){
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(ALPHANUMERIC_STRING.length());
            char randomChar = ALPHANUMERIC_STRING.charAt(randomIndex);
            stringBuilder.append(randomChar);

        }
        return stringBuilder.toString();
    }

// user to userDTO
    public static UserDTO mapUserEntityToUserDTO(User user){
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setRole(user.getRole());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        return userDTO;
    }

// user to userDTO with bookings
    public static UserDTO mapUserEntityToUserDTOPlusBooking(User user){
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setRole(user.getRole());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());

        if(!user.getBookings().isEmpty()){
            userDTO.setBookings(user.getBookings().stream().map(booking -> mapBookingEntityToBookingDTOPlusBookedRooms(booking, true)).toList());
        }
        return userDTO;
    }

// room to roomDTO
    public static RoomDTO mapRoomEntityToRoomDTO(Room room){
        RoomDTO roomDTO = new RoomDTO();
        roomDTO.setId(room.getId());
        roomDTO.setDescription(room.getDescription());
        roomDTO.setRoomType(room.getRoomType());
        roomDTO.setRoomPrice(room.getRoomPrice());
        roomDTO.setImageUrl(room.getImageUrl());
        roomDTO.setImageId(room.getImageId());
//        roomDTO.setImageData(room.getImageData());

        return roomDTO;
    }

// room to roomDTO with booking
    public static RoomDTO mapRoomEntityToRoomDTOPlusBooking(Room room){
        RoomDTO roomDTO = new RoomDTO();
        roomDTO.setId(room.getId());
        roomDTO.setDescription(room.getDescription());
        roomDTO.setRoomType(room.getRoomType());
        roomDTO.setRoomPrice(room.getRoomPrice());
        roomDTO.setImageUrl(room.getImageUrl());
        roomDTO.setImageId(room.getImageId());
//        roomDTO.setImageData(room.getImageData());

        if(room.getBooking() != null){
            roomDTO.setBooking(room.getBooking());
        }
        return roomDTO;
    }

// booking to bookingDTO
    public static BookingDTO mapBookingEntityToBookingDTO(Booking booking){
        BookingDTO bookingDTO = new BookingDTO();

        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfGuests(booking.getNumOfGuests());
        bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());
        List<Room> rooms = booking.getRooms();
        List<RoomDTO> roomDTOS = mapRoomListEntityToRoomListDTO(rooms);
        bookingDTO.setRooms(roomDTOS);
        return bookingDTO;
    }

// booking to bookingDTO with rooms and user
    public static BookingDTO mapBookingEntityToBookingDTOPlusBookedRooms(Booking booking, boolean mapUser){
        BookingDTO bookingDTO = new BookingDTO();

        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfGuests(booking.getNumOfGuests());
        bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());
//        bookingDTO.setUser(booking.getUser());
        List<Room> rooms = booking.getRooms();
        List<RoomDTO> roomDTOS = Utils.mapRoomListEntityToRoomListDTO(rooms);
        bookingDTO.setRooms(roomDTOS);


//        if(mapUser){
//            bookingDTO.setUser(booking.getUser());
////            User user = booking.getUser();
////            user.setBookings();
//        }


        return bookingDTO;
    }

    public static List<UserDTO> mapUserListEntityToUserListDTO(List<User> userList){
        return userList.stream().map(Utils::mapUserEntityToUserDTO).collect(Collectors.toList());
    }

public static List<RoomDTO> mapRoomListEntityToRoomListDTO(List<Room> roomList){
        return roomList.stream().map(Utils::mapRoomEntityToRoomDTO).collect(Collectors.toList());
    }

    public static List<BookingDTO> mapBookingListEntityToBookingListDTO(List<Booking> bookingList){
        return bookingList.stream().map(Utils::mapBookingEntityToBookingDTO).collect(Collectors.toList());
    }


}
