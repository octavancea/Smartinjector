import React from 'react';

function Settings({ settings, setSettings, setZones }) {
  // Handle changes for global settings fields
  const handleChange = (field, value) => {
    // If updating number of pumps, clamp zone pump selections if needed
    if (field === 'numPumps') {
      const num = Math.max(1, Math.min(4, parseInt(value) || 1));
      setSettings(prev => ({ ...prev, numPumps: num }));
      setZones(prevZones => prevZones.map(zone => (
        zone.pump > num ? { ...zone, pump: num } : zone
      )));
    } else if (field === 'targetSolutionVolume') {
      const vol = value !== "" ? parseFloat(value) : "";
      setSettings(prev => ({ ...prev, targetSolutionVolume: vol }));
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  // Simulate sending settings to ESP32 (future integration)
  const sendToESP32 = () => {
    if (!settings.esp32Url) {
      alert("Setați URL-ul ESP32 înainte de trimitere.");
    } else {
      console.log("Sending config to ESP32 at", settings.esp32Url, { zones: "...", settings });
      alert("Configurația a fost trimisă către " + settings.esp32Url + " (simulare).");
      // TODO: Integrare reală cu API-ul ESP32 prin fetch/HTTP request
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Setări globale</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nume configurație:</label>
        <input 
          type="text"
          className="border border-gray-300 rounded w-full px-2 py-1"
          value={settings.configName}
          onChange={(e) => handleChange('configName', e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Număr pompe disponibile:</label>
        <input 
          type="number"
          className="border border-gray-300 rounded w-20 px-2 py-1"
          min={1}
          max={4}
          value={settings.numPumps}
          onChange={(e) => handleChange('numPumps', e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Volum soluție per zonă (L):</label>
        <input 
          type="number"
          className="border border-gray-300 rounded w-32 px-2 py-1"
          step="0.1"
          min={0}
          value={settings.targetSolutionVolume}
          onChange={(e) => handleChange('targetSolutionVolume', e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">ESP32 API URL:</label>
        <input 
          type="text"
          className="border border-gray-300 rounded w-full px-2 py-1"
          placeholder="http://192.168.x.x"
          value={settings.esp32Url}
          onChange={(e) => handleChange('esp32Url', e.target.value)}
        />
      </div>
      <button 
        type="button"
        onClick={sendToESP32}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Trimite către ESP32
      </button>
    </div>
  );
}

export default Settings;
