//import React, { use } from "react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { Navigate }  from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});

  const [user, setUser] = useContext(UserDataContext);
  const navigate = useNavigate();


  const submitHandler = async (e) => {
    e.preventDefault();
    
    const userData = {
      email: email,
      password: password,
    }

    

   try {
      // 1. Wrap the API call in a try block
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate("/home");
      }
    } catch (error) {
      // 2. Handle the error here
      console.error("Login Error:", error);
      
      if (error.response && error.response.status === 401) {
        alert("Invalid email or password. Please try again.");
      } else {
        alert("Something went wrong. Please check your connection.");
      }
    }
    
    // Clear fields regardless of success or failure
    setEmail("");
    setPassword("");
  }

  
  return (
    <div className="p-7 flex h-screen flex-col justify-center">
      <div>
        <img
          className="w-16 mb-10"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt=""
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
            New here?{" "}
            <Link to="/signup" className="text-blue-600">
              Create new account
            </Link>
          </p>
        </form>
      </div>
      <div>
        <Link to ='/captain-login' className="bg-[#10b461] flex items-center justify-center text-white mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base">
          Sign in as captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
