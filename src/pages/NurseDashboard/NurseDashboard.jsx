import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NurseDashboard.css';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visitsSearchTerm, setVisitsSearchTerm] = useState('');
  const [appointmentsSearchTerm, setAppointmentsSearchTerm] = useState('');

  useEffect(() => {
    // Hardcoded all patients
    const allPatients = [
      { id: 1, first_name: 'Sarah', last_name: 'Johnson' },
      { id: 2, first_name: 'Michael', last_name: 'Chen' },
      { id: 3, first_name: 'Emma', last_name: 'Rodriguez' },
      { id: 4, first_name: 'David', last_name: 'Williams' },
      { id: 5, first_name: 'Sophia', last_name: 'Brown' },
      { id: 6, first_name: 'James', last_name: 'Smith' },
    ];
    setPatients(allPatients);

    // Hardcoded recent patients with "visitTime"
    const visits = [
      { id: 7, first_name: 'Ava', last_name: 'Taylor', visitTime: '2025-08-30T15:30:00' },
      { id: 8, first_name: 'Liam', last_name: 'Davis', visitTime: '2025-08-30T14:45:00' },
      { id: 9, first_name: 'Olivia', last_name: 'Martinez', visitTime: '2025-08-30T13:00:00' },
      { id: 10, first_name: 'Noah', last_name: 'Wilson', visitTime: '2025-08-30T12:15:00' },
    ];

    const sortedVisits = visits.sort(
      (a, b) => new Date(b.visitTime) - new Date(a.visitTime)
    );

    setRecentPatients(sortedVisits);

    // Hardcoded appointments
    const upcomingAppointments = [
      { id: 1, first_name: 'Sarah', last_name: 'Johnson', time: '9:00 AM', type: 'Follow-up' },
      { id: 2, first_name: 'Michael', last_name: 'Chen', time: '11:30 AM', type: 'Consultation' },
      { id: 3, first_name: 'Emma', last_name: 'Rodriguez', time: '2:15 PM', type: 'Physical Exam' },
    ];
    setAppointments(upcomingAppointments);
  }, []);

  const handleAddPatient = () => {
    navigate('/dashboard/patient-demographics');
  };

  const handleNewVisit = () => {
    navigate('/new-visit');
  };

  const handleNewAppointment = () => {
    navigate('/new-appointment');
  };

  const handleViewPatient = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVisits = recentPatients.filter(patient =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(visitsSearchTerm.toLowerCase())
  );

  const filteredAppointments = appointments.filter(appointment =>
    `${appointment.first_name} ${appointment.last_name}`.toLowerCase().includes(appointmentsSearchTerm.toLowerCase())
  );

  return (
    <div className="nurse-dashboard">
      <div className="dashboard-header">
        <h1>SSPD Dashboard</h1>
        <p>Welcome Back! Here's Today's Patient Overview.</p>
      </div>

      <div className="dashboard-content">
        {/* Column 1: Add patient + All Patients */}
        <div className="col">
          <div className="card">
            <div className="card-header-section">
              <h2>Patient Directory</h2>
              <button className="header-action-btn" onClick={handleAddPatient}>
                + Add New Patient
              </button>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search patients..."
                className="search-box"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="content-scrollable">
              <h3>All Patients ({patients.length})</h3>
              <ul>
                {filteredPatients.map((patient) => (
                  <li key={patient.id} className="patient-item">
                    <div className="patient-avatar">
                      {patient.first_name.charAt(0)}
                      {patient.last_name.charAt(0)}
                    </div>
                    <div className="patient-info">
                      <span className="patient-name">
                        {patient.first_name} {patient.last_name}
                      </span>
                      <span className="patient-id">ID: {patient.id}</span>
                    </div>
                    <div className="patient-actions">
                      <button 
                        className="view-btn"
                        onClick={() => handleViewPatient(patient.id)}
                      >
                        View
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Column 2: Recent patients (descending order) */}
        <div className="col">
          <div className="card">
            <div className="card-header-section">
              <h2>Recent Patient Encounters</h2>
              <button className="header-action-btn" onClick={handleNewVisit}>
                + New Visit
              </button>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search visits..."
                className="search-box"
                value={visitsSearchTerm}
                onChange={(e) => setVisitsSearchTerm(e.target.value)}
              />
            </div>

            <div className="content-scrollable">
              <h3>Recent Visits ({recentPatients.length})</h3>
              <ul>
                {filteredVisits.length > 0 ? (
                  filteredVisits.slice(0, 10).map((patient) => (
                    <li key={patient.id} className="recent-patient-item">
                      <div className="recent-patient-info">
                        <span className="patient-name">
                          {patient.first_name} {patient.last_name}
                        </span>
                        <span className="visit-time">
                          {new Date(patient.visitTime).toLocaleString()}
                        </span>
                      </div>
                      <div className="status-badge new">New</div>
                    </li>
                  ))
                ) : (
                  <li className="no-data">No recent visits found</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Column 3: Upcoming appointments */}
        <div className="col">
          <div className="card">
            <div className="card-header-section">
              <h2>Upcoming Appointments</h2>
              <button className="header-action-btn" onClick={handleNewAppointment}>
                + New Appointment
              </button>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search appointments..."
                className="search-box"
                value={appointmentsSearchTerm}
                onChange={(e) => setAppointmentsSearchTerm(e.target.value)}
              />
            </div>

            <div className="content-scrollable">
              <h3>Today's Schedule ({appointments.length})</h3>
              <ul>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <li key={appointment.id} className="appointment-item">
                      <div className="appointment-time">{appointment.time}</div>
                      <div className="appointment-info">
                        <span className="patient-name">
                          {appointment.first_name} {appointment.last_name}
                        </span>
                        <span className="appointment-type">{appointment.type}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="no-data">No appointments found</li>
                )}
              </ul>
              <button className="view-schedule-btn">View Full Schedule</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;