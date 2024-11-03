import React, { useState } from "react";
import "./loginPage.css";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom';

function LoginPage() {

  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoader(true);
    try {
      const response = await fetch('/api/v1/user/login',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
          credentials: 'include'
        }
      )

      const data = await response.json();
      if(response.ok){
        toast.success("Logged in Successfully")
          localStorage.setItem('user', JSON.stringify(data))
          navigate("/");
      }else{
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error("Unexpected error from server")
      console.log("Error",error)
    } finally{
      setLoader(false)
    }
  }

  return (
    <>
        <div className="main-box">
      {loader ? (
        <div className="loader"></div> // Corrected line
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
              <button id="loginButton" type="submit">Login</button>
              <p>
                New User? <a href="/register">Sign Up</a>
              </p>
            </div>
          </form>
      )}
      </div>
    </>
  );
  
}

export default LoginPage;
