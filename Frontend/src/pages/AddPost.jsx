import React from "react";
import Sidebar from "../components/Sidebar";
import Rightbar from "../components/Rightbar";
import AddPostComponent from "../components/AddPost";
import { useSelector } from "react-redux";
function AddPost() {
  const darkMode = useSelector((state) => state.user.darkMode);
  return (
    <div
      id="main-box"
      className={`flex ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <Sidebar />
      <AddPostComponent />
      <Rightbar />
    </div>
  );
}

export default AddPost;
