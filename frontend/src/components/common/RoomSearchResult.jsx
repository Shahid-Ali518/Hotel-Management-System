import { useNavigate } from "react-router-dom"
import ApiService from "../services/ApiService";


const RoomSearchResult = ({ roomSearchResults }) => {

    const navigate = useNavigate();
    const isAdmin = ApiService.isAdmin();

    const handleDeleteRoom = async (roomId) => {
        
        try{
            if(!window.confirm('are you sure to delete room')){
                return;
            }
            const response = await ApiService.deleteRoomById(roomId)
            if(response.statusCode === 200){
                alert('Room Deleted successfully!')
            }
        }
        catch(error)
        {
            console.log(error.message);
        }
    }

    return (
        <section className="room-results">
            {
                roomSearchResults && roomSearchResults.length > 0 && (
                    <div className="room-list">
                        {
                            roomSearchResults.map(room => (
                                <div key={room.id} className="room-list-item">
                                    <img className="room-list-item-image" src={room.imageUrl} alt={room.roomType} />
                                    <div className="room-detail">
                                        <h3>{room.roomType}</h3>
                                        <p><b>Price:</b> ${room.roomPrice} / night</p>
                                        <p><b>Description:</b> {room.description}</p>
                                    </div>

                                    <div className="book-now-div">
                                        {
                                            isAdmin ? (
                                                <div>
                                                    <button className="edit-room-button" onClick={() => navigate(`/admin/edit-room/${room.id}`)}>
                                                        Edit Room
                                                    </button>
                                                    <button className="delete-room-button" onClick={() => handleDeleteRoom(room.id)}>
                                                        Delete Room
                                                    </button>
                                                </div>
                                            ) :
                                                (
                                                    <button className="book-room-button" onClick={() => navigate(`/room-details-book/${room.id}`)}>
                                                        View/Book Now
                                                    </button>
                                                )
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </section>
    )

}
export default RoomSearchResult;