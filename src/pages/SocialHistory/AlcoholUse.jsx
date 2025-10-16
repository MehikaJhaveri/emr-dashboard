import React, { useState } from "react";
import { useSocialHistory } from "./SocialHistoryContext";
import "./AlcoholUse.css";

const AlcoholUse = ({ onClose }) => {
  const { updateAlcoholUse } = useSocialHistory();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    status: "Moderate Drinker",
    weeklyConsumption: "",
    alcoholType: "Red wine",
    period: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Get patientId from localStorage
    const patientId = localStorage.getItem("currentPatientId");

    if (!patientId) {
      alert("No patient selected. Please complete Patient Demographics first.");
      return;
    }

    setIsSaving(true);

    try {
      const alcoholData = {
        status: formData.status,
        weeklyConsumption: formData.weeklyConsumption,
        alcoholType: formData.alcoholType,
        period: formData.period,
        notes: formData.notes
      };

      console.log('Sending alcohol data:', alcoholData);

      // Save to backend using patientId
      const response = await fetch(`http://localhost:5000/api/social-history/${patientId}/alcohol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alcoholData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save alcohol data");
      }

      // Update context
      updateAlcoholUse(alcoholData);
      
      console.log("Alcohol data saved:", alcoholData);
      alert('Alcohol information saved successfully!');
      
      // Close the panel after successful save
      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error("Error saving alcohol data:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    console.log("Close button clicked!");
    console.log("onClose prop:", onClose);
    
    if (onClose) {
      console.log("Calling onClose function");
      onClose();
    } else {
      console.log("No onClose function provided!");
      alert("Close function not provided by parent component");
    }
  };

  return (
    <div className="alcohol-use-panel">
      <div className="panel-header">
        <h3>Alcohol Use</h3>
      </div>

      <div className="form-group">
        <label>Current Status</label>
        <select 
          name="status" 
          value={formData.status} 
          onChange={handleChange}
        >
          <option>Non-Drinker</option>
          <option>Moderate Drinker</option>
          <option>Heavy Drinker</option>
        </select>
      </div>

      <div className="form-group">
        <label>Average Weekly Consumption (drinks)</label>
        <input
          type="number"
          name="weeklyConsumption"
          value={formData.weeklyConsumption}
          onChange={handleChange}
          placeholder="e.g., 5"
        />
      </div>

      <div className="form-group">
        <label>Type of Alcohol</label>
        <select 
          name="alcoholType" 
          value={formData.alcoholType} 
          onChange={handleChange}
        >
          <option>Beer</option>
          <option>Wine</option>
          <option>Liquor/Spirits</option>
          <option>Mixed Drinks</option>
          <option>Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Period of Use</label>
        <input
          type="text"
          name="period"
          value={formData.period}
          onChange={handleChange}
          placeholder="e.g., 2 years"
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea 
          name="notes" 
          value={formData.notes} 
          onChange={handleChange}
          placeholder="Additional notes..."
        />
      </div>

      <div className="alcohol-buttons">
        <button 
          className="save-btn" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Alcohol Data"}
        </button>
      </div>
    </div>
  );
};

export default AlcoholUse;