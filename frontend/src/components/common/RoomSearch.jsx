import React, { useEffect, useState } from "react";
import ApiService from "../services/ApiService";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import RoomSearchResult from "./RoomSearchResult";



const RoomSearch = ({ handleSearchResult }) => {

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [roomType, setRoomType] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);

            }
            catch (err) {
                console.log(err.message);
            }
        }
        fetchRoomTypes();
    }, []);

    // show error 
    const showError = (message, timeOut = 5000) => {
        setError(message)
        setTimeout(() => {
            setError('')
        }, timeOut)
    };


    const handleInternalSearch = async () => {
        if (!startDate || !endDate || !roomType) {
            showError("Please fill all fields");
            return false;
        }

        try {
            const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
            const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;

            const response = await ApiService.getAllAvailableRoomsWithDateAndTime(formattedStartDate, formattedEndDate, roomType);

            console.log(response.statusCode)
            console.log(response.roomList)
            console.log(response.message)

            if(formattedStartDate > formattedEndDate){
                showError("Check-in must before Check-out. Please try again.");
                    return;
            }

            if (response.statusCode === 200) {
                console.log("error");

                if (!response.roomList || response.roomList.length === 0) {
                    showError("Room is not available for selected room type and date range");
                    return;
                }

                handleSearchResult(response.roomList)
                setError('');
            }




        }
        catch (err) {
            setError(err.response.data.message)
        }
    }

    // return view of page
    return (
        <section>
            <div className="search-container">

                <div className="search-field">
                    <label >Check-in Date</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Check-in Date"
                        className="roomsearch-input"
                    />
                </div>

                <div className="search-field">
                    <label >Check-out Date</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Check-out Date"
                        className="roomsearch-input"
                    />
                </div>

                <div className="search-field">
                    <label >Room Type</label>

                    <select className="roomsearch-input" value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                        <option disabled value="" className="roomsearch-input">
                            Select Room Type
                        </option>
                        {roomTypes.map((roomType) => (
                            <option key={roomType} value={roomType}>
                                {roomType}
                            </option>
                        ))}

                    </select>
                </div>


                <button className="room-search-button" onClick={handleInternalSearch} >
                    Search Room
                </button>

            </div>

            {error && <p className="error-message"> {error} </p>}
        </section>
    )
}
export default RoomSearch;