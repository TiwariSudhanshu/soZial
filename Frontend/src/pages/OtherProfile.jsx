import React from "react";
import { useState, useEffect } from "react";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import Rightbar from "../components/Rightbar";
import {  useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TurnedInIcon from '@mui/icons-material/TurnedIn';

function OtherProfile() {
  const [profile, setProfile] = useState("");
  const [posts, setPosts] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("followers");
  const param = useParams();
  const username = param.username;
  const [followingData, setFollowingData] = useState([]);
  const [followerData, setFollowerData] = useState([]);
  const darkMode = useSelector((state) => state.user.darkMode);
  const userData = JSON.parse(localStorage.getItem("user"));
  const user = userData?.data?.loggedInUser || userData?.data;

  const [postStatus, setPostStatus] = useState([]);

  useEffect(() => {
    const findProfile = async () => {
      try {
        const response = await fetch("/api/v1/profiles/fetch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setProfile(data.data);
          setPosts(data.data.posts);
        } else {
          console.error("Server Error:", data.message);
          toast.error("Error: " + data.message);
        }
      } catch (error) {
        console.log("Error", error);
        toast.error("Failed to fetch the profile");
      }
    };
    if (username) {
      findProfile();
    }
  }, [username]);

  const profileId = profile._id;
  // Post status

  const getPostStatus = async(id)=>{
    try {
      const response = await fetch('/api/v1/post/postStatus',{
        method: 'post',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user._id,
          profileId: id
        })
      })
      
      if(response.ok){
        const data = await response.json();
        setPostStatus(data.data);
        // toast.success("Fetched status successfully")
      }else{
        toast.error("Error in response")
      }
    } catch (error) {
      console.log("Error in getting post status :", error)
      toast.error("Error");
      
    }
  }

  useEffect(()=>{
    if(profileId){
      getPostStatus(profileId);   
    }
  },[profileId])
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleString("en-US", options);
  };
    const handleLike = async(postId)=>{
     try {
       const response = await fetch('/api/v1/post/like',{
         method: 'post',
         headers:{
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           postId
         })
       })
       if(response.ok){
        setPostStatus((prevStatus) =>
          prevStatus.map((status) =>
            status.postId === postId
              ? {
                  ...status,
                  isLiked: !status.isLiked,
                  likeCount: status.isLiked ? status.likeCount - 1 : status.likeCount + 1, // Toggle likeCount
                }
              : status
          )
        );
        //  toast.success('liked')
       }else{
         toast.error("Error in liking")
       }
     } catch (error) {
      console.log("Error :", error)
      toast.error("Error")
     }
    }
  

  // Bookmarking

  const bookmark = async(postId)=>{
    try {
      const response = await fetch("/api/v1/post/bookmark",{
        method: 'post',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId
        }),
        credentials: "include"
      })
      if(response.ok){
        setPostStatus((prevStatus) =>
          prevStatus.map((status) =>
            status.postId === postId
              ? { ...status, isBookmarked: !status.isBookmarked }
              : status
          )
        );
        // toast.success("Bookmarked")

      }else{
        toast.error("Failed to bookmark")
      }
    } catch (error) {
      console.log("Error in bookmarking :", error)
      toast.error("Error in bookmarking")
    }
  }
  

  // Follow

  const [followed, setFollowed] = useState(false);
  const [followings, setFollowings] = useState(0);
  const [followers, setFollowers] = useState(0);

  const handleFollow = async () => {
    try {
      const response = await fetch("/api/v1/user/follow", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followingId: profile._id,
        }),
      });
      if (response.ok) {
        // toast.success("Followed");
        setFollowed(!followed);
      } else {
        toast.error("Error in following");
      }
    } catch (error) {
      console.log("Error :", error);
      toast.error("Error in following in catch block");
    }
  };
  const getFollowDetails = async (profileId) => {
    try {
      const response = await fetch("/api/v1/user/followStatus", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFollowings(data.data.followingCount);
        setFollowers(data.data.followerCount);
        setFollowed(data.data.followStatus);
        setFollowingData(data.data.followings);
        setFollowerData(data.data.followers);
      } else {
        toast.error("Error in fetching follow details");
      }
    } catch (error) {
      console.log("Error : ", error);
      toast.error("Error in fetching follow details in catch block");
    }
  };
  useEffect(() => {
    if (profile?._id) {
      getFollowDetails(profile._id);
    }
  }, [profile, followed]);

  const handleUnfollow = async () => {
    try {
      const response = await fetch("/api/v1/user/unfollow", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followingId: profile._id,
        }),
      });
      if (response.ok) {
        // toast.success("UnFollowed");
        setFollowed(!followed);
      } else {
        toast.error("Error in unfollowing");
      }
    } catch (error) {
      console.log("Error :", error);
      toast.error("Error in unfollowing in catch block");
    }
  };

  const renderPopupContent = () => {
    const data = activeTab === "followers" ? followerData : followingData;
    return (
      <div className="space-y-4">
        {data.map((user) => (
          <div
            key={user.username}
            onClick={() => navigate(`/${user.username}`)}
            className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <img
              src={user.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.username}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className={`flex ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
    }`}  id='main-box'>
      <Sidebar />
      <div  id="main-content"
        className={`ml-[8%] mr-[23%] flex-1 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        {/* Theme Toggle Button */}
        <div className="p-4 flex items-center justify-between">
        <h1 className="font-bold text-xl">{profile.name}</h1>
        
      </div>
        {/* Profile Section */}
        <div>
          <div
            className="h-[12vmax] w-full bg-gray-500 bg-cover bg-center"
            style={{ backgroundImage: `url(${profile.coverImage})` }}
          ></div>
          <div
            className={`flex flex-col items-start p-6 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            } shadow rounded-lg`}
          >
            <div className="relative -mt-16">
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white"
              />
            </div>
            <div className="flex justify-between items-center w-full mt-4">
              <div>
                <h2 className="text-3xl font-bold">{profile.name}</h2>
                <p>@{profile.username}</p>
              </div>
              {followed ? (
                <button
                  className="bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transform transition-transform hover:scale-105"
                  id="follow-btn"
                  onClick={() => {
                    handleUnfollow();
                  }}
                >
                  Following
                </button>
              ) : (
                <button
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-500 transform transition-transform hover:scale-105"
                  id="follow-btn"
                  onClick={() => {
                    handleFollow();
                  }}
                >
                  Follow
                </button>
              )}
            </div>

            <div className="mt-2 flex space-x-6">
              <p
                onClick={() => {
                  setActiveTab("followers");
                  setPopupVisible(true);
                }}
                className="cursor-pointer hover:underline"
              >
                <strong>{followers}</strong> Followers
              </p>
              <p
                onClick={() => {
                  setActiveTab("following");
                  setPopupVisible(true);
                }}
                className="cursor-pointer hover:underline"
              >
                <strong>{followings}</strong> Following
              </p>
            </div>
          </div>
        </div>
        {popupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab("followers")}
                    className={`text-lg font-bold ${
                      activeTab === "followers"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    Followers
                  </button>
                  <button
                    onClick={() => setActiveTab("following")}
                    className={`text-lg font-bold ${
                      activeTab === "following"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    Following
                  </button>
                </div>
                <button
                  onClick={() => setPopupVisible(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
              {renderPopupContent()}
            </div>
          </div>
        )}

        {/* Posts Section */}
        <div
          className={`mt-10 p-6 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } shadow rounded-lg`}
        >
          <h3 className="text-2xl font-semibold mb-6 border-b pb-2">Posts</h3>
          {posts
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((post) => {
              const status = postStatus?.find((status) => status.postId === post._id);
              return(
                <div key={post._id} className="mb-6 pb-6 border-b">
                <div className="flex items-center space-x-4 mb-2 relative">
                  <img
                    src={profile.avatar}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="text-lg font-bold">{profile.name}</h4>
                    <p>{profile.username}</p>
                  </div>
            
                  {/* Bookmark button in the top-right corner */}
                  <button
                    onClick={() => bookmark(post._id)}
                    className="absolute top-0 right-0 p-2"
                  >
                    {/* {profile.bookmark.includes(user._id)?(<TurnedInIcon />):(<TurnedInNotIcon />)} */}
                    {status?.isBookmarked?(<TurnedInIcon />):(<TurnedInNotIcon />)}
                  </button>
                </div>
            
                {post.content && (
                  <p className="mb-3">
                    {post.content.split(" ").map((word, index) =>
                      word.startsWith("#") ? (
                        <span key={index} style={{ color: "skyblue" }}>
                          {word}{" "}
                        </span>
                      ) : (
                        word + " "
                      )
                    )}
                  </p>
                )}
            
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post Content"
                    className="w-full rounded-lg mb-3"
                  />
                )}
            
                <div className="flex justify-between items-center ml-2">
                  {/* Likes and Like Button */}
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xl">{status?.likeCount}</span>
                    <button onClick={() => handleLike(post._id)}>
                    { status?.isLiked?<ThumbUpAltIcon />:<ThumbUpOffAltIcon />}
                    </button>                                                                      
                  </div>
            
                  {/* Post Date in Bottom-Right Corner */}
                  <p className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              )
            } )
            
            }
        </div>
      </div>
      <Rightbar />
    </div>
  );
}

export default OtherProfile;
