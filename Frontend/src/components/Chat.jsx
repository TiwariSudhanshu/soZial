import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Rightbar from "../components/Rightbar"
import { useState, useEffect, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import socket from "../../app/socket";
import { toast } from "react-toastify";
import '../index.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function Chat() {
  const username = useParams();
    const darkMode = useSelector((state) => state.user.darkMode);
    const [activeChat, setActiveChat] = useState(null);
     const userData = JSON.parse(localStorage.getItem("user"));
      const user = userData?.data?.loggedInUser || userData?.data;
      const userId = user._id;
      const [message, setMessage] = useState("");
      const [chat, setChat] = useState([]);
      const [prevChat, setPrevChat] = useState([]);
        const chatContainerRef = useRef(null);
        const [toId, setToId] = useState();
        const navigate = useNavigate();
        useEffect(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, [chat, prevChat]);
        useEffect(() => {
          socket.on("recieve", (data) => {
            setChat((prevChat) => [...prevChat, data]);
          });
          return () => {
            socket.off("recieve");
          };
        },[]);
        useEffect(() => {
          if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
            // Skip reload if the page was already reloaded
            return;
          }
          window.location.reload();
        }, []);
        
        
        const getActiveChat = async()=>{
            try {
            
                const response = await fetch('/api/v1/profiles/fetch', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username.username
                    }),
                  });
                  if(response.ok){
                      const data = await response.json();
                      setActiveChat(data.data);
                      setToId(data.data._id);
                  }else{
                    // toast.error("Error in fetching user")
                  }
            } catch (error) {
                console.log("Error :", error)
                // toast.error("Error in getting Active Chat")
            }
        }
       

          const getPrevChat = async () => {
            try {
              const response = await fetch('/api/v1/message/get', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: userId,
                  to: toId,
                }),
              });
          
              // Parsing JSON response
              const data = await response.json();
          
              if (response.ok) {
                if (data.data === null || !data.data.messages) {
                  setPrevChat([]);
                } else {
                  setPrevChat(data.data.messages);
                }
                // toast.success("Fetched previous chat") 
              } else {
                // toast.error("Error in fetching chat");
              }
            } catch (error) {
              console.error("Error:", error);
              // toast.error("An error occurred while fetching chats.");
            }
          };
          
          useEffect(()=>{
            getActiveChat();
        })
        useEffect(() => {
          if (toId) {
            getPrevChat();
          }
        }, [toId]);
        
          const handleSend = (e) => {
            // e.preventDefault();
           
  if (message.trim() !== "") { 
    const data = {
      message: message,
      id: toId,
    };
    saveMessage(message);
    socket.emit("message", data);
    setMessage(""); 
  }
          };
          const saveMessage = async(message)=>{
             try {
               const response = await fetch('/api/v1/message/new',{
                 method: 'post',
                 headers:{
                   'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({
                   to: toId,
                   from: userId,
                   message: message
                 })
               })
               if(response.ok){
                //  toast.success("Success in saving message")
               }else{
                 toast.error("Error in saving message")
               }
             } catch (error) {
              console.log("Error :", error)
              toast.error("Error in saving message")
             }
            }
           
            const TimeDisplay = (timeStamp)=>{
              const date = new Date(timeStamp);
              // Format the time to AM/PM
              const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
              return formattedTime;
            }
             const clearChat = async()=>{
                try {
                  const response = await fetch('/api/v1/message/clear',{
                    method: 'post',
                    headers:{
                      'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({
                      from: userId,
                      to: toId
                    })
                  })
                  if(response.ok){
                    toast.success("Cleared");
                    setPrevChat([]);
                    setChat([]);
                  }else{
                    toast.error("Error in clearing chat")
                  }
                } catch (error) {
                  console.log("Error in clearing :", error)
                  toast.error("Error in clearing")
                }
              }
             
              if (!activeChat) return <div className="loader"></div>;
  return (
    <div className={`flex ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
    }`} id='main-box'>
      <Sidebar/>
      <div className="w-3/4 p-4 relative min-h-screen ml-[5vmax]" id="chat-screen">
          <div className="flex flex-col h-full" >
            {/* Chat Header */}
            <div
              className={`flex items-center space-x-4 p-4 border-b ${
                darkMode ? "border-gray-700" : "border-indigo-300"
              }`}
            >
              <button onClick={()=>{navigate('/chat')}}><ArrowBackIcon/></button>
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
              <button
                onClick={clearChat}
                className="absolute right-8 border p-2 rounded-md"
              >
                Clear chat
              </button>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="chat-div flex-1 p-4 overflow-y-scroll"
              style={{
                maxHeight: "calc(100vh - 200px)",
                // Adjust for header & input
              }}
            >
              {prevChat.map((message, index) => (
                <div
                  key={index}
                  className={`message flex flex-col ${
                    message.from === userId ? "items-end" : "items-start"
                  } mb-6`}
                >
                  <div
                    className={`p-2 rounded-lg shadow-md max-w-fit ${
                      message.from === userId
                        ? "bg-green-100 text-gray-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <p className="m-0">{message.content}</p>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {TimeDisplay(message.timeStamp)}
                  </p>
                </div>
              ))}

              {chat.map((message, index) => (
                <div
                  key={index}
                  className={`message flex flex-col ${
                    message.sender === "You" ? "items-end" : "items-start"
                  } mb-6`}
                >
                  <div
                    className={`p-2 rounded-lg shadow-md max-w-fit ${
                      message.sender === "You"
                        ? "bg-green-100 text-gray-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <p className="m-0">{message.message}</p>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {TimeDisplay(Date.now())}
                  </p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div
              id="chatInput"
              className={`flex items-center w-[96%] absolute bottom-2 p-4 border-t ${
                darkMode ? "border-gray-700" : "border-indigo-300"
              }`}
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend(); 
                  }
                }}
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
      </div>
      <div id="chat-rightbar">
      <Rightbar/>
      </div>
    </div>
    
  );
}

export default Chat;
