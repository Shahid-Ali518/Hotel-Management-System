import React, { useEffect, useState } from 'react'
import ApiService from '../services/ApiService'
import { useNavigate } from 'react-router-dom'
import './EditProfile.css';
import useTitle from '../hooks/useTitle';

const EditProfilePage = () => {

    // set title of the page
    useTitle("Edit Profile");

    const [user, setUser] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate();

    useEffect(() => {

        const fetchUserProfile = async () => {

            try {
                const response = await ApiService.getUserProfile();
                setUser(response.user);

            }
            catch (error) {
                setError(error.message?.data?.message || error.message);
                setTimeout(() => setError(''), 5000);
            }
        };
        fetchUserProfile();
    }, []);


    const handleDeleteProfile = async() => {
        if(!window.confirm('Are you sure to delete your account?')) {
            return;
        }

        try {
             await ApiService.deleteUser(user.id);
             alert("Your Account has been deleted!");
            navigate('/register')
        }
        catch (error) {
            setError(error.message);
        }
    }

return (
    <div className="profile-container">
        <h2>Edit Profile</h2>
        {error && <p className="error-message">{error}</p>}

        {user && (
            <div className="profile-details">
                <p className="details"><b>Name: </b>{user.name}</p>
                <p className="details"><b>PhoneNumber: </b>{user.phoneNumber}</p>
                <p className="details"><b>Email: </b>{user.email}</p>
                <button className="profile-delete-btn" onClick={handleDeleteProfile}>Delete</button>
            </div>
        )}
    </div>
)
}

export default EditProfilePage;
