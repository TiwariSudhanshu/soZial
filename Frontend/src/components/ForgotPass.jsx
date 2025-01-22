import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../index.css";

function ForgotPass() {
  const darkMode = useSelector((state) => state.user.darkMode);
  const [modalOpen, setModalOpen] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isVerified, setIsVerified] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [newPassData, setNewPassData] = useState({
    newPass: "",
    confirmPass: "",
  });
  const otpRefs = useRef([]);

  const [email, setEmail] = useState("");
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < otp.length - 1) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setNewPassData({ ...newPassData, [id]: value });
  };

  //   APIs
  const forgotPassword = async (email, newPass, confirmPass) => {
    setLoader(true);
    try {
      const response = await fetch("api/v1/verify/forgotPass", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPass,
          confirmPass,
        }),
      });
      if (response.ok) {
        toast.success("Password changed");
        navigate("/");
      } else {
        toast.error("Error in changing password");
      }
    } catch (error) {
      console.log("Error in changing password", error);
      toast.error("Error");
    } finally {
      setLoader(false);
    }
  };

  const sendMail = async (email) => {
    setLoader(true);
    try {
      const response = await fetch("/api/v1/verify/sendOTP", {
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
    } finally {
      setLoader(false);
    }
  };

  const verifyOTP = async (e, userOTP) => {
    e.preventDefault();
    setLoader(true);
    try {
      setLoader(true);
      const response = await fetch("/api/v1/verify/verifyOTP", {
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
          setModalOpen(false);
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
      className={`flex flex-col items-center justify-center h-screen ${
        darkMode
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700"
          : "bg-gradient-to-r from-purple-100 via-indigo-200 to-purple-300"
      }`}
    >
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } p-8 rounded-lg shadow-lg w-full max-w-md`}
      >
        {isVerified ? (
          <>
            <h2 className="text-2xl mb-6 font-bold text-center">
              Change Password
            </h2>
            <div className="mb-4">
              <label
                htmlFor="newPass"
                className={`block mb-2 ${
                  darkMode ? "text-gray-400" : "text-gray-700"
                }`}
              >
                New Password
              </label>
              <input
                type="password"
                id="newPass"
                value={newPassData.newPass}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 rounded-lg border text-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                }`}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPass"
                className={`block mb-2 ${
                  darkMode ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPass"
                value={newPassData.confirmPass}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 rounded-lg border text-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                }`}
              />
            </div>
            <div className="flex justify-center items-center">
              {loader ? (
                <>
                  <div className="loader"></div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      forgotPassword(
                        email,
                        newPassData.newPass,
                        newPassData.confirmPass
                      );
                    }}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all duration-300"
                  >
                    Change Password
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl mb-6 font-bold text-center">
              Forgot Password
            </h2>
            <div className="mb-4">
              <label
                htmlFor="email"
                className={`block mb-2 ${
                  darkMode ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                className={`w-full px-4 py-2 rounded-lg border text-lg ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                }`}
              />
            </div>
            <div className="flex justify-center items-center">
              {" "}
              {loader ? (
                <>
                  <div className="loader"></div>
                </>
              ) : (
                <>
                  <button
                    className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all duration-300"
                    onClick={async () => {
                      await sendMail(email);
                      setModalOpen(true);
                    }}
                  >
                    Send OTP
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setModalOpen(false)}
        >
          <div
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            } p-8 rounded-lg shadow-lg w-11/12 sm:w-1/3`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl mb-4">Verify OTP</h2>
            <div className="flex space-x-2 mb-4 justify-center">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="number"
                  maxLength="1"
                  className="w-12 h-12 text-center text-xl text-black border border-gray-300 rounded-lg"
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(e, index)}
                  ref={(el) => (otpRefs.current[index] = el)}
                />
              ))}
            </div>
            <div className="flex items-center justify-center">
              {loader ? (
                <>
                  <div className="loader"></div>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => verifyOTP(e, otp)}
                    className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg relative"
                  >
                    Verify
                  </button>
                </>
              )}
            </div>
            <button
              className="mt-4 w-full py-2 bg-gray-500 text-white rounded-lg"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPass;
