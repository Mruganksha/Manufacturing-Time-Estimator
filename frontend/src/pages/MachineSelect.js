import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const machines = [
  { name: 'Milling', key: 'milling', image: './images/milling.jpeg' },
  { name: 'Grinding', key: 'grinding', image: '/images/grinding.jpeg' },
  { name: 'EDM', key: 'edm', image: '/images/edm.jpeg' },
  { name: 'Wire EDM', key: 'wire-edm', image: '/images/wire-edm.jpeg' }
];

const MachineSelect = () => {
  const navigate = useNavigate();

  const handleMachineClick = (key) => {
    navigate(`/input/${key}`);
  };

  return (
    <div className="container">
      <h2 className="heading">Select a Machine</h2>
      <div className="machine-grid">
        {machines.map((machine) => (
          <div className="machine-card" key={machine.key} onClick={() => handleMachineClick(machine.key)}>
            <img src={machine.image} alt={machine.name} className="machine-image" />
            <p className="machine-name">{machine.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineSelect;
