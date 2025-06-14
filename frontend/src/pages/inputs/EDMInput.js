import React, { useState } from 'react';
import axios from 'axios';

const EDMInput = () => {
  const [form, setForm] = useState({
    length: '',
    width: '',
    height: '',
    mrr: '',
    setup_time: ''
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/edm-time', {
        ...form,
        length: parseFloat(form.length),
        width: parseFloat(form.width),
        height: parseFloat(form.height),
        mrr: parseFloat(form.mrr),
        setup_time: parseFloat(form.setup_time)
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Error calculating EDM time. Please check your inputs and try again.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">EDM Time Estimator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="length" type="number" step="0.01" placeholder="Length to remove (mm)" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="width" type="number" step="0.01" placeholder="Width to remove (mm)" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="height" type="number" step="0.01" placeholder="Height to remove (mm)" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="mrr" type="number" step="0.01" placeholder="MRR (mm³/min)" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="setup_time" type="number" step="0.01" placeholder="Setup Time (mins)" className="w-full p-2 border rounded" onChange={handleChange} required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Calculate</button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-sm">
          <p><strong>Total Volume to Remove:</strong> {result.volume_to_remove} mm³</p>
          <p><strong>Machining Time:</strong> {result.machining_time_minutes} mins</p>
          <p><strong>Total Time (mins):</strong> {result.total_time_minutes} mins</p>
          <p className="text-blue-700 font-semibold"><strong>⏳ Total Time (hours):</strong> {result.total_time_hours} hours</p>
        </div>
      )}
    </div>
  );
};

export default EDMInput;
