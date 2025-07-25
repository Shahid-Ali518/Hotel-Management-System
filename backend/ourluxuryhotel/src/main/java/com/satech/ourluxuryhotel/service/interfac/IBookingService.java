package com.satech.ourluxuryhotel.service.interfac;

import com.satech.ourluxuryhotel.dto.Response;
import com.satech.ourluxuryhotel.entity.Booking;

public interface IBookingService {

    Response getAllBookings();

    Response saveBooking(Long roomId, Long userId, Booking booking);

    Response findBookingsByRoomId(Long roomId);

    Response findBookingsByConfirmationCode(String ConfirmationCode);

    Response findBookingsByUserId(Long userId);

    Response findBookingById(Long bookingId);

    Response cancelBooking(Long bookingId);







}
