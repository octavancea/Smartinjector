import React from 'react';
import { nozzleOptions } from '../utils/data_nozzles.js';
import { solutionOptions } from '../utils/data_solutions.js';

function ZoneConfig({ index, zone, settings, onChange, onDelete }) {
  // Helper: get all unique brands from nozzle data
  const brands = [...new Set(nozzleOptions.map(n => n.brand))];

  // Current brand's available nozzle models
  const nozzleList = nozzleOptions.filter(n => n.brand === zone.brand);

  // Handle field changes
  const handlePumpChange = (e) => {
    const newPump = parseInt(e.target.value);
    onChange(index, { ...zone, pump: isNaN(newPump) ? zone.pump : newPump });
  };
  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    // auto-select first nozzle of the new brand
    const firstNozzle = nozzleOptions.find(n => n.brand === newBrand);
    onChange(index, {
      ...zone,
      brand: newBrand,
      nozzle: firstNozzle ? firstNozzle.model : "",
      // If changing brand, keep other fields same
      solution: zone.solution,
      pump: zone.pump,
      dilution: zone.dilution
    });
  };
  const handleNozzleChange = (e) => {
    onChange(index, { ...zone, nozzle: e.target.value });
  };
  const handleSolutionChange = (e) => {
    onChange(index, { ...zone, solution: e.target.value });
  };
  const handleDilutionChange = (e) => {
    const val = parseInt(e.target.value);
    const newDilution = isNaN(val) ? 0 : Math.max(0, Math.min(100, val));
    onChange(index, { ...zone, dilution: newDilution });
  };

  // Find selected nozzle's data for calculations
  const nozzleData = nozzleOptions.find(n => n.brand === zone.brand && n.model === zone.nozzle);
  const flow = nozzleData ? nozzleData.flow : 0;
  const radius = nozzleData ? nozzleData.radius : "-";
  // Calculate dosing time (minutes) for target solution volume
  let doseTime = "-";
  if (nozzleData && zone.dilution > 0 && settings.targetSolutionVolume > 0) {
    const flowLpm = flow * 1000 / 60; // convert m³/h to L/min
    const injectionFlow = flowLpm * (zone.dilution / 100); // solution L/min
    if (injectionFlow > 0) {
      const time = settings.targetSolutionVolume / injectionFlow;
      doseTime = time.toFixed(2);
    }
  }
  if (zone.dilution === 0 && settings.targetSolutionVolume > 0) {
    doseTime = "N/A";
  }

  return (
    <div className="bg-white border border-gray-300 rounded p-4 mb-4">
      {/* Zone header with name and delete button */}
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium">Zona {index + 1}</span>
        <button 
          type="button"
          onClick={onDelete}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
          X
        </button>
      </div>
      {/* Pump selection */}
      <div className="mb-2">
        <select 
          value={zone.pump}
          onChange={handlePumpChange}
          className="border border-gray-300 rounded px-2 py-1 w-full"
        >
          {Array.from({ length: settings.numPumps }, (_, i) => i + 1).map(p => (
            <option key={p} value={p}>Pompa {p}</option>
          ))}
        </select>
      </div>
      {/* Sprinkler brand/type selection */}
      <div className="mb-2">
        <select 
          value={zone.brand}
          onChange={handleBrandChange}
          className="border border-gray-300 rounded px-2 py-1 w-full"
        >
          {brands.map(br => (
            <option key={br} value={br}>{br}</option>
          ))}
        </select>
      </div>
      {/* Nozzle model selection */}
      <div className="mb-2">
        <select 
          value={zone.nozzle}
          onChange={handleNozzleChange}
          className="border border-gray-300 rounded px-2 py-1 w-full"
        >
          {nozzleList.map(item => (
            <option key={item.model} value={item.model}>{item.model}</option>
          ))}
        </select>
      </div>
      {/* Solution selection */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Soluție:</label>
        <select 
          value={zone.solution}
          onChange={handleSolutionChange}
          className="border border-gray-300 rounded px-2 py-1 w-full"
        >
          <option value="" disabled>Alege soluția</option>
          {solutionOptions.map(sol => (
            <option key={sol} value={sol}>{sol}</option>
          ))}
        </select>
      </div>
      {/* Dilution percentage */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Procent diluție (%):</label>
        <input 
          type="number"
          className="border border-gray-300 rounded px-2 py-1 w-28"
          min={0}
          max={100}
          value={zone.dilution}
          onChange={handleDilutionChange}
        />
      </div>
      {/* Calculated info: flow, radius, dosing time */}
      <div className="text-sm bg-gray-50 p-2 rounded">
        <div><strong>Debit:</strong> {flow.toFixed(2)} m³/h</div>
        <div><strong>Rază:</strong> {radius}</div>
        <div><strong>Timp Dozare:</strong> {doseTime} minute (exemplu)</div>
      </div>
    </div>
  );
}

export default ZoneConfig;
