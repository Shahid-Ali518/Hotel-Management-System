package com.satech.ourluxuryhotel.repository;

import com.satech.ourluxuryhotel.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository  extends JpaRepository<Room, Long> {

    // method to find rooms with distinct roomtypes
    @Query("SELECT DISTINCT r.roomType FROM Room r")
    List<String> findDistinctRoomTypes ();


    // method to find rooms which are not booked
    @Query("SELECT r FROM Room r WHERE r.id NOT IN (SELECT r2.id FROM Booking b JOIN b.rooms r2)")
    List<Room> getAvailableRooms();

    // method to find rooms with date and types
    @Query("SELECT r FROM Room r WHERE r.roomType LIKE %:roomType% AND r.id NOT IN (" +
            "SELECT r2.id FROM Booking b JOIN b.rooms r2 " +
            "WHERE b.checkInDate <= :checkOutDate AND b.checkOutDate >= :checkInDate)")
    List<Room> getAvailableRoomsByDatesAndTypes(@Param("checkInDate") LocalDate checkInDate,
                                                @Param("checkOutDate") LocalDate checkOutDate,
                                                @Param("roomType") String roomType);

}
