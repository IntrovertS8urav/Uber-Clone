import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";

const Captainlogin = () => {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captainData, setCaptainData] = useState({});
  
    const submitHandler = (e) => {
      e.preventDefault();
      setCaptainData({
        email: email,
        password: password,
      });
      
      setEmail("");
      setPassword("");
    };

  return (
    <div className="p-7" flex h-screen flex-col justify-center>
      <div>
        <img
          className="w-20 mb-4"
          src="https://tse2.mm.bing.net/th?id=OIP.3SOM13M9ZLBDZo699IeZMAHaHa&pid=Api&P=0&h=180" 
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
