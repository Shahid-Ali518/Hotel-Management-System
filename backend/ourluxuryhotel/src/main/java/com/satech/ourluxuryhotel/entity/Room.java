package com.satech.ourluxuryhotel.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "room")

public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomType;
    private Double roomPrice;
    private String description;
    private String imageUrl; // to store image url in cloudinary cloud storage
    private String imageId; // to store image id on cloudinary cloud storage, useful to delete image from cloud


   // @Lob // large object
   // private byte[] imageData; // to store image data in the form of bytes in database

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", roomType='" + roomType + '\'' +
                ", roomPrice=" + roomPrice +
                ", description='" + description + '\'' +
                ", imageName='" + imageUrl + '\'' +
                ", imageName='" + imageId + '\'' +
                ", bookings=" + booking +
                '}';
    }
}
