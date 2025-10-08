import express from 'express';
import Patient from '../models/patients.js';

const router = express.Router();

// POST - Create/Update alcohol use data for a specific patient
router.post('/:patientId/alcohol', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, weeklyConsumption, alcoholType, period, notes } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Current status is required'
      });
    }

    // Prepare update data - nested under social_history
    const alcoholUseData = {
      current_status: status,
      average_weekly_consumption: weeklyConsumption || '',
      type_of_alcohol: alcoholType || '',
      period_of_use: period || '',
      notes: notes || ''
    };

    // Update patient's alcohol use information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.alcohol_use': alcoholUseData },
      { new: true, runValidators: true }
    ).select('social_history.alcohol_use');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alcohol use information saved successfully',
      data: updatedPatient.social_history?.alcohol_use
    });
  } catch (error) {
    console.error('Error saving alcohol use data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error saving alcohol use data',
      error: error.message
    });
  }
});

// GET - Retrieve alcohol use data for a specific patient
router.get('/:patientId/alcohol', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).select('social_history.alcohol_use');

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: patient.social_history?.alcohol_use || {}
    });
  } catch (error) {
    console.error('Error fetching alcohol use data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching alcohol use data',
      error: error.message
    });
  }
});

// PUT - Update alcohol use data for a specific patient
router.put('/:patientId/alcohol', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, weeklyConsumption, alcoholType, period, notes } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Current status is required'
      });
    }

    // Prepare update data - nested under social_history
    const alcoholUseData = {
      current_status: status,
      average_weekly_consumption: weeklyConsumption || '',
      type_of_alcohol: alcoholType || '',
      period_of_use: period || '',
      notes: notes || ''
    };

    // Update patient's alcohol use information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.alcohol_use': alcoholUseData },
      { new: true, runValidators: true }
    ).select('social_history.alcohol_use');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alcohol use information updated successfully',
      data: updatedPatient.social_history?.alcohol_use
    });
  } catch (error) {
    console.error('Error updating alcohol use data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating alcohol use data',
      error: error.message
    });
  }
});

// DELETE - Remove alcohol use data for a specific patient
router.delete('/:patientId/alcohol', async (req, res) => {
  try {
    const { patientId } = req.params;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $unset: { 'social_history.alcohol_use': '' } },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alcohol use information deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting alcohol use data:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting alcohol use data',
      error: error.message
    });
  }
});

// POST - Create/Update social history free text for a specific patient
router.post('/:patientId/social-text', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { notes } = req.body;

    // Prepare update data - nested under social_history
    const socialTextData = {
      notes: notes || ''
    };

    // Update patient's social history free text under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.social_history_free_text': socialTextData },
      { new: true, runValidators: true }
    ).select('social_history.social_history_free_text');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Social history notes saved successfully',
      data: updatedPatient.social_history?.social_history_free_text
    });
  } catch (error) {
    console.error('Error saving social history text:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error saving social history text',
      error: error.message
    });
  }
});

// GET - Retrieve social history free text for a specific patient
router.get('/:patientId/social-text', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).select('social_history.social_history_free_text');

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: patient.social_history?.social_history_free_text || {}
    });
  } catch (error) {
    console.error('Error fetching social history text:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching social history text',
      error: error.message
    });
  }
});

// PUT - Update social history free text for a specific patient
router.put('/:patientId/social-text', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { notes } = req.body;

    // Prepare update data - nested under social_history
    const socialTextData = {
      notes: notes || ''
    };

    // Update patient's social history free text under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.social_history_free_text': socialTextData },
      { new: true, runValidators: true }
    ).select('social_history.social_history_free_text');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Social history notes updated successfully',
      data: updatedPatient.social_history?.social_history_free_text
    });
  } catch (error) {
    console.error('Error updating social history text:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating social history text',
      error: error.message
    });
  }
});

// DELETE - Remove social history free text for a specific patient
router.delete('/:patientId/social-text', async (req, res) => {
  try {
    const { patientId } = req.params;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $unset: { 'social_history.social_history_free_text': '' } },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Social history notes deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting social history text:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting social history text',
      error: error.message
    });
  }
});

// POST - Create/Update financial resources data for a specific patient
router.post('/:patientId/financial-resources', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { incomeLevel, employmentStatus, financialSupport, notes } = req.body;

    // Validate required fields
    if (!incomeLevel || !employmentStatus || !financialSupport) {
      return res.status(400).json({
        success: false,
        message: 'Income level, employment status, and financial support are required'
      });
    }

    // Prepare update data - nested under social_history
    const financialResourcesData = {
      income_level: incomeLevel,
      employment_status: employmentStatus,
      financial_support: financialSupport,
      notes: notes || ''
    };

    // Update patient's financial resources under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.financial_resources': financialResourcesData },
      { new: true, runValidators: true }
    ).select('social_history.financial_resources');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Financial resources information saved successfully',
      data: updatedPatient.social_history?.financial_resources
    });
  } catch (error) {
    console.error('Error saving financial resources data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error saving financial resources data',
      error: error.message
    });
  }
});

// GET - Retrieve financial resources data for a specific patient
router.get('/:patientId/financial-resources', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).select('social_history.financial_resources');

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: patient.social_history?.financial_resources || {}
    });
  } catch (error) {
    console.error('Error fetching financial resources data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching financial resources data',
      error: error.message
    });
  }
});

// PUT - Update financial resources data for a specific patient
router.put('/:patientId/financial-resources', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { incomeLevel, employmentStatus, financialSupport, notes } = req.body;

    // Validate required fields
    if (!incomeLevel || !employmentStatus || !financialSupport) {
      return res.status(400).json({
        success: false,
        message: 'Income level, employment status, and financial support are required'
      });
    }

    // Prepare update data - nested under social_history
    const financialResourcesData = {
      income_level: incomeLevel,
      employment_status: employmentStatus,
      financial_support: financialSupport,
      notes: notes || ''
    };

    // Update patient's financial resources under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.financial_resources': financialResourcesData },
      { new: true, runValidators: true }
    ).select('social_history.financial_resources');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Financial resources information updated successfully',
      data: updatedPatient.social_history?.financial_resources
    });
  } catch (error) {
    console.error('Error updating financial resources data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating financial resources data',
      error: error.message
    });
  }
});

// DELETE - Remove financial resources data for a specific patient
router.delete('/:patientId/financial-resources', async (req, res) => {
  try {
    const { patientId } = req.params;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $unset: { 'social_history.financial_resources': '' } },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Financial resources information deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting financial resources data:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting financial resources data',
      error: error.message
    });
  }
});

// POST - Create/Update physical activity data for a specific patient
router.post('/:patientId/physical-activity', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { frequency, type, duration, durationUnit, consistency, notes } = req.body;

    // Validate required fields
    if (!frequency) {
      return res.status(400).json({
        success: false,
        message: 'Frequency is required'
      });
    }

    // Prepare update data - nested under social_history
    const physicalActivityData = {
      frequency: frequency,
      type_of_exercise: type || '',
      duration: duration ? parseInt(duration) : null,
      duration_unit: durationUnit || 'min',
      consistency: consistency || 'Regular',
      notes: notes || ''
    };

    // Update patient's physical activity information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.physical_activity': physicalActivityData },
      { new: true, runValidators: true }
    ).select('social_history.physical_activity');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Physical activity information saved successfully',
      data: updatedPatient.social_history?.physical_activity
    });
  } catch (error) {
    console.error('Error saving physical activity data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error saving physical activity data',
      error: error.message
    });
  }
});

// GET - Retrieve physical activity data for a specific patient
router.get('/:patientId/physical-activity', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).select('social_history.physical_activity');

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: patient.social_history?.physical_activity || {}
    });
  } catch (error) {
    console.error('Error fetching physical activity data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching physical activity data',
      error: error.message
    });
  }
});

// PUT - Update physical activity data for a specific patient
router.put('/:patientId/physical-activity', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { frequency, type, duration, durationUnit, consistency, notes } = req.body;

    // Validate required fields
    if (!frequency) {
      return res.status(400).json({
        success: false,
        message: 'Frequency is required'
      });
    }

    // Prepare update data - nested under social_history
    const physicalActivityData = {
      frequency: frequency,
      type_of_exercise: type || '',
      duration: duration ? parseInt(duration) : null,
      duration_unit: durationUnit || 'min',
      consistency: consistency || 'Regular',
      notes: notes || ''
    };

    // Update patient's physical activity information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.physical_activity': physicalActivityData },
      { new: true, runValidators: true }
    ).select('social_history.physical_activity');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Physical activity information updated successfully',
      data: updatedPatient.social_history?.physical_activity
    });
  } catch (error) {
    console.error('Error updating physical activity data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating physical activity data',
      error: error.message
    });
  }
});

// DELETE - Remove physical activity data for a specific patient
router.delete('/:patientId/physical-activity', async (req, res) => {
  try {
    const { patientId } = req.params;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $unset: { 'social_history.physical_activity': '' } },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Physical activity information deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting physical activity data:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting physical activity data',
      error: error.message
    });
  }
});

export default router;