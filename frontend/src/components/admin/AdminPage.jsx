import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApiService from '../services/ApiService'
import './Admin.css';
import useTitle from "../hooks/useTitle";

const AdminPage = () => {

    // set title of the page
    useTitle("Administrator");

    const [adminName, setAdminName] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate();

    useEffect(() => {

        const fetchAdminDetails = async () => {

            try {

                const response = await ApiService.getUserProfile();
                setAdminName(response.user.name);
               
            }
            catch (error) {
                setError('Error while fetching admin profile');
                setTimeout(() => setError(''), 5000);
            }
        }

        fetchAdminDetails();
    }, []);


    return (

        <div className="admin-page">
            <div className="admin-card">
                <h1 className="admin-title">Welcome, {adminName} 👋</h1>
                <p className="admin-subtitle">What would you like to manage today?</p>
                <div className="admin-actions">
                    <button className="manage-button" onClick={() => navigate('/admin/manage-rooms')}>
                        🛏 Manage Rooms
                    </button>
                    <button className="manage-button" onClick={() => navigate('/admin/manage-bookings')}>
                        📆 Manage Bookings
                    </button>
                </div>
            </div>
        </div>
    );


}

export default AdminPage;
