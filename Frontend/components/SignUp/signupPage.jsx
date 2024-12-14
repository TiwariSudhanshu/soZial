import React, { useState } from "react";
import "./signupPage.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();

  let [formData, setFormData] = useState({
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
    if (mobileNo.length != 10) {
      toast.error("Please enter correct mobile No");
    }
    if (password == confirmpassword) {
      navigate("/register", { state: { email, mobileNo, password } });
    } else {
      toast.error("Password mismatch");
    }
  };

  return (
    <>
      <div className="signup-main-box">
        <div className="right">
          <form onSubmit={handleSubmit}>
            <div className="r1">
              <h2>SignUp</h2>
              <p>Join us today !</p>
            </div>
            <div className="r2">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  required
                  onChange={handleChange}
                  name="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="field">
                <label htmlFor="contact">Mobile no.</label>
                <input
                  type="text"
                  id="mobileNo"
                  value={formData.mobileNo}
                  required
                  onChange={handleChange}
                  name="mobileNo"
                  placeholder="Enter your mobile number"
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  required
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>
              <div className="field">
                <label htmlFor="password">Confirm Password</label>
                <input
                  type="password"
                  id="confirmpassword"
                  name="confirmpassword"
                  value={formData.confirmpassword}
                  required
                  onChange={handleChange}
                  placeholder="Enter your password again"
                />
              </div>
            </div>
            <div className="r3">
              <button id="sup-btn" type="submit">
                Sign Up
              </button>
              <p>
                Have an acoount ? <a href="/">Sign in</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
