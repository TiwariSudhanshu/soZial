import React from 'react'
import Sidebar from '../components/Sidebar'
import Rightbar from '../components/Rightbar'
import EditProfileComponent from '../components/EditProfile'

function EditProfile() {
  return (
    <div className='flex'  id='main-box'>
      <Sidebar/>
      <EditProfileComponent/>
      <Rightbar/>
    </div>
  )
}

export default EditProfile
