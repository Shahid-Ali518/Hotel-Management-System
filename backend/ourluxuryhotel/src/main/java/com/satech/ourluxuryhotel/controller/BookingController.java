package com.satech.ourluxuryhotel.controller;

import com.satech.ourluxuryhotel.dto.Response;
import com.satech.ourluxuryhotel.entity.Booking;
import com.satech.ourluxuryhotel.service.interfac.IBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private IBookingService bookingService;

    @GetMapping("/all-bookings")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllBookings(){
        Response response = bookingService.getAllBookings();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/save-booking/{userId}/{roomId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<Response> saveBooking(@PathVariable Long userId,
                                                @PathVariable Long roomId,
                                                @RequestBody Booking bookingRequest){

        Response response = bookingService.saveBooking(userId, roomId, bookingRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-booking-confirmation-code/{confirmationCode}")
    public ResponseEntity<Response> getBookingByConfirmationCode(@PathVariable String confirmationCode){
        Response response = bookingService.findBookingsByConfirmationCode(confirmationCode);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-user-bookings/{userId}")
    public ResponseEntity<Response> getUserBookings(@PathVariable Long userId){
        Response response = bookingService.findBookingsByUserId(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping ("/cancel-booking/{bookingId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<Response> cancelBooking(@PathVariable Long bookingId){
        Response response = bookingService.cancelBooking(bookingId);
        bookingService.cancelBooking(bookingId);

        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


}
