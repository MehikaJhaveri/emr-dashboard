// App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import PatientDemographics from './pages/PatientDemographics/PatientDemographics';
import ContactInformation from './pages/ContactInformation/ContactInformation';
import InsuranceInformation from "./pages/InsuranceInformation/InsuranceInformation";
import Allergies from './pages/Allergies/Allergies';
import FamilyHistory from './pages/FamilyHistory/FamilyHistory';
import SocialHistory from './pages/SocialHistory/SocialHistory';
import Preview from './pages/Preview/Preview';
import Consent from './pages/Consent/Consent';
import SocialHistoryPreview from './pages/SocialHistory/SocialHistoryPreview';

// ✅ New nurse dashboard import
import NurseDashboard from './pages/NurseDashboard/NurseDashboard';
import NewVisit from './pages/NurseDashboard/NewVisit';
import NewAppointment from './pages/NurseDashboard/NewAppointment';
import PatientDetail from './pages/NurseDashboard/PatientDetail';
import TableDashboard from './pages/NurseDashboard/TableDashboard';
import PatientEdit from './pages/NurseDashboard/PatientEdit';

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Dashboard flow for adding new patients */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<PatientDemographics />} />
        <Route path="patient-demographics" element={<PatientDemographics />} />
        <Route path="contact-information" element={<ContactInformation />} />
        <Route path="insurance-information" element={<InsuranceInformation />} />
        <Route path="allergies" element={<Allergies />} />
        <Route path="family-history" element={<FamilyHistory />} />
        <Route path="social-history" element={<SocialHistory />} />
        <Route path="preview" element={<Preview />} />
        <Route path="consent" element={<Consent />} />
        <Route path="social-history-preview" element={<SocialHistoryPreview />} />
      </Route>

      {/* ✅ New nurse dashboard route */}
      <Route path="/nurse-dashboard" element={<NurseDashboard />} />
      <Route path="/new-visit" element={<NewVisit />} />
      <Route path="/new-appointment" element={<NewAppointment />} />
      <Route path="/table-dashboard" element={<TableDashboard />} />
      <Route path="/patient/:id" element={<PatientDetail />} />
      <Route path="/patient/:id/edit" element={<PatientEdit />} />

    </Routes>
  );
}

export default App;
