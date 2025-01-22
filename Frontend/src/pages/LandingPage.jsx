import React from "react";
import { useSelector, useDispatch } from "react-redux";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { toggleDarkMode } from "../../app/userSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const darkMode = useSelector((state) => state.user.darkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-indigo-50 text-gray-800"
      } min-h-screen flex flex-col transition-all duration-500`}
    >
      {/* Topbar */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800"
            : "bg-gradient-to-r from-indigo-100 to-indigo-300"
        } w-full px-6 py-6 flex justify-between items-center shadow-lg transition-all duration-300 relative`}
      >
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 cursor-pointer">
          soZial
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-black"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <DarkModeIcon />
          </motion.button>
        </div>
      </div>

      {/* Main Section with Parallax Effect */}
      <div className="flex flex-1 justify-center items-center bg-fixed bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <motion.div
          className={`${
            darkMode
              ? "bg-gray-800"
              : "bg-gradient-to-r from-indigo-200 to-indigo-400"
          } z-10 w-full sm:w-2/3 md:w-1/2 p-8 rounded-3xl shadow-xl transform transition-all duration-500`}
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <h1
            className={`${
              darkMode ? "text-white" : " bg-clip-text text-black"
            } text-7xl font-extrabold mb-6`}
            // style={{ fontFamily: "cursive", textShadow: "2px 2px 10px rgba(0, 0, 0, 0.7)" }}
          >
            soZial
          </h1>
          <p
            className={`${
              darkMode ? "text-gray-300" : "text-black-600"
            } text-lg sm:text-xl mb-4 leading-relaxed tracking-wider font-medium transition-all duration-100`}
          >
            Welcome to soZial, where thoughts, photos, and ideas come to life in
            a vibrant community. Share your journey and connect with others!
          </p>
          <p
            className={`${
              darkMode ? "text-gray-400" : "text-gray-500"
            } text-lg mb-8 italic font-light transition-all duration-300`}
          >
            Discover, engage, and grow your network with people who share your
            passions. Ready to start your adventure? Join now!
          </p>

          <div className="flex space-x-6 justify-center">
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Sign In
            </motion.button>
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate("/signup");
              }}
            >
              Join Now
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Creative Bottom Section */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800"
            : "bg-gradient-to-r from-indigo-100 to-indigo-300"
        } py-4 text-center text-gray-400`}
      >
        {" "}
      </div>
    </div>
  );
}

export default LandingPage;
