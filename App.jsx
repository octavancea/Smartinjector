import React, { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';

const defaultSettings = {
  configName: "",
  targetSolutionVolume: 20,
  numPumps: 4,
  esp32Url: ""
};
const defaultZone = {
  id: Date.now(),
  pump: 1,
  brand: "Rain Bird",
  nozzle: "U-8",
  solution: "Îngrășământ",
  dilution: 0
};

function App() {
  // Load saved config from localStorage, or use defaults
  let savedConfig = null;
  try {
    const stored = localStorage.getItem('smartInjectorConfig');
    if (stored) savedConfig = JSON.parse(stored);
  } catch {}
  const initialZones = savedConfig ? savedConfig.zones : [ { ...defaultZone } ];
  const initialSettings = savedConfig ? savedConfig.settings : { ...defaultSettings };
  const initialLogged = localStorage.getItem('loggedIn') === 'true';

  const [loggedIn, setLoggedIn] = useState(initialLogged);
  const [zones, setZones] = useState(initialZones);
  const [settings, setSettings] = useState(initialSettings);

  // Save config to localStorage whenever zones or settings change
  useEffect(() => {
    try {
      localStorage.setItem('smartInjectorConfig', JSON.stringify({ zones, settings }));
    } catch {}
  }, [zones, settings]);

  // Handle login (hardcoded credentials admin/admin)
  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      setLoggedIn(true);
      localStorage.setItem('loggedIn', 'true');
      return true;
    }
    return false;
  };

  // Handle logout
  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
  };

  return (
    <div>
      {loggedIn ? (
        <Dashboard 
          zones={zones} setZones={setZones}
          settings={settings} setSettings={setSettings}
          onLogout={handleLogout}
        />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
