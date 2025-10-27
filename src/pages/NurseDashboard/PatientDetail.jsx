import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PatientDetail.css';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const allPatients = [
      { id: 1, first_name: 'Sarah', last_name: 'Johnson', phone: '+1 344-716-6844', dob: '02/10/1990', gender: 'Female', location: 'USA' },
      { id: 2, first_name: 'Michael', last_name: 'Chen', phone: '+1 555-123-4567', dob: '15/07/1985', gender: 'Male', location: 'USA' },
      { id: 3, first_name: 'Emma', last_name: 'Rodriguez', phone: '+1 555-987-6543', dob: '22/03/1992', gender: 'Female', location: 'USA' },
      { id: 4, first_name: 'David', last_name: 'Williams', phone: '+1 555-456-7890', dob: '08/11/1978', gender: 'Male', location: 'USA' },
      { id: 5, first_name: 'Sophia', last_name: 'Brown', phone: '+1 555-321-0987', dob: '14/05/1995', gender: 'Female', location: 'USA' },
      { id: 6, first_name: 'James', last_name: 'Smith', phone: '+1 555-654-3210', dob: '30/09/1982', gender: 'Male', location: 'USA' }
    ];

    const foundPatient = allPatients.find(p => p.id === parseInt(id));
    if (foundPatient) {
      foundPatient.allergies = [
        { allergen: 'Pollen', reaction: 'Sneezing, Itchy Eyes', severity: 'Mild', status: 'Active', category: 'Environmental', code: 'ALG123' },
        { allergen: 'Penicillin', reaction: 'Rash, Itching', severity: 'Moderate', status: 'Resolved', category: 'Medication', code: 'ALG456' }
      ];
    }
    setPatient(foundPatient);
  }, [id]);

  const handleNewVisit = () => navigate('/new-visit');
  
  const handleNewAppointment = () => {
    // Calculate age from DOB
    const calculateAge = (dob) => {
      const birthDate = new Date(dob.split('/').reverse().join('-'));
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    // Extract phone number (remove country code and formatting)
    const extractPhoneNumber = (phone) => {
      return phone.replace(/[^\d]/g, '').slice(-10);
    };

    // Navigate with patient data
    navigate('/new-appointment', {
      state: {
        patientData: {
          firstName: patient.first_name,
          middleName: '',
          lastName: patient.last_name,
          age: calculateAge(patient.dob),
          contactInfo: extractPhoneNumber(patient.phone)
        }
      }
    });
  };
  
  const handleGoToMessages = () => {}; // No functionality for now
  const handleEdit = () => navigate(`/patient/${id}/edit`);
  const handleBackToDashboard = () => navigate('/dashboard');

  if (!patient) return <div className="pd-notfound">Patient not found</div>;

  return (
    <div className="pd-container">
      {/* Back to Dashboard Button */}
      <div className="pd-back-button-container">
        <button className="pd-back-button" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Header Card */}
      <div className="pd-header-card">
        <div className="pd-header-left">
          <div className="pd-avatar-circle">
            <span className="pd-avatar-letter">{patient.first_name.charAt(0)}</span>
          </div>

          <div className="pd-header-info">
            <h1 className="pd-header-name">{patient.first_name} {patient.last_name}</h1>

            <div className="pd-header-details">
              <div><span className="pd-label-inline">Phone no:</span> <span className="pd-value-inline">{patient.phone}</span></div>
              <div><span className="pd-label-inline">DOB:</span> <span className="pd-value-inline">{patient.dob}</span></div>
              <div><span className="pd-label-inline">Gender:</span> <span className="pd-value-inline">{patient.gender}</span></div>
              <div><span className="pd-label-inline">Location:</span> <span className="pd-value-inline">{patient.location}</span></div>
            </div>

            <div>
              <button className="pd-edit-link" onClick={handleEdit}>Edit</button>
            </div>
          </div>
        </div>

        <div className="pd-header-actions">
          <button className="pd-pill" onClick={handleNewVisit}>New Visit</button>
          <button className="pd-pill" onClick={handleNewAppointment}>New Appointment</button>
          <button className="pd-pill" onClick={handleGoToMessages}>Go To Messages</button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="pd-overview-card">
        <h2>Patient Overview</h2>

        {patient.allergies && patient.allergies.map((allergy, idx) => (
          <div key={idx} className="pd-allergy-section">
            <h3 className="pd-allergy-title">Allergies {idx + 1}</h3>
            <ul className="pd-allergy-list">
              <li><strong>Allergen:</strong> {allergy.allergen}</li>
              <li><strong>Reaction:</strong> {allergy.reaction}</li>
              <li><strong>Severity:</strong> {allergy.severity}</li>
              <li><strong>Status:</strong> {allergy.status}</li>
              <li><strong>Allergy Category:</strong> {allergy.category}</li>
              <li><strong>Allergy Code:</strong> {allergy.code}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDetail;