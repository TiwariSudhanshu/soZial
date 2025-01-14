import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link, NavLink } from "react-router-dom";
import { editUserInfo, fetchUser, changePassword } from "../api/edit.api";
import '../index.css'
import { useSelector } from "react-redux";

const EditProfileComponent = () => {
  const [activeSection, setActiveSection] = useState("profile");

    const [loader, setLoader] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [coverImagePreview, setCoverImagePreview] = useState("");
    const [pageToggle, setPageToggle] = useState(true);
     const darkMode = useSelector((state) => state.user.darkMode);

    const [formData, setFormData] = useState({
      name: "",
      username: "",
      bio: "",
      mobileNo: "",
      email: "",
      avatar: null,
      coverImage: null,
    });
  
    const [passData, setPassData] = useState({
      oldPass: "",
      newPass: "",
      confirmPass: "",
    });
  
    // Handle changes function
    const handleChange = (e) => {
      const { id, value } = e.target;
      setFormData({ ...formData, [id]: value });
    };
  
    const handlePassChange = (e) => {
      const { id, value } = e.target;
      setPassData({ ...passData, [id]: value });
    };
  
    const handleFileChange = (e) => {
      const { id, files } = e.target;
      if (files.length > 0) {
        const file = files[0];
        if (id === "avatar") {
          setAvatar(file);
          const imageUrl = URL.createObjectURL(file);
          setAvatarPreview(imageUrl);
        } else if (id === "coverImage") {
          setFormData((prevData) => ({
            ...prevData,
            coverImage: file,
          }));
          const coverUrl = URL.createObjectURL(file);
          setCoverImagePreview(coverUrl);
        }
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoader(true);
      const dataToSend = new FormData();
      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }
      if (avatar) {
        dataToSend.append("avatar", avatar);
      }
  
      try {
        const data = await editUserInfo(dataToSend);
        toast.success("User Info edited");
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/profile");
      } catch (error) {
        toast.error("User info not edited");
        console.log("Error in change: ", error);
      } finally {
        setLoader(false);
      }
    };
  
    useEffect(() => {
      const fetchAndSetUser = async () => {
        try {
          const data = await fetchUser();
          setUser(data.data);
          setFormData({
            name: data.data.name,
            username: data.data.username,
            bio: data.data.bio,
            mobileNo: data.data.mobileNo,
            email: data.data.email,
            avatar: null,
            coverImage: null,
          });
        } catch (error) {
          toast.error("Some Error");
          console.log("Error in fetchUser: ", error);
        }
      };
  
      fetchAndSetUser();
    }, []);
  
    const [passLoader, setPassLoader] = useState(false);
  
    const handlePasswordChange = async (e) => {
      e.preventDefault();
      setPassLoader(true);
      try {
        await changePassword(passData);
        toast.success("Password changed");
        navigate("/profile");
      } catch (error) {
        toast.error("Error in response");
        console.log("Error in changePassword: ", error);
      } finally {
        setPassLoader(false);
      }
    };
  
    if (!user) {
      return (
        <div className="loading-div">
          <div className="loader absolute top-[50%] left-[50%]"></div>
        </div>
      );
    }
    
    return(
      <div
  id="main-content"
  className={`h-screen w-full ml-[-5vmax] ${
    darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
  } flex flex-col items-center p-8 overflow-x-hidden`}
>
  {/* Header */}
  <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

  {/* Toggle Tabs */}
  <div className="flex mb-6 space-x-8">
    <span
      onClick={() => setActiveSection("profile")}
      className={`cursor-pointer text-lg font-medium ${
        activeSection === "profile"
          ? "border-b-2 border-orange-500 text-orange-500"
          : `${
              darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`
      }`}
    >
      Edit Profile Info
    </span>
    <span
      onClick={() => setActiveSection("password")}
      className={`cursor-pointer text-lg font-medium ${
        activeSection === "password"
          ? "border-b-2 border-orange-500 text-orange-500"
          : `${
              darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`
      }`}
    >
      Change Password
    </span>
  </div>

  {/* Content Section */}
  <div
    className={`w-full max-w-3xl ${
      darkMode ? "bg-gray-800" : "bg-white"
    } rounded-lg p-6 shadow-md`}
  >
    {activeSection === "profile" ? (
      <form onSubmit={handleSubmit}>
        {/* Profile Info Section */}
        <div className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex items-center space-x-4">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600"
              />
            ) : (
              <img
                src={user.avatar}
                alt="Default Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600"
              />
            )}
            <div>
              <label className="block text-sm mb-2">Change Avatar</label>
              <label
                htmlFor="avatar"
                className={`block text-sm cursor-pointer py-1 px-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-600 text-gray-300"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                Choose File
              </label>
              <input
                type="file"
                accept="image/*"
                id="avatar"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } outline-none`}
            />
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } outline-none`}
            />
          </div>

          {/* Bio Input */}
          <div>
            <label className="block text-sm mb-1">Bio</label>
            <textarea
              placeholder="Enter bio"
              id="bio"
              value={formData.bio}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } outline-none resize-none`}
              rows="3"
            />
          </div>

          {/* Cover Image Preview */}
          <div>
            <label className="block text-sm mb-1">Cover Image</label>
            {coverImagePreview ? (
              <div
                className="w-full h-32 object-cover rounded-lg mb-2"
                style={{
                  backgroundImage: `url(${coverImagePreview})`,
                }}
              ></div>
            ) : user?.coverImage ? (
              <div
                className="w-full h-32 object-cover rounded-lg mb-2"
                style={{
                  backgroundImage: `url(${user.coverImage})`,
                }}
              ></div>
            ) : null}
            <input
              type="file"
              accept="image/*"
              id="coverImage"
              name="coverImage"
              onChange={handleFileChange}
              className={`text-sm file:mr-4 file:py-1 file:px-2 file:rounded-lg ${
                darkMode
                  ? "file:bg-gray-600 file:text-gray-300"
                  : "file:bg-gray-300 file:text-gray-700"
              }`}
            />
          </div>
          {loader ? (
            <div className="loader" id="changeloader"></div>
          ) : (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              type="submit"
            >
              Save Changes
            </button>
          )}
        </div>
      </form>
    ) : (
      // Password Change Section
      <form onSubmit={handlePasswordChange}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-1">Old Password</label>
            <input
              type="password"
              id="oldPass"
              placeholder="Enter old password"
              value={passData.oldPass}
              onChange={handlePassChange}
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } outline-none`}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              id="newPass"
              placeholder="Enter new password"
              value={passData.newPass}
              onChange={handlePassChange}
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } outline-none`}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPass"
              placeholder="Confirm new password"
              value={passData.confirmPass}
              onChange={handlePassChange}
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } outline-none`}
            />
          </div>

          {passLoader ? (
            <div className="loader"></div>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Change Password
            </button>
          )}
        </div>
      </form>
    )}
  </div>
</div>
    )


};

export default EditProfileComponent;
