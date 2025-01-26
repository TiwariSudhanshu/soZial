import React, { useState, useEffect, useRef } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../app/userSlice";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { serverLink } from "../../constants";

const SignupPage = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.user.darkMode);
  const toggleTheme = () => {
    dispatch(toggleDarkMode());
  };
  const navigate = useNavigate();

  const sendMail = async (email) => {
    try {
      const response = await fetch(`${serverLink}/api/v1/verify/sendOTP`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        toast.success("OTP sent on email");
      } else {
        toast.error("Failed in sending otp on email");
      }
    } catch (error) {
      console.log("Error :", error);
      toast.error("Error");
    }
  };

  const [formData, setFormData] = useState({
    email: "",
    mobileNo: "",
    password: "",
    confirmpassword: "",
  });

  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (isVerified) {
      navigate("/register", { state: { email, mobileNo, password } });
    }
  }, [isVerified]);
  const otpRefs = useRef([]);
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      // Allow only numbers
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        otpRefs.current[index + 1].focus();
      }
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const { email, mobileNo, password, confirmpassword } = formData;
    if (mobileNo.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (password === confirmpassword) {
      await sendMail(email);
      setModalOpen(true);
      setLoader(false);
    } else {
      toast.error("Passwords do not match");
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
            state: { email: formData.email, mobileNo: formData.mobileNo, password: formData.password }
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
              : "linear-gradient(to top, rgba(232, 224, 255, 0.8), rgba(238, 232, 255, 0.9))",
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
            {["email", "mobileNo", "password", "confirmpassword"].map(
              (field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className={`block mb-3 text-lg ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace("No", " Number")}
                  </label>
                  <input
                    type={
                      field === "password" || field === "confirmpassword"
                        ? "password"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
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
              )
            )}
          </div>
           <div className="flex justify-center items-center"> {loader?(<>
            <div className="loader"></div>
            </>):(<>
              <button
            type="submit"
            className={` bg-gradient-to-r from-indigo-400 to-indigo-600 w-full mt-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
              darkMode
                ? "bg-purple-600 text-white hover:bg-purple-500"
                : "bg-gray-400 text-gray-900 hover:bg-gray-500"
            }`}
          >
              Sign Up
          </button></>)}</div>
          

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
            <p className="text-lg">
              Already have an account?{" "}
              <a
                href="/login"
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

      {/* Modal */}
      {modalOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    onClick={() => setModalOpen(false)}
  >
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } p-6 sm:p-8 rounded-lg shadow-lg w-11/12 sm:w-1/3`}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl mb-4">Verify OTP</h2>

      {/* OTP Input */}
      <div className="flex space-x-2 mb-4 justify-center">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            type="number"
            maxLength="1"
            className="w-12 h-12 text-center text-xl text-black border border-gray-300 rounded-lg"
            value={otp[index]}
            onChange={(e) => handleOtpChange(e, index)}
            onFocus={(e) => e.target.select()}
            ref={(el) => otpRefs.current[index] = el}
          />
        ))}
      </div>

      {/* Verify Button */}
      <div className="flex justify-center items-center">{loader?(<>
      <div className="loader"></div>
      </>):(<>
        <button
        onClick={(e) => verifyOTP(e, otp)}
        className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg relative"
        disabled={loader}
      >Verify
        </button>
      </>)}</div>

      {/* Close Button */}
      <button
        onClick={() => setModalOpen(false)}
        className="mt-4 w-full py-2 bg-gray-500 text-white rounded-lg"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default SignupPage;
