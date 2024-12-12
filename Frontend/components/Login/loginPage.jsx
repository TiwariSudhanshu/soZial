import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./loginPage.css";
import { loginUser } from "../api/login.api.jsx";

function LoginPage() {
  // State variables
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle functions
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
        navigate("/");
    } catch (error) {
      toast.error("Unexpected error from server");
      console.log("Error", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="main-box">
        {loader ? (
          <div className="loader"></div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="x1">
              <h2>Login</h2>
              <p>Welcome back! Please login to your account</p>
            </div>
            <div className="x2">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={formData.password}
                />
              </div>
            </div>
            <div className="x3">
              <button id="loginButton" type="submit">
                Login
              </button>
              <p>
                New User? <a href="/signup">Sign Up</a>
              </p>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default LoginPage;
