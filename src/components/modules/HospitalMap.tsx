/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MapPin, Building, Bed, HelpCircle, Layers, Users } from "lucide-react";

interface DepartmentLocation {
  id: string;
  name: string;
  building: string;
  floor: string;
  color: string;
  description: string;
  staffOnDuty: number;
  occupancy: string;
  svgCoords: { x: number; y: number; w: number; h: number };
}

export const HospitalMap: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<DepartmentLocation | null>(null);

  const departments: DepartmentLocation[] = [
    { id: "RECEPTION", name: "Main Reception & Lobby", building: "Building F", floor: "Ground Floor", color: "fill-emerald-100 stroke-emerald-500 hover:fill-emerald-200/80 transition-all", description: "OPD Registrations, Token Dispatch, Guest Lounge", staffOnDuty: 8, occupancy: "Moderate", svgCoords: { x: 50, y: 150, w: 180, h: 100 } },
    { id: "EMERGENCY", name: "Trauma & Emergency Room", building: "Building B", floor: "Ground Floor", color: "fill-rose-100 stroke-rose-500 hover:fill-rose-200/80 transition-all", description: "24/7 Resuscitation, Minor OT, Disaster Standby", staffOnDuty: 14, occupancy: "High", svgCoords: { x: 250, y: 150, w: 150, h: 100 } },
    { id: "OT_COMPLEX", name: "Main Operation Theatre Complex", building: "Building B", floor: "3rd Floor", color: "fill-indigo-100 stroke-indigo-500 hover:fill-indigo-200/80 transition-all", description: "Laparoscopic and Neurosurgical Theatres", staffOnDuty: 10, occupancy: "Active (2 Theatres Running)", svgCoords: { x: 250, y: 30, w: 150, h: 100 } },
    { id: "ICU_BLOCK", name: "Intensive Care Unit (ICU)", building: "Building B", floor: "3rd Floor", color: "fill-cyan-100 stroke-cyan-500 hover:fill-cyan-200/80 transition-all", description: "Ventilator support, Critical Hemodynamic Monitoring", staffOnDuty: 12, occupancy: "75% Occupied", svgCoords: { x: 420, y: 30, w: 150, h: 100 } },
    { id: "RADIOLOGY", name: "Radiology & MRI Pavilion", building: "Building E", floor: "Ground Floor", color: "fill-teal-100 stroke-teal-500 hover:fill-teal-200/80 transition-all", description: "3T MRI, Multi-slice CT, Ultrasonography", staffOnDuty: 6, occupancy: "Low wait-time", svgCoords: { x: 50, y: 30, w: 180, h: 100 } },
    { id: "LABORATORY", name: "Pathology & Quality Diagnostics", building: "Building E", floor: "1st Floor", color: "fill-amber-100 stroke-amber-500 hover:fill-amber-200/80 transition-all", description: "Bio-safety Level 2 microbiology and blood banking", staffOnDuty: 9, occupancy: "Normal Queue", svgCoords: { x: 50, y: 270, w: 180, h: 100 } },
    { id: "PHARMACY", name: "Central Outpatient Pharmacy", building: "Building F", floor: "Ground Floor", color: "fill-teal-500/10 stroke-teal-600 hover:fill-teal-500/20 transition-all", description: "Automated medicine storage, Cold storage vaccines", staffOnDuty: 12, occupancy: "No Queue", svgCoords: { x: 250, y: 270, w: 150, h: 100 } },
    { id: "AMBULANCE_BAY", name: "Emergency Ambulance Garage", building: "Building H", floor: "Basement Floor", color: "fill-sky-100 stroke-sky-500 hover:fill-sky-200/80 transition-all", description: "Dispatch, driver crew restrooms, fuel depot", staffOnDuty: 6, occupancy: "Standby ready", svgCoords: { x: 420, y: 270, w: 150, h: 100 } }
  ];

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/40 pb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Dynamic Hospital Floor Grid</h3>
          <p className="text-xs text-slate-500 font-medium">Click on any colored ward block or wing to track occupancy, staff counts, and facility parameters</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Interactive SVG Plan (MediCore Main Campus)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Floor Plan SVG */}
        <div className="lg:col-span-2 border border-white/40 bg-white/40 backdrop-blur-sm rounded-2xl p-4 flex justify-center items-center overflow-x-auto">
          <svg viewBox="0 0 620 400" className="w-full max-w-[620px] h-auto drop-shadow-sm">
            {/* Background hospital border outline */}
            <rect x="10" y="10" width="600" height="380" rx="20" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 6" />
            
            {/* Grid line guidelines */}
            <line x1="240" y1="20" x2="240" y2="380" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="410" y1="20" x2="410" y2="380" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="20" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="20" y1="260" x2="600" y2="260" stroke="#f1f5f9" strokeWidth="1" />

            {/* Department Blocks */}
            {departments.map((dept) => (
              <g key={dept.id} className="cursor-pointer" onClick={() => setSelectedDept(dept)}>
                <rect
                  x={dept.svgCoords.x}
                  y={dept.svgCoords.y}
                  width={dept.svgCoords.w}
                  height={dept.svgCoords.h}
                  rx="14"
                  className={`${dept.color} transition-all duration-300 stroke-[2]`}
                />
                <text
                  x={dept.svgCoords.x + dept.svgCoords.w / 2}
                  y={dept.svgCoords.y + dept.svgCoords.h / 2}
                  textAnchor="middle"
                  className="font-extrabold text-[10px] fill-slate-700 pointer-events-none tracking-tight"
                >
                  {dept.name.split(" ")[0]} {dept.name.split(" ")[1] || ""}
                </text>
                <text
                  x={dept.svgCoords.x + dept.svgCoords.w / 2}
                  y={dept.svgCoords.y + dept.svgCoords.h / 2 + 14}
                  textAnchor="middle"
                  className="font-bold text-[8px] fill-slate-400 pointer-events-none"
                >
                  {dept.floor}
                </text>
              </g>
            ))}

            {/* Parking/Yard label */}
            <text x="510" y="200" textAnchor="middle" className="font-extrabold text-[10px] fill-slate-300 uppercase tracking-widest">Central Yard & Parking</text>
          </svg>
        </div>

        {/* Selected Wing Details Sidebar */}
        <div className="flex flex-col justify-between">
          {selectedDept ? (
            <div className="bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-600" />
                <h4 className="font-extrabold text-slate-800 text-sm">{selectedDept.name}</h4>
              </div>
              
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Building Block</span>
                  <span className="font-semibold text-slate-700">{selectedDept.building}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Floor Level</span>
                  <span className="font-semibold text-slate-700">{selectedDept.floor}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Staff Count</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {selectedDept.staffOnDuty} Clinicians Active
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Occupancy Rate</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-slate-400" />
                    {selectedDept.occupancy}
                  </span>
                </div>
                <div className="border-t border-white/40 pt-3 mt-1 text-slate-600 font-medium leading-relaxed">
                  {selectedDept.description}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 p-6 flex flex-col items-center justify-center text-center h-full space-y-3.5 min-h-[250px]">
              <HelpCircle className="w-12 h-12 text-slate-400 animate-pulse" />
              <div>
                <h4 className="font-bold text-slate-700 text-sm">Interactive Inspector</h4>
                <p className="text-xs text-slate-500 font-medium max-w-[200px] mx-auto mt-1">Click on any region inside the floor plan map to view clinical metrics</p>
              </div>
            </div>
          )}

          {/* Quick Info Box */}
          <div className="bg-emerald-50/60 backdrop-blur-md border border-emerald-200/50 rounded-2xl p-4 text-xs text-emerald-800 mt-4">
            <h5 className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Direction Finder Guidance
            </h5>
            <p className="font-medium text-emerald-700 leading-relaxed">
              Patient tokens issued at the front desk automatically sync with this map, highlighting the direct route to your clinical destination on your smartphone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
