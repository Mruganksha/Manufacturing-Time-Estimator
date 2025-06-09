import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function InputForm() {
  const { machineType } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/api/tasks/calculate", {
      machineType,
      inputParams: inputs
    });
    navigate("/result", { state: { estimatedTime: res.data.estimatedTime } });
  };

  const getFields = () => {
    switch (machineType) {
      case 'Turning':
        return (
          <>
            <input name="length" placeholder="Length" onChange={handleChange} required />
            <input name="diameter" placeholder="Diameter" onChange={handleChange} required />
            <input name="feedRate" placeholder="Feed Rate" onChange={handleChange} required />
            <input name="speed" placeholder="Speed" onChange={handleChange} required />
          </>
        );
      // Add similar cases for other machines
      default:
        return <p>No input form defined for this machine yet.</p>;
    }
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <h2>{machineType} - Input Parameters</h2>
      {getFields()}
      <button type="submit">Calculate</button>
    </form>
  );
}

export default InputForm;
