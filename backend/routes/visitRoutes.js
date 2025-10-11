import express from 'express';
import mongoose from 'mongoose';
import Visit from '../models/visits.js';
import Patient from '../models/patients.js';

const router = express.Router();

// Create a new visit
router.post('/visits', async (req, res) => {
  try {
    const {
      visitType,
      patientName,
      chiefComplaints,
      height,
      weight,
      bloodPressure,
      pulse,
      respiratoryRate,
      oxygenSaturation,
      temperature,
      notes,
      investigationRequest,
      investigationResult,
      icdQuickest,
      icdFull,
      treatment,
      seenBy,
      followUpDate,
      totalCost,
      amountPaid,
      balanceAmount
    } = req.body;

    // Validate required fields
    if (!visitType || !patientName || !chiefComplaints) {
      return res.status(400).json({
        success: false,
        message: 'Visit type, patient name, and chief complaints are required'
      });
    }

    // Generate a new patient_id for every visit
    const generatedPatientId = new mongoose.Types.ObjectId();

    // Create visit object
    const visitData = {
      visit_type: visitType,
      patient_name: patientName,
      patient_id: generatedPatientId, // Always generate new ObjectId
      chief_complaints: chiefComplaints,
      vitals: {
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        blood_pressure: bloodPressure || null,
        pulse: pulse ? parseInt(pulse) : null,
        respiratory_rate: respiratoryRate ? parseInt(respiratoryRate) : null,
        oxygen_saturation: oxygenSaturation ? parseFloat(oxygenSaturation) : null,
        temperature: temperature ? parseFloat(temperature) : null
      },
      investigation_request: investigationRequest || null,
      investigation_result: investigationResult || null,
      diagnosis: {
        icd10_quickest: icdQuickest || null,
        full_icd10_list: icdFull || null
      },
      treatment: treatment || null,
      seen_by: seenBy || null,
      appointment_date: followUpDate ? formatDateToMMDDYYYY(followUpDate) : null,
      billing: {
        total_cost: totalCost ? parseFloat(totalCost) : null,
        amount_paid: amountPaid ? parseFloat(amountPaid) : null,
        balance_amount: balanceAmount ? parseFloat(balanceAmount) : null
      },
      notes: notes || null
    };

    // Create new visit (MongoDB will auto-generate _id as visitId)
    const newVisit = new Visit(visitData);
    const savedVisit = await newVisit.save();

    res.status(201).json({
      success: true,
      message: 'Visit created successfully',
      data: savedVisit,
      visitId: savedVisit._id,
      patientId: generatedPatientId
    });

  } catch (error) {
    console.error('Error creating visit:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating visit',
      error: error.message
    });
  }
});

// Get all visits
router.get('/visits', async (req, res) => {
  try {
    const { patientId, patientName, visitType, startDate, endDate } = req.query;
    
    let query = {};

    // Filter by patient ID
    if (patientId) {
      query.patient_id = patientId;
    }

    // Filter by patient name
    if (patientName) {
      query.patient_name = { $regex: patientName, $options: 'i' };
    }

    // Filter by visit type
    if (visitType) {
      query.visit_type = visitType;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const visits = await Visit.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visits.length,
      data: visits
    });

  } catch (error) {
    console.error('Error fetching visits:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching visits',
      error: error.message
    });
  }
});

// Get single visit by ID
router.get('/visits/:id', async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit not found'
      });
    }

    res.status(200).json({
      success: true,
      data: visit
    });

  } catch (error) {
    console.error('Error fetching visit:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching visit',
      error: error.message
    });
  }
});

// Update visit
router.put('/visits/:id', async (req, res) => {
  try {
    const {
      visitType,
      patientName,
      chiefComplaints,
      height,
      weight,
      bloodPressure,
      pulse,
      respiratoryRate,
      oxygenSaturation,
      temperature,
      notes,
      investigationRequest,
      investigationResult,
      icdQuickest,
      icdFull,
      treatment,
      seenBy,
      followUpDate,
      totalCost,
      amountPaid,
      balanceAmount
    } = req.body;

    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit not found'
      });
    }

    // Update fields
    if (visitType) visit.visit_type = visitType;
    if (patientName) visit.patient_name = patientName;
    if (chiefComplaints) visit.chief_complaints = chiefComplaints;

    // Update vitals
    if (height !== undefined) visit.vitals.height = height ? parseFloat(height) : null;
    if (weight !== undefined) visit.vitals.weight = weight ? parseFloat(weight) : null;
    if (bloodPressure !== undefined) visit.vitals.blood_pressure = bloodPressure || null;
    if (pulse !== undefined) visit.vitals.pulse = pulse ? parseInt(pulse) : null;
    if (respiratoryRate !== undefined) visit.vitals.respiratory_rate = respiratoryRate ? parseInt(respiratoryRate) : null;
    if (oxygenSaturation !== undefined) visit.vitals.oxygen_saturation = oxygenSaturation ? parseFloat(oxygenSaturation) : null;
    if (temperature !== undefined) visit.vitals.temperature = temperature ? parseFloat(temperature) : null;

    // Update other fields
    if (investigationRequest !== undefined) visit.investigation_request = investigationRequest || null;
    if (investigationResult !== undefined) visit.investigation_result = investigationResult || null;
    if (icdQuickest !== undefined) visit.diagnosis.icd10_quickest = icdQuickest || null;
    if (icdFull !== undefined) visit.diagnosis.full_icd10_list = icdFull || null;
    if (treatment !== undefined) visit.treatment = treatment || null;
    if (seenBy !== undefined) visit.seen_by = seenBy || null;
    if (followUpDate !== undefined) visit.appointment_date = followUpDate ? formatDateToMMDDYYYY(followUpDate) : null;
    if (notes !== undefined) visit.notes = notes || null;

    // Update billing
    if (totalCost !== undefined) visit.billing.total_cost = totalCost ? parseFloat(totalCost) : null;
    if (amountPaid !== undefined) visit.billing.amount_paid = amountPaid ? parseFloat(amountPaid) : null;
    if (balanceAmount !== undefined) visit.billing.balance_amount = balanceAmount ? parseFloat(balanceAmount) : null;

    const updatedVisit = await visit.save();

    res.status(200).json({
      success: true,
      message: 'Visit updated successfully',
      data: updatedVisit
    });

  } catch (error) {
    console.error('Error updating visit:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating visit',
      error: error.message
    });
  }
});

// Delete visit
router.delete('/visits/:id', async (req, res) => {
  try {
    const visit = await Visit.findByIdAndDelete(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Visit deleted successfully',
      data: visit
    });

  } catch (error) {
    console.error('Error deleting visit:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting visit',
      error: error.message
    });
  }
});

// Get visits by patient ID
router.get('/patients/:patientId/visits', async (req, res) => {
  try {
    const visits = await Visit.find({ patient_id: req.params.patientId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visits.length,
      data: visits
    });

  } catch (error) {
    console.error('Error fetching patient visits:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient visits',
      error: error.message
    });
  }
});

// Get visit statistics
router.get('/visits/stats/overview', async (req, res) => {
  try {
    const totalVisits = await Visit.countDocuments();
    const visitsByType = await Visit.aggregate([
      {
        $group: {
          _id: '$visit_type',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentVisits = await Visit.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalVisits,
        visitsByType,
        recentVisits
      }
    });

  } catch (error) {
    console.error('Error fetching visit stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching visit statistics',
      error: error.message
    });
  }
});

// Helper function to format date
function formatDateToMMDDYYYY(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}-${day}-${year}`;
}

export default router;
