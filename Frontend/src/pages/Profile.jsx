import React from 'react'
import Sidebar from '../components/Sidebar'
import Rightbar from '../components/Rightbar'
import MainContent from '../components/MainContent'
import '../index.css'
import { useSelector } from 'react-redux'
function Profile() {
  const darkMode = useSelector((state) => state.user.darkMode);
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
