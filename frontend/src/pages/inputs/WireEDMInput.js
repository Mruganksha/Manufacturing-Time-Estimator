import React, { useState } from 'react';
import axios from 'axios';

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
      const res = await axios.post('http://localhost:5000/api/wire-edm-time', form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to calculate time. Check server.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded px-4 py-4">
      <h2 className="text-xl font-semibold mb-4">Wire EDM Time Estimator</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
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
            <label className="block text-sm">{label}</label>
            <input
              type="number"
              name={name}
              value={form[name]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-2 py-1 rounded"
              step="any"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Calculate
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold text-lg mb-2">--- Machining Time Report ---</h3>
          <p>Cutting Area per Piece: {result.cutting_area_per_piece} mm²</p>
          <p>Total Cutting Area: {result.total_cutting_area} mm²</p>
          <p>Cutting Time: {result.cutting_time} hours</p>
          <p>Hole Shifting Time: {result.shift_time} hours</p>
          <p>Setup Time: {result.setup_time} hours</p>
          <p className="font-semibold">Total Machining Time: {result.total_time} hours</p>
        </div>
      )}
    </div>
  );
};

export default WireEDMInput;
