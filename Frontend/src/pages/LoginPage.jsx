import React, { useState, useEffect } from "react";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/login.api.js";
import { useDispatch } from "react-redux";
import { setPosts } from "../../app/userSlice.js";


const LoginPage = () => {
  
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('theme')) || false);
    const toggleTheme = () => {
      setDarkMode(!darkMode);
    };
    useEffect(() => {
      localStorage.setItem("theme", darkMode);
    }, [darkMode]);
    

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const data = await loginUser(formData.email, formData.password);
      toast.success("Logged in Successfully");
      localStorage.setItem("user", JSON.stringify(data));
      dispatch(setPosts(data.data.loggedInUser.posts))
      navigate("/profile");
    } catch (error) {
      toast.error("Unexpected error from server");
      console.log("Error", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center h-screen ${
        darkMode
          ? "bg-gradient-to-r from-[#1f2937] via-gray-800 to-indigo-900"
          : "bg-gradient-to-r from-purple-100 via-indigo-200 to-purple-300"
      }`}
    >
      {loader ? (
        <div className="loader"></div>
      ) : (
        <div
          className={`${
            darkMode
              ? "bg-gray-800 text-white shadow-lg"
              : "bg-white text-gray-900 shadow-2xl"
          } px-10 py-12 rounded-3xl w-full max-w-md transition-all duration-500`}
          style={{
            backgroundImage: darkMode
              ? "linear-gradient(to bottom, rgba(34, 34, 34, 0.9), rgba(0, 0, 0, 0.9))"
              : "linear-gradient(to top, rgba(232, 224, 255, 0.8), rgba(238, 232, 255, 0.9))",
          }}
        >
           <div className="flex relative justify-end mb-6">
            <button
              onClick={toggleTheme}
              className="text-xl p-2 absolute top-[-40px] right-3 rounded-full focus:outline-none hover:bg-gray-700"
            >
              <DarkModeIcon />
            </button>
          </div>

          <h2 className="text-4xl font-extrabold text-center mb-8">
            {darkMode ? "Welcome Back!" : "Log In to Continue"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className={`block mb-3 text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-5 py-3 rounded-lg border text-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                    : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-purple-500"
                } focus:outline-none focus:ring-2`}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className={`block mb-3 text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-5 py-3 rounded-lg border text-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                    : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-purple-500"
                } focus:outline-none focus:ring-2`}
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
                darkMode
                  ? "bg-purple-600 text-white hover:bg-purple-500"
                  : "bg-purple-500 text-white hover:bg-purple-600"
              }`}
            >
              Log In
            </button>
          </form>
          <div className="flex items-center my-6">
            <hr className="w-full border-gray-300" />
            <span
              className={`px-4 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              OR
            </span>
            <hr className="w-full border-gray-300" />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <a
              href="/forgot-password"
              className={`text-lg ${
                darkMode
                  ? "text-purple-500 hover:text-purple-400"
                  : "text-purple-600 hover:text-purple-500"
              }`}
            >
              Forgot Password?
            </a>
            <p className="text-lg">
              Don't have an account?{" "}
              <a
                href="/signup"
                className={`font-semibold ${
                  darkMode
                    ? "text-purple-500 hover:text-purple-400"
                    : "text-purple-600 hover:text-purple-500"
                }`}
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};


export default LoginPage;
