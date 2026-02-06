import React from "react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainSignup = () => {

    const navigate = useNavigate();


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
   
    
    const [vehicleColor, setVehicleColor] = useState("");
    const [vehicleplate, setVehicleplate] = useState("");
    const [vehiclecapacity, setVehiclecapacity] = useState("");
    const [vehicleType, setVehicleType] = useState("");

    const {captain, setCaptain} = useContext(CaptainDataContext);
  
    const submitHandler = async (e) => {
      e.preventDefault()
  
      const captainData ={
        fullname:{  
          firstname: firstName,
          lastname: lastName,
        },
        email: email,
        password: password,
        vehicle: {
          vehicleType: vehicleType,
          color: vehicleColor,
          plate: vehicleplate,
          capacity: vehiclecapacity,
        },
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);
      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        navigate("/captain-home");
      }
      
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setVehicleColor("");
      setVehicleplate("");
      setVehiclecapacity("");
      setVehicleType("");
  
    }
  return (
    <div className="p-7 flex h-screen flex-col justify-center">
      <div>
        <img className="w-20 mb-4"
         src="https://tse2.mm.bing.net/th?id=OIP.3SOM13M9ZLBDZo699IeZMAHaHa&pid=Api&P=0&h=180"
        />
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg w-1/2 font-medium mb-2">What's our Captain's name</h3>
          <div className="flex gap-4 mb-7">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>

          <h3 className="text-lg font-medium mb-2">What's our Captain's email</h3>

          <input
            required
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
          <div className="flex gap-4 mb-6">
            <select
              required
              className="bg-[#eeeeee] w-1/3 rounded px-4 py-2 border text-lg"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="" disabled>
                Select vehicle type
              </option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="motorcycle">Moto</option>
            </select>
            <input
              required
              className="bg-[#eeeeee] w-1/3 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Vehicle color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
            <input
              required
              className="bg-[#eeeeee] w-1/3 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Plate number"
              value={vehicleplate}
              onChange={(e) => setVehicleplate(e.target.value)}
            />
          </div>
          <input
            required
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="number"
            min="1"
            max="8"
            placeholder="Vehicle capacity"
            value={vehiclecapacity}
            onChange={(e) => setVehiclecapacity(e.target.value)}
          />

          <button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base">
            Create Captain account
          </button>
        </form>
 
        <p className="text-center">
          Already have an account?
          <Link to="/captain-login" className="text-blue-600">
              Login here
          </Link>
        </p>
      </div>
      <div>
        <p className="text-[10px] leading-tight">
          This site is protected bt reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span>and
          <span className="underline"> Terms of Service apply.</span>
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
