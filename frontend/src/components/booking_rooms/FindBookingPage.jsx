import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import './FindBooking.css';
import useTitle from "../hooks/useTitle";

const FindBookingPage = () => {

    // set title of the page
    useTitle("Find Booking");

    const [code, setCode] = useState('')
    const [booking, setBooking] = useState('')
    const [room, setRoom] = useState('')
    const [error, setError] = useState('')


    const navigate = useNavigate();



    const handleBookingSearch = async () => {
        try {

            const booking = await ApiService.getBookingByCode(code);
            setBooking(booking);
            if(booking.statusCode === 404){
                setError('Booking not found. Please enter correct confirmation code.');
            }
            
        }
        catch (error) {
            setError(error.message?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    }


    return (

        <div className="find-booking-container">

            <div className="heading">
                <h1>Find Booking</h1>
            </div>

            <div className="booking-search">

                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="Enter your booking confirmation code"
                />

                <button onClick={handleBookingSearch}>
                    Search
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {booking && (
                <div className="booing-info">
                    <h3>Booking information</h3>
                    <p><b>Confirmation Code: </b>{booking.bookingConfirmationCode}</p>
                    <p><b>Check-in Date: </b>{booking.checkInDate}</p>
                    <p><b>Check-out Date: </b>{booking.checkOutDate}</p>

                    <h3>Room Information</h3>
                    {  booking.rooms.map((room, index) => (
                       <div key={index} className="room-info">
                         <img src={room.imageUrl} alt={room.roomType} />
                        <h4> {room.roomType} </h4>
                        <p><b>Description: </b>{room.description}</p>
                        
                       </div>
                    ))}

                </div>
            )}

        </div>
    )
}
export default FindBookingPage;