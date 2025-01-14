import React from 'react'
import Sidebar from '../components/Sidebar'
import Rightbar from '../components/Rightbar'
import MainContent from '../components/MainContent'
import '../index.css'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import socket from '../../app/socket'

function Profile() {
  const darkMode = useSelector((state) => state.user.darkMode);
  const userData = JSON.parse(localStorage.getItem("user"));
  const user = userData?.data?.loggedInUser || userData?.data;
  const userId = user._id;
  useEffect(() => {
      
    socket.on("connect", () => {
      console.log("Connected to socket server");
      // Optionally, send user data to the server
      socket.emit("join", { userId });
    });

    // socket.on("disconnect", () => {
    //   console.log("Disconnected from socket server");
    // });

    return () => {
      if (socket) {
        socket.disconnect(); // Clean up socket connection on unmount
      }
    };
  }, [userId]);

  return (
    <div className={`flex ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
    }`} id='main-box'>
      <Sidebar/>
      <MainContent/>
      <Rightbar/>
    </div>
  )
}

export default Profile
