import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import './ProfilePage.css';
import useTitle from '../hooks/useTitle';


const ProfilePage = () => {

    // set title of the page
    useTitle("User Profile");

    const [user, setUser] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        const fetchUserProfile = async () => {
            try {
                const profile = await ApiService.getUserProfile();
                const userPlusBookings = await ApiService.getUserBookings(profile.user.id);
                // console.log('hello')
                // console.log(userPlusBookings)
                if (userPlusBookings.statusCode === 200) {
                    console.log(userPlusBookings.user)
                    setUser(userPlusBookings.user);
                }
            }
            catch (error) {
                setError(error.message?.data?.message || error.message);
                setTimeout(() => setError(''), 5000);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        const isLogout = window.confirm("Are you really sure to logout");
        if (isLogout) {
            ApiService.logout()
            navigate("/home");
        }
    }

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };


    return (
        <div>
            <div className="profile-page">
                {user && (<h2>Welcome {user.name}!</h2>)}

                <div className="profile-actions">
                    <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button>
                    <button className="logout-button" onClick={handleLogout} >Logout</button>
                    {/* <a href="" onClick={handleLogout}>Logout</a> */}
                </div>

                {error && <p className='error-message'>{error}</p>}

                {user && (
                    <div className="profile-details">
                        <h3>My Profile Details</h3>
                        <p><b>Name: </b>{user.name}</p>
                        <p><b>Email: </b>{user.email}</p>
                        <p><b>Phone Number: </b>{user.phoneNumber}</p>
                    </div>
                )}

                <div className="bookings-section">
                    <h3>My Booking History</h3>

                    <div className="booking-list">
                        {user && user.bookings.length > 0 ? (
                            <div className="booking-table">
                                <table className="styled-table">
                                    <thead>
                                        <tr className='booking-table-heading'>
                                            <th>Confirmation Code</th>
                                            <th>Check-in Date</th>
                                            <th>Check-out Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {user.bookings.map((booking, index) => {
                                            const checkOutDate = new Date(booking.checkOutDate);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0); // Remove time for accurate comparison

                                            const status = checkOutDate < today ? "Completed" : "Upcoming";

                                            return (
                                                <tr key={index}>
                                                    <td>{booking.bookingConfirmationCode}</td>
                                                    <td>{booking.checkInDate}</td>
                                                    <td>{booking.checkOutDate}</td>
                                                    <td>{status}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) :
                            (<div className="empty-booking">
                                <p>
                                    You don't have any booking. <a href="/rooms">Make Booking</a>
                                </p>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;
