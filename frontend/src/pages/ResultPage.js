import React from 'react';
import { useLocation } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const time = location.state?.estimatedTime;

  return (
    <div className="container">
      <h2>Estimated Time</h2>
      {time ? <p>{time}</p> : <p>No estimate found.</p>}
    </div>
  );
}

export default ResultPage;
