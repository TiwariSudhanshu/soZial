import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import '../index.css'

const Rightbar = () => {
  // Search Profile
  const navigate = useNavigate();
   const [searchUsername, setSearchUsername] = useState("");
   const [loader, setLoader] = useState(false)
  
    const [searchProfile, setSearchProfile] = useState(null);
    const userData = JSON.parse(localStorage.getItem("user"));
    const user = userData?.data?.loggedInUser || userData?.data;
    
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

    // Suggestions

  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/v1/user/suggestions", {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        const allUsers = data.data.users;
        const profiles = allUsers.filter((i) => i._id != user._id);
        const shuffleProfiles = [...profiles].sort(() => 0.5 - Math.random());
        const suggestedUsers = shuffleProfiles.slice(0, 5);
        setUsers(suggestedUsers);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error("Error in fetching");
    }
  };
  useEffect(() => {
      fetchUsers();
    }, []);


  return (
    <div id="rightbar" className="h-screen w-1/5 bg-gray-800 text-white flex flex-col fixed right-0">
      {/* Search Bar */}
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
          <span className="absolute left-3 mr-10 top-2 text-gray-400" ><SearchIcon/></span>
            </button>
        </div>
      </div>

      {/* Search Result */}
      {loader ? (
  <div className="loader ml-[50%]"></div>
) : (
  searchProfile && (
    <div className="px-4 mt-4">
      <h2 className="text-lg font-semibold border-b border-gray-700 pb-2">Search Result</h2>
      <div   onClick={() => {
                navigate(`/${searchProfile.username}`)
              }}
      className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded-lg cursor-pointer mt-2">
        <img
          src={searchProfile.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-medium">{searchProfile.name}</p>
          <p className="text-sm text-gray-400">{searchProfile.username}</p>
        </div>
      </div>
    </div>
  )
)}

    

      {/* Suggestions */}
      <div className="flex-1 mt-6 px-4 space-y-4">
        <h2 className="text-lg font-semibold border-b border-gray-700 pb-2">Suggestions
          <button onClick={fetchUsers} className="absolute right-5"><RefreshIcon/></button></h2>
        
        {users.map((suggestion) => (
           <div onClick={() => {
            navigate(`/${suggestion.username}`);
          }} className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
           <img
              src={suggestion.avatar}
             alt="avatar"
             className="w-10 h-10 rounded-full"
           />
           <div>
             <p className="font-medium">{suggestion.name}</p>
             <p className="text-sm text-gray-400">@{suggestion.username}</p>
           </div>
         </div>
        ))}
        {/* User Suggestion 1 */}
       

       
        <hr />
      {/* Bottom Icon */}

    </div>

    </div>
  );
};

export default Rightbar;
