import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Navigate, BrowserRouter, Routes, Route  } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './components/home/HomePage';
import AllRoomsPage from './components/booking_rooms/AllRoomsPage';
import FindBookingPage from './components/booking_rooms/FindBookingPage';
import RoomDetailsPage from './components/booking_rooms/RoomDetailsPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProfilePage from './components/profile/ProfilePage';
import EditProfilePage from './components/profile/EditProfilePage';
import { ProtectedRoute, AdminRoute } from './components/services/guard';
import AdminPage from './components/admin/AdminPage';
import ManageRoomsPage from './components/admin/ManageRoomsPage';
import EditRoomPage from './components/admin/EditRoomPage';
import AddRoomPage from './components/admin/AddRoomPage';
import ManageBookingsPage from './components/admin/ManageBookingsPage';


function App() {
  return (
   <BrowserRouter>
    <div className="App">
      <Navbar/>
      {/* <HomePage /> */}
      <div className='content'>
        <Routes>

          {/* public routes  */}
          <Route exact path='/home' element={<HomePage/>} />
          <Route exact path='/rooms' element={<AllRoomsPage/>} />
          <Route exact path='/find-booking' element={<FindBookingPage/>} />
          <Route  path='/login' element={<LoginPage/>} />
          <Route  path='/register' element={<RegisterPage/>} />

          {/* authenticated routes  */}
          <Route  path='/room-details-book/:roomId'  element={ <ProtectedRoute  element={<RoomDetailsPage/>} /> }  />
          <Route  path='/profile' element={ <ProtectedRoute  element={<ProfilePage/>} />  } />
          <Route  path='/edit-profile' element={ <ProtectedRoute  element={<EditProfilePage/>} />  } />

          
          {/* ADMIN routes  */}
          <Route  path='/admin' element={ <AdminRoute  element={<AdminPage/>} />  } />
          <Route  path='/admin/manage-rooms' element={ <AdminRoute  element={<ManageRoomsPage/>} />  } />
          <Route  path='/admin/manage-bookings' element={ <AdminRoute  element={<ManageBookingsPage/>} />  } />
          <Route  path='/admin/add-room' element={ <AdminRoute  element={<AddRoomPage/>} />  } />
          <Route  path='/admin/edit-room/:roomId' element={ <AdminRoute  element={<EditRoomPage/>} />  } />


          {/* random url  */}
          <Route  path='*' element={<Navigate to='/home'/>} />
        </Routes>

      </div>

      <Footer />
    </div>
   </BrowserRouter>
  );
}

export default App;
