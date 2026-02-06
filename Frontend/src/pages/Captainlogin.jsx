import React from 'react'
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from "../context/CaptainContext";

const Captainlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {captain, setCaptain} = useContext(CaptainDataContext);
  const navigate = useNavigate();
    
  
   const submitHandler = async (e) => {
  e.preventDefault();
  
  const captainData = { // Use a clear name
    email: email,
    password: password,
  };

  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captainData);

    if (response.status === 200) {
      const data = response.data;
      
      // CRITICAL: Verify data structure before updating context
      if (data.captain && data.token) {
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        navigate("/captain-home");
      } else {
        console.error("Login successful but data format is wrong:", data);
      }
    }
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    alert("Invalid credentials or Server Error");
  }
  
  setEmail("");
  setPassword("");
};

  return (
    <div className="p-7 flex h-screen flex-col justify-center">
      <div>
        <img
          className="w-20 mb-4"
          src="https://toppng.com/uploads/preview/uber-logo-transparent-background-11661767233dtpbxh9w4v.png" 
          alt="User Icon"
        />
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-xl font-medium mb-2">What's your email</h3>

          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="Email@xyz.com"
            autoComplete="email"
          />

          <h3 className="text-xl font-medium mb-2">Enter password</h3>

          <input
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
          />

          <button className="bg-[#111] text-white mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base">
            Login
          </button>

          <p className="text-center">
            Join a fleet?
            <Link to="/captain-Signup" className="text-blue-600">
              Register as a Captain
            </Link>
          </p>
        </form>
      </div>
      <div>
        <Link to ='/login' className="bg-[#d5622d] flex items-center justify-center text-white mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base">
          Sign in as User
        </Link>
      </div>
    </div>
  )
}

export default Captainlogin
