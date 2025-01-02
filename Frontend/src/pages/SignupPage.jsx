import React, { useState, useEffect } from "react";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../app/userSlice";

const SignupPage = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.user.darkMode);
  const toggleTheme = ()=>{
     dispatch(toggleDarkMode())
    }
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    mobileNo: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, mobileNo, password, confirmpassword } = formData;
    if (mobileNo.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (password === confirmpassword) {
      navigate("/register", { state: { email, mobileNo, password } });
    } else {
      toast.error("Passwords do not match");
    }
  };

  return (
    <div
      className={`flex items-center justify-center   ${
        darkMode
          ? "bg-gradient-to-r from-[#1f2937] via-gray-800 to-indigo-900"
          : "bg-gradient-to-r from-purple-100 via-indigo-200 to-purple-300"
      }`}
    >
      <form onSubmit={handleSubmit} className="w-full flex justify-center">
        <div
          className={`${
            darkMode
              ? "bg-gray-800 text-white shadow-lg"
              : "bg-white text-gray-900 shadow-2xl"
          } px-12 py-8 mt-5 mb-5 rounded-3xl w-full max-w-2xl lg:max-w-screen-sm xl:max-w-screen-md transition-all duration-500`}
          style={{
            backgroundImage: darkMode
              ? "linear-gradient(to bottom, rgba(34, 34, 34, 0.9), rgba(0, 0, 0, 0.9))"
              : "linear-gradient(to top, rgba(211, 211, 211, 0.8), rgba(211, 211, 211, 0.9))",
          }}
        >
          {/* Theme Toggle Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleTheme}
              className="text-xl p-2 rounded-full focus:outline-none hover:bg-gray-700"
            >
              <DarkModeIcon />
            </button>
          </div>
  
          {/* Title */}
          <h2 className="text-3xl lg:text-4xl font-extrabold text-center mb-8">
            {darkMode ? "Create an Account" : "Sign Up to Join"}
          </h2>
  
          {/* Signup Form */}
          <div className="space-y-6">
            {["email", "mobileNo", "password", "confirmpassword"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className={`block mb-3 text-lg ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1).replace("No", " Number")}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  placeholder={`Enter your ${field}`}
                  value={formData[field]}
                  required
                  onChange={handleChange}
                  className={`w-full px-5 py-3 rounded-lg border text-lg ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                      : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-gray-400"
                  } focus:outline-none focus:ring-2`}
                />
              </div>
            ))}
          </div>
  
          <button
            type="submit"
            className={`w-full mt-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
              darkMode
                ? "bg-purple-600 text-white hover:bg-purple-500"
                : "bg-gray-400 text-gray-900 hover:bg-gray-500"
            }`}
          >
            Sign Up
          </button>
  
          <div className="flex items-center my-6">
            <hr className="w-full border-gray-300" />
            <span className={`px-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>OR</span>
            <hr className="w-full border-gray-300" />
          </div>
  
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg">
              Already have an account?{" "}
              <a
                href="/"
                className={`font-semibold ${
                  darkMode
                    ? "text-purple-500 hover:text-purple-400"
                    : "text-gray-600 hover:text-gray-500"
                }`}
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
  
};

export default SignupPage;
