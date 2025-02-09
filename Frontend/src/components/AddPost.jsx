import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../index.css";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../../app/userSlice";
import { serverLink } from "../../constants";

const AddPostComponent = ({ setPosts, setIsDialogOpen, isDialogOpen }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.user.darkMode);
  const [formData, setFormData] = useState({
    postContent: "",
    postImage: "",
  });
  const dispatch = useDispatch();


  const handleChange = (e) => {
    setFormData({ ...formData, postContent: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, postImage: file });
    } else {
      setImagePreview(null);
      setFormData({ ...formData, postImage: "" });
    }
  };

  // Add Post Api
  const addNewPost = async (e) => {
    e.preventDefault();

    if (!formData.postContent.trim() && !formData.postImage) {
      toast.error("Post should not be empty");

      return;
    }
    setLoader(true);
    const formDataToSend = new FormData();
    formDataToSend.append("postContent", formData.postContent);
    formDataToSend.append("postImage", formData.postImage);
    try {
      const response = await fetch(`${serverLink}/api/v1/post/add`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Post Added");
        dispatch(addPost(data.data));
        setFormData({ postContent: "", postImage: "" });
        setImagePreview(null);
        navigate("/");
      } else {
        toast.error(data.message || "Failed to add post");
      }
    } catch (error) {
      toast.error("Error occurred during adding post");
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div
      className={`w-full max-w-2xl min-h-screen mx-auto p-6 rounded-lg shadow-md ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Create a New Post</h2>
      <div className="mb-4">
        <textarea
          rows="4"
          onChange={handleChange}
          value={formData.postContent}
          placeholder="What's on your mind?"
          className={`w-full p-3 rounded-lg border resize-none focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "bg-gray-800 text-gray-200 border-gray-700"
              : "bg-gray-100 text-gray-800 border-gray-300"
          }`}
          aria-label="Post Content"
        ></textarea>
      </div>
      <div className="mb-4">
        <label
          className={`block text-sm font-medium mb-2 ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={`text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg ${
            darkMode ? "file:bg-gray-700 text-gray-200" : "file:bg-gray-300"
          }`}
          aria-label="Upload Image"
        />
      </div>
      {imagePreview && (
        <div className="mb-4">
          <p
            className={`text-sm font-medium mb-2 ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Image Preview:
          </p>
          <img
            src={imagePreview}
            alt="Selected"
            className="w-full h-auto object-contain rounded-lg border"
          />
        </div>
      )}

      <div className="flex justify-center items-center">
        {loader ? (
          <div className="loader"></div>
        ) : (
          <button
            onClick={addNewPost}
            className={`w-full py-2 px-4 font-semibold rounded-lg ${
              darkMode
                ? "bg-blue-700 hover:bg-blue-800 text-gray-200"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Post
          </button>
        )}
      </div>
    </div>
  );
};

export default AddPostComponent;
