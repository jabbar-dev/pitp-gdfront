import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import PITPLOGO from "../assets/pitp.png";

const Dashboard = () => {
  const [profile, setProfile] = useState({
    studentId: "",
    personalInfo: {
      name: "",
      fatherName: "",
      email: "",
      contact: "",
      address: "",
      linkedIn: "",
    },
    educationInfo: {
      qualification: "",
      grade: "",
      passingYear: "",
    },
    employmentInfo: {
      salary: "",
      organization: "",
      appointmentDate: "",
      jobType: "",
      earnings: "",
    },
    pitpInfo: {
      course: "",
      batch: "",
      center: "",
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const studentId = localStorage.getItem("studentId");
      const token = localStorage.getItem("token");
    
      if (!studentId || !token) {
        setError("Missing credentials. Please login again.");
        return;
      }
    
      setLoading(true);
      setError(null);
    
      try {
        const res = await axios.get(`https://pitp-graduatedirectory.vercel.app/api/profile/${studentId}`, {
          headers: { "x-auth-token": token },
        });
    
        const fetchedProfile = res.data || {};
    
        setProfile({
          studentId: fetchedProfile.studentId || "",
          personalInfo: fetchedProfile.personalInfo || profile.personalInfo,
          educationInfo: fetchedProfile.educationInfo || profile.educationInfo,
          employmentInfo: fetchedProfile.employmentInfo || profile.employmentInfo,
          pitpInfo: fetchedProfile.pitpInfo || {
            course: "",
            batch: "",
            center: "",
          },
        });
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };
    

    fetchProfile();
  }, []);

  const handleChange = (section, field, value) => {
    setProfile((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value || "" },
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        studentId: profile.studentId,
        personalInfo: profile.personalInfo,
        educationInfo: profile.educationInfo,
        employmentInfo: profile.employmentInfo,
        pitpInfo: profile.pitpInfo
      };
  
      await axios.post("https://pitp-graduatedirectory.vercel.app/api/profile", payload, {
        headers: { "x-auth-token": token },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");
    navigate("/login");
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <img src={PITPLOGO} alt="PITP Logo" style={{ width: "700px" }} className="mb-3" />
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-danger"><FaSignOutAlt /> Logout</button>
      </div>
      <h3 className="text-center mb-4">Welcome, {profile.personalInfo.name}</h3>
      <div className="card p-5 shadow-lg">
        <h4 className="mb-4 fw-bold border-bottom pb-2">Student Information</h4>
        <label className="fw-bold">Student ID</label>
        <input type="text" value={profile.studentId} readOnly className="form-control mb-3" />
        <label className="fw-bold">Email</label>
        <input type="email" value={profile.personalInfo.email} readOnly className="form-control mb-3" />
        
        <h4 className="mb-4 fw-bold border-bottom pb-2">Personal Information</h4>
        {Object.entries(profile.personalInfo).map(([key, value]) => (
          <div key={key}>
            <label className="text-capitalize fw-bold">{key.replace(/([A-Z])/g, ' $1')}</label>
            <input type="text" value={value} onChange={(e) => handleChange("personalInfo", key, e.target.value)} className="form-control mb-3" />
          </div>
        ))}

        <h4 className="mb-4 fw-bold border-bottom pb-2">Education Information</h4>
        {Object.entries(profile.educationInfo).map(([key, value]) => (
          <div key={key}>
            <label className="text-capitalize fw-bold">{key.replace(/([A-Z])/g, ' $1')}</label>
            <input type="text" value={value} onChange={(e) => handleChange("educationInfo", key, e.target.value)} className="form-control mb-3" />
          </div>
        ))}

        <h4 className="mb-4 fw-bold border-bottom pb-2">Employment Information</h4>
        {Object.entries(profile.employmentInfo).map(([key, value]) => (
          <div key={key}>
            <label className="text-capitalize fw-bold">{key.replace(/([A-Z])/g, ' $1')}</label>
            <input type="text" value={value} onChange={(e) => handleChange("employmentInfo", key, e.target.value)} className="form-control mb-3" />
          </div>
        ))}

        <h4 className="mb-4 fw-bold border-bottom pb-2">PITP Information</h4>
        {Object.entries(profile.pitpInfo).map(([key, value]) => (
          <div key={key}>
            <label className="text-capitalize fw-bold">{key.replace(/([A-Z])/g, ' $1')}</label>
            <input type="text" value={value} onChange={(e) => handleChange("pitpInfo", key, e.target.value)} className="form-control mb-3" />
          </div>
        ))}

        <button onClick={handleSave} className="btn btn-success mt-4 w-100">Save</button>
      </div>
    </div>
  );
};


export default Dashboard;
