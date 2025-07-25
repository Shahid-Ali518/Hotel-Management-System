import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../services/ApiService'
import './AddRoom.css';
import useTitle from "../hooks/useTitle";
const AddRoomPage = () => {

  // set title of the page
    useTitle("Admin - Add Room");

  const [roomdetails, setRoomDetails] = useState({
    roomType: '',
    roomPrice: 0,
    roomDescription: '',
    imageUrl: ''

  })

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoomType, setNewRoomType] = useState(false);
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect (() => {

    const fetchRoomTypes = async () => {
      try {

        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);

        if (types.statusCode === 404)
          setError('Room Not found.');

      }
      catch (error) {
        setError(error.response?.data?.message || error.message);
        setTimeout(() => setError(''), 5000);
      }
    };
    fetchRoomTypes();

  }, []);

  const handleChange = (e) => {

    const { name, value } = e.target;
    setRoomDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {

    const seletedFile = e.target.files[0];
    if (seletedFile) {
      setFile(seletedFile);
      setPreview(URL.createObjectURL(seletedFile))
    }
    else {
      setFile(null)
      setPreview(null)
    }
  };

  const handleRoomTypeChange = (e) => {

    if (e.target.value === 'new') {
      setNewRoomType(true);
      setRoomDetails(prevState => ({
        ...prevState,
        roomType: ''
      }));
    }
    else {
      setNewRoomType(false);
      setRoomDetails(prevState => ({
        ...prevState,
        roomType: e.target.value
      }));
    }
  };



  const handleAddRoom = async () => {

    if (!roomdetails.roomType || !roomdetails.roomPrice || !roomdetails.roomDescription) {
      setError("All room details must be provided.");
      setTimeout(() => {
        setError('')
      }, 3000);
      return;
    }

    if (!window.confirm("Do you want to add this room?")) {
      return;
    }


    try {

      const formData = new FormData();
      formData.append('roomType', roomdetails.roomType);
      formData.append('roomPrice', roomdetails.roomPrice);
      formData.append('roomDescription', roomdetails.roomDescription);

      if (file) {
        formData.append('photo', file);
      }

      const response = await ApiService.addNewRoom(formData);
      if (response.statusCode === 201) {
        setSuccess('Room added successfully.');

        setTimeout(() => {
          setSuccess('')
          navigate("/admin/manage-rooms");
        }, 3000);
      }
    }
    catch (error) {
      setError(error.response?.data?.message || error.message);
      setTimeout(() => setError(''), 5000);
    }
  }

  return (
    <div className="edit-room-container">
      <h1 className='form-title'>Add New Room</h1>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="edit-room-form">

        <div className="form-group">
          {preview && (

            <img src={preview} alt="Room Preview" className="room-photo-preview" />
          )}

          <input type="file"
            name='imageUrl'
            onChange={handleFileChange}
            className='form-input'
          />
        </div>

        <div className="form-group">

          <label htmlFor="">Room Type</label>
          <select value={roomdetails.roomType} onChange={handleRoomTypeChange} className='form-input'>
            <option value="">Select a room type</option>
            {roomTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
            <option value="new">Other (please specify)</option>
          </select>
          {newRoomType && (
            <input type="text"
              name='roomType'
              placeholder='Enter a new room type'
              value={roomdetails.roomType}
              onChange={handleChange}
              className='form-input'
            />
          )}
        </div>

        <div className="form-group">

          <label htmlFor="">Room Price</label>
          <input type="text"
            name='roomPrice'
            value={roomdetails.roomPrice}
            placeholder='Enter room price per night'
            onChange={handleChange}
            className='form-input'
          />
        </div>

        <div className="form-group">

          <label htmlFor="">Description</label>
          <input type="text"
            name='roomDescription'
            value={roomdetails.roomDescription}
            placeholder='Enter room description'
            onChange={handleChange}
            className='form-input'
          />
        </div>

        <div className="form-buttons">
          <button className="add-button" onClick={handleAddRoom}>Add Room</button>
          <button className="cancel-button" onClick={(() => navigate('/admin/manage-rooms'))}>Cancel</button>

        </div>
      </div>
    </div>
  )
}

export default AddRoomPage;
