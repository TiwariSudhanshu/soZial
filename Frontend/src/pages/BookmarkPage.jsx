import React from 'react'
import Sidebar from '../components/Sidebar'
import Rightbar from '../components/Rightbar'
import Bookmark from '../components/Bookmark'
import { useSelector } from 'react-redux'

function BookmarkPage() {
  const darkMode = useSelector((state) => state.user.darkMode);

  return (
    <div className={`flex justify-start ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
    }`} id='main-box'>
        <div className="w-1/8">
      <Sidebar/>
        </div>
        <div id='bookmark-box' className="w-[70%] ml-[7vmax]">
      <Bookmark/>
        </div>
      <div >
      <Rightbar/>
      </div>
    </div>
  )
}

export default BookmarkPage
