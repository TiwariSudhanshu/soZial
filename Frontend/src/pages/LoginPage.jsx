import React, { useState, useEffect } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/login.api.js";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, toggleDarkMode } from "../../app/userSlice.js";
import { serverLink } from "../../constants";


const LoginPage = () => {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.user.darkMode);
  const toggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const data = await loginUser(formData.email, formData.password);
      // toast.success("Logged in Successfully");
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      dispatch(setPosts(data.data.loggedInUser.posts));
      navigate("/");
    } catch (error) {
      toast.error("No user found with these credentials");
      toast.error("Please recheack email or password");
      console.log("Error", error);
    } finally {
      setLoader(false);
    }
  };

  const verifyOTP = async (e, userOTP) => {
    e.preventDefault();
    setLoader(true);
    try {
      setLoader(true);
      const response = await fetch(`${serverLink}/api/v1/verify/verifyOTP`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userOTP: userOTP.join(""),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.data) {
          toast.success("Email Verified");
          setIsVerified(true);
          navigate("/register", {
            state: {
              email: formData.email,
              mobileNo: formData.mobileNo,
              password: formData.password,
            },
          });
        } else {
          toast.error("Incorrect OTP");
        }
      } else {
        toast.error("Failed in verification of otp ");
      }
    } catch (error) {
      console.log("Error :", error);
      toast.error("Error");
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
          <div className="flex items-center justify-center">
            {loader ? (
              <>
                <div className="loader"></div>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className={
                    "w-full bg-gradient-to-r from-indigo-400 to-indigo-600 py-3 text-lg font-semibold rounded-lg transition-all duration-300 "
                  }
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </form>
        <div className="flex items-center my-6">
          <hr className="w-full border-gray-300" />
          <span
            className={`px-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            OR
          </span>
          <hr className="w-full border-gray-300" />
        </div>
        <div className="flex flex-col items-center space-y-4">
          <a
            href="/forgot"
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
    </div>
  );
};

export default LoginPage;
