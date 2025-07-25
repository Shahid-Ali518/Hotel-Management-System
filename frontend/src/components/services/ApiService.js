import axios from "axios";

export default class ApiService{

    static BASE_URL = "http://localhost:8080";

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization :`Bearer ${token}`,
            "Content-Type" : "application/json"
        };
    }

    // this create a new user
    static async registerUser(registration){
        const response =  await axios.post(`${this.BASE_URL}/auth/register`, registration)
        return response.data
    }

    // method to login a user
    static async loginUser(userDetails){
        const response =  await axios.post(`${this.BASE_URL}/auth/login`, userDetails)
        return response.data
    }

    // method to get all users
    static async allUsers(){
        const response =  await axios.get(`${this.BASE_URL}/user/all`, {
            headers : this.getHeader()
        });
        return response.data
    }

    // method to get user profile
    static async getUserProfile(){
        const response =  await axios.get(`${this.BASE_URL}/user/get-logged-in-profile-info`, {
            headers : this.getHeader()
        });
        return response.data
    }

    // method to get user by id
    static async getUser(userId){
        const response =  await axios.get(`${this.BASE_URL}/user/get-by-id/${userId}`, {
            headers : this.getHeader()
        });
        return response.data
    }

     // method to delete user by id
    static async deleteUser(userId){
        const response =  await axios.delete(`${this.BASE_URL}/user/delete/${userId}`, {
            headers : this.getHeader()
        });
        return response.data
    }


     // method to add new room
    static async addNewRoom(formData){
        const response =  await axios.post(`${this.BASE_URL}/rooms/add-new-room`, formData,  {
            headers : {
                ...this.getHeader(),
                "Content-Type" : "multipart/form-data"

            }
        });
        return response.data
    }

     // method to update a room
    static async updateRoom(roomId, formData){
        const response =  await axios.put(`${this.BASE_URL}/rooms/update/${roomId}`, formData,  {
            headers : {
                ...this.getHeader(),
                "Content-Type" : "multipart/form-data"

            }
        });
        return response.data
    }

    // method to get all available rooms
    static async getAllAvailableRooms(){
        const response =  await axios.get(`${this.BASE_URL}/rooms/all-available-rooms`);
        return response.data
    }

    // method to get all available rooms with check in and check out date and roomType
    static async getAllAvailableRoomsWithDateAndTime(checkInDate, checkOutDate, roomType){
        const response =  await axios.get(
            `${this.BASE_URL}/rooms/available-rooms-by-date-and-type?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`);
        return response.data
    }

     // method to get all rooms
    static async getAllRooms(){
        const response =  await axios.get(`${this.BASE_URL}/rooms/all`);
        return response.data
    }

     // method to get all room types
    static async getRoomTypes(){
        const response =  await axios.get(`${this.BASE_URL}/rooms/types`);
        return response.data
    }

     // method to get room by id
    static async getRoomById(roomId){
        const response =  await axios.get(`${this.BASE_URL}/rooms/get-by-id/${roomId}`);
        // console.log(response.data)
        return response.data
    }

    // method to delete room by id
    static async deleteRoomById(roomId){
        const response =  await axios.delete(`${this.BASE_URL}/rooms/delete/${roomId}`, {
            headers: this.getHeader()
        });
        return response.data
    }

    // method to book a room
    static async bookRoom(userId, roomId, booking){
        console.log("USER ID is: " +  userId);
        const response = await axios.post(`${this.BASE_URL}/bookings/save-booking/${userId}/${roomId}`, booking, {
            headers : this.getHeader()
        });

        return response.data;
    }

     // method to get all bookings
    static async getAllBookings(){
        const response = await axios.get(`${this.BASE_URL}/bookings/all-bookings`, {
            headers : this.getHeader()
        });

        return response.data;
    }

     // method to get booking by userId
    static async getUserBookings(userId){
        const response = await axios.get(`${this.BASE_URL}/bookings/get-user-bookings/${userId}`, {
            headers : this.getHeader()
        });

        return response.data;
    }

     // method to get booking by confimation code
    static async getBookingByCode(confimationCode){
        const response = await axios.get(`${this.BASE_URL}/bookings/get-booking-confirmation-code/${confimationCode}`, {
            headers : this.getHeader()
        });

        return response.data.booking;
    }

     // method to cancel booking
    static async cancelBooking(bookingId){
        const response = await axios.delete(`${this.BASE_URL}/bookings/cancel-booking/${bookingId}`, {
            headers : this.getHeader()
        });

        return response.data;
    }


    /** AUTHENTICATION CHECKER */
    static logout(){
        localStorage.removeItem("token");
        localStorage.removeItem('role');
    }

    static isAuthenticated(){
        const token = localStorage.getItem("token")
        return !! token;
    }

    static isAdmin(){
        const role = localStorage.getItem("role")
        return role === "ADMIN"
    }

    static isUser(){
        const role = localStorage.getItem("role")
        return role === "USER"
    }



}