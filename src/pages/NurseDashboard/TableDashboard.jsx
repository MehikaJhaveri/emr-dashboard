import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TableDashboard.css";

const TableDashboard = () => {
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const patients = [
    { name: "Amelia Adams", dob: "01/01/1990", sex: "Female", status: "Active", appointmentTime: "9:00 AM", appointmentDate: "20-10-2025", doctor: "Dr. Smith" },
    { name: "Ava Armstrong", dob: "02/01/1990", sex: "Female", status: "Active", appointmentTime: "10:30 AM", appointmentDate: "20-10-2025", doctor: "Dr. Johnson" },
    { name: "Bella Brooks", dob: "03/01/1990", sex: "Female", status: "Active", appointmentTime: "11:00 AM", appointmentDate: "21-10-2025", doctor: "Dr. Smith" },
    { name: "Chloe Carter", dob: "04/01/1990", sex: "Male", status: "Active", appointmentTime: "1:30 PM", appointmentDate: "21-10-2025", doctor: "Dr. Williams" },
    { name: "Daniel Davis", dob: "05/01/1990", sex: "Male", status: "Active", appointmentTime: "2:00 PM", appointmentDate: "22-10-2025", doctor: "Dr. Johnson" },
    { name: "Emily Edwards", dob: "06/01/1990", sex: "Female", status: "Active", appointmentTime: "3:15 PM", appointmentDate: "22-10-2025", doctor: "Dr. Smith" },
    { name: "Gavin Green", dob: "07/01/1990", sex: "Male", status: "Active", appointmentTime: "4:00 PM", appointmentDate: "23-10-2025", doctor: "Dr. Williams" },
    { name: "Leo Lawson", dob: "08/01/1990", sex: "Male", status: "Active", appointmentTime: "9:30 AM", appointmentDate: "23-10-2025", doctor: "Dr. Johnson" },
    { name: "Zoey Zephyr", dob: "09/01/1990", sex: "Male", status: "Active", appointmentTime: "11:30 AM", appointmentDate: "24-10-2025", doctor: "Dr. Smith" },
  ];

  const filteredPatients = patients.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesDoctor = p.doctor.toLowerCase().includes(doctorFilter.toLowerCase());
    const matchesDate = dateFilter === "" || p.appointmentDate === dateFilter;
    
    return matchesName && matchesDoctor && matchesDate;
  });

  const handleBackToDashboard = () => {
    navigate('/nurse-dashboard');
  };

  return (
    <div className="pdb-container">
      {/* Header with Back Button */}
      <div className="pdb-header-bar">
        <button className="pdb-back-btn" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </button>
        <h2 className="pdb-title">Patient Appointment Schedule</h2>
      </div>

      {/* Filter Section */}
      <div className="pdb-filter-section">
        <div className="pdb-filter-group">
          <label>Patient Name:</label>
          <input
            type="text"
            className="pdb-filter-input"
            placeholder="Search by patient name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        
        <div className="pdb-filter-group">
          <label>Doctor Name:</label>
          <input
            type="text"
            className="pdb-filter-input"
            placeholder="Search by doctor name"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          />
        </div>
        
        <div className="pdb-filter-group">
          <label>Appointment Date:</label>
          <input
            type="date"
            className="pdb-filter-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        
        <button 
          className="pdb-clear-btn"
          onClick={() => {
            setNameFilter("");
            setDoctorFilter("");
            setDateFilter("");
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Results Count */}
      <div className="pdb-results-count">
        Showing {filteredPatients.length} of {patients.length} appointments
      </div>

      {/* Table */}
      <div className="pdb-table-wrapper">
        <table className="pdb-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>DOB</th>
              <th>SEX</th>
              <th>APPOINTMENT DATE</th>
              <th>APPOINTMENT TIME</th>
              <th>DOCTOR</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.name}</td>
                  <td>{p.dob}</td>
                  <td>{p.sex}</td>
                  <td>{p.appointmentDate}</td>
                  <td>{p.appointmentTime}</td>
                  <td>{p.doctor}</td>
                  <td>{p.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="pdb-no-results">
                  No appointments found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableDashboard;