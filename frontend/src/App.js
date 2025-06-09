import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import MachineSelect from './pages/MachineSelect';
import InputForm from './pages/InputForm';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/select-machine" element={<MachineSelect />} />
      <Route path="/input/:machineType" element={<InputForm />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}

export default App;
