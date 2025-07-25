import { useEffect, useState } from "react";
import ApiService from "../services/ApiService";
import RoomSearch from "../common/RoomSearch";
import Pagination from "../common/Pagination";
import RoomSearchResult from "../common/RoomSearchResult";
import { useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";

const ManageRoomsPage = () =>{

    // set title of the page
    useTitle("Admin - Mangae Rooms");

    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage, setRoomsPerPage] = useState(5);

    const navigate = useNavigate();

    // Function to handle search results 
    const handleSearchResult = (results) =>{
        setRooms(results);
        setFilteredRooms(results);
    };

    useEffect(() => {
        const fetchAllRooms = async () => {
            try{
                const response = await ApiService.getAllRooms();
                const allRooms = response.roomList;
                setRooms(allRooms);
                setFilteredRooms(allRooms);

            }
            catch( error ){
                console.error("Error fetching room", error.message);
            }
        };

         const fetchRoomTypes = async () => {
            try{
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);

            }
            catch( error ){
                console.error("Error fetching room types", error.message);
            }
        };

        fetchAllRooms();
        fetchRoomTypes();

    }, []);

    const handleRoomTypeChange = (e) => {
        setSelectedRoomType(e.target.value);
        filterRooms(e.target.value);
    }

    const filterRooms = (type) => {
        if(type == ''){
            setFilteredRooms(rooms);
        }
        else{
            const filtered = rooms.filter( (room) => room.roomType === type);
            setFilteredRooms(filtered);
        }
        setCurrentPage(1); // Reset to first page after filtering
    };

    

    // Pagination
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    // change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="all-rooms">
            <h2>All Rooms</h2>
            <div className="all-room-filter-div">
                <label>Filter by Room Type: </label>
                <select value={selectedRoomType} onChange={handleRoomTypeChange}>
                    <option value="">All</option>
                    {
                        roomTypes.map( (type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))
                    }
                </select>
            </div>
                    
            <button className="add-room-button" onClick={() => navigate('/admin/add-room')}>Add Room</button>

            {/* <RoomSearch handleSearchResult={handleSearchResult} /> */}
            <RoomSearchResult roomSearchResults = {currentRooms} />

            <Pagination 
                roomsPerPage={roomsPerPage}
                totalRooms={filteredRooms.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    )
}
export default ManageRoomsPage;