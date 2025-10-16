import express from 'express';
import Patient from '../models/patients.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/medical-reports');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});

// Helper function to convert YYYY-MM-DD to MM-DD-YYYY
const convertDateFormat = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${month}-${day}-${year}`;
};

// Helper function to convert YYYY-MM-DD to DD-MM-YYYY
const convertDateFormatDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

// POST: Save Conditions
router.post('/conditions', async (req, res) => {
  console.log('Conditions route hit!');
  console.log('Request body:', req.body);
  
  try {
    const { patient_id, conditions } = req.body;

    if (!patient_id) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Transform frontend data to match schema
    const formattedConditions = conditions.map(condition => ({
      condition_name: condition.condition,
      diagnosis_date: convertDateFormat(condition.diagnosisDate),
      treating_physician: condition.physician,
      status: condition.status || 'Unknown'
    }));

    patient.medical_history.conditions = formattedConditions;
    await patient.save();

    res.status(200).json({
      message: 'Conditions saved successfully',
      data: patient.medical_history.conditions
    });
  } catch (error) {
    console.error('Error saving conditions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST: Save Surgeries
router.post('/surgeries', async (req, res) => {
  console.log('Surgeries route hit!');
  console.log('Request body:', req.body);
  
  try {
    const { patient_id, surgeries } = req.body;

    if (!patient_id) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Transform frontend data to match schema
    const formattedSurgeries = surgeries.map(surgery => ({
      surgery_type: surgery.surgeryType,
      date: convertDateFormatDDMMYYYY(surgery.surgeryDate),
      surgeon_name: surgery.surgeonName,
      post_operative_notes: surgery.postOpNotes
    }));

    patient.medical_history.surgeries = formattedSurgeries;
    await patient.save();

    res.status(200).json({
      message: 'Surgeries saved successfully',
      data: patient.medical_history.surgeries
    });
  } catch (error) {
    console.error('Error saving surgeries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST: Save Allergies
router.post('/allergies', async (req, res) => {
  console.log('Allergies route hit!');
  console.log('Request body:', req.body);
  
  try {
    const { patient_id, allergies } = req.body;

    if (!patient_id) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Transform frontend data to match schema
    const formattedAllergies = allergies.map(allergy => ({
      allergy_type: allergy.allergyType,
      allergic_substance: allergy.substance,
      severity: allergy.severity
    }));

    patient.medical_history.allergies = formattedAllergies;
    await patient.save();

    res.status(200).json({
      message: 'Allergies saved successfully',
      data: patient.medical_history.allergies
    });
  } catch (error) {
    console.error('Error saving allergies:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST: Save Immunizations
router.post('/immunizations', async (req, res) => {
  console.log('Immunizations route hit!');
  console.log('Request body:', req.body);
  
  try {
    const { patient_id, immunizations } = req.body;

    if (!patient_id) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Transform frontend data to match schema
    const formattedImmunizations = immunizations.map(immunization => ({
      vaccine_name: immunization.vaccineName,
      date_administered: convertDateFormatDDMMYYYY(immunization.dateAdministered),
      adverse_reaction: immunization.reactions
    }));

    patient.medical_history.immunizations = formattedImmunizations;
    await patient.save();

    res.status(200).json({
      message: 'Immunizations saved successfully',
      data: patient.medical_history.immunizations
    });
  } catch (error) {
    console.error('Error saving immunizations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST: Save Lab Reports (with file upload)
router.post('/lab-reports', upload.single('file'), async (req, res) => {
  console.log('Lab reports route hit!');
  console.log('Request body:', req.body);
  console.log('File:', req.file);
  
  try {
    const { patient_id, comments } = req.body;

    if (!patient_id) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Store file information (use placeholder ObjectId to satisfy schema)
    const labReport = {
      file_id: new mongoose.Types.ObjectId(),
      comments: comments || ''
    };

    patient.medical_history.lab_reports.push(labReport);
    await patient.save();

    res.status(200).json({
      message: 'Lab report uploaded successfully',
      data: labReport,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error saving lab report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST: Save Diagnostic Reports (with file upload)
router.post('/diagnostic-reports', upload.single('file'), async (req, res) => {
  console.log('Diagnostic reports route hit!');
  console.log('Request body:', req.body);
  console.log('File:', req.file);
  
  try {
    const { patient_id, comments } = req.body;

    if (!patient_id) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Store file information (use placeholder ObjectId to satisfy schema)
    const diagnosticReport = {
      file_id: new mongoose.Types.ObjectId(),
      comments: comments || ''
    };

    patient.medical_history.diagnostic_reports.push(diagnosticReport);
    await patient.save();

    res.status(200).json({
      message: 'Diagnostic report uploaded successfully',
      data: diagnosticReport,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error saving diagnostic report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Retrieve all medical history for a patient
router.get('/:patient_id', async (req, res) => {
  try {
    const { patient_id } = req.params;

    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({
      message: 'Medical history retrieved successfully',
      data: patient.medical_history
    });
  } catch (error) {
    console.error('Error retrieving medical history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;