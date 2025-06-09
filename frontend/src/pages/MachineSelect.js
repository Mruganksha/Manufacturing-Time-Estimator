import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const MachineSelect = () => {
  const [showMillingOptions, setShowMillingOptions] = useState(false);
  const navigate = useNavigate();

  const handleMachineClick = (machine) => {
    if (machine === 'milling') {
      setShowMillingOptions((prev) => !prev);
    } else {
      navigate(`/input/${machine}`);
    }
  };

  const handleSubMachineClick = (subMachine) => {
    navigate(`/input/${subMachine}`);
  };

  return (
    <div className="container">
      <h2>Select Machine</h2>
      <ul>
        <li>
          <button className="machine-btn" onClick={() => handleMachineClick('milling')}>
            Milling {showMillingOptions ? '▲' : '▼'}
          </button>
          {showMillingOptions && (
            <ul className="sub-list">
              <li>
                <button onClick={() => handleSubMachineClick('face-milling')}>
                  Face Milling
                </button>
              </li>
              <li>
                <button onClick={() => handleSubMachineClick('end-milling')}>
                  End Milling
                </button>
              </li>
            </ul>
          )}
        </li>
        <li>
          <button className="machine-btn" onClick={() => handleMachineClick('grinding')}>
            Grinding
          </button>
        </li>
        <li>
          <button className="machine-btn" onClick={() => handleMachineClick('eom')}>
            EOM
          </button>
        </li>
        <li>
          <button className="machine-btn" onClick={() => handleMachineClick('wire-edm')}>
            Wire EDM
          </button>
        </li>
        <li>
          <button className="machine-btn" onClick={() => handleMachineClick('cnc')}>
            CNC
          </button>
        </li>
      </ul>
    </div>
  );
};

export default MachineSelect;
