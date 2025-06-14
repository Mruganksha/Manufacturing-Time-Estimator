import React, { useState } from 'react';
import axios from 'axios';

const MillingTimeEstimator = () => {
  const [gcode, setGcode] = useState('');
  const [feed, setFeed] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/milling-time', {
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
    <div className="p-6 max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-700">Milling Machine Time Estimator</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={10}
          className="w-full p-3 border rounded font-mono"
          placeholder="Paste your G-code here..."
          value={gcode}
          onChange={(e) => setGcode(e.target.value)}
          required
        />
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Feed of table (mm/hr)"
          value={feed}
          onChange={(e) => setFeed(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Calculate
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-sm">
          <p><strong>Total Tool Travel Distance:</strong> {result.tool_travel} mm</p>
          <p><strong>Feed Rate:</strong> {result.feed_rate} mm/hr</p>
          <p className="text-green-700 font-semibold"><strong>⏱️ Machining Time:</strong> {result.machining_time} hours</p>
        </div>
      )}
    </div>
  );
};

export default MillingTimeEstimator;
