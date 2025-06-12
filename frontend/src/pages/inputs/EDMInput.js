import React, { useState } from 'react';
import axios from 'axios';

const EDMInput = () => {
  const [form, setForm] = useState({
    length: '',
    width: '',
    height: '',
    mrr: ''
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/edm-time', form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error calculating EDM time.");
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">EDM Time Estimator</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="length" type="number" placeholder="Length to remove (mm)" className="w-full p-2 border" onChange={handleChange} required />
        <input name="width" type="number" placeholder="Width to remove (mm)" className="w-full p-2 border" onChange={handleChange} required />
        <input name="height" type="number" placeholder="Height to remove (mm)" className="w-full p-2 border" onChange={handleChange} required />
        <input name="mrr" type="number" placeholder="Material Removal Rate (mm³/hr)" className="w-full p-2 border" onChange={handleChange} required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Calculate</button>
      </form>

      {result && (
        <div className="mt-5 bg-gray-100 p-3 rounded">
          <p><strong>Total Volume to Remove:</strong> {result.volume_to_remove} mm³</p>
          <p><strong>Total Machining Time:</strong> {result.total_time} hours</p>
        </div>
      )}
    </div>
  );
};

export default EDMInput;
