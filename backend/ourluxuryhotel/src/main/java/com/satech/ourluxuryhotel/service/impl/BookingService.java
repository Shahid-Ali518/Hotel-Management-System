package com.satech.ourluxuryhotel.service.impl;

import com.satech.ourluxuryhotel.dto.BookingDTO;
import com.satech.ourluxuryhotel.dto.Response;
import com.satech.ourluxuryhotel.dto.RoomDTO;
import com.satech.ourluxuryhotel.dto.UserDTO;
import com.satech.ourluxuryhotel.entity.Booking;
import com.satech.ourluxuryhotel.entity.Room;
import com.satech.ourluxuryhotel.entity.User;
import com.satech.ourluxuryhotel.exception.AppException;
import com.satech.ourluxuryhotel.repository.BookingRepository;
import com.satech.ourluxuryhotel.repository.RoomRepository;
import com.satech.ourluxuryhotel.repository.UserRepository;
import com.satech.ourluxuryhotel.service.interfac.IBookingService;
import com.satech.ourluxuryhotel.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class BookingService implements IBookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;


    // to get all bookings
    @Override
    public Response getAllBookings() {
        Response response = new Response();
        try{
            List<Booking> bookings = bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
            List<BookingDTO> bookingDTOList = Utils.mapBookingListEntityToBookingListDTO(bookings);
            response.setBookingList(bookingDTOList);
            response.setMessage("successful");
            response.setStatusCode(200);
        }
        catch (AppException ap){
            response.setStatusCode(404); // not found request
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while getting all bookings");
        }
        return response;
    }

    @Override
    public Response saveBooking(Long userId, Long roomId, Booking bookingRequest) {
        Response response = new Response();
        try{
            if(bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())){
                response.setMessage("Check in date must before check out date");
                throw new IllegalArgumentException("Check in date must before check out date");
            }
            Room room = roomRepository.findById(roomId).orElseThrow( () -> new AppException("Room not found"));
            User user = userRepository.findById(userId).orElseThrow( () -> new AppException("User not found"));

            Booking existingBooking = room.getBooking();
            System.out.println(existingBooking);
            if(existingBooking == null){
                room.setBooking(bookingRequest);
            }
            else {
                if(!isRoomAvailable(bookingRequest, existingBooking)){
                    response.setMessage("Room is not available in selected time range");
                    throw new AppException("Room is not available in selected time range");
                }
            }


            bookingRequest.setUser(user);
//            room.setBooking(bookingRequest);
//            List<Room> rooms = new ArrayList<>();
//            rooms.add(room);
//            bookingRequest.setRooms(rooms);
            bookingRequest.getRooms().add(room);
            String bookingConfirmationCode = Utils.generateRandomConfirmationCode(10);
            bookingRequest.setBookingConfirmationCode(bookingConfirmationCode);
            bookingRepository.save(bookingRequest);

            response.setMessage("successful");
            response.setStatusCode(200);
            response.setConfirmationCode(bookingConfirmationCode);
        }
        catch (AppException ap){
            response.setStatusCode(400); // bad request
            response.setMessage("Room is not available in selected time range");
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            response.setMessage("Internal Error occurred while saving a new booking");
            log.error("Error occurred while saving a new booking");
            System.out.println(e.getMessage());
        }
        return response;
    }

    @Override
    public Response findBookingsByRoomId(Long roomId) {
        Response response = new Response();
        try{
            Room room = roomRepository.findById(roomId).orElseThrow(()-> new AppException("Room does not found"));
            List<Booking> bookingList = bookingRepository.findBookingByRoomId(roomId);
            if(bookingList != null && !bookingList.isEmpty()){
                List<BookingDTO> bookingDTOList = Utils.mapBookingListEntityToBookingListDTO(bookingList);
                response.setBookingList(bookingDTOList);
                response.setMessage("successful");
                response.setStatusCode(200);
            }
        }
        catch (AppException ap){
            response.setStatusCode(404); // not found request
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while loading bookings by roomId");
        }
        return response;
    }


    @Override
    public Response findBookingsByConfirmationCode(String bookingConfirmationCode) {
        Response response = new Response();
        try{
            Booking booking = bookingRepository.findBookingByBookingConfirmationCode(bookingConfirmationCode).orElseThrow(()-> new AppException("Booking not found"));

            BookingDTO bookingDTO = Utils.mapBookingEntityToBookingDTOPlusBookedRooms(booking, true);
//            User user = booking.getUser();
//            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);
//            response.setUser(userDTO);
            response.setBooking(bookingDTO);
            response.setMessage("successful");
            response.setStatusCode(200);
        }
        catch (AppException ap){
            response.setStatusCode(404); // not found request
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while getting booking via code");
        }
        return response;
    }

    @Override
    public Response findBookingsByUserId(Long userId) {
        Response response = new Response();
        try{

            User user = userRepository.findById(userId).orElseThrow(()-> new AppException("User does not found"));
//            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);
            List<Booking> bookingList = bookingRepository.findBookingByUserId(userId);
            if(bookingList != null && !bookingList.isEmpty()){
//                List<BookingDTO> bookingDTOList = Utils.mapBookingListEntityToBookingListDTO(bookingList);
                UserDTO userDTO = Utils.mapUserEntityToUserDTOPlusBooking(user);
//                response.setBookingList(bookingDTOList);
                response.setUser(userDTO);
                response.setMessage("successful");
                response.setStatusCode(200);
            }
        }
        catch (AppException ap){
            response.setStatusCode(404); // not found request
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while loading bookings by userId");
        }
        return response;
    }

    @Override
    public Response findBookingById(Long bookingId) {
        return null;
    }

    @Override
    @Transactional
    public Response cancelBooking(Long bookingId) {
        Response response = new Response();
        try{
            Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new AppException("Booking does not exist"));
            System.out.println(booking);
            booking.getRooms().forEach(room -> room.setBooking(null));
            booking.getRooms().clear();
            booking.setUser(null);

//            bookingRepository.saveAndFlush(booking);

            bookingRepository.deleteById(bookingId);
            bookingRepository.flush();
            response.setMessage("Booking of Id " + bookingId + " is deleted successfully!");
            response.setStatusCode(200);
        }
        catch (AppException ap){
            response.setStatusCode(404); // not found request
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while canceling booking ");
            throw e;
        }
        return response;
    }


    // check if room is available
    private boolean isRoomAvailable(Booking bookingRequest, Booking existingBooking){
        if(bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())
            && bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckInDate()))
            return true;

        if(bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckOutDate())
            && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))
            return true;

        else
            return false;
    }
}
