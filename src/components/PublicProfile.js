import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import PITPLOGO from "../assets/pitp.png";

const PublicProfile = () => {
  const { id } = useParams(); // Get studentId from the URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const profileRef = useRef();
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://pitp-graduatedirectory.vercel.app/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.msg || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const generatePDF = () => {
    setIsPrinting(true);
    setTimeout(() => {
      html2canvas(profileRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
        pdf.save("profile.pdf");
        setIsPrinting(false);
      });
    }, 500);
  };

  if (loading) {
    return <p className="text-center mt-5">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center text-danger mt-5">{error}</p>;
  }

  return (
    <div className="container mt-5" ref={profileRef}>
      <div className="text-center mb-4 p-3" style={{ backgroundColor: "#fffff" }}>
        <img src={PITPLOGO} width={1200} alt="Profile Logo" className="mb-3" />
      </div>
      <div className="card shadow-lg">
        <div className="card-header bg-dark text-white text-center">
          <h1 className="display-5">{profile.personalInfo.name}</h1>
          <p className="lead">{profile.educationInfo.qualification}</p>
          <h4 className="text-warning">
            {profile.employmentInfo.jobType} at {profile.employmentInfo.organization}
          </h4>
          <p className="h5 text-success">Earnings: {profile.employmentInfo.earnings}</p>
        </div>

        <div className="text-center my-4">
          {!isPrinting && (
            <div className="d-flex justify-content-center">
              <a href={profile.personalInfo.linkedIn} target="_blank" rel="noopener noreferrer" className="btn btn-primary me-3">LinkedIn Profile</a>
              <a href={`mailto:${profile.personalInfo.email}`} className="btn btn-secondary me-3">Contact via Email</a>
              <a href={`https://wa.me/${profile.personalInfo.contact}`} target="_blank" rel="noopener noreferrer" className="btn btn-success">Contact via WhatsApp</a>
            </div>
          )}
        </div>

        <div className="card-body">
          <div className="row mb-4">
            <h4 className="border-bottom pb-2">Personal Information</h4>
            <div className="col-md-6">
              <p><strong>Father Name:</strong> {profile.personalInfo.fatherName}</p>
              <p><strong>Address:</strong> {profile.personalInfo.address}</p>
              <p><strong>Contact:</strong> {profile.personalInfo.contact}</p>
              {isPrinting && (
                <>
                  <p><strong>LinkedIn:</strong> {profile.personalInfo.linkedIn}</p>
                  <p><strong>Email:</strong> {profile.personalInfo.email}</p>
                </>
              )}
            </div>
          </div>

          <div className="row mb-4">
            <h4 className="border-bottom pb-2">PITP Information</h4>
            <div className="col-md-6">
              <p><strong>Course:</strong> {profile.pitpInfo.course}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Batch:</strong> {profile.pitpInfo.batch}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Center:</strong> {profile.pitpInfo.center}</p>
            </div>
          </div>

          <div className="row mb-4">
            <h4 className="border-bottom pb-2">Education Information</h4>
            <div className="col-md-6">
              <p><strong>Grade:</strong> {profile.educationInfo.grade}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Passing Year:</strong> {profile.educationInfo.passingYear}</p>
            </div>
          </div>

          <div className="row">
            <h4 className="border-bottom pb-2">Employment Information</h4>
            <div className="col-md-6">
              <p><strong>Salary:</strong> {profile.employmentInfo.salary}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Appointment Date:</strong> {profile.employmentInfo.appointmentDate}</p>
            </div>
          </div>
        </div>

        <div className="card-footer text-center">
          <a href={window.location.href} className="text-muted">{window.location.href}</a>
        </div>
      </div>
      {!isPrinting && (
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={generatePDF}>Generate PDF</button>
        </div>
      )}
    </div>
  );
};

export default PublicProfile;
