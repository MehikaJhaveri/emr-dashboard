//routes/contactInformation.js

import express from "express";
import Patient from "../models/patients.js";

const router = express.Router();

// Helper function to parse phone number - handles both string and object formats
const parsePhoneNumber = (phone) => {
  if (!phone) return null;
  
  // If it's already an object with code and number, return it
  if (typeof phone === 'object' && phone.code && phone.number) {
    return {
      code: phone.code,
      number: phone.number
    };
  }
  
  // If it's a string, parse it
  if (typeof phone === 'string') {
    // Remove any spaces, dashes, or parentheses
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // If it starts with +, extract country code
    if (cleaned.startsWith('+')) {
      const match = cleaned.match(/^\+(\d{1,3})(\d{7,10})$/);
      if (match) {
        return {
          code: `+${match[1]}`,
          number: match[2]
        };
      }
    }
    
    // Default to +91 for Indian numbers
    return {
      code: '+91',
      number: cleaned.slice(-10) // Take last 10 digits
    };
  }
  
  return null;
};

// Helper function to capitalize preferred contact methods to match schema enum
const normalizeContactMethod = (method) => {
  const methodMap = {
    'phone': 'Phone Call',
    'messages': 'Messages',
    'email': 'Email',
    'phone call': 'Phone Call'
  };
  return methodMap[method.toLowerCase()] || method;
};

// POST - Update contact information for a patient
router.post("/", async (req, res) => {
  try {
    const {
      patient_id,
      mobilePhone,
      homePhone,
      workPhone,
      email,
      preferredContactMethod,
      emergencyContacts
    } = req.body;

    // Validate required fields
    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: "patient_id is required"
      });
    }

    if (!mobilePhone || !email) {
      return res.status(400).json({
        success: false,
        message: "Mobile phone and email are required"
      });
    }

    // Find the patient
    const patient = await Patient.findById(patient_id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    // Parse phone numbers
    const mobileParsed = parsePhoneNumber(mobilePhone);
    const homeParsed = parsePhoneNumber(homePhone);
    const workParsed = parsePhoneNumber(workPhone);

    // Build contact_info object
    const contactInfo = {
      mobile: mobileParsed,
      email: email,
      preferred_contact_methods: Array.isArray(preferredContactMethod) 
        ? preferredContactMethod.map(normalizeContactMethod)
        : []
    };

    // Add optional phone numbers if provided
    if (homeParsed) {
      contactInfo.home_phone = homeParsed;
    }

    if (workParsed) {
      contactInfo.work_phone = workParsed;
    }

    // Process emergency contacts
    if (Array.isArray(emergencyContacts) && emergencyContacts.length > 0) {
      contactInfo.emergency_contact = emergencyContacts
        .filter(contact => contact.firstName && contact.lastName && contact.phone)
        .map(contact => {
          const emergencyPhoneParsed = parsePhoneNumber(contact.phone);
          
          return {
            name: {
              first: contact.firstName,
              middle: contact.middleName || "",
              last: contact.lastName
            },
            relationship: contact.relationship || "Unknown",
            phone: emergencyPhoneParsed,
            email: contact.email || ""
          };
        });
    } else {
      contactInfo.emergency_contact = [];
    }

    // Update the patient's contact_info
    patient.contact_info = contactInfo;

    // Save the updated patient
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Contact information updated successfully",
      data: {
        id: patient._id,
        contact_info: patient.contact_info
      }
    });

  } catch (error) {
    console.error("Error updating contact information:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors,
      });
    }

    // Handle cast errors (invalid ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update contact information",
      error: error.message,
    });
  }
});

// GET - Retrieve contact information for a specific patient
router.get("/:patient_id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patient_id).select('contact_info name');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: patient._id,
        name: patient.name,
        contact_info: patient.contact_info
      }
    });

  } catch (error) {
    console.error("Error fetching contact information:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch contact information",
      error: error.message
    });
  }
});

// PUT - Update contact information for a specific patient
router.put("/:patient_id", async (req, res) => {
  try {
    const {
      mobilePhone,
      homePhone,
      workPhone,
      email,
      preferredContactMethod,
      emergencyContacts
    } = req.body;

    const patient = await Patient.findById(req.params.patient_id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    // Parse phone numbers - handles both string and object formats
    if (mobilePhone) {
      const mobileParsed = parsePhoneNumber(mobilePhone);
      if (mobileParsed) {
        patient.contact_info.mobile = mobileParsed;
      }
    }

    if (email) {
      patient.contact_info.email = email;
    }

    if (homePhone) {
      const homeParsed = parsePhoneNumber(homePhone);
      if (homeParsed) {
        patient.contact_info.home_phone = homeParsed;
      }
    }

    if (workPhone) {
      const workParsed = parsePhoneNumber(workPhone);
      if (workParsed) {
        patient.contact_info.work_phone = workParsed;
      }
    }

    if (Array.isArray(preferredContactMethod)) {
      patient.contact_info.preferred_contact_methods = preferredContactMethod.map(normalizeContactMethod);
    }

    // Update emergency contacts
    if (Array.isArray(emergencyContacts)) {
      patient.contact_info.emergency_contact = emergencyContacts
        .filter(contact => contact.firstName && contact.lastName && contact.phone)
        .map(contact => {
          const emergencyPhoneParsed = parsePhoneNumber(contact.phone);
          
          return {
            name: {
              first: contact.firstName,
              middle: contact.middleName || "",
              last: contact.lastName
            },
            relationship: contact.relationship || "Unknown",
            phone: emergencyPhoneParsed,
            email: contact.email || ""
          };
        });
    }

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Contact information updated successfully",
      data: {
        id: patient._id,
        contact_info: patient.contact_info
      }
    });

  } catch (error) {
    console.error("Error updating contact information:", error);

    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update contact information",
      error: error.message
    });
  }
});

export default router;