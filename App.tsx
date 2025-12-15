import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-brand-black min-h-screen text-white font-sans selection:bg-brand-yellow selection:text-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;