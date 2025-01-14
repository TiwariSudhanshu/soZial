import React from "react";
import Sidebar from "../components/Sidebar";
import Rightbar from "../components/Rightbar"

import { useState, useEffect, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import { io } from "socket.io-client";
import '../index.css'
import { useNavigate } from "react-router-dom";


function ChatPage() {
  const darkMode = useSelector((state) => state.user.darkMode);
  const [followingData, setFollowingData] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const user = userData?.data?.loggedInUser || userData?.data;
  const userId = user._id;

  const navigate = useNavigate();
  




  const getFollowDetails = async (profileId) => {
    try {
      const response = await fetch("/api/v1/user/followStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      if (response.ok) {
        const data = await response.json();
        setFollowingData(data.data.followings);
      } else {
        toast.error("Error in fetching follow details");
      }
    } catch (error) {
      console.error("Error fetching follow details:", error);
      toast.error("Error fetching follow details in catch block");
    }
  };

  useEffect(() => {
    if (userId) getFollowDetails(userId);
  }, []);

  const [searchUsername, setSearchUsername] = useState("");
  const [loader, setLoader] = useState(false);
  const [searchProfile, setSearchProfile] = useState(null);

  const searchProfileRequest = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await fetch("/api/v1/profiles/search", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: searchUsername,
        }),
      });

      if (response.ok) {
        toast.success("User found");
        const data = await response.json();
        setSearchProfile(data.data);
      } else {
        setSearchProfile(null);
      }
    } catch (error) {
      toast.error("Something went wrong while searching");
      console.log("Error : ", error);
    } finally {
      setLoader(false);
    }
  };

  return(
    <div className={` flex ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
    }`} id='main-box'>
      <Sidebar/>
      <div>
      <div id="chat-screen"
            className={`w-[70vmax] p-4 min-h-screen ml-[5vmax]  ${
              darkMode ? "border-gray-700" : "border-indigo-200"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                darkMode ? "text-purple-400" : "text-indigo-600"
              }`}
            >
              Chat
            </h2>
            {/* Search Input */}
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  id="searchUsername"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 pl-10 rounded-lg outline-none focus:bg-gray-600"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") searchProfileRequest();
                  }}
                />
                <button onClick={searchProfileRequest}>
                  <span className="absolute left-3 mr-10 top-2 text-gray-400">
                    <SearchIcon />
                  </span>
                </button>
              </div>
            </div>
  
            {/* Search Results or Suggestions */}
            {loader ? (
              <div className="loader ml-[50%]"></div>
            ) : (
              searchProfile && (
                <div className="px-4 mt-4">
                  <h2 className="text-lg font-semibold border-b border-gray-700 pb-2">
                    Search Result
                  </h2>
                  <div
                    onClick={() => {
                      // setActiveChat(searchProfile);
                      // setChat([]);
                      // setToId(searchProfile._id);
                      navigate(`/chat/${searchProfile.username}`)
                    }}
                    className="flex border-b border-gray-700 mb-10 items-center space-x-4 p-2 hover:bg-gray-700 rounded-lg cursor-pointer mt-2"
                  >
                    <img
                      src={searchProfile.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div id="chatProfile-details">
                      <p className="font-medium">{searchProfile.name}</p>
                      <p className="text-sm text-gray-400">
                        {searchProfile.username}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
  
            {followingData.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => {
                  // setActiveChat(suggestion);
                  // setChat([]);
                  // setToId(suggestion._id);
                  navigate(`/chat/${suggestion.username}`)
                }}
                className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer ${
                  darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-indigo-200 hover:shadow-md"
                }`}
              >
                <img
                  src={suggestion.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div id="chatProfile-details">
                  <p className="font-medium">{suggestion.name}</p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-indigo-500"
                    }`}
                  >
                    @{suggestion.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
      </div>
      <Rightbar/>
    </div>
  )
  
}

export default ChatPage;
