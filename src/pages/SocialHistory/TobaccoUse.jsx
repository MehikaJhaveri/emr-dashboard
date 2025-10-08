import React, { useState, useEffect } from "react";
import { useSocialHistory } from "./SocialHistoryContext";
import "./TobaccoUse.css";

const TobaccoUse = ({ onClose }) => {
  const { updateTobaccoUse } = useSocialHistory();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    status: "Never Smoked",
    dailyConsumption: "",
    duration: "",
    durationUnit: "years",
    quitDate: "",
    notes: "",
  });

  // Fetch existing tobacco smoking data on component mount
  useEffect(() => {
    const fetchTobaccoData = async () => {
      const patientId = localStorage.getItem("currentPatientId");
      
      if (!patientId) {
        console.log("No patient ID found in localStorage");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching tobacco data for patient:", patientId);
        const response = await fetch(`http://localhost:5000/api/social-history/${patientId}/tobacco-smoking`);
        
        console.log("Response status:", response.status);
        
        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON. Content-Type:", contentType);
          const text = await response.text();
          console.error("Response body:", text);
          setIsLoading(false);
          return;
        }

        const result = await response.json();
        console.log("Loaded tobacco data:", result);

        if (response.ok && result.success && result.data) {
          setFormData({
            status: result.data.current_status || "Never Smoked",
            dailyConsumption: result.data.average_daily_consumption || "",
            duration: result.data.duration_of_use || "",
            durationUnit: result.data.duration_unit || "years",
            quitDate: result.data.quit_date || "",
            notes: result.data.notes || ""
          });
        }
      } catch (error) {
        console.error("Error fetching tobacco smoking data:", error);
        alert("Error loading tobacco data. Please check console for details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTobaccoData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const patientId = localStorage.getItem("currentPatientId");

    if (!patientId) {
      alert("No patient selected. Please complete Patient Demographics first.");
      return;
    }

    setIsSaving(true);

    try {
      const tobaccoData = {
        status: formData.status,
        dailyConsumption: formData.dailyConsumption,
        duration: formData.duration,
        durationUnit: formData.durationUnit,
        quitDate: formData.quitDate,
        notes: formData.notes
      };

      console.log('Sending tobacco smoking data:', tobaccoData);
      console.log('To URL:', `http://localhost:5000/api/social-history/${patientId}/tobacco-smoking`);

      const response = await fetch(`http://localhost:5000/api/social-history/${patientId}/tobacco-smoking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tobaccoData),
      });

      console.log("Response status:", response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON. Content-Type:", contentType);
        const text = await response.text();
        console.error("Response body:", text);
        alert("Server error: Received invalid response. Check console for details.");
        return;
      }

      const result = await response.json();
      console.log("Save response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to save tobacco data");
      }

      // Update context
      updateTobaccoUse(tobaccoData);
      
      console.log("Tobacco data saved successfully:", result.data);
      alert('Tobacco smoking information saved successfully!');
      
      // Close the panel after successful save
      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error("Error saving tobacco data:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="tobacco-use-panel">
        <div className="panel-header">
          <h3>Tobacco Use(Smoking)</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="tobacco-use-panel">
      <div className="panel-header">
        <h3>Tobacco Use(Smoking)</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="form-group">
        <label>Current Status</label>
        <select 
          name="status" 
          value={formData.status} 
          onChange={handleInputChange}
          disabled={isSaving}
        >
          <option>Current Smoker</option>
          <option>Former Smoker</option>
          <option>Never Smoked</option>
        </select>
      </div>

      {(formData.status === "Current Smoker" || formData.status === "Former Smoker") && (
        <>
          <div className="form-group">
            <label>Average Daily Consumption</label>
            <input
              type="number"
              name="dailyConsumption"
              value={formData.dailyConsumption}
              onChange={handleInputChange}
              placeholder="Number of cigarettes per day"
              disabled={isSaving}
            />
          </div>

          <div className="form-group duration-group">
            <label>Duration of Use</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Duration"
                disabled={isSaving}
              />
              <select 
                name="durationUnit" 
                value={formData.durationUnit} 
                onChange={handleInputChange}
                disabled={isSaving}
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>

          {formData.status === "Former Smoker" && (
            <div className="form-group">
              <label>Quit Date</label>
              <input
                type="date"
                name="quitDate"
                value={formData.quitDate}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </div>
          )}
        </>
      )}

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Additional notes about tobacco use..."
          disabled={isSaving}
        />
      </div>

      <div className="tobacco-buttons">
        <button 
          onClick={handleSave} 
          className="save-btn"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Tobacco Data"}
        </button>
      </div>
    </div>
  );
};

export default TobaccoUse;
