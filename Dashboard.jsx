import React, { useRef } from 'react';
import Settings from './Settings.jsx';
import ZoneConfig from './ZoneConfig.jsx';

function Dashboard({ zones, setZones, settings, setSettings, onLogout }) {
  const fileInputRef = useRef(null);

  // Add a new irrigation zone (up to 10)
  const handleAddZone = () => {
    if (zones.length < 10) {
      const newZone = {
        id: Date.now(),
        pump: 1,
        brand: "Rain Bird",
        nozzle: "U-8",
        solution: "Îngrășământ",
        dilution: 0
      };
      setZones(prev => [...prev, newZone]);
    }
  };

  // Delete a zone by index
  const handleDeleteZone = (index) => {
    setZones(prev => prev.filter((_, i) => i !== index));
  };

  // Update zone data when any field changes
  const handleUpdateZone = (index, updatedZone) => {
    setZones(prev => prev.map((z, i) => (i === index ? updatedZone : z)));
  };

  // Export current configuration to JSON file
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ zones, settings }, null, 2));
    const fileName = (settings.configName || "smartinjector_config") + ".json";
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import configuration from a JSON file
  const handleImport = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.zones && imported.settings) {
          const importZones = Array.isArray(imported.zones) ? imported.zones.slice(0, 10) : [];
          const maxPump = imported.settings.numPumps || settings.numPumps;
          importZones.forEach(zone => {
            if (zone.pump > maxPump) zone.pump = maxPump;
          });
          setZones(importZones);
          setSettings(prev => ({ ...prev, ...imported.settings }));
        } else {
          alert("Fișierul importat nu este valid.");
        }
      } catch {
        alert("Eroare la citirea fișierului. Asigurați-vă că este un fișier JSON valid.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">SmartInjector Dashboard</h1>
        <button 
          onClick={onLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
          Logout
        </button>
      </header>

      {/* Export/Import Buttons */}
      <div className="mb-6">
        <button 
          onClick={handleExport}
          className="mr-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Export Settings
        </button>
        <button 
          onClick={() => fileInputRef.current.click()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Import Settings
        </button>
        <input 
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </div>

      {/* Global Settings Panel */}
      <Settings settings={settings} setSettings={setSettings} setZones={setZones} />

      {/* Irrigation Zones Section */}
      <h2 className="text-xl font-semibold mt-8 mb-3">Zone de irigare</h2>
      <button 
        onClick={handleAddZone}
        className="mb-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
        + Adaugă zonă
      </button>
      {zones.map((zone, index) => (
        <ZoneConfig 
          key={zone.id}
          index={index}
          zone={zone}
          settings={settings}
          onChange={handleUpdateZone}
          onDelete={() => handleDeleteZone(index)}
        />
      ))}
    </div>
  );
}

export default Dashboard;
