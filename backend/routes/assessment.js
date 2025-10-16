import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Patient from '../models/patients.js';
import mongoose from 'mongoose';

const router = express.Router();

// Configure multer for test file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/test-results';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'test-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
                     file.mimetype === 'application/msword' ||
                     file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files, PDFs, and Word documents are allowed!'));
    }
  }
});

// POST - Create a new assessment for a patient
router.post('/:patient_id', upload.array('testFiles', 10), async (req, res) => {
  try {
    const { patient_id } = req.params;
    const {
      chiefComplaints,
      historyOfPresentIllness,
      pastMedicalHistory,
      medicationHistory,
      remindersAlerts,
      planCare,
      tests
    } = req.body;

    // Validate required fields
    if (!patient_id) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    // Find the patient
    const patient = await Patient.findById(patient_id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Parse tests if it's a string (from form data)
    let parsedTests = [];
    if (tests) {
      parsedTests = typeof tests === 'string' ? JSON.parse(tests) : tests;
    }

    // Build test results array with file information
    const testResults = [];
    if (parsedTests && Array.isArray(parsedTests)) {
      parsedTests.forEach((test, index) => {
        const uploadedFile = req.files ? req.files[index] : null;
        
        // Only add test results that have actual content
        if (test.result || uploadedFile) {
          const testResult = {
            results: test.result || 'No result specified',
            comments: test.comment || '',
            test_file: {
              file_id: uploadedFile ? new mongoose.Types.ObjectId() : new mongoose.Types.ObjectId()
            }
          };

          testResults.push(testResult);
        }
      });
    }

    // Build assessment object according to schema
    const assessmentData = {
      chief_complaints: chiefComplaints || '',
      history_of_present_illness: historyOfPresentIllness || '',
      past_medical_history: pastMedicalHistory || '',
      medication_history: medicationHistory || '',
      test_results: testResults,
      reminders_alerts: remindersAlerts || '',
      plan_of_care: planCare || ''
    };

    // Initialize assessments array if it doesn't exist
    if (!patient.assessments) {
      patient.assessments = [];
    }

    // Add the assessment to the array
    patient.assessments.push(assessmentData);

    // Save the patient
    await patient.save();

    res.status(201).json({
      message: 'Assessment added successfully',
      patient_id: patient._id,
      assessment: assessmentData,
      totalAssessments: patient.assessments.length,
      uploadedFiles: req.files ? req.files.map(f => ({
        filename: f.filename,
        originalname: f.originalname,
        path: f.path
      })) : []
    });

  } catch (error) {
    console.error('Error adding assessment:', error);
    console.error('Error stack:', error.stack);
    console.error('Validation errors:', error.errors);
    res.status(500).json({ 
      error: 'Failed to add assessment',
      details: error.message,
      validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });
  }
});

// POST - Add assessment without file upload (JSON only)
router.post('/:patient_id/json', async (req, res) => {
  try {
    const { patient_id } = req.params;
    const {
      chiefComplaints,
      historyOfPresentIllness,
      pastMedicalHistory,
      medicationHistory,
      remindersAlerts,
      planCare,
      tests
    } = req.body;

    console.log('Received patient_id:', patient_id);
    console.log('Received body:', req.body);
    console.log('Tests array:', tests);

    if (!patient_id) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    const patient = await Patient.findById(patient_id);
    console.log('Found patient:', patient ? 'Yes' : 'No');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Build test results array (without files)
    const testResults = [];
    if (tests && Array.isArray(tests)) {
      tests.forEach(test => {
        // Accept test if it has a result (even empty string after trim check in frontend)
        const testResult = {
          results: test.result || 'No result specified',
          comments: test.comment || '',
          test_file: {
            file_id: test.fileId || new mongoose.Types.ObjectId()
          }
        };
        testResults.push(testResult);
      });
    }

    console.log('Built test results:', testResults);

    const assessmentData = {
      chief_complaints: chiefComplaints || '',
      history_of_present_illness: historyOfPresentIllness || '',
      past_medical_history: pastMedicalHistory || '',
      medication_history: medicationHistory || '',
      test_results: testResults,
      reminders_alerts: remindersAlerts || '',
      plan_of_care: planCare || ''
    };

    console.log('Assessment data to save:', assessmentData);

    if (!patient.assessments) {
      patient.assessments = [];
    }

    patient.assessments.push(assessmentData);
    
    console.log('Patient assessments before save:', patient.assessments.length);
    const savedPatient = await patient.save();
    console.log('Patient assessments after save:', savedPatient.assessments.length);

    res.status(201).json({
      message: 'Assessment added successfully',
      patient_id: patient._id,
      assessment: assessmentData,
      totalAssessments: patient.assessments.length
    });

  } catch (error) {
    console.error('Error adding assessment (JSON):', error);
    console.error('Error stack:', error.stack);
    console.error('Validation errors:', error.errors);
    res.status(500).json({ 
      error: 'Failed to add assessment',
      details: error.message,
      validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });
  }
});

// GET - Retrieve all assessments for a patient
router.get('/:patient_id', async (req, res) => {
  try {
    const { patient_id } = req.params;

    const patient = await Patient.findById(patient_id).select('assessments');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Format assessments for frontend
    const formattedAssessments = (patient.assessments || []).map(assessment => ({
      chiefComplaints: assessment.chief_complaints,
      historyOfPresentIllness: assessment.history_of_present_illness,
      pastMedicalHistory: assessment.past_medical_history,
      medicationHistory: assessment.medication_history,
      testResults: assessment.test_results.map(test => ({
        result: test.results,
        comment: test.comments,
        fileId: test.test_file?.file_id || null
      })),
      remindersAlerts: assessment.reminders_alerts,
      planCare: assessment.plan_of_care
    }));

    res.status(200).json({
      patient_id: patient._id,
      assessments: formattedAssessments,
      totalAssessments: formattedAssessments.length
    });

  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch assessments',
      details: error.message 
    });
  }
});

// GET - Retrieve a specific assessment by index
router.get('/:patient_id/:assessment_index', async (req, res) => {
  try {
    const { patient_id, assessment_index } = req.params;
    const index = parseInt(assessment_index, 10);

    const patient = await Patient.findById(patient_id).select('assessments');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (!patient.assessments || index < 0 || index >= patient.assessments.length) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const assessment = patient.assessments[index];

    const formattedAssessment = {
      chiefComplaints: assessment.chief_complaints,
      historyOfPresentIllness: assessment.history_of_present_illness,
      pastMedicalHistory: assessment.past_medical_history,
      medicationHistory: assessment.medication_history,
      testResults: assessment.test_results.map(test => ({
        result: test.results,
        comment: test.comments,
        fileId: test.test_file?.file_id || null
      })),
      remindersAlerts: assessment.reminders_alerts,
      planCare: assessment.plan_of_care
    };

    res.status(200).json({
      patient_id: patient._id,
      assessmentIndex: index,
      assessment: formattedAssessment
    });

  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ 
      error: 'Failed to fetch assessment',
      details: error.message 
    });
  }
});

// PUT - Update a specific assessment by index
router.put('/:patient_id/:assessment_index', async (req, res) => {
  try {
    const { patient_id, assessment_index } = req.params;
    const index = parseInt(assessment_index, 10);
    const {
      chiefComplaints,
      historyOfPresentIllness,
      pastMedicalHistory,
      medicationHistory,
      remindersAlerts,
      planCare,
      tests
    } = req.body;

    const patient = await Patient.findById(patient_id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (!patient.assessments || index < 0 || index >= patient.assessments.length) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Build test results array
    const testResults = [];
    if (tests && Array.isArray(tests)) {
      tests.forEach(test => {
        if (test.result) {
          const testResult = {
            results: test.result,
            comments: test.comment || '',
            test_file: {
              file_id: test.fileId || new mongoose.Types.ObjectId()
            }
          };

          testResults.push(testResult);
        }
      });
    }

    // Update the assessment at the specified index
    patient.assessments[index] = {
      chief_complaints: chiefComplaints || '',
      history_of_present_illness: historyOfPresentIllness || '',
      past_medical_history: pastMedicalHistory || '',
      medication_history: medicationHistory || '',
      test_results: testResults,
      reminders_alerts: remindersAlerts || '',
      plan_of_care: planCare || ''
    };

    await patient.save();

    res.status(200).json({
      message: 'Assessment updated successfully',
      patient_id: patient._id,
      assessmentIndex: index,
      assessment: patient.assessments[index]
    });

  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ 
      error: 'Failed to update assessment',
      details: error.message 
    });
  }
});

// DELETE - Remove a specific assessment by index
router.delete('/:patient_id/:assessment_index', async (req, res) => {
  try {
    const { patient_id, assessment_index } = req.params;
    const index = parseInt(assessment_index, 10);

    const patient = await Patient.findById(patient_id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (!patient.assessments || index < 0 || index >= patient.assessments.length) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Remove the assessment at the specified index
    patient.assessments.splice(index, 1);

    await patient.save();

    res.status(200).json({
      message: 'Assessment deleted successfully',
      patient_id: patient._id,
      remainingAssessments: patient.assessments.length
    });

  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ 
      error: 'Failed to delete assessment',
      details: error.message 
    });
  }
});

// POST - Upload test files for an existing assessment
router.post('/:patient_id/:assessment_index/upload-tests', upload.array('testFiles', 10), async (req, res) => {
  try {
    const { patient_id, assessment_index } = req.params;
    const index = parseInt(assessment_index, 10);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const patient = await Patient.findById(patient_id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (!patient.assessments || index < 0 || index >= patient.assessments.length) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Store file information (in production, you'd create File documents)
    const uploadedFiles = req.files.map(file => ({
      file_id: new mongoose.Types.ObjectId(),
      path: file.path,
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    }));

    res.status(200).json({
      message: 'Test files uploaded successfully',
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Error uploading test files:', error);
    res.status(500).json({ 
      error: 'Failed to upload test files',
      details: error.message 
    });
  }
});

export default router;