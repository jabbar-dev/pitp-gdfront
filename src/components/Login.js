import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PITPLOGO from "../assets/pitp.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://pitp-graduatedirectory.vercel.app/api/auth/login", formData);
      console.log("Server response:", res.data); // Debugging response
  
      // Updated condition to check for authCode instead of token
      if (res.data.authCode && res.data.studentId) {
        localStorage.setItem("token", res.data.authCode);  // Store with correct key
        localStorage.setItem("studentId", res.data.studentId);
        navigate("/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
    }
  };
  

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <img 
        src={PITPLOGO} 
        alt="PITP Logo" 
        style={{ width: "90%", maxWidth: "800px", marginBottom: "20px" }} 
        className="mb-3" 
      />
      <div className="container d-flex justify-content-center align-items-center">
        <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "700px" }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Login to PITP GRADUATE DIRECTORY</h2>
            <p className="text-muted">Please enter your credentials</p>
          </div>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <div className="text-center mt-3">
            <p className="mb-0">Not Registered? <a href="/signup" className="text-decoration-none fw-bold">Create An Account</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
