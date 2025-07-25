package com.satech.ourluxuryhotel.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.satech.ourluxuryhotel.dto.BookingDTO;
import com.satech.ourluxuryhotel.dto.Response;
import com.satech.ourluxuryhotel.dto.RoomDTO;
import com.satech.ourluxuryhotel.entity.Booking;
import com.satech.ourluxuryhotel.entity.Room;
import com.satech.ourluxuryhotel.exception.AppException;
import com.satech.ourluxuryhotel.repository.RoomRepository;
import com.satech.ourluxuryhotel.service.interfac.IRoomService;
import com.satech.ourluxuryhotel.service.interfac.IUploadImageService;
import com.satech.ourluxuryhotel.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.ObjectError;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class RoomService implements IRoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private IUploadImageService uploadImageService;

    @Autowired
    private Cloudinary cloudinary;


    @Override
    public Response addNewRoom(MultipartFile photo, String roomType, String description, Double roomPrice) {

        Response response = new Response();
        try{
            Room room = new Room();


            Map<String, Object> photoInfo = uploadImageService.uploadImage(photo, "rooms");
            String imageUrl =  photoInfo.get("secure_url").toString();
            String imageId =  photoInfo.get("public_id").toString();


//            String imageName = photo.getOriginalFilename();
//            byte[] imageData = photo.getBytes();

            room.setRoomType(roomType);
            room.setDescription(description);
            room.setRoomPrice(roomPrice);
            room.setImageUrl(imageUrl);
            room.setImageId(imageId);
//            room.setImageData(imageData);
            Room savedRoom = roomRepository.save(room);
            RoomDTO
                    roomDTO = Utils.mapRoomEntityToRoomDTO(savedRoom);
            response.setRoom(roomDTO);
            response.setStatusCode(201);
            response.setMessage("Successful");

        }
        catch (AppException ap){
            response.setStatusCode(400); // bad request
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while adding a new room");
            System.out.println(e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllRooms() {

        Response response = new Response();

        try{
            List<Room> rooms = roomRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
            List<RoomDTO> roomDTOList = Utils.mapRoomListEntityToRoomListDTO(rooms);
            response.setRoomList(roomDTOList);
            response.setStatusCode(200);
            response.setMessage("Successful");

        }
        catch (AppException ap){
            response.setStatusCode(404); // not found
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while loading rooms");
        }
        return response;
    }

    @Override
    public List<String> getAllRoomTypes() {
        return roomRepository.findDistinctRoomTypes();
    }


    @Override
    public Response deleteRoom(Long roomId) {

        Response response = new Response();

        try{
            Room room = roomRepository.findById(roomId).orElseThrow(() -> new AppException("Room not found"));

            String publicId = room.getImageId();

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

            roomRepository.deleteById(roomId);
            response.setStatusCode(200);
            response.setMessage("Successful");

        }
        catch (AppException ap){
            response.setStatusCode(404); // not found
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while deleting room");
            System.out.println(e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateRoom(Long roomId, MultipartFile photo, String roomType, String description, Double roomPrice) {
        Response response = new Response();

        try{
            Room room = roomRepository.findById(roomId).orElseThrow( () -> new AppException("Room Not Found"));

            if(photo != null && photo.isEmpty()){
                Map<String, Object> fileInfo = uploadImageService.uploadImage(photo, "rooms");
//                imageName = photo.getOriginalFilename();
//                imageData = photo.getBytes();
                String imageUrl = fileInfo.get("secure_url").toString();
                String imageId = fileInfo.get("public_id").toString();
                room.setImageUrl(imageUrl);
                room.setImageId(imageId);
//                room.setImageData(imageData);

            }
            if(description!= null)
                room.setDescription(description);
            if(roomPrice != null)
                room.setRoomPrice(roomPrice);
            if(roomType != null)
                room.setRoomType(roomType);

            Room updatedRoom = roomRepository.save(room);
            RoomDTO roomDTO = Utils.mapRoomEntityToRoomDTO(updatedRoom);
            response.setRoom(roomDTO);
            response.setStatusCode(201);
            response.setMessage("Successful");

        }
        catch (AppException ap){
            response.setStatusCode(400); // bad request
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while updating a room");
        }
        return response;
    }

    @Override
    public Response getRoomById(Long roomId) {
        Response response = new Response();
        try{
            Room room = roomRepository.findById(roomId).orElseThrow(() -> new AppException("Room not found"));
            RoomDTO roomDTO = Utils.mapRoomEntityToRoomDTO(room);
//            Booking booking = room.getBooking();
//            BookingDTO bookingDTO = Utils.mapBookingEntityToBookingDTO(booking);
            response.setRoom(roomDTO);
//            response.setBooking(bookingDTO);
            response.setStatusCode(200);
            response.setMessage("Successful");

        }
        catch (AppException ap){
            response.setStatusCode(404); // not found
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            System.out.println(e.getMessage());
            log.error("Error occurred while loading room");
        }
        return response;
    }

    @Override
    public Response getAvailableRoomsByDateAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
        Response response = new Response();
        try{
            List<Room> rooms = roomRepository.getAvailableRoomsByDatesAndTypes(checkInDate, checkOutDate, roomType);
                List<RoomDTO> roomDTOList = Utils.mapRoomListEntityToRoomListDTO(rooms);
                response.setRoomList(roomDTOList);
                response.setStatusCode(200);
                response.setMessage("Successful");
                System.out.println("here room service");

        }
        catch (AppException ap){
            response.setStatusCode(404); // not found
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while getting rooms");
        }
        return response;
    }

    @Override
    public Response getAvailableRooms() {
        Response response = new Response();
        try{
            List<Room> rooms = roomRepository.getAvailableRooms();
            List<RoomDTO> roomDTOList = Utils.mapRoomListEntityToRoomListDTO(rooms);
            response.setRoomList(roomDTOList);
            response.setStatusCode(200);
            response.setMessage("Successful");

        }
        catch (AppException ap){
            response.setStatusCode(404); // not found
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while getting available rooms");
        }
        return response;
    }

}


