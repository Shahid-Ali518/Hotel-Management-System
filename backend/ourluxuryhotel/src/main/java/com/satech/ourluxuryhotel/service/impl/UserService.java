package com.satech.ourluxuryhotel.service.impl;

import com.satech.ourluxuryhotel.dto.LoginRequest;
import com.satech.ourluxuryhotel.dto.Response;
import com.satech.ourluxuryhotel.dto.UserDTO;
import com.satech.ourluxuryhotel.entity.User;
import com.satech.ourluxuryhotel.exception.AppException;
import com.satech.ourluxuryhotel.repository.UserRepository;
import com.satech.ourluxuryhotel.service.interfac.IUserService;
import com.satech.ourluxuryhotel.utils.JWTUtils;
import com.satech.ourluxuryhotel.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class UserService implements IUserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    JWTUtils jwtUtils;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;


    @Override
    public Response register(User user) {

        Response response = new Response();

        try{

          if(user.getRole() == null || user.getRole().isBlank()){
              user.setRole("USER");
          }

          if(userRepository.existsByEmail(user.getEmail())){
              throw new AppException(user.getEmail() + " is Already Exists");
          }
          user.setPassword(passwordEncoder.encode(user.getPassword()));
          User savedUser = userRepository.save(user);
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(savedUser);
            response.setStatusCode(201); // created
            response.setUser(userDTO);
//            return response;

        }
        catch (AppException ap){
            response.setStatusCode(400); // bad request
            log.error(ap.getMessage());
        }
        catch (Exception e){
          response.setStatusCode(500); // internal server error
          log.error("Error occurred while registering a user");
        }
        return response;
    }

    @Override
    public Response login(LoginRequest loginRequest) {

        Response response = new Response();
       try{

           authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
           User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()-> new AppException("user not found"));
           var token = jwtUtils.createToken(user.getEmail());
           response.setToken(token);
           response.setStatusCode(200);
           response.setRole(user.getRole());
           response.setExpirationTime("7 Days");
           response.setMessage("Successful");


       }
       catch (AppException ap){
           response.setStatusCode(404); // not found
           log.error(ap.getMessage());
       }
       catch (Exception e){
           response.setStatusCode(500); // internal server error
           System.out.println(e.getMessage());
           log.error("Error occurred while login");
       }
        return response;
    }

    @Override
    public Response getAllUsers() {

        Response response = new Response();
       try{
           List<User> users = userRepository.findAll();
           List<UserDTO> userDTOList = Utils.mapUserListEntityToUserListDTO(users);
           response.setUserList(userDTOList);
           response.setMessage("Successful");
           response.setStatusCode(200);

       }
       catch (Exception e){
           response.setStatusCode(500); // internal server error
           log.error("Error occurred while getting all users");
       }
        return response;
    }

    @Override
    public Response getUserBookingHistory(String userId) {

        Response response = new Response();

        UserDTO userDTO = new UserDTO();

        try{
            var user = userRepository.findById(Long.valueOf(userId)).orElseThrow( ()-> new AppException("user does not exist"));
            userDTO = Utils.mapUserEntityToUserDTOPlusBooking(user);
            response.setUser(userDTO);
            response.setStatusCode(200);
            response.setMessage("Successful");

        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while getting user booking history");
        }
        return response;

    }

    @Override
    public Response getUserById(String userId) {
        Response response = new Response();

        try{
            var user = userRepository.findById(Long.valueOf(userId)).orElseThrow( ()-> new AppException("user does not exist"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);
            response.setUser(userDTO);
            response.setStatusCode(200);
            response.setMessage("Successful");

        }
        catch (AppException ap){
            response.setStatusCode(404); // not found
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while getting user by id");
        }
        return response;

    }


    @Override
    public Response deleteUser(String userId) {
        Response response = new Response();
        try{
            var user = userRepository.findById(Long.valueOf(userId)).orElseThrow( ()-> new AppException("user does not exist"));
            userRepository.deleteById(Long.valueOf(userId));
            response.setStatusCode(200);
            response.setMessage("Successful");

        }
        catch (AppException ap){
            response.setStatusCode(404); // not found
            log.error(ap.getMessage());
        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while deleting user by id");
        }
        return response;
    }


    @Override
    public Response getMyInfo(String email) {
        Response response = new Response();
        try{
            var user = userRepository.findByEmail(email).orElseThrow( ()-> new AppException("user does not exist"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTOPlusBooking(user);
            response.setUser(userDTO);
            response.setStatusCode(200);
            response.setMessage("Successful");

        }
        catch (Exception e){
            response.setStatusCode(500); // internal server error
            log.error("Error occurred while getting user info");
        }
        return response;
    }
}
