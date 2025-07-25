package com.satech.ourluxuryhotel.repository;

import com.satech.ourluxuryhotel.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b JOIN b.rooms r WHERE r.id = :roomId")
    List<Booking> findBookingByRoomId(Long roomId);

    Optional<Booking> findBookingByBookingConfirmationCode(String bookingConfirmationCode);

    @Query("SELECT b FROM Booking b JOIN b.user u WHERE u.id = :userId")
    List<Booking> findBookingByUserId(Long userId);
}
