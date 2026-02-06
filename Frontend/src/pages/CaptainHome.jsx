import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import CaptainDetails from "../components/CaptainDetails";
import { useGSAP } from "@gsap/react";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainHome = () => {
  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);


  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);

  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);
  const [ride, setRide] = useState(null);

  useEffect(() => {
    const captainId = captain?._id || captain?.id;

    if (captainId) {
      socket.emit("join", {
        userType: "captain",
        userId: captainId
      });

      const updateLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {

            // console.log('Updating location:', position.coords.latitude, position.coords.longitude);
              socket.emit("update-location-captain", {
                userId : captainId,
                location: {
                  lng: position.coords.longitude,
                  ltd: position.coords.latitude
              }
              });
            });
    }
  };

      const locationInterval = setInterval(updateLocation, 10000); 
      updateLocation();
      // return () => clearInterval(locationInterval);
  }
    },[captain, socket]);

  socket.on('new-ride', (data) => {

    console.log('New ride request received:', data);

    setRide(data);
    setRidePopUpPanel(true);

  })

  async function confirmRide(){
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`,{
      rideId: ride._id,
      captainId: captain._id,

      
    },{
    
      headers : {
        Authorization : `Bearer ${localStorage.getItem('token')}`
      }


    })
    
   

    setRidePopUpPanel(false);
    setConfirmRidePopUpPanel(true);
  }

  

  useGSAP(function(){
    if(ridePopUpPanel){

      gsap.to(ridePopUpPanelRef.current,{
        transform:'translateY(0)'
      })
    }else{
      gsap.to(ridePopUpPanelRef.current,{
        transform:'translateY(100%)'
    })
  }
  },[ridePopUpPanel])

  useGSAP(function(){
    if(confirmRidePopUpPanel){

      gsap.to(confirmRidePopUpPanelRef.current,{
        transform:'translateY(0)'
      })
    }else{
      gsap.to(confirmRidePopUpPanelRef.current,{
        transform:'translateY(100%)'
    })
  }
  },[confirmRidePopUpPanel])

  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex item-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-home-5-line"></i>
        </Link>
      </div>
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/max/1280/0*gwMx05pqII5hbfmX.gif"
        />
      </div>
      <div className="h-2/5 p-6">
      <CaptainDetails/>
      
      </div>

      <div ref={ridePopUpPanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
       <RidePopUp
       ride = {ride}
        setRidePopUpPanel={setRidePopUpPanel} 
        setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        confirmRide={confirmRide}
        />
      </div>
      <div ref={confirmRidePopUpPanelRef} className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
       <ConfirmRidePopUp
       ride={ride}
       setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} setRidePopUpPanel={setRidePopUpPanel}/>
      </div>
    </div>
  );
};

export default CaptainHome;
