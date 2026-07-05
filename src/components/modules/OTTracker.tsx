/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Activity, User, Shield, HelpCircle, Plus, Sparkles, CheckCircle, Clock } from "lucide-react";
import { OperationTheatreSession, UserRole } from "../../types";
import { employeesData } from "../../data/employees";

interface OTTrackerProps {
  otSessions: OperationTheatreSession[];
  onAddSession: (newSession: OperationTheatreSession) => void;
}

export const OTTracker: React.FC<OTTrackerProps> = ({ otSessions, onAddSession }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [surgeryName, setSurgeryName] = useState("");
  const [surgeonId, setSurgeonId] = useState("");
  const [assistantName, setAssistantName] = useState("");
  const [anesthesiologistName, setAnesthesiologistName] = useState("");
  const [scrubNurseName, setScrubNurseName] = useState("");
  const [roomNumber, setRoomNumber] = useState("OT Room-02");
  const [estimatedDuration, setEstimatedDuration] = useState("2 Hours");

  const surgeons = employeesData.filter(e => e.role === UserRole.DOCTOR && e.specialization?.includes("Surgery") || e.specialization?.includes("Oncology") || e.specialization?.includes("Orthopedics"));

  const getStatusColor = (status: "Preparation" | "Active Surgery" | "Recovery" | "Completed") => {
    switch (status) {
      case "Preparation":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Active Surgery":
        return "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
      case "Recovery":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = surgeons.find(s => s.id === surgeonId);
    const newSession: OperationTheatreSession = {
      id: `OTS-${Date.now().toString().slice(-4)}`,
      patientId: `PAT-SCH-${Math.floor(100 + Math.random() * 900)}`,
      patientName,
      surgeryName,
      primarySurgeonId: surgeonId,
      primarySurgeonName: doc ? doc.name : "Dr. Salim Rahaman Dipu",
      assistantSurgeonName: assistantName,
      anesthesiologistName,
      scrubNurseName,
      roomNumber,
      status: "Preparation",
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDuration
    };

    onAddSession(newSession);
    setShowAddForm(false);
    
    // Clear form
    setPatientName("");
    setSurgeryName("");
    setSurgeonId("");
    setAssistantName("");
    setAnesthesiologistName("");
    setScrubNurseName("");
  };

  return (
    <div className="space-y-6">
      {/* OT Summary Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Surgical Command Deck</h3>
          <p className="text-xs text-slate-500 font-medium">Monitor active surgical suites, pre-op preparations, and post-op anesthesia recoveries</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Schedule Surgery
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateSession} className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
          <div className="md:col-span-3 border-b border-white/40 pb-2">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Pre-Op Booking Registry
            </h4>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Patient Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Salim Rownak"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 rounded-xl focus:outline-none font-semibold text-slate-700 placeholder-slate-400 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Surgery / Procedure</label>
            <input
              type="text"
              required
              placeholder="e.g. Coronary Bypass CABG"
              value={surgeryName}
              onChange={(e) => setSurgeryName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 rounded-xl focus:outline-none font-semibold text-slate-700 placeholder-slate-400 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Primary Surgeon</label>
            <select
              required
              value={surgeonId}
              onChange={(e) => setSurgeonId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl focus:outline-none font-semibold text-slate-600 transition"
            >
              <option value="">Select Surgeon...</option>
              {surgeons.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.specialization?.split(" ")[0]})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Assistant Surgeon</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Tanbin Nishad"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 rounded-xl focus:outline-none font-semibold text-slate-700 placeholder-slate-400 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Anesthesiologist</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Sheikh Sifat Roshidi"
              value={anesthesiologistName}
              onChange={(e) => setAnesthesiologistName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 rounded-xl focus:outline-none font-semibold text-slate-700 placeholder-slate-400 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Scrub Nurse</label>
            <input
              type="text"
              required
              placeholder="e.g. Nurse Sumaiya Jannat"
              value={scrubNurseName}
              onChange={(e) => setScrubNurseName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 rounded-xl focus:outline-none font-semibold text-slate-700 placeholder-slate-400 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">OT Room Assignment</label>
            <select
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl focus:outline-none font-semibold text-slate-600 transition"
            >
              <option value="OT Room-01">OT Suite-01</option>
              <option value="OT Room-02">OT Suite-02</option>
              <option value="OT Room-03">OT Suite-03</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Estimated Duration</label>
            <input
              type="text"
              placeholder="e.g. 2.5 hours"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 rounded-xl focus:outline-none font-semibold text-slate-700 placeholder-slate-400 transition"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      )}

      {/* Grid mapping surgical cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {otSessions.map((session) => (
          <div
            key={session.id}
            className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 hover:translate-y-[-2px] transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/40 pb-3.5 mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold font-mono">{session.roomNumber}</span>
                  <h4 className="font-extrabold text-slate-800 text-sm mt-0.5">{session.surgeryName}</h4>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${getStatusColor(session.status)}`}>
                  {session.status}
                </span>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs font-semibold text-slate-600 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Patient</span>
                  <span className="text-slate-800 font-extrabold flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {session.patientName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Primary Surgeon</span>
                  <span className="text-slate-700 font-bold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    {session.primarySurgeonName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Anesthesiologist</span>
                  <span className="text-slate-600 font-medium">{session.anesthesiologistName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assistant Surgeon</span>
                  <span className="text-slate-600 font-medium">{session.assistantSurgeonName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Scrub Nurse</span>
                  <span className="text-slate-600 font-medium">{session.scrubNurseName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Scheduled Start</span>
                  <span className="text-slate-700 font-mono font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {session.startTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom track status action */}
            {session.status === "Preparation" && (
              <div className="flex items-center justify-between bg-white/40 border border-white/40 rounded-xl p-3">
                <p className="text-[11px] text-slate-600 font-medium">Awaiting patient transfer to suite</p>
                <button
                  onClick={() => {
                    session.status = "Active Surgery";
                    onAddSession({ ...session });
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] transition cursor-pointer"
                >
                  Engage Surgery
                </button>
              </div>
            )}

            {session.status === "Active Surgery" && (
              <div className="flex items-center justify-between bg-rose-50/60 backdrop-blur-sm border border-rose-200/50 rounded-xl p-3">
                <p className="text-[11px] text-rose-800 font-extrabold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-rose-600" />
                  INCISION ENGAGED (Countdown: {session.estimatedDuration})
                </p>
                <button
                  onClick={() => {
                    session.status = "Recovery";
                    onAddSession({ ...session });
                  }}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-[10px] transition cursor-pointer"
                >
                  Send to Recovery
                </button>
              </div>
            )}

            {session.status === "Recovery" && (
              <div className="flex items-center justify-between bg-cyan-50/60 backdrop-blur-sm border border-cyan-200/50 rounded-xl p-3">
                <p className="text-[11px] text-cyan-800 font-bold">Patient is waking from anesthesia</p>
                <button
                  onClick={() => {
                    session.status = "Completed";
                    onAddSession({ ...session });
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition cursor-pointer"
                >
                  Discharge Suite
                </button>
              </div>
            )}

            {session.status === "Completed" && (
              <div className="flex items-center gap-1 text-emerald-800 font-bold text-xs bg-emerald-50/60 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-3">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Surgical mission completed successfully. Room sterile prepared.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
