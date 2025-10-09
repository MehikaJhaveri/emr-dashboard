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


// POST - Create/Update tobacco smoking data for a specific patient
router.post('/:patientId/tobacco-smoking', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, dailyConsumption, duration, durationUnit, quitDate, notes } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Current status is required'
      });
    }

    // Prepare update data
    const tobaccoSmokingData = {
      current_status: status,
      average_daily_consumption: dailyConsumption ? parseInt(dailyConsumption) : undefined,
      duration_of_use: duration || '',
      duration_unit: durationUnit || 'years',
      quit_date: quitDate || '',
      notes: notes || ''
    };

    // Update patient's tobacco smoking information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.tobacco_smoking': tobaccoSmokingData },
      { new: true, runValidators: true }
    ).select('social_history.tobacco_smoking');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tobacco smoking information saved successfully',
      data: updatedPatient.social_history?.tobacco_smoking
    });
  } catch (error) {
    console.error('Error saving tobacco smoking data:', error);
    
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
      message: 'Error saving tobacco smoking data',
      error: error.message
    });
  }
});

// GET - Retrieve tobacco smoking data for a specific patient
router.get('/:patientId/tobacco-smoking', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).select('social_history.tobacco_smoking');

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: patient.social_history?.tobacco_smoking || {}
    });
  } catch (error) {
    console.error('Error fetching tobacco smoking data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tobacco smoking data',
      error: error.message
    });
  }
});

// PUT - Update tobacco smoking data for a specific patient
router.put('/:patientId/tobacco-smoking', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, dailyConsumption, duration, durationUnit, quitDate, notes } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Current status is required'
      });
    }

    // Prepare update data
    const tobaccoSmokingData = {
      current_status: status,
      average_daily_consumption: dailyConsumption ? parseInt(dailyConsumption) : undefined,
      duration_of_use: duration || '',
      duration_unit: durationUnit || 'years',
      quit_date: quitDate || '',
      notes: notes || ''
    };

    // Update patient's tobacco smoking information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.tobacco_smoking': tobaccoSmokingData },
      { new: true, runValidators: true }
    ).select('social_history.tobacco_smoking');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tobacco smoking information updated successfully',
      data: updatedPatient.social_history?.tobacco_smoking
    });
  } catch (error) {
    console.error('Error updating tobacco smoking data:', error);
    
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
      message: 'Error updating tobacco smoking data',
      error: error.message
    });
  }
});

// DELETE - Remove tobacco smoking data for a specific patient
router.delete('/:patientId/tobacco-smoking', async (req, res) => {
  try {
    const { patientId } = req.params;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $unset: { 'social_history.tobacco_smoking': '' } },
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
      message: 'Tobacco smoking information deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tobacco smoking data:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tobacco smoking data',
      error: error.message
    });
  }
});

// POST - Create/Update tobacco consumption data for a specific patient
router.post('/:patientId/tobacco-consumption', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, dailyConsumption, duration, durationUnit, quitDate, notes } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Current status is required'
      });
    }

    // Prepare update data - only include fields with valid values
    const tobaccoConsumptionData = {
      current_status: status
    };

    // Only add fields if they have valid values
    if (dailyConsumption && dailyConsumption !== '') {
      tobaccoConsumptionData.average_daily_consumption = parseInt(dailyConsumption);
    }

    if (duration && duration !== '') {
      tobaccoConsumptionData.duration_of_use = duration.toString();
    }

    if (durationUnit && durationUnit !== '') {
      tobaccoConsumptionData.duration_unit = durationUnit;
    }

    // Only add quit_date if it's not empty (empty string fails regex validation)
    if (quitDate && quitDate.trim() !== '') {
      tobaccoConsumptionData.quit_date = quitDate;
    }

    if (notes && notes !== '') {
      tobaccoConsumptionData.notes = notes;
    }

    console.log('Processed tobacco consumption data:', tobaccoConsumptionData);

    // Update patient's tobacco consumption information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.tobacco_consumption': tobaccoConsumptionData },
      { new: true, runValidators: true }
    ).select('social_history.tobacco_consumption');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tobacco consumption information saved successfully',
      data: updatedPatient.social_history?.tobacco_consumption
    });
  } catch (error) {
    console.error('Error saving tobacco consumption data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
        details: error.errors
      });
    }

    // Handle MongoDB schema validation errors (code 121)
    if (error.code === 121) {
      console.error('MongoDB validation error:', JSON.stringify(error.errInfo, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Document validation failed - data does not match schema requirements',
        error: error.errmsg,
        details: error.errInfo
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error saving tobacco consumption data',
      error: error.message
    });
  }
});

// GET - Retrieve tobacco consumption data for a specific patient
router.get('/:patientId/tobacco-consumption', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).select('social_history.tobacco_consumption');

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: patient.social_history?.tobacco_consumption || {}
    });
  } catch (error) {
    console.error('Error fetching tobacco consumption data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tobacco consumption data',
      error: error.message
    });
  }
});

// PUT - Update tobacco consumption data for a specific patient
router.put('/:patientId/tobacco-consumption', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, dailyConsumption, duration, durationUnit, quitDate, notes } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Current status is required'
      });
    }

    // Prepare update data - only include fields with valid values
    const tobaccoConsumptionData = {
      current_status: status
    };

    // Only add fields if they have valid values
    if (dailyConsumption && dailyConsumption !== '') {
      tobaccoConsumptionData.average_daily_consumption = parseInt(dailyConsumption);
    }

    if (duration && duration !== '') {
      tobaccoConsumptionData.duration_of_use = duration.toString();
    }

    if (durationUnit && durationUnit !== '') {
      tobaccoConsumptionData.duration_unit = durationUnit;
    }

    // Only add quit_date if it's not empty (empty string fails regex validation)
    if (quitDate && quitDate.trim() !== '') {
      tobaccoConsumptionData.quit_date = quitDate;
    }

    if (notes && notes !== '') {
      tobaccoConsumptionData.notes = notes;
    }

    console.log('Processed tobacco consumption data:', tobaccoConsumptionData);

    // Update patient's tobacco consumption information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.tobacco_consumption': tobaccoConsumptionData },
      { new: true, runValidators: true }
    ).select('social_history.tobacco_consumption');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tobacco consumption information updated successfully',
      data: updatedPatient.social_history?.tobacco_consumption
    });
  } catch (error) {
    console.error('Error updating tobacco consumption data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
        details: error.errors
      });
    }

    // Handle MongoDB schema validation errors (code 121)
    if (error.code === 121) {
      console.error('MongoDB validation error:', JSON.stringify(error.errInfo, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Document validation failed - data does not match schema requirements',
        error: error.errmsg,
        details: error.errInfo
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating tobacco consumption data',
      error: error.message
    });
  }
});

// DELETE - Remove tobacco consumption data for a specific patient
router.delete('/:patientId/tobacco-consumption', async (req, res) => {
  try {
    const { patientId } = req.params;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $unset: { 'social_history.tobacco_consumption': '' } },
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
      message: 'Tobacco consumption information deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tobacco consumption data:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tobacco consumption data',
      error: error.message
    });
  }
});

// POST - Create/Update exposure to violence data for a specific patient
router.post('/:patientId/exposure-to-violence', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { typeOfViolence, lastExposure, supportReceived, notes } = req.body;

    // Prepare update data - only include fields with valid values
    const exposureToViolenceData = {};

    if (typeOfViolence !== undefined) {
      exposureToViolenceData.type_of_violence = typeOfViolence || '';
    }

    // Convert date from YYYY-MM-DD to MM-DD-YYYY format
    if (lastExposure && lastExposure.trim() !== '') {
      // Check if date is in YYYY-MM-DD format
      const dateMatch = lastExposure.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (dateMatch) {
        // Convert to MM-DD-YYYY
        const [, year, month, day] = dateMatch;
        exposureToViolenceData.date_of_last_exposure = `${month}-${day}-${year}`;
      } else {
        // If already in MM-DD-YYYY format, use as is
        exposureToViolenceData.date_of_last_exposure = lastExposure;
      }
    }

    if (supportReceived !== undefined) {
      exposureToViolenceData.support_or_intervention_received = supportReceived || '';
    }

    if (notes !== undefined) {
      exposureToViolenceData.notes = notes || '';
    }

    console.log('Processed exposure to violence data:', exposureToViolenceData);

    // Update patient's exposure to violence information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.exposure_to_violence': exposureToViolenceData },
      { new: true, runValidators: true }
    ).select('social_history.exposure_to_violence');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exposure to violence information saved successfully',
      data: updatedPatient.social_history?.exposure_to_violence
    });
  } catch (error) {
    console.error('Error saving exposure to violence data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
        details: error.errors
      });
    }

    // Handle MongoDB schema validation errors (code 121)
    if (error.code === 121) {
      console.error('MongoDB validation error:', JSON.stringify(error.errInfo, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Document validation failed - data does not match schema requirements',
        error: error.errmsg,
        details: error.errInfo
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error saving exposure to violence data',
      error: error.message
    });
  }
});

// GET - Retrieve exposure to violence data for a specific patient
router.get('/:patientId/exposure-to-violence', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).select('social_history.exposure_to_violence');

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    // Convert date from MM-DD-YYYY to YYYY-MM-DD for the date input
    let responseData = patient.social_history?.exposure_to_violence || {};
    if (responseData.date_of_last_exposure) {
      const dateMatch = responseData.date_of_last_exposure.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (dateMatch) {
        const [, month, day, year] = dateMatch;
        responseData = {
          ...responseData,
          date_of_last_exposure: `${year}-${month}-${day}`
        };
      }
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching exposure to violence data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exposure to violence data',
      error: error.message
    });
  }
});

// PUT - Update exposure to violence data for a specific patient
router.put('/:patientId/exposure-to-violence', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { typeOfViolence, lastExposure, supportReceived, notes } = req.body;

    // Prepare update data - only include fields with valid values
    const exposureToViolenceData = {};

    if (typeOfViolence !== undefined) {
      exposureToViolenceData.type_of_violence = typeOfViolence || '';
    }

    // Convert date from YYYY-MM-DD to MM-DD-YYYY format
    if (lastExposure && lastExposure.trim() !== '') {
      // Check if date is in YYYY-MM-DD format
      const dateMatch = lastExposure.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (dateMatch) {
        // Convert to MM-DD-YYYY
        const [, year, month, day] = dateMatch;
        exposureToViolenceData.date_of_last_exposure = `${month}-${day}-${year}`;
      } else {
        // If already in MM-DD-YYYY format, use as is
        exposureToViolenceData.date_of_last_exposure = lastExposure;
      }
    }

    if (supportReceived !== undefined) {
      exposureToViolenceData.support_or_intervention_received = supportReceived || '';
    }

    if (notes !== undefined) {
      exposureToViolenceData.notes = notes || '';
    }

    console.log('Processed exposure to violence data:', exposureToViolenceData);

    // Update patient's exposure to violence information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.exposure_to_violence': exposureToViolenceData },
      { new: true, runValidators: true }
    ).select('social_history.exposure_to_violence');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exposure to violence information updated successfully',
      data: updatedPatient.social_history?.exposure_to_violence
    });
  } catch (error) {
    console.error('Error updating exposure to violence data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
        details: error.errors
      });
    }

    // Handle MongoDB schema validation errors (code 121)
    if (error.code === 121) {
      console.error('MongoDB validation error:', JSON.stringify(error.errInfo, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Document validation failed - data does not match schema requirements',
        error: error.errmsg,
        details: error.errInfo
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating exposure to violence data',
      error: error.message
    });
  }
});

// DELETE - Remove exposure to violence data for a specific patient
router.delete('/:patientId/exposure-to-violence', async (req, res) => {
  try {
    const { patientId } = req.params;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $unset: { 'social_history.exposure_to_violence': '' } },
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
      message: 'Exposure to violence information deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting exposure to violence data:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting exposure to violence data',
      error: error.message
    });
  }
});

// POST - Create/Update education data for a specific patient
router.post('/:patientId/education', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { highestEducation, notes } = req.body;

    // Validate required fields
    if (!highestEducation) {
      return res.status(400).json({
        success: false,
        message: 'Highest level of education is required'
      });
    }

    // Prepare update data with correct nested path
    const educationData = {
      highest_level_of_education: highestEducation,
      notes: notes || ''
    };

    // Update patient's education information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.education': educationData },
      { new: true, runValidators: true }
    ).select('social_history.education');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Education information saved successfully',
      data: updatedPatient.social_history?.education
    });
  } catch (error) {
    console.error('Error saving education data:', error);
    
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
      message: 'Error saving education data',
      error: error.message
    });
  }
});

// GET - Retrieve education data for a specific patient
router.get('/:patientId/education', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).select('social_history.education');

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: patient.social_history?.education || {}
    });
  } catch (error) {
    console.error('Error fetching education data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching education data',
      error: error.message
    });
  }
});

// PUT - Update education data for a specific patient
router.put('/:patientId/education', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { highestEducation, notes } = req.body;

    // Validate required fields
    if (!highestEducation) {
      return res.status(400).json({
        success: false,
        message: 'Highest level of education is required'
      });
    }

    // Prepare update data with correct nested path
    const educationData = {
      highest_level_of_education: highestEducation,
      notes: notes || ''
    };

    // Update patient's education information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.education': educationData },
      { new: true, runValidators: true }
    ).select('social_history.education');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Education information updated successfully',
      data: updatedPatient.social_history?.education
    });
  } catch (error) {
    console.error('Error updating education data:', error);
    
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
      message: 'Error updating education data',
      error: error.message
    });
  }
});

// DELETE - Remove education data for a specific patient
router.delete('/:patientId/education', async (req, res) => {
  try {
    const { patientId } = req.params;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $unset: { 'social_history.education': '' } },
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
      message: 'Education information deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting education data:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting education data',
      error: error.message
    });
  }
});

// POST - Create/Update social isolation and connection data for a specific patient
router.post('/:patientId/social-isolation', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { isolationStatus, socialSupport, interactions, notes } = req.body;

    // Prepare update data - nested under social_history
    const socialIsolationData = {
      isolation_status: isolationStatus || '',
      social_support: socialSupport || '',
      frequency_of_social_interactions: interactions || '',
      notes: notes || ''
    };

    console.log('Processed social isolation data:', socialIsolationData);

    // Update patient's social isolation information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.social_isolation_connection': socialIsolationData },
      { new: true, runValidators: true }
    ).select('social_history.social_isolation_connection');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Social isolation information saved successfully',
      data: updatedPatient.social_history?.social_isolation_connection
    });
  } catch (error) {
    console.error('Error saving social isolation data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
        details: error.errors
      });
    }

    // Handle MongoDB schema validation errors (code 121)
    if (error.code === 121) {
      console.error('MongoDB validation error:', JSON.stringify(error.errInfo, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Document validation failed - data does not match schema requirements',
        error: error.errmsg,
        details: error.errInfo
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error saving social isolation data',
      error: error.message
    });
  }
});

// GET - Retrieve social isolation and connection data for a specific patient
router.get('/:patientId/social-isolation', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).select('social_history.social_isolation_connection');

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: patient.social_history?.social_isolation_connection || {}
    });
  } catch (error) {
    console.error('Error fetching social isolation data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching social isolation data',
      error: error.message
    });
  }
});

// PUT - Update social isolation and connection data for a specific patient
router.put('/:patientId/social-isolation', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { isolationStatus, socialSupport, interactions, notes } = req.body;

    // Prepare update data - nested under social_history
    const socialIsolationData = {
      isolation_status: isolationStatus || '',
      social_support: socialSupport || '',
      frequency_of_social_interactions: interactions || '',
      notes: notes || ''
    };

    console.log('Processed social isolation data:', socialIsolationData);

    // Update patient's social isolation information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.social_isolation_connection': socialIsolationData },
      { new: true, runValidators: true }
    ).select('social_history.social_isolation_connection');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Social isolation information updated successfully',
      data: updatedPatient.social_history?.social_isolation_connection
    });
  } catch (error) {
    console.error('Error updating social isolation data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
        details: error.errors
      });
    }

    // Handle MongoDB schema validation errors (code 121)
    if (error.code === 121) {
      console.error('MongoDB validation error:', JSON.stringify(error.errInfo, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Document validation failed - data does not match schema requirements',
        error: error.errmsg,
        details: error.errInfo
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating social isolation data',
      error: error.message
    });
  }
});

// DELETE - Remove social isolation and connection data for a specific patient
router.delete('/:patientId/social-isolation', async (req, res) => {
  try {
    const { patientId } = req.params;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $unset: { 'social_history.social_isolation_connection': '' } },
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
      message: 'Social isolation information deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting social isolation data:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting social isolation data',
      error: error.message
    });
  }
});

// POST - Create/Update nutrients history data for a specific patient
router.post('/:patientId/nutrients-history', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { dietaryPreferences, supplementUsage, notes } = req.body;

    // Prepare update data - nested under social_history
    const nutrientsHistoryData = {
      dietary_preferences: dietaryPreferences || '',
      supplement_usage: supplementUsage || '',
      notes: notes || ''
    };

    console.log('Processed nutrients history data:', nutrientsHistoryData);

    // Update patient's nutrients history information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.nutrients_history': nutrientsHistoryData },
      { new: true, runValidators: true }
    ).select('social_history.nutrients_history');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Nutrients history information saved successfully',
      data: updatedPatient.social_history?.nutrients_history
    });
  } catch (error) {
    console.error('Error saving nutrients history data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
        details: error.errors
      });
    }

    // Handle MongoDB schema validation errors (code 121)
    if (error.code === 121) {
      console.error('MongoDB validation error:', JSON.stringify(error.errInfo, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Document validation failed - data does not match schema requirements',
        error: error.errmsg,
        details: error.errInfo
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error saving nutrients history data',
      error: error.message
    });
  }
});

// GET - Retrieve nutrients history data for a specific patient
router.get('/:patientId/nutrients-history', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).select('social_history.nutrients_history');

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: patient.social_history?.nutrients_history || {}
    });
  } catch (error) {
    console.error('Error fetching nutrients history data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nutrients history data',
      error: error.message
    });
  }
});

// PUT - Update nutrients history data for a specific patient
router.put('/:patientId/nutrients-history', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { dietaryPreferences, supplementUsage, notes } = req.body;

    // Prepare update data - nested under social_history
    const nutrientsHistoryData = {
      dietary_preferences: dietaryPreferences || '',
      supplement_usage: supplementUsage || '',
      notes: notes || ''
    };

    console.log('Processed nutrients history data:', nutrientsHistoryData);

    // Update patient's nutrients history information under social_history
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 'social_history.nutrients_history': nutrientsHistoryData },
      { new: true, runValidators: true }
    ).select('social_history.nutrients_history');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Nutrients history information updated successfully',
      data: updatedPatient.social_history?.nutrients_history
    });
  } catch (error) {
    console.error('Error updating nutrients history data:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
        details: error.errors
      });
    }

    // Handle MongoDB schema validation errors (code 121)
    if (error.code === 121) {
      console.error('MongoDB validation error:', JSON.stringify(error.errInfo, null, 2));
      return res.status(400).json({
        success: false,
        message: 'Document validation failed - data does not match schema requirements',
        error: error.errmsg,
        details: error.errInfo
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating nutrients history data',
      error: error.message
    });
  }
});

// DELETE - Remove nutrients history data for a specific patient
router.delete('/:patientId/nutrients-history', async (req, res) => {
  try {
    const { patientId } = req.params;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $unset: { 'social_history.nutrients_history': '' } },
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
      message: 'Nutrients history information deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting nutrients history data:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting nutrients history data',
      error: error.message
    });
  }
});

export default router;
