import React, { useState } from 'react';
import axios from 'axios';
import '../../App.css'; 

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
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/edm-time`, {
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
      alert("Error calculating EDM time. Please check your inputs and try again.");
    }
  };

  return (
    <div className="edm-container">
      <h2 className="edm-title">EDM Time Estimator</h2>

      <form onSubmit={handleSubmit} className="edm-form">
        <input name="length" type="number" placeholder="Length (mm)" onChange={handleChange} required />
        <input name="width" type="number" placeholder="Width (mm)" onChange={handleChange} required />
        <input name="height" type="number" placeholder="Height (mm)" onChange={handleChange} required />
        <input name="mrr" type="number" placeholder="MRR (mm³/min)" onChange={handleChange} required />
        <input name="setup_time" type="number" placeholder="Setup Time (mins)" onChange={handleChange} required />
        <button type="submit">Calculate</button>
      </form>

      {result && (
        <div className="result-box">
          <p><strong>Volume:</strong> {result.volume_to_remove} mm³</p>
          <p><strong>Machining Time:</strong> {result.machining_time_minutes} mins</p>
          <p><strong>Total Time (mins):</strong> {result.total_time_minutes}</p>
          <p><strong>Total Time (hours):</strong> {result.total_time_hours}</p>
        </div>
      )}
    </div>
  );
};

export default EDMInput;
