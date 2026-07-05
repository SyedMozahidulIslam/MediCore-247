/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Heart, HeartPulse, Search, PlusCircle, Activity, ShieldCheck, Clipboard, UserCheck } from "lucide-react";
import { Patient, Bed as BedType } from "../../types";

interface PatientPortalProps {
  patients: Patient[];
  beds: BedType[];
  onAddPatient: (newPatient: Patient) => void;
  onUpdatePatientVitals: (id: string, vitals: Patient["vitals"]) => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  patients,
  beds,
  onAddPatient,
  onUpdatePatientVitals
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatId, setSelectedPatId] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // New patient form state
  const [name, setName] = useState("");
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [bloodType, setBloodType] = useState("O+");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [insurance, setInsurance] = useState("");
  const [freeEligible, setFreeEligible] = useState(false);

  // Log vitals form state
  const [bp, setBp] = useState("120/80");
  const [temp, setTemp] = useState("98.6 F");
  const [pulse, setPulse] = useState("72 bpm");
  const [spO2, setSpO2] = useState("98%");

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    const activeBeds = beds.filter(b => b.status === "Available" && b.type === "General Ward");
    const assignedBed = activeBeds[0];

    const newPatient: Patient = {
      id: `PAT-0${(patients.length + 1).toString().padStart(2, '0')}`,
      name,
      age,
      gender,
      bloodType,
      phone,
      email,
      address,
      insuranceProvider: insurance || undefined,
      freeTreatmentEligible: freeEligible,
      status: "Admitted",
      bedId: assignedBed?.id || "BED-GW-203",
      admissionDate: new Date().toISOString().split("T")[0],
      vitals: { bp: "120/80", temp: "98.6 F", pulse: "72 bpm", spO2: "98%", lastUpdated: "Just now" },
      medicalHistory: [
        { diagnosis: "Admission Baseline Assessment", date: "2026-07-04", notes: "Patient admitted under clinical care protocol." }
      ]
    };

    onAddPatient(newPatient);
    setShowAddForm(false);
    setSelectedPatId(newPatient.id);

    // Reset Form
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setInsurance("");
    setFreeEligible(false);
  };

  const handleUpdateVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = selectedPatId || patients[0]?.id;
    if (!targetId) return;

    onUpdatePatientVitals(targetId, {
      bp,
      temp,
      pulse,
      spO2,
      lastUpdated: "Just now"
    });

    alert("Clinical vitals updated & pushed to telemetry monitors!");
  };

  const selectedPatient = patients.find(p => p.id === selectedPatId) || patients[0];

  return (
    <div className="space-y-6">
      {/* Patient Intake Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Dynamic Medical Records Core</h3>
          <p className="text-xs text-slate-500 font-medium">Log clinician assessments, live vitals tracking, and admission registrations</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Patient Admission Intake
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreatePatient} className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
          <div className="md:col-span-3 border-b border-white/40 pb-2">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              Electronic Intake Form
            </h4>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Salim Rahaman Dipu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 focus:border-emerald-500 rounded-xl focus:outline-none font-semibold text-slate-700 placeholder-slate-400 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Age</label>
            <input
              type="number"
              required
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 focus:border-emerald-500 rounded-xl focus:outline-none font-semibold text-slate-700 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl focus:outline-none font-semibold text-slate-600 transition"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Blood Type</label>
            <input
              type="text"
              required
              placeholder="e.g. A+"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 focus:border-emerald-500 rounded-xl focus:outline-none font-semibold text-slate-700 placeholder-slate-400 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Contact Phone</label>
            <input
              type="text"
              required
              placeholder="e.g. +880-1711..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 focus:border-emerald-500 rounded-xl focus:outline-none font-semibold text-slate-700 placeholder-slate-400 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Address</label>
            <input
              type="text"
              required
              placeholder="e.g. Mirpur, Dhaka"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 focus:border-emerald-500 rounded-xl focus:outline-none font-semibold text-slate-700 placeholder-slate-400 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Insurance Provider (Optional)</label>
            <input
              type="text"
              placeholder="e.g. MetLife"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 focus:border-emerald-500 rounded-xl focus:outline-none font-semibold text-slate-700 placeholder-slate-400 transition"
            />
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="freeEligible"
              checked={freeEligible}
              onChange={(e) => setFreeEligible(e.target.checked)}
              className="w-4 h-4 text-emerald-600 border-white/50 rounded focus:ring-emerald-500"
            />
            <label htmlFor="freeEligible" className="text-xs font-bold text-slate-600">Free/Charity treatment candidate</label>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
            >
              Admit Patient
            </button>
          </div>
        </form>
      )}

      {/* Directory & Assessment panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Index list */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search patients index..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 rounded-xl focus:outline-none focus:border-emerald-500 font-semibold text-slate-800 placeholder-slate-400 transition"
            />
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredPatients.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatId(p.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  selectedPatient?.id === p.id
                    ? "bg-white text-emerald-800 border-emerald-400/50 shadow-sm"
                    : "bg-white/40 border-white/40 hover:bg-white/60"
                }`}
              >
                <div>
                  <h5 className="text-xs font-extrabold text-slate-800">{p.name}</h5>
                  <p className="text-[9px] text-slate-500 font-extrabold font-mono mt-0.5">{p.id} | {p.age} yrs | {p.bloodType}</p>
                </div>
                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-lg border uppercase ${
                  p.status === "Admitted" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Clinical Assessment details */}
        {selectedPatient && (
          <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6 lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/40 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {selectedPatient.name.split(" ").slice(-1)[0]?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">{selectedPatient.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">Blood Group: {selectedPatient.bloodType} | Bed: {selectedPatient.bedId || "OPD Case"}</p>
                </div>
              </div>

              {selectedPatient.freeTreatmentEligible && (
                <span className="text-[10px] font-bold text-emerald-700 bg-white/70 border border-white/60 px-3 py-1 rounded-xl uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <UserCheck className="w-3.5 h-3.5" />
                  CHARITY CANDIDATE
                </span>
              )}
            </div>

            {/* Vitals logs row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  Blood Pressure
                </span>
                <span className="text-lg font-mono font-extrabold text-slate-800 mt-2">{selectedPatient.vitals?.bp || "N/A"}</span>
              </div>
              <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  Heart Rate
                </span>
                <span className="text-lg font-mono font-extrabold text-slate-800 mt-2">{selectedPatient.vitals?.pulse || "N/A"}</span>
              </div>
              <div className="bg-teal-50/40 border border-teal-100 rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-teal-500 uppercase tracking-widest flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
                  Oxygen Saturation
                </span>
                <span className="text-lg font-mono font-extrabold text-slate-800 mt-2">{selectedPatient.vitals?.spO2 || "N/A"}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Body Temp
                </span>
                <span className="text-lg font-mono font-extrabold text-slate-800 mt-2">{selectedPatient.vitals?.temp || "N/A"}</span>
              </div>
            </div>

            {/* Interactive Vitals Logger */}
            <form onSubmit={handleUpdateVitals} className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-5 gap-3.5">
              <div className="md:col-span-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Clipboard className="w-3.5 h-3.5 text-emerald-600" />
                  Pushed Telemetry Update
                </span>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="BP (e.g. 120/80)"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/85 border border-white/50 focus:border-emerald-500 rounded-lg text-slate-800 focus:outline-none transition font-semibold"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Temp (e.g. 98.6 F)"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/85 border border-white/50 focus:border-emerald-500 rounded-lg text-slate-800 focus:outline-none transition font-semibold"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Pulse (e.g. 72 bpm)"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/85 border border-white/50 focus:border-emerald-500 rounded-lg text-slate-800 focus:outline-none transition font-semibold"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="spO2 (e.g. 98%)"
                  value={spO2}
                  onChange={(e) => setSpO2(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/85 border border-white/50 focus:border-emerald-500 rounded-lg text-slate-800 focus:outline-none transition font-semibold"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] shadow-sm transition cursor-pointer"
                >
                  Log Telemetry
                </button>
              </div>
            </form>

            {/* Medical History timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3.5">Clinical History timeline</h4>
              <div className="space-y-4">
                {selectedPatient.medicalHistory.map((history, idx) => (
                  <div key={idx} className="flex gap-4 border-l-2 border-emerald-100 pl-4 pb-1 relative">
                    <span className="w-3 h-3 bg-emerald-500 border border-white rounded-full absolute -left-[7px] top-1" />
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">{history.date}</span>
                      <h5 className="text-xs font-bold text-slate-800 mt-0.5">{history.diagnosis}</h5>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-1">{history.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
