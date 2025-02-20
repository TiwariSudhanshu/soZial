import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/register.api";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const InfoPage = () => {
  const [step, setStep] = useState(1);
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("theme")) || false
  );
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    localStorage.setItem("theme", darkMode);
  }, [darkMode]);

  const navigate = useNavigate();
  const location = useLocation();
  const { email, mobileNo, password } = location.state || {};
  const [loader, setLoader] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    email: email || "",
    mobileNo: mobileNo || "",
    password: password || "",
    name: "",
    username: "",
    age: "",
    gender: "",
    dob: "",
    address: "",
    bio: "",
    avatar: null,
  });

  useEffect(() => {
    setStep(1);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, avatar: file });
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const response = await registerUser(formData);

    if (response.success) {
      toast.success("Registered successfully!");
      navigate("/");
    } else {
      toast.error(response.message);
    }

    setLoader(false);
  };

  return (
    <div
      className={`flex items-center justify-center h-screen overflow-hidden ${
        darkMode
          ? "bg-gradient-to-r from-[#1f2937] via-gray-800 to-indigo-900"
          : "bg-gradient-to-r from-purple-100 via-indigo-200 to-purple-300"
      }`}
    >
      {loader ? (
        <div className="loader"></div>
      ) : (
        <form onSubmit={handleSubmit}>
          <button
            type="button"
            onClick={toggleTheme}
            className={`absolute top-4 right-4 px-4 py-2 rounded focus:outline-none ${
              darkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-300 text-black hover:bg-gray-400"
            }`}
          >
            <DarkModeIcon />
          </button>

          {step === 1 && (
            <div
              className={`p-8 rounded-lg shadow-2xl w-full max-w-3xl transition-colors duration-500 ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900 shadow-lg"
              }`}
            >
              <h2 className="text-2xl font-extrabold mb-6 text-center">
                Personal Info
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  id="name"
                  placeholder="Full Name"
                  required
                  onChange={handleChange}
                  className={`w-full px-5 py-3 rounded-lg text-lg transition-all duration-500 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                      : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-purple-500"
                  } focus:outline-none focus:ring-2`}
                />
                <input
                  type="date"
                  id="dob"
                  placeholder="Date of Birth"
                  required
                  onChange={handleChange}
                  className={`w-full px-5 py-3 rounded-lg text-lg transition-all duration-500 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                      : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-purple-500"
                  } focus:outline-none focus:ring-2`}
                />
                <input
                  type="number"
                  id="age"
                  placeholder="Age"
                  required
                  onChange={handleChange}
                  className={`w-full px-5 py-3 rounded-lg text-lg transition-all duration-500 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                      : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-purple-500"
                  } focus:outline-none focus:ring-2`}
                />
                <input
                  type="text"
                  id="address"
                  placeholder="Address"
                  required
                  onChange={handleChange}
                  className={`w-full px-5 py-3 rounded-lg text-lg transition-all duration-500 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                      : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-purple-500"
                  } focus:outline-none focus:ring-2`}
                />
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
                    darkMode
                      ? "bg-purple-600 text-white hover:bg-purple-500"
                      : "bg-purple-500 text-white hover:bg-purple-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div
              className={`p-8 rounded-lg shadow-2xl w-full max-w-3xl transition-colors duration-500 ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900 shadow-lg"
              }`}
            >
              <h2 className="text-2xl font-extrabold mb-6 text-center">
                Username & Bio
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  required
                  onChange={handleChange}
                  className={`w-full px-5 py-3 rounded-lg text-lg transition-all duration-500 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                      : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-purple-500"
                  } focus:outline-none focus:ring-2`}
                />
                <textarea
                  id="bio"
                  placeholder="Bio"
                  required
                  onChange={handleChange}
                  className={`w-full px-5 py-3 rounded-lg text-lg transition-all duration-500 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                      : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-purple-500"
                  } focus:outline-none focus:ring-2`}
                  rows="4"
                />
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
                    darkMode
                      ? "bg-purple-600 text-white hover:bg-purple-500"
                      : "bg-purple-500 text-white hover:bg-purple-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div
              className={`p-8 rounded-lg shadow-2xl w-[40vmax] pt-10 pb-10 transition-colors duration-500 ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900 shadow-lg"
              }`}
            >
              <h2 className="text-2xl font-extrabold mb-6 text-center">
                Profile Picture
              </h2>
              <div className="space-y-4 flex flex-col items-center">
                <label
                  className={`w-full py-3 px-4 rounded-lg text-lg text-center cursor-pointer transition-all duration-500 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-gray-100 text-gray-900 border-gray-300"
                  }`}
                >
                  Upload Picture
                  <input
                    type="file"
                    id="avatar"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Avatar Preview"
                    className="w-24 h-24 rounded-full"
                  />
                )}
                <button
                  type="submit"
                  className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
                    darkMode
                      ? "bg-purple-600 text-white hover:bg-purple-500"
                      : "bg-purple-500 text-white hover:bg-purple-600"
                  }`}
                >
                  Complete Signup
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default InfoPage;
