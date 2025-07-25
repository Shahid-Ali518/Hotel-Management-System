import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import Pagination from '../common/Pagination';
import './ManageBookings.css';
import useTitle from "../hooks/useTitle";
const ManageBookingsPage = () => {

    // set title of the page
    useTitle("Admin - Manage Bookings");

    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage, setBookingsPerPage] = useState(5);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchAllBookings = async () => {
            try {
                const response = await ApiService.getAllBookings();
                console.log(response)
                const allBookings = response.bookingList;
                console.log(allBookings)
                setBookings(allBookings);
                setFilteredBookings(allBookings);
            }
            catch (error) {
                console.error("Error fetching bookings", error.message);
            }

        };
        fetchAllBookings();

    }, []);

    useEffect(() => {

        filterBookings(searchTerm);

    }, [searchTerm, bookings]);

    const filterBookings = (term) => {

        if (term === '')
            setFilteredBookings(bookings);
        else {
            const filtered = bookings.filter((booking) =>
                booking.bookingConfirmationCode && booking.bookingConfirmationCode.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredBookings(filtered);
        }
        setCurrentPage(1);
    };

    const handleSearchTerm = (e) => {
        setSearchTerm(e.target.value);
    }

    // Pagination
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    // change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div className="bookings-container">
            <h1>All Bookings</h1>
            <div className="search-div">
                <label htmlFor="">Filter By Booking Number: </label>
                <input type="text"
                    value={searchTerm}
                    onChange={handleSearchTerm}
                    placeholder='Enter Booking Number'
                />
            </div>

            <div className="all-bookings">
                   <div className="booking-results">
                { currentBookings.length > 0 && currentBookings.map((booking) => (
                    <div key={booking.id} className="booking-result-item">
                        <p><b>Booking Code: </b>{booking.bookingConfirmationCode}</p>
                        <p><b>Check-in Date: </b>{booking.checkInDate}</p>
                        <p><b>Check-out Date: </b>{booking.checkOutDate}</p>
                        <p><b>Total Guests: </b>{booking.numOfGuests}</p>
                        <button className="manage-booking-button"
                            onClick={() => navigate(`/admin/edit-booking/${booking.bookingConfirmationCode}`)}>
                            Manage Booking
                        </button>
                    </div>
                )
                )}

                {currentBookings.length <= 0 && <h2>No booking found</h2>}

            </div>
            </div>

               <Pagination
                    roomsPerPage={bookingsPerPage}
                    totalRooms={filteredBookings.length}
                    currentPage={currentPage}
                    paginate={paginate}
                />
        </div>
    )
}

export default ManageBookingsPage;
