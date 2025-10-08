import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Patient from "../models/patients.js";

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "patient-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, jpg, png, gif)"));
    }
  },
});

// Helper function to convert date format from YYYY-MM-DD to MM-DD-YYYY
const convertDateFormat = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${month}-${day}-${year}`;
};

// POST - Create new patient demographics
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      dob,
      gender,
      address1,
      address2,
      city,
      postalCode,
      district,
      state,
      country,
      bloodGroup,
      occupation,
      aadharNumber,
      panNumber,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !dob || !gender || !bloodGroup) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: firstName, lastName, dob, gender, and bloodGroup are required",
      });
    }

    // Validate address required fields
    if (!city || !postalCode || !district || !state) {
      return res.status(400).json({
        success: false,
        message: "Missing required address fields: city, postalCode, district, and state are required",
      });
    }

    // Map blood group display value to schema enum value
    const bloodGroupMap = {
      "A+": "A Positive (A⁺)",
      "A-": "A Negative (A⁻)",
      "B+": "B Positive (B⁺)",
      "B-": "B Negative (B⁻)",
      "AB+": "AB Positive (AB⁺)",
      "AB-": "AB Negative (AB⁻)",
      "O+": "O Positive (O⁺)",
      "O-": "O Negative (O⁻)",
      "None": "None",
    };

    // Prepare patient data according to schema
    const patientData = {
      name: {
        first: firstName,
        middle: middleName || "",
        last: lastName,
      },
      date_of_birth: convertDateFormat(dob),
      gender: gender,
      blood_group: bloodGroupMap[bloodGroup] || bloodGroup,
      address: {
        street: address1 || "",
        city: city,
        postal_code: postalCode,
        district: district,
        state: state,
        country: country || "India",
      },
    };

    // Add optional fields only if they exist
    if (occupation) {
      patientData.occupation = occupation;
    }

    if (aadharNumber) {
      patientData.aadhaar = aadharNumber;
    }

    if (panNumber) {
      patientData.pan = panNumber;
    }

    // Handle photo upload
    if (req.file) {
      const mongoose = await import("mongoose");
      patientData.img = {
        file_id: new mongoose.Types.ObjectId(),
      };
    }

    // Add placeholder data for required fields that aren't in demographics form
    patientData.contact_info = {
      mobile: {
        code: "+91",
        number: "0000000000"
      },
      email: "placeholder@example.com",
      preferred_contact_methods: ["Email"],
      emergency_contact: []
    };

    patientData.insurance = {
      primary: {
        company_name: "Not Provided",
        policy_number: "N/A",
        plan_type: "Other",
      },
      insurance_contact_number: "0000000000",
      insurance_card_img: {
        file_id: new (await import("mongoose")).Types.ObjectId()
      }
    };

    // Format date and time correctly for vitals
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    patientData.vitals = {
      date: `${day}-${month}-${year}`, // DD-MM-YYYY format
      time: `${hours}:${minutes}` // 24-hour HH:MM format
    };

    // Initialize empty social_history so it appears on creation
    // Initialize social_history with proper structure
    patientData.social_history = {
      tobacco_smoking: {},
      tobacco_consumption: {},
      alcohol_use: {},
      social_history_free_text: {
        notes: ""
      },
      financial_resources: {},
      education: {},
      physical_activity: {},
      stress: {},
      social_isolation_connection: {},
      exposure_to_violence: {},
      gender_identity: {},
      sexual_orientation: {},
      nutrients_history: {}
    };

    // Create new patient
    const newPatient = new Patient(patientData);
    await newPatient.save();

    res.status(201).json({
      success: true,
      message: "Patient demographics saved successfully",
      data: {
        id: newPatient._id,
        name: `${firstName} ${middleName} ${lastName}`.trim(),
        photoPath: req.file ? `/uploads/${req.file.filename}` : null,
      },
    });
  } catch (error) {
    console.error("Error saving patient demographics:", error);

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

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A patient with this information already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to save patient demographics",
      error: error.message,
    });
  }
});

// GET - Retrieve all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().select(
      "name date_of_birth gender blood_group contact_info.email"
    );

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: error.message,
    });
  }
});

// GET - Retrieve single patient by ID
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error("Error fetching patient:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch patient",
      error: error.message,
    });
  }
});

// PUT - Update patient demographics
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      dob,
      gender,
      address1,
      address2,
      city,
      postalCode,
      district,
      state,
      country,
      bloodGroup,
      occupation,
      aadharNumber,
      panNumber,
    } = req.body;

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Map blood group
    const bloodGroupMap = {
      "A+": "A Positive (A⁺)",
      "A-": "A Negative (A⁻)",
      "B+": "B Positive (B⁺)",
      "B-": "B Negative (B⁻)",
      "AB+": "AB Positive (AB⁺)",
      "AB-": "AB Negative (AB⁻)",
      "O+": "O Positive (O⁺)",
      "O-": "O Negative (O⁻)",
      "None": "None",
    };

    // Update fields
    if (firstName) patient.name.first = firstName;
    if (middleName !== undefined) patient.name.middle = middleName;
    if (lastName) patient.name.last = lastName;
    if (dob) patient.date_of_birth = convertDateFormat(dob);
    if (gender) patient.gender = gender;
    if (address1 !== undefined) patient.address.street = address1;
    if (city) patient.address.city = city;
    if (postalCode) patient.address.postal_code = postalCode;
    if (district) patient.address.district = district;
    if (state) patient.address.state = state;
    if (country) patient.address.country = country;
    if (bloodGroup) patient.blood_group = bloodGroupMap[bloodGroup] || bloodGroup;
    if (occupation) patient.occupation = occupation;
    if (aadharNumber) patient.aadhaar = aadharNumber;
    if (panNumber) patient.pan = panNumber;

    // Handle photo upload
    if (req.file) {
      const mongoose = await import("mongoose");
      patient.img = {
        file_id: new mongoose.Types.ObjectId(),
      };
    }

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient demographics updated successfully",
      data: patient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);

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

    res.status(500).json({
      success: false,
      message: "Failed to update patient demographics",
      error: error.message,
    });
  }
});

// DELETE - Delete patient
router.delete("/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting patient:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete patient",
      error: error.message,
    });
  }
});

export default router;