import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ApiService from '../services/ApiService'
import './Register.css'
import useTitle from "../hooks/useTitle";
const RegisterPage = () => {

  // set title of the page
    useTitle("Register");

  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [role, setRole] = useState('USER')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/login';

  const handleSubmit = async (e) =>{
    e.preventDefault();
    
    if(!email || !password || !name || !phoneNumber){
      setError('Please fill all fields.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    const registration = {
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        password: password,
        role: 'USER'
    }

    try{
      const response = await ApiService.registerUser({registration});
      if(response.statusCode === 200){
      
        navigate(from, {replace : true});
      }
    }
    catch(error){
      setError(error.message?.data?.message || error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && ( <p className='error-message'> {error} </p>)}
        <form  onSubmit={handleSubmit}>
          <div className="form-group">
            <label >Name: </label>
            <input 
              type="text"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label >Phone Number: </label>
            <input 
              type="text"
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label >Email: </label>
            <input 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            
            <label >Password: </label>
            <input 
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className='register-button' type='submit'>Register</button>
        </form>
        <p className='register-link'>
          Already have an account? <a href="/login">Login</a>
        </p>
    </div>
  )
};

export default RegisterPage;


