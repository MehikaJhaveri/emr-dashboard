// routes/DashboardRoutes.js
import express from 'express';
import Patient from '../models/patients.js';
import Visit from '../models/visits.js';
import Appointment from '../models/appointments.js';

const router = express.Router();

// GET all patients
router.get('/patients', async (req, res) => {
  try {
    console.log('📥 Fetching all patients...');
    const patients = await Patient.find()
      .select('name date_of_birth gender contact_info.email contact_info.mobile')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${patients.length} patients`);
    res.status(200).json(patients);
  } catch (error) {
    console.error('❌ Error fetching patients:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching patients', 
      error: error.message 
    });
  }
});

// GET all visits
router.get('/visits', async (req, res) => {
  try {
    console.log('📥 Fetching all visits...');
    const visits = await Visit.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    console.log(`✅ Found ${visits.length} visits`);
    res.status(200).json(visits);
  } catch (error) {
    console.error('❌ Error fetching visits:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching visits', 
      error: error.message 
    });
  }
});

// GET all appointments
router.get('/appointments', async (req, res) => {
  try {
    console.log('📥 Fetching all appointments...');
    const appointments = await Appointment.find()
      .sort({ appointment_date: 1, appointment_time: 1 });
    
    console.log(`✅ Found ${appointments.length} appointments`);
    res.status(200).json(appointments);
  } catch (error) {
    console.error('❌ Error fetching appointments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching appointments', 
      error: error.message 
    });
  }
});

// GET single patient by ID
router.get('/patient/:id', async (req, res) => {
  try {
    console.log(`📥 Fetching patient with ID: ${req.params.id}`);
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      console.log('❌ Patient not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }
    
    console.log('✅ Patient found');
    res.status(200).json({ 
      success: true, 
      data: patient 
    });
  } catch (error) {
    console.error('❌ Error fetching patient:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching patient', 
      error: error.message 
    });
  }
});

// GET single visit by ID
router.get('/visit/:id', async (req, res) => {
  try {
    console.log(`📥 Fetching visit with ID: ${req.params.id}`);
    const visit = await Visit.findById(req.params.id);
    
    if (!visit) {
      console.log('❌ Visit not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Visit not found' 
      });
    }
    
    console.log('✅ Visit found');
    res.status(200).json({ 
      success: true, 
      data: visit 
    });
  } catch (error) {
    console.error('❌ Error fetching visit:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching visit', 
      error: error.message 
    });
  }
});

// GET single appointment by ID
router.get('/appointment/:id', async (req, res) => {
  try {
    console.log(`📥 Fetching appointment with ID: ${req.params.id}`);
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      console.log('❌ Appointment not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }
    
    console.log('✅ Appointment found');
    res.status(200).json({ 
      success: true, 
      data: appointment 
    });
  } catch (error) {
    console.error('❌ Error fetching appointment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching appointment', 
      error: error.message 
    });
  }
});

// GET visits by patient ID
router.get('/patient/:id/visits', async (req, res) => {
  try {
    console.log(`📥 Fetching visits for patient ID: ${req.params.id}`);
    const visits = await Visit.find({ patient_id: req.params.id })
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${visits.length} visits for patient`);
    res.status(200).json({ 
      success: true, 
      data: visits 
    });
  } catch (error) {
    console.error('❌ Error fetching patient visits:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching patient visits', 
      error: error.message 
    });
  }
});

// GET appointments by patient ID
router.get('/patient/:id/appointments', async (req, res) => {
  try {
    console.log(`📥 Fetching appointments for patient ID: ${req.params.id}`);
    const appointments = await Appointment.find({ patient_id: req.params.id })
      .sort({ appointment_date: 1, appointment_time: 1 });
    
    console.log(`✅ Found ${appointments.length} appointments for patient`);
    res.status(200).json({ 
      success: true, 
      data: appointments 
    });
  } catch (error) {
    console.error('❌ Error fetching patient appointments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching patient appointments', 
      error: error.message 
    });
  }
});

export default router;