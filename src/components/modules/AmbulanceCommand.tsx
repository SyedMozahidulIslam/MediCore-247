/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Truck, Phone, Navigation, AlertTriangle, Play, CheckCircle, Activity, Fuel } from "lucide-react";
import { Ambulance } from "../../types";

interface AmbulanceCommandProps {
  ambulances: Ambulance[];
  onUpdateAmbulance: (updated: Ambulance) => void;
}

export const AmbulanceCommand: React.FC<AmbulanceCommandProps> = ({ ambulances, onUpdateAmbulance }) => {
  const [selectedAmbId, setSelectedAmbId] = useState<string>("");
  const [targetLocation, setTargetLocation] = useState("Dhanmondi Intersection");
  const [dispatchNote, setDispatchNote] = useState("Trauma / Head Injury request");
  const [activeDispatchLog, setActiveDispatchLog] = useState<{ id: string; msg: string; time: string }[]>([
    { id: "DISP-101", msg: "AMB-001 Dispatched to Banani Road 11 (Cardiac emergency)", time: "10 mins ago" },
    { id: "DISP-102", msg: "AMB-002 Arrived at Rampura Accident site", time: "25 mins ago" }
  ]);

  useEffect(() => {
    if (ambulances.length > 0 && !selectedAmbId) {
      setSelectedAmbId(ambulances[0].id);
    }
  }, [ambulances, selectedAmbId]);

  const selectedAmb = ambulances.find(a => a.id === selectedAmbId) || ambulances[0];

  // Simulated GPS movement tracking (coordinates pulse slightly to indicate live tracking)
  const [mapPulse, setMapPulse] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setMapPulse(p => (p + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmb || selectedAmb.status !== "Available") {
      alert("Selected vehicle must be in AVAILABLE status to dispatch!");
      return;
    }

    const updated: Ambulance = {
      ...selectedAmb,
      status: "Dispatched",
      destinationName: targetLocation,
      fuelLevel: Math.max(20, selectedAmb.fuelLevel - Math.floor(5 + Math.random() * 10))
    };

    onUpdateAmbulance(updated);

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setActiveDispatchLog(prev => [
      { id: `DISP-${now.getTime()}`, msg: `${selectedAmb.id} Dispatched to ${targetLocation} (${dispatchNote})`, time: `Just now (${timeStr})` },
      ...prev
    ]);

    setTargetLocation("");
    setDispatchNote("");
  };

  const handleCompleteMission = (amb: Ambulance) => {
    const updated: Ambulance = {
      ...amb,
      status: "Available",
      destinationName: undefined
    };
    onUpdateAmbulance(updated);

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setActiveDispatchLog(prev => [
      { id: `DISP-${now.getTime()}`, msg: `${amb.id} Mission Completed & returned to Standby`, time: `Just now (${timeStr})` },
      ...prev
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Fleet Tracking Grid */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Telemetry Dispatch Fleet</h3>
            <p className="text-xs text-slate-500 font-medium">Select a vehicle to configure emergency dispatch routes</p>
          </div>

          <div className="space-y-3">
            {ambulances.map((amb) => (
              <div
                key={amb.id}
                onClick={() => setSelectedAmbId(amb.id)}
                className={`p-4 rounded-xl border cursor-pointer transition duration-200 flex flex-col justify-between space-y-3 ${
                  selectedAmbId === amb.id
                    ? "bg-white text-emerald-800 border-emerald-400/50 shadow-sm"
                    : "bg-white/40 border-white/40 hover:bg-white/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className={`w-4 h-4 ${selectedAmbId === amb.id ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span className="text-xs font-extrabold text-slate-800">{amb.id}</span>
                  </div>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-lg border uppercase ${
                    amb.status === "Available" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    amb.status === "Dispatched" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    amb.status === "Heading to Hospital" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                    "bg-rose-50 text-rose-700 border-rose-200"
                  }`}>
                    {amb.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                  <span>Driver: {amb.driverName}</span>
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-slate-400" />
                    Fuel: {amb.fuelLevel}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Vector GPS Map Tracking */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Live Fleet GPS Tracker</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Dhaka Metropolitan Grid routing</p>
          </div>

          {/* SVG map showing live coordinates */}
          <div className="border border-white/10 bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 flex justify-center items-center relative overflow-hidden h-64 shadow-inner">
            <svg viewBox="0 0 300 200" className="w-full h-full opacity-90">
              {/* Dhaka road grid lines */}
              <line x1="20" y1="50" x2="280" y2="50" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="20" y1="120" x2="280" y2="120" stroke="#334155" strokeWidth="2" />
              <line x1="50" y1="10" x2="50" y2="190" stroke="#334155" strokeWidth="2" />
              <line x1="180" y1="10" x2="180" y2="190" stroke="#334155" strokeWidth="2" strokeDasharray="2 2" />
              
              {/* Main Hospital Hub */}
              <rect x="135" y="95" width="30" height="30" rx="6" fill="#10b981" className="animate-pulse" />
              <text x="150" y="112" textAnchor="middle" fill="#fff" className="font-black text-[9px]">H</text>
              <text x="150" y="140" textAnchor="middle" fill="#94a3b8" className="font-extrabold text-[8px] uppercase tracking-wider">MediCore</text>

              {/* Active Vehicles Markers */}
              {ambulances.map((amb, idx) => {
                // Generate dynamic positions around hospital
                const mapPositions = [
                  { x: 50, y: 50, label: "AMB-001" },
                  { x: 180, y: 140, label: "AMB-002" },
                  { x: 135, y: 110, label: "AMB-003" }
                ];
                const pos = mapPositions[idx % mapPositions.length];
                const isPulse = mapPulse === idx;

                return (
                  <g key={amb.id}>
                    {/* Animated coordinates pulse indicator */}
                    {isPulse && (
                      <circle cx={pos.x} cy={pos.y} r="12" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />
                    )}
                    <circle cx={pos.x} cy={pos.y} r="6" fill={amb.status === "Available" ? "#10b981" : "#f59e0b"} />
                    <text x={pos.x + 8} y={pos.y + 3} fill="#f8fafc" className="font-bold text-[7px]">{pos.label}</text>
                  </g>
                );
              })}
            </svg>
            <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-lg text-[9px] font-bold text-emerald-400">
              ● RADAR REFRESH SYNCED
            </div>
          </div>
        </div>

        {/* Dispatch Action Console */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Dispatch Center Console</h3>
            <p className="text-xs text-rose-600 font-bold mb-4 font-mono">AUTHORIZED PERSONNEL ONLY</p>

            {selectedAmb ? (
              <div className="space-y-4">
                <div className="bg-white/40 border border-white/40 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Selected Fleet:</span>
                    <span className="text-slate-800 font-bold">{selectedAmb.id}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-emerald-700 font-bold">{selectedAmb.status}</span>
                  </div>
                  {selectedAmb.destinationName && (
                    <div className="flex justify-between text-xs font-semibold border-t border-white/30 pt-2">
                      <span className="text-slate-500">Current Destination:</span>
                      <span className="text-amber-700 font-bold">{selectedAmb.destinationName}</span>
                    </div>
                  )}
                </div>

                {selectedAmb.status === "Available" ? (
                  <form onSubmit={handleDispatch} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Location (Dhaka)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Banani Road 11 Intersection"
                        value={targetLocation}
                        onChange={(e) => setTargetLocation(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 border border-white/50 focus:border-emerald-500 rounded-lg focus:outline-none font-medium text-slate-800 placeholder-slate-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Triage Notes / Hazard</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pediatric seizure, trauma"
                        value={dispatchNote}
                        onChange={(e) => setDispatchNote(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 border border-white/50 focus:border-emerald-500 rounded-lg focus:outline-none font-medium text-slate-800 placeholder-slate-400 transition"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      ENGAGE EMERGENCY DISPATCH
                    </button>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 font-medium">Vehicle is currently dispatched on an active life saving mission.</p>
                    <button
                      onClick={() => handleCompleteMission(selectedAmb)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Mission Complete / Standby
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Please select an ambulance to start tracking</p>
            )}
          </div>
        </div>
      </div>

      {/* Dispatch History Logs */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">Command Center Dispatch History Log</h4>
        <div className="space-y-2.5 max-h-[150px] overflow-y-auto">
          {activeDispatchLog.map((log) => (
            <div key={log.id} className="flex justify-between items-center bg-white/40 border border-white/40 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                <span className="font-medium text-slate-700">{log.msg}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold font-mono">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
