import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import '../index.css'
import { useDispatch } from "react-redux";
import { addPost } from "../../app/userSlice";

const AddPostComponent = ({ setPosts, setIsDialogOpen, isDialogOpen }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    postContent: "",
    postImage: "",
  });
  const dispatch = useDispatch()
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
      const response = await fetch("/api/v1/post/add", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Post Added");
        dispatch(addPost(data.data))
        setFormData({ postContent: "", postImage: "" });
        setImagePreview(null);
        navigate("/profile")
        
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

  return loader ? (
    <div className="loader absolute top-[50%] left-[50%]">
    </div>
  ) : (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center">Create a New Post</h2>
      <div className="mb-4">
        <textarea
          rows="4"
          onChange={handleChange}
          value={formData.postContent}
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg border bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 resize-none"
          aria-label="Post Content"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg"
          aria-label="Upload Image"
        />
      </div>
      {imagePreview && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Image Preview:</p>
          <img
            src={imagePreview}
            alt="Selected"
            className="w-full h-64 object-cover rounded-lg border"
          />
        </div>
      )}
      <button
        onClick={addNewPost}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
      >
        Post
      </button>
    </div>
  );
};

export default AddPostComponent;
