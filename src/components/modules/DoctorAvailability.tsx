/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Clock, Calendar, Check, AlertTriangle, ShieldCheck, ChevronRight, User } from "lucide-react";
import { Employee, UserRole, AvailabilityStatus } from "../../types";

interface DoctorAvailabilityProps {
  doctors: Employee[];
}

export const DoctorAvailability: React.FC<DoctorAvailabilityProps> = ({ doctors }) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(720); // 12 minutes countdown in seconds

  const dutyDoctors = doctors.filter(doc => doc.availability !== AvailabilityStatus.OFFLINE);

  useEffect(() => {
    if (dutyDoctors.length > 0 && !selectedDoctorId) {
      setSelectedDoctorId(dutyDoctors[0].id);
    }
  }, [dutyDoctors, selectedDoctorId]);

  // Set up live countdown simulation for remaining consultation time
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 720));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedDoc = doctors.find(d => d.id === selectedDoctorId) || dutyDoctors[0];

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:30 PM", "06:00 PM"];

  // Mock schedule grid generator
  const getScheduleStatus = (day: string, slot: string, docId: string) => {
    const seed = day.charCodeAt(0) + slot.charCodeAt(0) + docId.charCodeAt(docId.length - 1);
    if (seed % 3 === 0) return { label: "Booked", color: "bg-amber-150/70 text-amber-900 border-amber-300" };
    if (seed % 5 === 0) return { label: "Surgery Block", color: "bg-indigo-100/70 text-indigo-900 border-indigo-200" };
    return { label: "Open", color: "bg-emerald-100/70 text-emerald-900 border-emerald-200 cursor-pointer hover:bg-emerald-200/80 transition" };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Clinician Selector Panel */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Live Scheduling Grid</h3>
          <p className="text-xs text-slate-500 font-medium mb-4">Click any on-duty clinician to view upcoming slots</p>
          
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-2">
            {dutyDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoctorId(doc.id);
                  setCountdown(Math.floor(400 + Math.random() * 500));
                }}
                className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  selectedDoctorId === doc.id
                    ? "bg-white text-emerald-800 border-emerald-400/50 shadow-sm"
                    : "bg-white/40 hover:bg-white/70 border-white/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs shadow-sm">
                    {doc.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{doc.name}</h5>
                    <p className="text-[10px] text-slate-500 font-semibold">{doc.specialization}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition ${selectedDoctorId === doc.id ? 'translate-x-1 text-emerald-600' : ''}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Countdown and Slot Details */}
      {selectedDoc && (
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6 lg:col-span-2 flex flex-col justify-between space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/40 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                {selectedDoc.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">{selectedDoc.name}</h3>
                <p className="text-xs text-emerald-600 font-bold">{selectedDoc.specialization} ({selectedDoc.starCategory?.split(" ")[0]})</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/40 border border-white/40 rounded-xl p-3">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current status</span>
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full inline-block ${
                    selectedDoc.availability === AvailabilityStatus.AVAILABLE ? "bg-emerald-500" : "bg-indigo-500 animate-pulse"
                  }`} />
                  {selectedDoc.availability}
                </span>
              </div>
            </div>
          </div>

          {/* Countdown timer for status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Time Remaining in Slot</span>
                <span className="text-3xl font-mono font-extrabold text-slate-800">{formatCountdown(countdown)}</span>
              </div>
              <p className="text-[10px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Working Hours: {selectedDoc.shift}
              </p>
            </div>

            <div className="bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Next Scheduled Slot</span>
                <span className="text-sm font-extrabold text-slate-800">11:30 AM - Consultation</span>
              </div>
              <p className="text-[10px] text-teal-600 font-medium mt-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Room: {selectedDoc.floor}, OPD Block
              </p>
            </div>
          </div>

          {/* Interactive Schedule Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Weekly Schedule Overview</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-spacing-0">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-[10px] font-bold text-slate-500 uppercase border-b border-white/40 animate-pulse">Slot</th>
                    {daysOfWeek.slice(0, 5).map((day, dIdx) => (
                      <th key={dIdx} className="p-2 text-center text-[10px] font-bold text-slate-500 uppercase border-b border-white/40">{day.substring(0, 3)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, sIdx) => (
                    <tr key={sIdx} className="hover:bg-white/40 transition">
                      <td className="p-2 font-semibold text-slate-700 border-b border-white/30 text-[11px] whitespace-nowrap">{slot}</td>
                      {daysOfWeek.slice(0, 5).map((day, dIdx) => {
                        const statusObj = getScheduleStatus(day, slot, selectedDoc.id);
                        return (
                          <td key={dIdx} className="p-1 border-b border-white/30 text-center">
                            <span className={`inline-block w-full py-1 rounded-lg text-[9px] font-bold border text-center ${statusObj.color}`}>
                              {statusObj.label}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
