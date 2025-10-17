import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Dashboard.css';

export default function Dashboard() {
  const [patientData, setPatientData] = useState({});
  const [contactData, setContactData] = useState({});
  const [insuranceData, setInsuranceData] = useState({});

  const updatePreviewData = (newData, section) => {
    switch (section) {
      case 'patient':
        setPatientData(newData);
        break;
      case 'contact':
        setContactData(newData);
        break;
      case 'insurance':
        setInsuranceData(newData);
        break;
      default:
        console.warn(`Unknown section: ${section}`);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="main-content">
        <Outlet context={{ 
          patientData, 
          contactData, 
          insuranceData, 
          updatePreviewData 
        }} />
      </div>
    </div>
  );
}