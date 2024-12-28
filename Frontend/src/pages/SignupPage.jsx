import React, { useState, useEffect } from "react";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('theme')) || false);
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    localStorage.setItem("theme", darkMode);
  }, [darkMode]);
  
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
      className={`flex items-center justify-center h-screen overflow-hidden ${
        darkMode
          ? "bg-gradient-to-r from-[#1f2937] via-gray-800 to-indigo-900"
          : "bg-gradient-to-r from-purple-100 via-indigo-200 to-purple-300"
      }`}
    >
      <form onSubmit={handleSubmit}>
        <div
          className={`${
            darkMode
              ? "bg-gray-800 text-white shadow-lg"
              : "bg-white text-gray-900 shadow-2xl"
          } px-12 mt-10 relative py-12 rounded-3xl w-full max-w-3xl transition-all duration-500 max-h-screen overflow-y-auto`}
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
              className="text-xl p-2 absolute top-2 rounded-full focus:outline-none hover:bg-gray-700"
            >
              <DarkModeIcon />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-extrabold text-center mb-8">
            {darkMode ? "Create an Account" : "Sign Up to Join"}
          </h2>

          {/* Signup Form */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className={`block mb-3 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              required
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-lg border text-lg ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                  : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-gray-400"
              } focus:outline-none focus:ring-2`}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="mobileNo"
              className={`block mb-3 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNo"
              name="mobileNo"
              placeholder="Enter your phone number"
              value={formData.mobileNo}
              required
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-lg border text-lg ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                  : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-gray-400"
              } focus:outline-none focus:ring-2`}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className={`block mb-3 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              required
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-lg border text-lg ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                  : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-gray-400"
              } focus:outline-none focus:ring-2`}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmpassword"
              className={`block mb-3 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              placeholder="Confirm your password"
              value={formData.confirmpassword}
              required
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-lg border text-lg ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                  : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-gray-400"
              } focus:outline-none focus:ring-2`}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
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
                  darkMode ? "text-purple-500 hover:text-purple-400" : "text-gray-600 hover:text-gray-500"
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
