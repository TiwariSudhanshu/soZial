import React from "react";
import { useState, useEffect } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function OtherProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(false);

  const [profile, setProfile] = useState("");
  const [posts, setPosts] = useState([]);

  const [postLikeIds, setPostLikeIds] = useState([]);

  // Function to handle likes
  const toggleLikePost = (postId) => {
    if (postLikeIds.includes(postId)) {
      setPostLikeIds(postLikeIds.filter((id) => id !== postId));
    } else {
      setPostLikeIds([...postLikeIds, postId]);
    }
  };

  const id = location.state;

  useEffect(() => {
    const findProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/profiles/profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
            }),
          }
        );

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
    if (id) {
      findProfile();
    }
  }, [id]);

  const profileId = profile._id;

  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const openSearchDialog = () => {
    setIsSearchDialogOpen(true);
  };

  const closeSearchDialog = () => {
    setIsSearchDialogOpen(false);
  };
  const [searchUsername, setSearchUsername] = useState("");

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

  const [users, setUsers] = useState([]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/suggestions",
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          const allUsers = data.data.users;
          const profiles = allUsers.filter((i) => i._id != profileId);
          const shuffleProfiles = [...profiles].sort(() => 0.5 - Math.random());
          const suggestedUsers = shuffleProfiles.slice(0, 6);
          setUsers(suggestedUsers);
        } else {
          alert("Failed to fetch users");
        }
      } catch (error) {
        alert("Error in fetching");
      }
    };
    fetchUsers();
  }, []);

  // Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleString("en-US", options);
  };
  const [isLightMode, setIsLightMode] = useState(false);
  const toggleMode = () => {
    const rootElement = document.documentElement;
    rootElement.classList.toggle("light-mode");
    setIsLightMode(!isLightMode);
  };
  const [more, setMore] = useState(false);

  function toggleMore() {
    setMore(!more);
  }
  console.log(posts);
  return (
    <div className="profilePage" id="profilePage">
      <div className="sidebar">
        <p id="logo">Profiler</p>
        <div className="tabs">
          <button onClick={()=>{navigate("/profile")}}>
            <i class="fa-solid fa-house"></i>
            <span> Home</span>
          </button>
          <button onClick={openSearchDialog}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <span>Search</span>
          </button>
          <button
            onClick={() => {
              navigate("/profile");
            }}
          >
            <i class="fa-solid fa-user"></i>
            <span>Profile</span>
          </button>
          <button onClick={toggleMore}>
            <i class="fa-solid fa-bars"></i>
            <span>More</span>
          </button>
        </div>
        <div
          className="moreOptionsBox"
          style={{ display: more ? "flex" : "none" }}
        >
          <button>
            <i class="fa-solid fa-pen-to-square"></i>Edit Profile
          </button>
          <button>
          <i class="fa-solid fa-bookmark"></i>Bookmarks
          </button>
          <button id="toggleMode" onClick={toggleMode}>
            <i class="fa-solid fa-toggle-on"></i>
            {isLightMode ? "Shift to Dark Mode" : "Shift to Light Mode"}
          </button>
        </div>
      </div>
      <form>
        <div
          className="searchModel"
          style={{ display: isSearchDialogOpen ? "flex" : "none" }}
        >
          <button id="closeDialog" onClick={()=>{
            e.preventDefault();
            closeSearchDialog();
          }}>
            <i class="fa-solid fa-xmark"></i>
          </button>
          <h2>Search</h2>
          <div className="searchUser">
            <input
              type="text"
              id="searchUsername"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter username"
            />
            <button id="searchBtn" onClick={searchProfileRequest}>
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          {loader ? (
            <div className="loader"></div> // This can be a spinner or loading animation
          ) : (
            searchProfile && (
              <div className="searchedUser"  onClick={()=>{navigate("/otherProfile", { state: searchProfile._id })}}>
                {searchProfile.avatar ? (
                  <img
                    src={searchProfile.avatar}
                    id="suggestImage"
                    alt="Search User Avatar"
                  />
                ) : (
                  <p></p>
                )}
                <div className="suggestDetail">
                  <h3>{searchProfile.name || ""}</h3>
                  <p>{searchProfile.username || ""}</p>
                </div>
                
              </div>
            )
          )}
        </div>
      </form>
      <div className="center">
        <div className="head">
          <span>{profile.name}</span>
        </div>
        <div
          className="cover-image"
          style={{ backgroundImage: `url(${profile.coverImage})` }}
        ></div>
        <img src={profile.avatar} id="avatarImage" alt="avatar" />
        <div className="profile-details">
          <h3 id="name">{profile.name}</h3>
          <p id="username">@{profile.username}</p>
          <p id="bio">{profile.bio}</p>
          <div className="connections">
            <span id="following-count">93 followings</span> &nbsp;&nbsp;&nbsp;
            <span id="follower-count">122 followers</span>
          </div>
          <br />
          <br />
        </div>
        <hr />
        <h2>Posts</h2>
        {posts
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((userPost) => {
            return (
              <div className="post">
                <div className="post-details">
                  <div className="post-details-left">
                    <img loading="lazy" id="post-avatar" src={profile.avatar} alt="" />
                    <div>
                      <h3>{profile.name}</h3>
                      <p>@{profile.username}</p>
                    </div>
                    <p id="dateOfPost">
                      &nbsp;&nbsp;&nbsp;.{formatDate(userPost.date)}{" "}
                    </p>
                  </div>
                  <div className="post-details-right">
                    <i
                      class="fa-regular fa-heart"
                      style={{
                        color: postLikeIds.includes(userPost._id)
                          ? "red"
                          : isLightMode
                          ? "black"
                          : "white",
                      }}
                      onClick={() => toggleLikePost(userPost._id)}
                    ></i>
                  </div>
                </div>
                <div className="post-content">
                  <p>{userPost.content}</p>
                </div>
                <img loading="lazy" id="postImage" src={userPost.image} alt="" />
              </div>
            );
          })}
      </div>
      <div className="rightbar">
        <h2>Suggestions</h2>
        <div className="suggestions">
          {users.map((suggestion) => (
            <div
              className="suggest"
              key={suggestion._id}
              onClick={() => {
                navigate("/otherProfile", { state: suggestion._id });
              }}
            >
              <img loading="lazy" src={suggestion.avatar} alt="img" id="suggestImage" />
              <div className="suggestDetail">
                <p id="suggestName">{suggestion.name}</p>
                <p id="suggestUsername">@{suggestion.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OtherProfile;
