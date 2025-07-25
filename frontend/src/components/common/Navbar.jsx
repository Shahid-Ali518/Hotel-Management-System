import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";


function Navbar() {

    const isAuthenticated = ApiService.isAuthenticated()
    const isAdmin = ApiService.isAdmin()
    const isUser = ApiService.isUser()
    const navigate = useNavigate()

    const handleLogout = () => {
        const isLogout = window.confirm("Are you really sure to logout");
        if (isLogout) {
            ApiService.logout()
            navigate("/home");
        }
    }

    return (
        <>
        <nav className="navbar ">
            {/* <div className="container-fluid"> */}
                <div className="row w-100">
                    <div className="col-4 d-flex align-items-center nav-brand">
                        <img src="./assets/images/hotel_logo.webp" alt="dev inn hotel" />
                        <NavLink to="/home" style={{textDecoration:'none'}}>Dev Inn Hotel </NavLink>
                    </div>

                    <div className="col-8 nav-items ">
                        <ul className="d-flex align-items-center">
                            <li> <NavLink to="/home" activeclass="active">Home</NavLink>   </li>
                            <li> <NavLink to="/rooms" activeclass="active">Rooms</NavLink> </li>
                            <li><NavLink to="/find-booking" activeclass="active">Find My Booking</NavLink></li>

                            {isUser && <li><NavLink to="/profile" activeclass="active">Profile</NavLink> </li>}
                            {isAdmin && <li><NavLink to="/admin" activeclass="active">Admin</NavLink> </li>}

                            {!isAuthenticated && (<li><NavLink to="/register" activeclass="active">Register</NavLink> </li>)}
                            {!isAuthenticated && (<li><NavLink to="/login" activeclass="active">Login</NavLink> </li>)}
                            {isAuthenticated && (  <li > <a href="" onClick ={handleLogout}>Logout</a></li>)}


                        </ul>
                    </div>
                </div>
            {/* </div> */}
        </nav>

        </>
    )
}
export default Navbar;