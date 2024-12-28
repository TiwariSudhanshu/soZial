import React from 'react'
import Sidebar from '../components/Sidebar'
import Rightbar from '../components/Rightbar'
import AddPostComponent from '../components/AddPost'
function AddPost() {
  return (
    <div  id='main-box' className='flex'>
    <Sidebar/>
    <AddPostComponent/>
    <Rightbar/>
  </div>
  )
}

export default AddPost
