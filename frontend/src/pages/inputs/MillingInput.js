import React, { useState } from 'react';
import axios from 'axios';
import '../../MillingTimeEstimator.css'; // Import the scoped CSS file

const MillingTimeEstimator = () => {
  const [gcode, setGcode] = useState('');
  const [feed, setFeed] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://your-backend.onrender.com/api/milling-time', {
        gcode,
        feed
      });
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Error calculating milling time.");
    }
  };

  return (
    <div className="milling-container">
      <h2 className="milling-title">Milling Machine Time Estimator</h2>

      <form onSubmit={handleSubmit} className="milling-form">
        <textarea
          rows={10}
          className="milling-textarea"
          placeholder="Paste your G-code here..."
          value={gcode}
          onChange={(e) => setGcode(e.target.value)}
          required
        />
        <input
          type="number"
          className="milling-input"
          placeholder="Feed of table (mm/hr)"
          value={feed}
          onChange={(e) => setFeed(e.target.value)}
          required
        />
        <button type="submit" className="milling-button">
          Calculate
        </button>
      </form>

      {result && (
        <div className="milling-result">
          <p><strong>Total Tool Travel Distance:</strong> {result.tool_travel} mm</p>
          <p><strong>Feed Rate:</strong> {result.feed_rate} mm/hr</p>
          <p className="milling-time"><strong>⏱️ Machining Time:</strong> {result.machining_time} hours</p>
        </div>
      )}
    </div>
  );
};

export default MillingTimeEstimator;
