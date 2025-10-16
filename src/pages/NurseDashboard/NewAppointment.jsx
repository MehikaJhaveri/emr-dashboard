import React, { useState, useEffect } from 'react';
import './NewAppointment.css';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import logo from "../../assets/logo.jpg";

axios.defaults.baseURL = 'http://localhost:5000';

const NewAppointment = () => {
  const navigate = useNavigate();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    age: '',
    contactInfo: '',
    date: '',
    time: '',
    appointmentType: 'Follow-up',
    reason: 'Regular',
    urgencyDropdown: 'No',
    doctor: 'Dr. Ram Shah',
    comments: ''
  });

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients');
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Fallback to default patient list if API fails
      setPatients([
        { id: 1, first_name: 'Sarah', last_name: 'Johnson' },
        { id: 2, first_name: 'Michael', last_name: 'Chen' },
        { id: 3, first_name: 'Emma', last_name: 'Rodriguez' },
        { id: 4, first_name: 'David', last_name: 'Williams' },
        { id: 5, first_name: 'Sophia', last_name: 'Brown' },
        { id: 6, first_name: 'James', last_name: 'Smith' },
      ]);
    }
  };

  const handleDone = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.age || 
        !formData.contactInfo || !formData.date || !formData.time) {
      alert('Please fill in all required fields: First Name, Last Name, Age, Contact Information, Date, and Time');
      return;
    }

    // Validate contact info format (7-10 digits)
    if (!/^\d{7,10}$/.test(formData.contactInfo)) {
      alert('Contact information must be 7-10 digits');
      return;
    }

    // Validate age
    if (formData.age <= 0) {
      alert('Please enter a valid age');
      return;
    }

    setLoading(true);

    try {
      const appointmentData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        age: formData.age,
        contactInfo: formData.contactInfo,
        date: formData.date,
        time: formData.time,
        appointmentType: formData.appointmentType,
        reason: formData.reason,
        urgencyDropdown: formData.urgencyDropdown,
        doctor: formData.doctor,
        comments: formData.comments
      };

      const response = await axios.post('/api/appointments', appointmentData);

      if (response.data.success) {
        alert('Appointment created successfully!');
        console.log('Appointment created with ID:', response.data.appointmentId);
        
        // Reset form
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          age: '',
          contactInfo: '',
          date: '',
          time: '',
          appointmentType: 'Follow-up',
          reason: 'Regular',
          urgencyDropdown: 'No',
          doctor: 'Dr. Ram Shah',
          comments: ''
        });
        setSelectedPatient(null);
        
        // Navigate to table dashboard
        navigate("/table-dashboard");
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert(error.response?.data?.message || 'Error creating appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = () => {
    navigate('/dashboard/patient-demographics');
  };

  const filteredPatients = patients.filter(patient => {
    const name = patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    
    // Handle different patient data structures
    const firstName = patient.first_name || patient.full_name?.split(' ')[0] || '';
    const lastName = patient.last_name || patient.full_name?.split(' ').slice(-1)[0] || '';
    const middleName = patient.middle_name || '';
    
    setFormData({
      ...formData,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      age: patient.age || '',
      contactInfo: patient.contact_number || patient.phone || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="medapp-container">
      {/* Header */}
      <div className="medapp-header">
        <h2 className="medapp-title">New Appointment Form</h2>
      </div>

      <div className="medapp-main-content">
        {/* Left Panel - Patient Search */}
        <div className="medapp-left-panel">
          
          {/* Add New Patient button here */}
          <div className="medapp-add-patient-container">
            <Link to="/nurse-dashboard" className="nv-logo">
              <img src={logo} alt="Logo" className="nv-logo-image" />
            </Link>
            <button className="medapp-add-patient-btn" onClick={handleAddPatient}>
              +Add New Patient
            </button>
          </div>

          <div className="medapp-search-container">
            <input
              type="text"
              placeholder="Search Patient"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="medapp-search-input"
            />
            <button className="medapp-search-btn">🔍</button>
          </div>
          
          <div className="medapp-patient-list">
            {filteredPatients.map((patient) => {
              const name = patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
              const patientId = patient._id || patient.id;
              
              return (
                <div
                  key={patientId}
                  className={`medapp-patient-item ${selectedPatient?._id === patientId || selectedPatient?.id === patientId ? 'medapp-selected' : ''}`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="medapp-patient-avatar"></div>
                  <span className="medapp-patient-name">{name}</span>
                  <span className="medapp-arrow">›</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Appointment Form */}
        <div className="medapp-right-panel">
          <div className="medapp-form-section">
            <h3 className="medapp-section-title">Patient Information</h3>
            
            <div className="medapp-form-row">
              <div className="medapp-form-group">
                <label className="medapp-label">
                  First Name <span style={{color: 'red'}}>*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="medapp-input"
                  placeholder=""
                  required
                />
              </div>
              <div className="medapp-form-group">
                <label className="medapp-label">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className="medapp-input"
                  placeholder=""
                />
              </div>
              <div className="medapp-form-group">
                <label className="medapp-label">
                  Last Name <span style={{color: 'red'}}>*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="medapp-input"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <div className="medapp-form-row">
              <div className="medapp-form-group">
                <label className="medapp-label">
                  Age <span style={{color: 'red'}}>*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="medapp-input medapp-age-input"
                  placeholder=""
                  min="0"
                  required
                />
              </div>
              <div className="medapp-form-group medapp-contact-group">
                <label className="medapp-label">
                  Contact Information <span style={{color: 'red'}}>*</span>
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  className="medapp-input medapp-contact-input"
                  placeholder="7-10 digits"
                  pattern="\d{7,10}"
                  required
                />
              </div>
            </div>
          </div>

          <div className="medapp-form-section">
            <h3 className="medapp-section-title">Appointment Details</h3>
            
            <div className="medapp-form-row">
              <div className="medapp-form-group">
                <label className="medapp-label">
                  Date <span style={{color: 'red'}}>*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="medapp-input"
                  required
                />
              </div>
              <div className="medapp-form-group">
                <label className="medapp-label">
                  Time <span style={{color: 'red'}}>*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="medapp-input"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <div className="medapp-form-row">
              <div className="medapp-form-group">
                <label className="medapp-label">Appointment Type</label>
                <select
                  name="appointmentType"
                  value={formData.appointmentType}
                  onChange={handleInputChange}
                  className="medapp-select"
                >
                  <option>Follow-up</option>
                  <option>New patient</option>
                  <option>Routine Check-up</option>
                  <option>Consultation</option>
                  <option>Emergency</option>
                  <option>Specialist Consultation</option>
                  <option>Procedure or Treatment</option>
                  <option>Vaccination</option>
                  <option>Counselling or Therapy</option>
                  <option>Emergency Visit</option>
                  <option>Telemedicine Appointment</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="medapp-form-group">
                <label className="medapp-label">Reason for Appointment</label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="medapp-select"
                >
                  <option>Regular</option>
                  <option>General Health Check-up</option>
                  <option>Follow-up Visit</option>
                  <option>Specialist Consultation</option>
                  <option>Vaccination</option>
                  <option>Screening Test</option>
                  <option>Symptoms Evaluation</option>
                  <option>Emergency</option>
                  <option>Routine check</option>
                  <option>Urgent</option>
                  <option>Routine Procedure (e.g., blood test, X-ray)</option>
                  <option>Counseling or Therapy</option>
                  <option>Prescription Refill</option>
                  <option>Health Education</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="medapp-form-row">
              <div className="medapp-form-group">
                <label className="medapp-label">Urgency</label>
                <select
                  name="urgencyDropdown"
                  value={formData.urgencyDropdown}
                  onChange={handleInputChange}
                  className="medapp-select"
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div className="medapp-form-group">
                <label className="medapp-label">Doctor</label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  className="medapp-select"
                >
                  <option>Dr. Ram Shah</option>
                  <option>Dr. Rohan Sharma</option>
                  <option>Dr. Sanjay Williams</option>
                  <option>Dr. Ajay Patil</option>
                </select>
              </div>
            </div>

            <div className="medapp-form-group medapp-comments-group">
              <label className="medapp-label">Notes</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                className="medapp-textarea"
                rows="4"
                placeholder=""
              />
            </div>
          </div>

          <div className="medapp-form-actions">
            <button 
              className="medapp-done-btn" 
              onClick={handleDone}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAppointment;