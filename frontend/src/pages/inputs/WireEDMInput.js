import React, { useState } from 'react';
import axios from 'axios';
import '../../WireEDMInput.css'; // Import the scoped CSS file

const WireEDMInput = () => {
  const [form, setForm] = useState({
    num_items: '',
    path_length: '',
    insert_height: '',
    num_passes: '',
    approach: '',
    num_holes: '',
    setup_time: ''
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/wire-edm-time`, form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to calculate time. Check server.");
    }
  };

  return (
    <div className="wire-edm-container">
      <h2 className="wire-edm-title">Wire EDM Time Estimator</h2>
      <form onSubmit={handleSubmit} className="wire-edm-form">
        {[
          ["num_items", "Number of Items"],
          ["path_length", "Path Length (mm)"],
          ["insert_height", "Insert Height (mm)"],
          ["num_passes", "Number of Passes (1-3)"],
          ["approach", "Approach (mm)"],
          ["num_holes", "Number of Holes per Item"],
          ["setup_time", "Setup Time (hours)"]
        ].map(([name, label]) => (
          <div key={name}>
            <label className="wire-edm-label">{label}</label>
            <input
              type="number"
              name={name}
              value={form[name]}
              onChange={handleChange}
              required
              className="wire-edm-input"
              step="any"
            />
          </div>
        ))}
        <button type="submit" className="wire-edm-button">Calculate</button>
      </form>

      {result && (
        <div className="wire-edm-result">
          <h3>--- Machining Time Report ---</h3>
          <p>Cutting Area per Piece: {result.cutting_area_per_piece} mm²</p>
          <p>Total Cutting Area: {result.total_cutting_area} mm²</p>
          <p>Cutting Time: {result.cutting_time} hours</p>
          <p>Hole Shifting Time: {result.shift_time} hours</p>
          <p>Setup Time: {result.setup_time} hours</p>
          <p><strong>Total Machining Time: {result.total_time} hours</strong></p>
        </div>
      )}
    </div>
  );
};

export default WireEDMInput;
