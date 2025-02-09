import React, { useState, useEffect } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { serverLink } from "../../constants";

const MainContent = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("followers");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const darkMode = useSelector((state) => state.user.darkMode);

  useEffect(() => {
    if (!userData) navigate("/");
  }, [userData, navigate]);

  if (!userData) return null;

  const user = userData?.data?.loggedInUser || userData?.data;
  if (!user) return <div>No user data available.</div>;

  const userId = user._id;
  // const [posts, setPosts] = useState(user.posts);
  const [posts, setPosts] = useState(
    useSelector((state) => state.user.userPost)
  );
  const [followed, setFollowed] = useState(false);
  const [followings, setFollowings] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [followingData, setFollowingData] = useState([]);
  const [followerData, setFollowerData] = useState([]);
  const [postStatus, setPostStatus] = useState([]);

  const getPostStatus = async (id) => {
    try {
      const response = await fetch(`${serverLink}/api/v1/post/postStatus`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          profileId: id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPostStatus(data.data);
        // toast.success("Fetched status successfully")
      } else {
        toast.error("Error in response");
      }
    } catch (error) {
      console.log("Error in getting post status :", error);
      toast.error("Error");
    }
  };

  useEffect(() => {
    if (userId) {
      getPostStatus(userId);
    }
  }, [userId]);
  const deletePostRequest = async (id) => {
    try {
      const response = await fetch(`${serverLink}/api/v1/post/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
         },
        body: JSON.stringify({ id }),
        credentials: "include",
      });
      if (response.ok) {
        toast.success("Post deleted successfully");
        setPosts((prev) => prev.filter((post) => post._id !== id));
      } else {
        toast.error("Unexpected error in deleting post");
      }
    } catch (error) {
      console.error("Error in deleting post:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${serverLink}/api/v1/post/like`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({
          postId,
        }),
      });
      if (response.ok) {
        setPostStatus((prevStatus) =>
          prevStatus.map((status) =>
            status.postId === postId
              ? {
                  ...status,
                  isLiked: !status.isLiked,
                  likeCount: status.isLiked
                    ? status.likeCount - 1
                    : status.likeCount + 1, // Toggle likeCount
                }
              : status
          )
        );
        //  toast.success('liked')
      } else {
        toast.error("Error in liking");
      }
    } catch (error) {
      console.log("Error :", error);
      toast.error("Error");
    }
  };

  const getFollowDetails = async (profileId) => {
    try {
      const response = await fetch(`${serverLink}/api/v1/user/followStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
         },
        body: JSON.stringify({ profileId }),
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
      console.error("Error fetching follow details:", error);
      toast.error("Error fetching follow details in catch block");
    }
  };

  useEffect(() => {
    if (userId) getFollowDetails(userId);
  }, [userId, followed]);

  // Bookmark

  const bookmark = async (postId) => {
    try {
      const response = await fetch(`${serverLink}/api/v1/post/bookmark`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({
          postId,
        }),
        credentials: "include",
      });
      if (response.ok) {
        setPostStatus((prevStatus) =>
          prevStatus.map((status) =>
            status.postId === postId
              ? { ...status, isBookmarked: !status.isBookmarked }
              : status
          )
        );
        // toast.success("Bookmarked")
      } else {
        toast.error("Failed to bookmark");
      }
    } catch (error) {
      console.log("Error in bookmarking :", error);
      toast.error("Error in bookmarking");
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
              <p className="font-medium text-black">{user.name}</p>
              <p className="text-sm text-gray-500">{user.username}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`ml-[8%] mr-[23%] flex-1 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
      id="main-content"
    >
      {/* Theme Toggle */}

      <div className="p-4 flex items-center justify-between">
        <h1 className="font-bold text-xl">{user.name}</h1>
      </div>
      {/* Profile Section */}
      <div>
        <div
          className="h-[12vmax] w-full bg-gray-500 bg-cover bg-center"
          style={{ backgroundImage: `url(${user.coverImage})` }}
        ></div>
        <div
          className={`p-6 shadow rounded-lg ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <div className="relative -mt-16">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-white"
            />
          </div>
          <div className="mt-4 flex justify-between mb-2">
            <div>
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p>@{user.username}</p>
            </div>
          </div>
          <div>
            <p>{user.bio}</p>
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

      {/* Follow Popup */}
      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg h-96 overflow-scroll" id="scroll-div">
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
            <div className="h-full">{renderPopupContent()}</div>
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div
        className={`mt-10 p-6 shadow rounded-lg ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h3 className="text-2xl font-semibold mb-6 border-b pb-2">Posts</h3>
        {posts
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((post) => {
            const status = postStatus?.find(
              (status) => status.postId === post._id
            );
            return (
              <div key={post._id} className="mb-6 pb-6 border-b">
                <div className="flex items-center space-x-4 mb-2 relative">
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="text-lg font-bold">{user.name}</h4>
                    <p>{user.username}</p>
                  </div>

                  {/* Bookmark button in the top-right corner */}
                  <button
                    onClick={() => bookmark(post._id)}
                    className="absolute top-0 right-0 p-2"
                  >
                    {/* {user.bookmark.includes(post._id)?(<TurnedInIcon />):(<TurnedInNotIcon />)} */}
                    {status?.isBookmarked ? (
                      <TurnedInIcon />
                    ) : (
                      <TurnedInNotIcon />
                    )}
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
                    onDoubleClick={() => handleLike(post._id)}
                  />
                )}

                <div className="flex justify-between items-center ml-2">
                  {/* Likes and Like Button */}
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xl">
                      {status?.likeCount}
                    </span>
                    <button onClick={() => handleLike(post._id)}>
                      {/* {post.likes.includes(user._id)?<ThumbUpAltIcon />:<ThumbUpOffAltIcon />} */}
                      {status?.isLiked ? (
                        <FavoriteIcon style={{color:'red'}}/>
                      ) : (
                        <FavoriteBorderIcon/>
                      )}
                    </button>
                    <button
                      className="font-[2px]"
                      onClick={() => deletePostRequest(post._id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>

                  {/* Post Date in Bottom-Right Corner */}
                  <p className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MainContent;
