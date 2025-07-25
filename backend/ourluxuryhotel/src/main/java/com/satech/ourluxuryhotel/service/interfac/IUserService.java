package com.satech.ourluxuryhotel.service.interfac;

import com.satech.ourluxuryhotel.dto.LoginRequest;
import com.satech.ourluxuryhotel.dto.Response;
import com.satech.ourluxuryhotel.entity.User;

public interface IUserService {

    Response register(User user);

    Response login(LoginRequest loginRequest);

    Response getAllUsers();

    Response getUserBookingHistory(String userId);

    Response getUserById(String userId);

    Response deleteUser(String userId);

    Response getMyInfo(String email);



}
