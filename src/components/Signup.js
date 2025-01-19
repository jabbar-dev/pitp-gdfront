import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PITPLOGO from "../assets/pitp.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://pitp-graduatedirectory.vercel.app/api/auth/signup", formData);
      localStorage.setItem("studentId", formData.studentId);
      if (res.data.authCode) {
        localStorage.setItem("authCode", res.data.authCode);
      }
      navigate(`/login`);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Signup failed");
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
            <h2 className="fw-bold">Signup for PITP GRADUATE DIRECTORY</h2>
            <p className="text-muted">Please enter your details to register</p>
          </div>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Student ID</label>
              <input
                type="text"
                name="studentId"
                className="form-control"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
            </div>
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
            <button type="submit" className="btn btn-primary w-100">Signup</button>
          </form>
          <div className="text-center mt-3">
            <p className="mb-0">Already have an account? <a href="/login" className="text-decoration-none fw-bold">Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
