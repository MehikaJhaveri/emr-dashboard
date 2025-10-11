import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './NewVisit.css';
import logo from "../../assets/logo.jpg";

axios.defaults.baseURL = 'http://localhost:5000';

const NewVisit = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    visitType: 'Regular Checkup',
    patientName: '',
    chiefComplaints: '',
    height: '',
    weight: '',
    bloodPressure: '',
    pulse: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    temperature: '',
    notes: '',
    investigationRequest: '',
    investigationResult: '',
    icdQuickest: '',
    icdFull: '',
    treatment: '',
    seenBy: 'Dr. Smith',
    sendFollowUp: '',
    followUpDate: '',
    totalCost: '',
    amountPaid: '',
    balanceAmount: ''
  });

  const visitTypes = [
    'Regular Checkup', 'Emergency Visit', 'Follow-up', 'Consultation',
    'Physical Exam', 'Vaccination', 'Lab Results Review', 'Urgent Care',
    'Specialist Referral', 'Other'
  ];

  const doctors = [
    'Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis'
  ];

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
        { _id: '1', full_name: 'Amelia Adams' },
        { _id: '2', full_name: 'Brooke Bennett' },
        { _id: '3', full_name: 'Chloe Carter' },
        { _id: '4', full_name: 'Daniel Davis' },
        { _id: '5', full_name: 'Emily Edwards' },
        { _id: '6', full_name: 'Finley Fisher' },
        { _id: '7', full_name: 'Grace Gardner' },
        { _id: '8', full_name: 'Henry Hughes' },
        { _id: '9', full_name: 'Isabella Irwin' },
        { _id: '10', full_name: 'Sam John' }
      ]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    // Validate required fields before moving to next step
    if (currentStep === 1) {
      if (!formData.patientName || !formData.chiefComplaints) {
        alert('Please fill in Patient Name and Chief Complaints');
        return;
      }
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleAddPatient = () => {
    navigate('/dashboard/patient-demographics');
  };

  const handleSubmit = async (status = 'saved') => {
    setLoading(true);
    
    try {
      // Prepare data for API
      const visitData = {
        visitType: formData.visitType,
        patientName: formData.patientName,
        chiefComplaints: formData.chiefComplaints,
        height: formData.height,
        weight: formData.weight,
        bloodPressure: formData.bloodPressure,
        pulse: formData.pulse,
        respiratoryRate: formData.respiratoryRate,
        oxygenSaturation: formData.oxygenSaturation,
        temperature: formData.temperature,
        notes: formData.notes,
        investigationRequest: formData.investigationRequest,
        investigationResult: formData.investigationResult,
        icdQuickest: formData.icdQuickest,
        icdFull: formData.icdFull,
        treatment: formData.treatment,
        seenBy: formData.seenBy,
        followUpDate: formData.followUpDate,
        totalCost: formData.totalCost,
        amountPaid: formData.amountPaid,
        balanceAmount: displayBalance || formData.balanceAmount
      };

      const response = await axios.post('/api/visits', visitData);

      if (response.data.success) {
        alert(`Visit ${status === 'complete' ? 'saved and marked complete' : 'saved'} successfully!`);
        console.log('Visit created with ID:', response.data.visitId);
        
        // Reset form or navigate away
        setFormData({
          visitType: 'Regular Checkup',
          patientName: '',
          chiefComplaints: '',
          height: '',
          weight: '',
          bloodPressure: '',
          pulse: '',
          respiratoryRate: '',
          oxygenSaturation: '',
          temperature: '',
          notes: '',
          investigationRequest: '',
          investigationResult: '',
          icdQuickest: '',
          icdFull: '',
          treatment: '',
          seenBy: 'Dr. Smith',
          sendFollowUp: '',
          followUpDate: '',
          totalCost: '',
          amountPaid: '',
          balanceAmount: ''
        });
        setCurrentStep(1);
        
        // Optionally navigate to visits list or dashboard
        // navigate('/dashboard/visits');
      }
    } catch (error) {
      console.error('Error saving visit:', error);
      alert(error.response?.data?.message || 'Error saving visit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const computedBalance = useMemo(() => {
    const total = parseFloat(formData.totalCost || 0) || 0;
    const paid = parseFloat(formData.amountPaid || 0) || 0;
    const bal = total - paid;
    return Number.isNaN(bal) ? '' : bal.toFixed(2);
  }, [formData.totalCost, formData.amountPaid]);

  const displayBalance = formData.balanceAmount === '' ? computedBalance : formData.balanceAmount;

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    const name = patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="new-visit">
      <div className="visit-header" />

      <div className="visit-layout">
        <aside className="nv-sidebar">
          <div className="nv-sidebar-header">
            <Link to="/nurse-dashboard" className="nv-logo">
              <img src={logo} alt="Logo" className="nv-logo-image" />
            </Link>
            <button className="add-patient-btn" onClick={handleAddPatient}>
              + Add New Patient
            </button>
          </div>

          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search Patient" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="patient-list">
            {filteredPatients.map((patient) => {
              const name = patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
              const initials = name.split(' ').map(n => n[0]).join('');
              return (
                <div
                  key={patient._id}
                  className="patient-item"
                  onClick={() => handleInputChange('patientName', name)}
                >
                  <div className="patient-avatar">{initials}</div>
                  <div className="patient-details">
                    <div className="patient-name">{name}</div>
                  </div>
                  <div className="patient-arrow">›</div>
                </div>
              );
            })}
          </div>
        </aside>

        <main className="main-content">
          <h2 className="page-title">New Visit</h2>

          {/* STEP 1 */}
          {currentStep === 1 && (
            <>
              <div className="form-card">
                <div className="form-group">
                  <label>Visit Type <span style={{color: 'red'}}>*</span></label>
                  <select
                    value={formData.visitType}
                    onChange={(e) => handleInputChange('visitType', e.target.value)}
                  >
                    {visitTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Patient Name <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    placeholder="Select from list or type name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Chief Complaints <span style={{color: 'red'}}>*</span></label>
                  <textarea
                    value={formData.chiefComplaints}
                    onChange={(e) => handleInputChange('chiefComplaints', e.target.value)}
                    rows="3"
                    placeholder="Describe the main complaints"
                    required
                  />
                </div>

                <div className="form-group">
                  <h3>Vitals</h3>
                  <div className="vitals-grid">
                    <div className="vital-item">
                      <label>Height</label>
                      <div className="input-unit">
                        <input 
                          type="number" 
                          step="0.1"
                          value={formData.height} 
                          onChange={(e) => handleInputChange('height', e.target.value)} 
                          placeholder="0.0"
                        />
                        <span>ft</span>
                      </div>
                    </div>
                    <div className="vital-item">
                      <label>RR</label>
                      <div className="input-unit">
                        <input 
                          type="number" 
                          value={formData.respiratoryRate} 
                          onChange={(e) => handleInputChange('respiratoryRate', e.target.value)} 
                          placeholder="0"
                        />
                        <span>bpm</span>
                      </div>
                    </div>
                    <div className="vital-item">
                      <label>Weight</label>
                      <div className="input-unit">
                        <input 
                          type="number" 
                          step="0.1"
                          value={formData.weight} 
                          onChange={(e) => handleInputChange('weight', e.target.value)} 
                          placeholder="0.0"
                        />
                        <span>kg</span>
                      </div>
                    </div>
                    <div className="vital-item">
                      <label>Oxygen%</label>
                      <div className="input-unit">
                        <input 
                          type="number" 
                          step="0.1"
                          value={formData.oxygenSaturation} 
                          onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)} 
                          placeholder="0.0"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <div className="vital-item">
                      <label>Blood pressure</label>
                      <input 
                        type="text" 
                        value={formData.bloodPressure} 
                        onChange={(e) => handleInputChange('bloodPressure', e.target.value)} 
                        placeholder="120/80"
                      />
                    </div>
                    <div className="vital-item">
                      <label>Temperature</label>
                      <div className="input-unit">
                        <input 
                          type="number" 
                          step="0.1"
                          value={formData.temperature} 
                          onChange={(e) => handleInputChange('temperature', e.target.value)} 
                          placeholder="98.6"
                        />
                        <span>F</span>
                      </div>
                    </div>
                    <div className="vital-item">
                      <label>Pulse</label>
                      <div className="input-unit">
                        <input 
                          type="number" 
                          value={formData.pulse} 
                          onChange={(e) => handleInputChange('pulse', e.target.value)} 
                          placeholder="0"
                        />
                        <span>bpm</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea 
                    value={formData.notes} 
                    onChange={(e) => handleInputChange('notes', e.target.value)} 
                    rows="4" 
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="form-card">
              <div className="form-group">
                <label>Investigation Request</label>
                <textarea 
                  value={formData.investigationRequest} 
                  onChange={(e) => handleInputChange('investigationRequest', e.target.value)} 
                  rows="2" 
                  placeholder="Enter investigation requests..."
                />
              </div>

              <div className="form-group">
                <label>Investigation Result</label>
                <textarea 
                  value={formData.investigationResult} 
                  onChange={(e) => handleInputChange('investigationResult', e.target.value)} 
                  rows="2" 
                  placeholder="Enter investigation results..."
                />
              </div>

              <div className="form-group">
                <h3>Diagnosis</h3>
                <p className="helper-text">ICD-10 Quickest</p>
                <input 
                  type="text" 
                  value={formData.icdQuickest} 
                  onChange={(e) => handleInputChange('icdQuickest', e.target.value)} 
                  placeholder="Enter ICD-10 code"
                />
                <p className="helper-text">Full ICD-10 List</p>
                <input 
                  type="text" 
                  value={formData.icdFull} 
                  onChange={(e) => handleInputChange('icdFull', e.target.value)} 
                  placeholder="Enter full ICD-10 list"
                />
              </div>

              <div className="form-group">
                <label>Treatment</label>
                <textarea 
                  value={formData.treatment} 
                  onChange={(e) => handleInputChange('treatment', e.target.value)} 
                  rows="2" 
                  placeholder="Enter treatment plan..."
                />
              </div>

              <div className="form-group">
                <label>Seen by</label>
                <select value={formData.seenBy} onChange={(e) => handleInputChange('seenBy', e.target.value)}>
                  {doctors.map(doctor => <option key={doctor} value={doctor}>{doctor}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="form-card">
              <div className="form-group">
                <label>Follow-up Appointment</label>
                <input 
                  type="date" 
                  value={formData.followUpDate} 
                  onChange={(e) => handleInputChange('followUpDate', e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Total Cost</label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={formData.totalCost} 
                  onChange={(e) => handleInputChange('totalCost', e.target.value)} 
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Amount Paid</label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={formData.amountPaid} 
                  onChange={(e) => handleInputChange('amountPaid', e.target.value)} 
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Balance Amount</label>
                <input 
                  type="text" 
                  value={displayBalance} 
                  onChange={(e) => handleInputChange('balanceAmount', e.target.value)} 
                  placeholder="Auto-calculated" 
                />
              </div>

              <div className="form-actions-row">
                <button 
                  className="btn-save" 
                  onClick={() => handleSubmit('saved')}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button 
                  className="btn-complete" 
                  onClick={() => handleSubmit('complete')}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save as Complete'}
                </button>
              </div>
            </div>
          )}

          <div className="form-nav">
            {currentStep > 1 && <button className="btn-outline" onClick={prevStep}>Previous</button>}
            <div className="spacer" />
            {currentStep < 3 ? <button className="btn-primary" onClick={nextStep}>Next</button> : null}
          </div>

          <div className="step-indicator">
            <div className={`step-dot ${currentStep >= 1 ? 'active' : ''}`} />
            <div className={`step-dot ${currentStep >= 2 ? 'active' : ''}`} />
            <div className={`step-dot ${currentStep >= 3 ? 'active' : ''}`} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewVisit;
