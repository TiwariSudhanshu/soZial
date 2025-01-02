import React from "react";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:3000", {
  withCredentials: true,
});

function ChatPage() {
  const darkMode = useSelector((state) => state.user.darkMode);
  const [activeChat, setActiveChat] = useState(null);
  const [followingData, setFollowingData] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const user = userData?.data?.loggedInUser || userData?.data;
  const userId = user._id;
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [toId, setToId] = useState("");

  useEffect(() => {
    socket.on("recieve", (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });
  }, []);

  const handleSend = (e) => {
    // e.preventDefault();
    console.log("handle button");
    const data = {
      message: message,
      id: toId,
    };
    socket.emit("message", data);
    setMessage("");
  };

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


  return (
    <>
      <div className="flex">
        <Sidebar />
        <div
          className={`min-h-screen w-[100%] flex ml-[5%] ${
            darkMode
              ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-100"
              : "bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-gray-800"
          }`}
        >
          {/* Sidebar */}
          <div
            className={`w-1/4 p-4 border-r ${
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
                      setActiveChat(searchProfile);
                      setChat([])
                      setToId(searchProfile._id);
                    }}
                    className="flex border-b border-gray-700 mb-10 items-center space-x-4 p-2 hover:bg-gray-700 rounded-lg cursor-pointer mt-2"
                  >
                    <img
                      src={searchProfile.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
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
                  setActiveChat(suggestion);
                  setChat([])
                  setToId(suggestion._id);
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
                <div>
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
  
          {/* Chat Section */}
          <div className="w-3/4 p-4">
            {activeChat ? (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div
                  className={`flex items-center space-x-4 p-4 border-b ${
                    darkMode ? "border-gray-700" : "border-indigo-300"
                  }`}
                >
                  <img
                    src={activeChat.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-lg">{activeChat.name}</p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-indigo-500"
                      }`}
                    >
                      @{activeChat.username}
                    </p>
                  </div>
                </div>
  
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {chat.map((message) => {
                    return (
                      <div
                        className="message"
                        style={{
                          alignSelf:
                            message.sender === "You"
                              ? "flex-end"
                              : "flex-start",
                          backgroundColor:
                            message.sender === "You" ? "#d1f7c4" : "#f1f1f1",
                          color: message.sender === "You" ? "#333" : "#555",
                          padding: "10px",
                          borderRadius: "10px",
                          maxWidth: "fit-content",
                          marginBottom: "10px",
                          marginLeft: message.sender === "You" ? "auto" : "0",
                          marginRight: message.sender === "You" ? "0" : "auto",
                          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <p style={{ margin: 0 }}>{message.message}</p>
                      </div>
                    );
                  })}
                </div>
  
                {/* Chat Input */}
                <div
                  className={`flex items-center p-4 border-t ${
                    darkMode ? "border-gray-700" : "border-indigo-300"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                      darkMode
                        ? "bg-gray-800 border-gray-600 focus:ring-purple-500"
                        : "bg-white border-indigo-300 focus:ring-indigo-500"
                    }`}
                  />
                  <button
                    onClick={() => {
                      handleSend();
                    }}
                    className={`ml-4 px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-purple-500 hover:bg-purple-600 text-gray-100"
                        : "bg-indigo-500 hover:bg-indigo-600 text-white"
                    }`}
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`flex items-center justify-center h-full ${
                  darkMode ? "text-gray-400" : "text-indigo-400"
                }`}
              >
                Select a user to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
  
}

export default ChatPage;
