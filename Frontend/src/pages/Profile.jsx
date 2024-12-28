import React from 'react'
import Sidebar from '../components/Sidebar'
import Rightbar from '../components/Rightbar'
import MainContent from '../components/MainContent'
import '../index.css'

function Profile() {
  return (
    <div className='flex' id='main-box'>
      <Sidebar/>
      <MainContent/>
      <Rightbar/>
    </div>
  )
}

export default Profile
