import { useState } from "react";
import RoomSearch from "../common/RoomSearch";
import RoomSearchResult from "../common/RoomSearchResult";
import useTitle from "../hooks/useTitle";



const HomePage = () => {

    // set title of the page
    useTitle("Welcome to Dev Inn Hotel");

    const [roomSearchResult, setRoomSearchResult] = useState([]);

    const handleResult = (results) =>{
        setRoomSearchResult(results);
    }


    return (
        <div className="home">
            <section>
                <header className="header-banner">
                    {/* <img src="./assets/images/hotel_banner.jpg" alt="Dev Inn Hotel" className="header-image" /> */}
                    <div className="overlay"></div>
                    <div className="hotel-heading">
                        <h1> Welcome to <span className="hotel-color ">Dev Inn Hotel</span></h1>
                        {/* <br /> */}
                        <h3 >Step into a haven of confort and care</h3>
                        <h4>Book Your luxury stay now</h4>
                    </div>
                </header>
            </section>
            
            {/* room search section  */}
            <RoomSearch handleSearchResult={handleResult} />
            <RoomSearchResult roomSearchResult={roomSearchResult} />


            {/* hotel services section */}
            <section className="services">
                <h1>Services At <span className="hotel-color ">Dev Inn Hotel</span></h1>
                <div className="container ">
                    <div className="row  g-3 justify-content-between">
                        <div className="col-5 service-item mx-4 d-flex">
                            <div className="image">
                                <img src="./assets/images/ac.jpg" style={{ height: 100, width: 100 }} alt="air conditioning" className="service-image" />
                            </div>
                            
                           <div className="content ">
                             
                            <h4 className="content-h4">Air Conditioning</h4>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos numquam harum, temporibus eligendi sequi voluptates adipisci quaerat blanditiis architecto recusandae!</p>
                        
                           </div>
                        </div>
                        <div className="col-5 service-item mx-4 d-flex">
                            <div className="image">

                            <img src="./assets/images/gym.jpg" style={{ height: 100, width: 100 }} className="service-image" alt="mini bar" />
                            </div>
                            <div className="content">
                            <h4  className="content-h4">Mini Gym</h4>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos numquam harum, temporibus eligendi sequi voluptates adipisci quaerat blanditiis architecto recusandae!</p>

                            </div>
                        </div>
                    </div>

                    <div className="row mt-3 g-3 justify-content-between">
                        <div className="col-5 service-item mx-4 d-flex ">
                            <div className="image">
                            <img  src="./assets/images/parking.png" style={{ height: 100, width: 100 }}  alt="parking" />

                            </div>
                           
                           <div className="content">
                             <h4  className="content-h4">Parking</h4>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos numquam harum, temporibus eligendi sequi voluptates adipisci quaerat blanditiis architecto recusandae!</p>
                        
                           </div>
                        </div>
                        <div className="col-5 service-item mx-4 d-flex">
                            <div className="image">
                            <img src="./assets/images/wifi.png" style={{ height: 100, width: 100 }} className="service-image" alt="wifi" />

                            </div>
                            <div className="content">
                            <h4  className="content-h4">Wifi</h4>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos numquam harum, temporibus eligendi sequi voluptates adipisci quaerat blanditiis architecto recusandae!</p>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default HomePage;