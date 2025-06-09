import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Manufacturing Time Estimator</h1>
      <p>Estimate how long your machining task will take</p>
      <button onClick={() => navigate('/select-machine')}>
        Start Estimating
      </button>
    </div>
  );
}

export default HomePage;
