// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import patientDemographicsRoutes from "./routes/patientDemographics.js";
import contactInformationRoutes from "./routes/contactInformation.js";
import insuranceInformationRoutes from "./routes/insuranceInformation.js"
import ailmentsRoutes from "./routes/ailments.js";
import assessmentRoutes from "./routes/assessment.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded images)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/patient-demographics', patientDemographicsRoutes);
app.use('/api/contact-information', contactInformationRoutes);
app.use('/api/insurance', insuranceInformationRoutes);
app.use('/api/ailments', ailmentsRoutes);
app.use('/api/assessment', assessmentRoutes);


// Root route
app.get('/', (req, res) => {
  res.json({
    message: "EMR Server is running",
    endpoints: {
      patientDemographics: "/api/patient-demographics",
      contactInformation: "/api/contact-information"
    }
  });
});

// Start server and connect to DB
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB, server not started:', err);
    process.exit(1);
  });