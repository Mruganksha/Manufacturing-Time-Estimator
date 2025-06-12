import React, { useState } from "react";
import axios from "axios";

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
      const response = await axios.post("http://localhost:5000/api/grinding-time", inputs);
      setResult(response.data);
    } catch (err) {
      setError("Error calculating grinding time. Please check your input.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
         <h2 className="text-xl font-bold mb-4 text-center">Grinding Time Estimator</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
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
            <label className="block mb-1 font-semibold">{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={inputs[field.name]}
              onChange={handleChange}
              step="any"
              required
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Calculate
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Result</h3>
          <p>Time per Pass: {result.time_per_pass} minutes</p>
          <p>Number of Passes: {result.number_of_passes}</p>
          <p>Total Cuts: {result.total_cuts}</p>
          <p>Total Time (minutes): {result.total_time_minutes}</p>
          <p>Total Time (hours): <strong>{result.total_time_hours}</strong></p>
        </div>
      )}
    
    </div>
    </div>
  );
};

export default GrindingInput;
