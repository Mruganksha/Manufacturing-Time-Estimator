import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import HomePage from './pages/HomePage';
import MachineSelect from './pages/MachineSelect';
import WireEDMInput from './pages/inputs/WireEDMInput';
import EDMInput from './pages/inputs/EDMInput';
import GrindingInput from './pages/inputs/GrindingInput';
import MillingInput from './pages/inputs/MillingInput';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/MachineSelct" element={<MachineSelect />} />
        <Route path="/input/wire-edm" element={<WireEDMInput />} />
        <Route path="/input/edm" element={<EDMInput />} />
        <Route path="/input/grinding" element={<GrindingInput />} />
        <Route path="/input/milling" element={<MillingInput />} />
      </Routes>
    </Router>
  );
}


export default App;
