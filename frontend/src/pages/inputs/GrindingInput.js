
import React, { useState } from "react";
import axios from "axios";
import "../../GrindingInput.css"; // scoped styles

const GrindingInput = () => {
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    feed: "",
    total_depth: "",
    depth_of_cut: "",
    table_speed: "",
    setting_time: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("https://your-backend.onrender.com/api/grinding-time", inputs);
      setResult(response.data);
    } catch (err) {
      setError("Error calculating grinding time. Please check your input.");
      console.error(err);
    }
  };

  return (
    <div className="grinding-container">
      <div className="grinding-card">
        <h2 className="grinding-title">Grinding Time Estimator</h2>
        <form onSubmit={handleSubmit} className="grinding-form">
          {[
            { name: "length", label: "Length (mm)" },
            { name: "width", label: "Width (mm)" },
            { name: "feed", label: "Feed (mm/pass)" },
            { name: "total_depth", label: "Total Depth to Remove (mm)" },
            { name: "depth_of_cut", label: "Depth of Cut per Pass (mm)" },
            { name: "table_speed", label: "Table Speed (mm/min)" },
            { name: "setting_time", label: "Setting Time (minutes)" },
          ].map((field) => (
            <div key={field.name}>
              <label className="grinding-label">{field.label}</label>
              <input
                type="number"
                name={field.name}
                value={inputs[field.name]}
                onChange={handleChange}
                step="any"
                required
                className="grinding-input"
              />
            </div>
          ))}
          <button type="submit" className="grinding-button">Calculate</button>
        </form>

        {error && <p className="grinding-error">{error}</p>}

        {result && (
          <div className="grinding-result">
            <h3>Result</h3>
            <p>Time per Pass: {result.time_per_pass} minutes</p>
            <p>Number of Passes: {result.number_of_passes}</p>
            <p>Total Cuts: {result.total_cuts}</p>
            <p>Total Time (minutes): {result.total_time_minutes}</p>
            <p><strong>Total Time (hours): {result.total_time_hours}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrindingInput;
