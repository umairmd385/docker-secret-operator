import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlatformProvider } from './context/PlatformContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Secrets from './pages/Secrets';
import Containers from './pages/Containers';
import Providers from './pages/Providers';
import Observability from './pages/Observability';
import Architecture from './pages/Architecture';
import Events from './pages/Events';
import Playground from './pages/Playground';
import Settings from './pages/Settings';

// Placeholder pages for subsequent implementation
const Placeholder = ({ name }) => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="w-20 h-20 bg-brand-cyan/10 rounded-full flex items-center justify-center mb-6 text-brand-cyan">
      <div className="w-10 h-10 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
    </div>
    <h2 className="text-3xl font-bold text-white mb-2">{name}</h2>
    <p className="text-gray-500">This platform feature is currently being calibrated...</p>
  </div>
);

function App() {
  return (
    <PlatformProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          <Route path="/secrets" element={<Secrets />} />
          <Route path="/containers" element={<Containers />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/observability" element={<Observability />} />
          <Route path="/events" element={<Events />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        </MainLayout>
      </Router>
    </PlatformProvider>
  );
}

export default App;
