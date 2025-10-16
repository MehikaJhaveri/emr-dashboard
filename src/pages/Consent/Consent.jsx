// src/pages/Consent/Consent.jsx
import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './Consent.css';

export default function Consent() {
  const { patientData, contactData } = useOutletContext();
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const fullName = [patientData.firstName, patientData.middleName, patientData.lastName]
    .filter(Boolean)
    .join(' ');

  const fullAddress = [
    patientData.address1,
    patientData.address2,
    patientData.city,
    patientData.postalCode,
    patientData.state,
    patientData.country
  ]
    .filter(Boolean)
    .join(', ');

  const handleSave = () => {
    if (agreed) {
      alert('Consent saved successfully!');
      // Redirect to nurse-dashboard
      navigate('/nurse-dashboard');
    } else {
      alert('Please agree to the terms before saving.');
    }
  };

  return (
    <div className="consent-container">
      <header className="fixed-header">
        <h1 className="header-title"></h1>
       </header>
      <h2 className="form-title">Consent Form</h2>

      <div className="consent-header">
        <p><strong>Name:</strong> {fullName} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Date of Birth:</strong> {patientData.dob}</p>
        <p><strong>Address:</strong> <u>{fullAddress}</u></p>
        <p><strong>Contact no:</strong> <u>{contactData.mobilePhone}</u> &nbsp;&nbsp;&nbsp;&nbsp; <strong>E-mail:</strong> {contactData.email}</p>
      </div>

      <div className="consent-body">
        <p>
          I, <strong>{fullName || "[Patient's Name]"}</strong>, hereby give my consent to
          <strong> SSPD</strong> to use electronic medical record (EMR) systems for the
          management of my health information. I understand and agree to the following terms:
        </p>

        <ol>
          <li><strong>Purpose of EMR:</strong> I understand that the purpose of using EMR systems is to efficiently manage and store my medical information, including but not limited to medical history, diagnoses, treatment plans, medications, and test results.</li>
          <li><strong>Confidentiality:</strong> I acknowledge that my health information stored in the EMR will be treated with the utmost confidentiality and will only be accessed by authorized healthcare professionals involved in my care.</li>
          <li><strong>Security Measures:</strong> I understand that <em>[Healthcare Provider's Name]</em> has implemented security measures to protect the privacy and security of my health information stored in the EMR system.</li>
          <li><strong>Access and Amendments:</strong> I understand that I have the right to access my medical records stored in the EMR system and request amendments to any inaccuracies or incomplete information.</li>
          <li><strong>Sharing of Information:</strong> I acknowledge that my health information may be shared with other healthcare providers involved in my treatment, as necessary for continuity of care.</li>
          <li><strong>Research and Quality Improvement:</strong> I understand that my de-identified health information may be used for research or quality improvement purposes to enhance healthcare services, with appropriate safeguards to protect my privacy.</li>
          <li><strong>Revocation of Consent:</strong> I understand that I have the right to revoke this consent at any time, except to the extent that action has already been taken in reliance on this consent.</li>
        </ol>

        <div className="consent-confirmation">
          <p>
            By checking the box below, I confirm that I have read and understood the contents of this consent form and agree to the use of electronic medical records for managing my health information.
          </p>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            &nbsp;I agree to the terms outlined above
          </label>
        </div>
      </div>

      <button className="save-btn" onClick={handleSave}disabled={!agreed}>Save</button>
    </div>
  );
}