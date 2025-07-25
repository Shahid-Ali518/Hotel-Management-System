import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ApiSerice from "../services/ApiService";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import useTitle from "../hooks/useTitle";


const RoomDetailsPage = () => {

    // set title of the page
    useTitle("Book Room");

    const navigate = useNavigate();
    const { roomId } = useParams();
    const [roomDetails, setRoomDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [numAdults, setNumAdults] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [totalGuest, setTotalGuest] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [userId, setUserId] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {

                console.log("hello");
                const data = await ApiSerice.getRoomById(roomId);
                console.log(data);
                setRoomDetails(data.room);
                const userProfile = await ApiSerice.getUserProfile();
                // console.log(userProfile.user.id)
                setUserId(userProfile.user.id);
            }
            catch (error) {
                setError(error.message?.data?.message || error.message);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [roomId]);

    const handleConfirmBooking = () => {
        if (!checkInDate || !checkOutDate) {
            setErrorMessage("Please select check-in and check-out dates.");
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }
        if (isNaN(numAdults) || numAdults < 1 || isNaN(numChildren) || numChildren < 0) {
            setErrorMessage("Please enter valid numbers for adults and children.");
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        // calculate total numbers of days
        const oneDay = 24 * 60 * 60 * 1000;
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);
        const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

        // calculate total number of children
        const totalNumGuest = numAdults + numChildren;

        // calculate total price
        const roomPricePerNight = roomDetails.roomPrice;
        const totalPriceBooking = roomPricePerNight * totalDays;

        setTotalGuest(parseInt(totalNumGuest));
        setTotalPrice(parseInt(totalPriceBooking));

    };

    const acceptBooking = async () => {
        try {

            const startDate = new Date(checkInDate);
            const endDate = new Date(checkOutDate);

            const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

            // booking js object
            const booking = {
                checkInDate: formattedCheckInDate,
                checkOutDate: formattedCheckOutDate,
                numOfAdults: numAdults,
                numOfChildren: numChildren
            };

            // make booking
            const response = await ApiSerice.bookRoom(userId, roomId, booking);
            if (response.statusCode === 200) {
                setConfirmationCode(response.bookingConfrimationCode);
                setShowMessage(true);
                // disappear message and navigate to rooms page 
                setTimeout(() => {
                    setShowMessage(false)
                    navigate('/rooms');
                }, 10000)
            }

        }
        catch (error) {
            setError(error.message?.data?.message || error.message);
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    if (isLoading) {
        return <p className="room-detail-loading">Loading Room Details...</p>
    }

    if (error) {
        return (
            <div className="room-detail-loading">
                 <p >{error}</p>
                 <a  href="/rooms"> Try Again </a>
            </div>
       
        )
    }
    if (!roomDetails) {
        return (
            <div className="room-detail-loading">
                <p >Room not found. </p>
                 <a  href="/rooms"> Try Again </a>
            </div>
        )
    }

    const { roomType, roomPrice, imageUrl, description, booking } = roomDetails;

    return (
        <div className="room-details-booking">
            {showMessage && (
                <p className="booking-success-message">
                    Booking successful! Confirmation Code: ${confirmationCode}. An SMS and email of your booking details has been sent.
                </p>
            )}

            {errorMessage && (
                <p className="error-message">
                    {errorMessage}
                </p>
            )}
            <h2>Room Details</h2>
            <br />
            <img src={imageUrl} alt={roomType} />
            <div className="room-details-info">
                <h3>{roomType}</h3>
                <p><b>Price: </b> {roomPrice} / night</p>
                <p><b>Description: </b> {description}</p>
            </div>             
            <div className="booking-info">
                <button className="book-now-button" onClick={() => setShowDatePicker(true)}>Book Now</button>
                {/* <button className="go-back-button" onClick={() => setShowDatePicker(false)}>Go Back</button> */}
                {showDatePicker && (
                    <div className="date-picker-container">
                        <DatePicker
                            className="date-picker-input"
                            selected={checkInDate}
                            onChange={(date) => setCheckInDate(date)}
                            selectsStart
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Check-in Date"
                        />

                        <DatePicker
                            className="date-picker-input"
                            selected={checkOutDate}
                            onChange={(date) => setCheckOutDate(date)}
                            selectsStart
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={checkInDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Check-out Date"
                        />
                        <div className="guest-container">
                            <div className="guest-div">
                                <label htmlFor="">Adults: </label>
                                <input type="number" min='1' value={numAdults} onChange={(e) => setNumAdults(parseInt(e.target.value))} />
                            </div>
                            <div className="guest-div">
                                <label htmlFor="">Children: </label>
                                <input type="number" min='0' value={numChildren} onChange={(e) => setNumChildren(parseInt(e.target.value))} />
                            </div>
                            <button className="confrim-booking" onClick={handleConfirmBooking}>Confirm Booking</button>
                        </div>
                    </div>
                )}
                { console.log(totalPrice)}
                {totalPrice && (
                    <div className="total-price">
                        <p><b>Total Price: </b> {totalPrice}</p>
                        <p><b>Total Guests: </b> {totalGuest}</p>
                        <button className="accept-booking" onClick={acceptBooking}>Accept Booking</button>
                    </div>
                )}

            </div>
        </div>
    )


}
export default RoomDetailsPage;
