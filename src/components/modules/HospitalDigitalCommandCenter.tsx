/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Building, Activity, Bed, Users, Shield, Clock, Map, AlertTriangle, Play,
  Cpu, Zap, HeartPulse, CheckCircle2, RefreshCw, Radio, UserCheck, Flame, 
  MapPin, Navigation, Compass, Star, TrendingUp, Sparkles, AlertCircle
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell 
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { Patient, Bed as BedType, Ambulance, OperationTheatreSession, BiomedicalAsset, Employee, UserRole } from "../../types";

interface DigitalCommandCenterProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  beds: BedType[];
  setBeds: React.Dispatch<React.SetStateAction<BedType[]>>;
  ambulances: Ambulance[];
  setAmbulances: React.Dispatch<React.SetStateAction<Ambulance[]>>;
  otSessions: OperationTheatreSession[];
  setOtSessions: React.Dispatch<React.SetStateAction<OperationTheatreSession[]>>;
  employees: Employee[];
  biomedicalAssets: BiomedicalAsset[];
  setBiomedicalAssets: React.Dispatch<React.SetStateAction<BiomedicalAsset[]>>;
  addLog: (action: string) => void;
}

export const HospitalDigitalCommandCenter: React.FC<DigitalCommandCenterProps> = ({
  patients,
  setPatients,
  beds,
  setBeds,
  ambulances,
  setAmbulances,
  otSessions,
  setOtSessions,
  employees,
  biomedicalAssets,
  setBiomedicalAssets,
  addLog
}) => {
  // Navigation active floor
  const [activeFloor, setActiveFloor] = useState<"GF" | "F1" | "F3" | "B1">("GF");
  // Visual Mode (Normal vs Occupancy Heatmap)
  const [isHeatmapMode, setIsHeatmapMode] = useState<boolean>(false);
  // Selected Room/Section for drill-down analysis
  const [selectedRoom, setSelectedRoom] = useState<string | null>("EMERGENCY_DEPT");
  // Selected ambulance index for radar tracking
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string | null>(null);
  
  // Simulated State for live progress
  const [simulatedTime, setSimulatedTime] = useState<string>("08:00");
  const [erWaitTime, setErWaitTime] = useState<number>(14); // in minutes
  const [activeAlerts, setActiveAlerts] = useState<Array<{ id: string; msg: string; severity: "critical" | "warning"; room: string; time: string }>>([
    { id: "A1", msg: "Ventilator VNT-404 SPO2 Alert", severity: "critical", room: "ICU-Bed-02", time: "Just Now" },
    { id: "A2", msg: "High Cardiac Intake Rate", severity: "warning", room: "Emergency Room", time: "4m ago" },
    { id: "A3", msg: "Ambulance AMB-102 Sirens Engaged", severity: "warning", room: "Central Highway", time: "12m ago" }
  ]);

  // Hourly analytical records for the Recharts KPI
  const kpiHistoryData = [
    { hour: "00:00", waitTime: 8, throughput: 12, icuOcc: 65, otActive: 1 },
    { hour: "04:00", waitTime: 5, throughput: 8, icuOcc: 70, otActive: 0 },
    { hour: "08:00", waitTime: 12, throughput: 28, icuOcc: 75, otActive: 2 },
    { hour: "12:00", waitTime: 18, throughput: 42, icuOcc: 80, otActive: 3 },
    { hour: "16:00", waitTime: 15, throughput: 36, icuOcc: 85, otActive: 3 },
    { hour: "20:00", waitTime: 14, throughput: 24, icuOcc: 85, otActive: 2 }
  ];

  // Map floor nodes
  const roomsByFloor = {
    GF: [
      { id: "EMERGENCY_DEPT", name: "Trauma & Emergency Wing", bedsCount: 12, occupied: 10, status: "Critical Surge", color: "fill-rose-100 stroke-rose-500 hover:fill-rose-200/90", heatmapColor: "bg-rose-500/30 text-rose-700 shadow-rose-500/20", equipment: ["3 Defibrillators", "2 Patient Monitors"], coords: { x: 30, y: 30, w: 220, h: 140 }, waitTime: "18m" },
      { id: "MAIN_RECEPTION", name: "Lobby & Care Coordination", bedsCount: 0, occupied: 0, status: "Normal Flow", color: "fill-emerald-50 stroke-emerald-500 hover:fill-emerald-100/90", heatmapColor: "bg-emerald-500/20 text-emerald-700 shadow-emerald-500/10", equipment: ["Token Dispatcher", "KIOSK-01"], coords: { x: 30, y: 190, w: 220, h: 140 }, waitTime: "4m" },
      { id: "PHARMACY_CENTRAL", name: "Outpatient Automated Pharmacy", bedsCount: 0, occupied: 0, status: "High Demand", color: "fill-teal-100 stroke-teal-500 hover:fill-teal-200/90", heatmapColor: "bg-teal-500/20 text-teal-700 shadow-teal-500/10", equipment: ["Automated Dispenser AD-3", "Cold Storage A"], coords: { x: 270, y: 190, w: 180, h: 140 }, waitTime: "9m" },
      { id: "TRIAGE_AREA", name: "Rapid Assessment & Triage", bedsCount: 4, occupied: 3, status: "Active Triage", color: "fill-amber-100 stroke-amber-500 hover:fill-amber-200/90", heatmapColor: "bg-amber-500/30 text-amber-700 shadow-amber-500/20", equipment: ["2 ECG Monitors", "Triage Console"], coords: { x: 270, y: 30, w: 180, h: 140 }, waitTime: "11m" },
      { id: "RADIOLOGY_PAVILION", name: "Radiology & imaging Pavilion", bedsCount: 2, occupied: 1, status: "Operating", color: "fill-sky-100 stroke-sky-500 hover:fill-sky-200/90", heatmapColor: "bg-sky-500/20 text-sky-700 shadow-sky-500/10", equipment: ["3T MRI Scanner", "CT Scanner Suite"], coords: { x: 470, y: 30, w: 200, h: 300 }, waitTime: "15m" }
    ],
    F1: [
      { id: "LAB_SERVICES", name: "Diagnostics & Pathology Lab", bedsCount: 0, occupied: 0, status: "Processing", color: "fill-teal-50 stroke-teal-500 hover:fill-teal-100/90", heatmapColor: "bg-teal-500/10 text-teal-700 shadow-teal-500/5", equipment: ["Bio-Safety Hood", "Centrifuge Stack"], coords: { x: 30, y: 30, w: 320, h: 140 }, waitTime: "5m" },
      { id: "PEDIATRICS_WARD", name: "Pediatric Ward (Wing A)", bedsCount: 15, occupied: 6, status: "Stable", color: "fill-indigo-50 stroke-indigo-400 hover:fill-indigo-100/90", heatmapColor: "bg-indigo-500/15 text-indigo-700 shadow-indigo-500/10", equipment: ["Infant Incubator", "Phototherapy Unit"], coords: { x: 370, y: 30, w: 300, h: 140 }, waitTime: "10m" },
      { id: "GENERAL_MED_WARD", name: "General Medicine Floor (Wing B)", bedsCount: 30, occupied: 26, status: "Near Capacity", color: "fill-rose-50 stroke-rose-400 hover:fill-rose-100/90", heatmapColor: "bg-rose-500/25 text-rose-700 shadow-rose-500/20", equipment: ["12 Multi-param Monitors"], coords: { x: 30, y: 190, w: 640, h: 140 }, waitTime: "12m" }
    ],
    F3: [
      { id: "ICU_BLOCK_A", name: "Intensive Care Unit (ICU Wing A)", bedsCount: 10, occupied: 9, status: "Critical Support", color: "fill-red-100 stroke-red-600 hover:fill-red-200/95", heatmapColor: "bg-red-500/40 text-red-700 shadow-red-500/30", equipment: ["8 Ventilators", "8 Infusion Stacks"], coords: { x: 30, y: 30, w: 320, h: 140 }, waitTime: "Immediate" },
      { id: "OT_COMPLEX_MAIN", name: "Operating Theatre Complex (OT 1-4)", bedsCount: 4, occupied: 3, status: "Live Surgeries", color: "fill-indigo-100 stroke-indigo-600 hover:fill-indigo-200/95", heatmapColor: "bg-indigo-500/35 text-indigo-700 shadow-indigo-500/20", equipment: ["OT Lights", "Anesthesia Stations"], coords: { x: 370, y: 30, w: 300, h: 140 }, waitTime: "Scheduled" },
      { id: "RECOVERY_SUITE", name: "Post-Anesthesia Care (PACU)", bedsCount: 8, occupied: 4, status: "Recovery Care", color: "fill-emerald-50 stroke-emerald-500 hover:fill-emerald-100/90", heatmapColor: "bg-emerald-500/20 text-emerald-700 shadow-emerald-500/10", equipment: ["Pulse Oximetry Towers"], coords: { x: 30, y: 190, w: 320, h: 140 }, waitTime: "2m" },
      { id: "ISOLATION_ZONE", name: "Biosecurity Isolation Ward", bedsCount: 6, occupied: 2, status: "Sterile Hold", color: "fill-amber-100 stroke-amber-500 hover:fill-amber-200/90", heatmapColor: "bg-amber-500/15 text-amber-700 shadow-amber-500/10", equipment: ["Negative Pressure Valve"], coords: { x: 370, y: 190, w: 300, h: 140 }, waitTime: "Immediate" }
    ],
    B1: [
      { id: "AMBULANCE_BAY", name: "Emergency Fleet Station & Bay", bedsCount: 0, occupied: 0, status: "Standby Active", color: "fill-sky-100 stroke-sky-500 hover:fill-sky-200/90", heatmapColor: "bg-sky-500/20 text-sky-700 shadow-sky-500/10", equipment: ["Fueling Depot", "Crew Dispatch Center"], coords: { x: 30, y: 30, w: 420, h: 300 }, waitTime: "0m" },
      { id: "CENTRAL_SUPPLY", name: "Central Materials & Sterile Store", bedsCount: 0, occupied: 0, status: "Sufficient", color: "fill-zinc-100 stroke-zinc-400 hover:fill-zinc-200/90", heatmapColor: "bg-zinc-500/10 text-zinc-700 shadow-zinc-500/5", equipment: ["Sterilization Autoclave", "Inventory Nodes"], coords: { x: 470, y: 30, w: 200, h: 300 }, waitTime: "N/A" }
    ]
  };

  // Keep simulated time updated
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedTime(prev => {
        const [h, m] = prev.split(":").map(Number);
        let nm = m + 1;
        let nh = h;
        if (nm >= 60) {
          nm = 0;
          nh = (h + 1) % 24;
        }
        return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
      });
    }, 15000); // 15 seconds real-time is 1 minute simulated time
    return () => clearInterval(timer);
  }, []);

  // Compute stats
  const totalBedsCount = beds.length;
  const occupiedBedsCount = beds.filter(b => b.status === "Occupied").length;
  const generalBeds = beds.filter(b => b.type === "General Ward");
  const icuBeds = beds.filter(b => b.type === "ICU");
  const occupiedIcuCount = icuBeds.filter(b => b.status === "Occupied").length;
  const activeOTSessionCount = otSessions.filter(s => s.status === "Active Surgery").length;
  const dispatchedAmbulanceCount = ambulances.filter(a => a.status === "Dispatched" || a.status === "Heading to Hospital" || a.status === "At Location").length;
  const activeScannersCount = biomedicalAssets.filter(a => a.status === "Active" || a.status === "In Use").length;
  const emergencyQueuePatientsCount = patients.filter(p => p.status === "Emergency Queue").length;

  // Find selected room information
  const currentFloorRooms = roomsByFloor[activeFloor];
  const selectedRoomDetails = Object.values(roomsByFloor).flatMap(r => r).find(r => r.id === selectedRoom);

  // Simulation actions
  const triggerCardiacAlert = () => {
    const criticalPatient = patients.find(p => p.status === "Admitted" && p.vitals);
    if (!criticalPatient) return;
    
    // update vitals of this patient to critical values
    const updatedVitals = {
      bp: "85/45",
      temp: "102.1 F",
      pulse: "138 bpm",
      spO2: "86%",
      lastUpdated: "Just Now"
    };

    setPatients(prev => prev.map(p => p.id === criticalPatient.id ? { ...p, vitals: updatedVitals } : p));
    
    // Add critical command center alert
    const newAlert = {
      id: `CRIT-${Date.now()}`,
      msg: `CARDIAC ARREST WARNING: ${criticalPatient.name} SPO2 level critical!`,
      severity: "critical" as const,
      room: criticalPatient.bedId || "ICU Room A",
      time: "Just Now"
    };
    
    setActiveAlerts(prev => [newAlert, ...prev]);
    addLog(`COMMAND ALERT: Cardiac Telemetry Warning generated for ${criticalPatient.name} [${criticalPatient.id}]`);
  };

  const simulateEmergencyIntake = () => {
    const intakeNames = ["Faisal Ahmed", "Tamim Iqbal", "Sultana Chowdhury", "Nabila Khan", "Arif Rahman"];
    const randomName = intakeNames[Math.floor(Math.random() * intakeNames.length)];
    const randomAge = Math.floor(Math.random() * 60) + 15;
    const bloodTypes = ["A+", "O+", "B+", "AB-"];
    const triageCategories = ["Critical", "Urgent", "Routine"];
    
    const newPatientId = `PAT-${Math.floor(100 + Math.random() * 900)}`;
    const newPatient: Patient = {
      id: newPatientId,
      name: randomName,
      age: randomAge,
      gender: Math.random() > 0.5 ? "Male" : "Female",
      bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
      phone: `+880-1712-${Math.floor(100000 + Math.random() * 900000)}`,
      email: `${randomName.toLowerCase().replace(" ", ".")}@example.com`,
      address: "Dhaka Central Area",
      freeTreatmentEligible: Math.random() > 0.8,
      status: "Emergency Queue",
      vitals: {
        bp: "145/95",
        temp: "99.8 F",
        pulse: "112 bpm",
        spO2: "93%",
        lastUpdated: "Just Now"
      },
      medicalHistory: [{ diagnosis: "Trauma Intake", date: "2026-07-05", notes: "Emergency incoming, immediate assessment needed." }]
    };

    setPatients(prev => [newPatient, ...prev]);
    setErWaitTime(prev => Math.min(45, prev + 3));
    
    const newAlert = {
      id: `AL-${Date.now()}`,
      msg: `New trauma casualty ${randomName} enrolled in emergency triage`,
      severity: "warning" as const,
      room: "Triage Reception",
      time: "Just Now"
    };

    setActiveAlerts(prev => [newAlert, ...prev]);
    addLog(`COMMAND CENTER: Registered emergency patient intake: ${randomName} (${newPatientId})`);
  };

  const dispatchAmbulanceFleet = () => {
    const standbyAmbulance = ambulances.find(a => a.status === "Available");
    if (!standbyAmbulance) {
      alert("All emergency ambulance crews are currently dispatched or in repair nodes!");
      return;
    }

    const destinations = ["Gulsan Circle 2", "Dhanmondi Lake R27", "Mohakhali Flyover", "Airport Rd Bypass"];
    const randomDest = destinations[Math.floor(Math.random() * destinations.length)];

    const updatedAmbulance: Ambulance = {
      ...standbyAmbulance,
      status: "Dispatched",
      destinationName: randomDest,
      fuelLevel: Math.max(20, standbyAmbulance.fuelLevel - 5),
    };

    setAmbulances(prev => prev.map(a => a.id === standbyAmbulance.id ? updatedAmbulance : a));
    setSelectedAmbulanceId(standbyAmbulance.id);

    const newAlert = {
      id: `AMB-${Date.now()}`,
      msg: `Ambulance ${standbyAmbulance.vehicleNumber} dispatched to ${randomDest}`,
      severity: "warning" as const,
      room: "Ambulance Bay",
      time: "Just Now"
    };

    setActiveAlerts(prev => [newAlert, ...prev]);
    addLog(`COMMAND RADAR: Ambulance ${standbyAmbulance.vehicleNumber} launched towards ${randomDest}`);
  };

  const admitEmergencyPatient = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    // Find available bed matching appropriate care needs
    const availableBed = beds.find(b => b.status === "Available" && b.type === "Emergency");
    const backupBed = beds.find(b => b.status === "Available");
    const targetBed = availableBed || backupBed;

    if (!targetBed) {
      alert("No available beds on any floor wing! Clear beds or transfer outpatient nodes first.");
      return;
    }

    // Assign bed
    setBeds(prev => prev.map(b => b.id === targetBed.id ? { ...b, status: "Occupied", patientId: patient.id } : b));
    setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, status: "Admitted", bedId: targetBed.id } : p));
    setErWaitTime(prev => Math.max(5, prev - 2));

    addLog(`COMMAND INTEL: Successfully assigned ${patient.name} to Ward Room ${targetBed.number} (${targetBed.type})`);
  };

  return (
    <div className="space-y-6">
      {/* Title & Live Status Ticker */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[24px] border border-white/60 p-6 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] flex flex-col lg:flex-row items-center justify-between gap-5 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl text-slate-900 shadow-md flex items-center justify-center transform hover:rotate-6 transition duration-300">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">Supreme Digital Command Center</h2>
              <span className="text-[9px] bg-red-500/10 text-red-600 font-extrabold px-2.5 py-1 rounded-full animate-pulse uppercase tracking-wider border border-red-500/20 flex items-center gap-1">
                <Flame className="w-2.5 h-2.5" /> LIVE SYSTEM
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold flex flex-wrap items-center gap-2 mt-1.5">
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Simulated Server Time: <span className="font-mono font-bold text-slate-800 bg-slate-100/80 border border-slate-200/40 px-2 py-0.5 rounded">{simulatedTime} BST</span>
              </span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span className="flex items-center gap-1 text-slate-600">
                Average waiting time: <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100/40 font-mono">{erWaitTime} mins</span>
              </span>
            </p>
          </div>
        </div>

        {/* Global Active Simulation Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={simulateEmergencyIntake}
            className="flex-1 lg:flex-initial text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 px-4.5 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-[0_8px_20px_rgba(245,158,11,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-amber-400/20 cursor-pointer"
          >
            <Activity className="w-4 h-4" /> Simulate Emergency
          </button>
          <button 
            onClick={dispatchAmbulanceFleet}
            className="flex-1 lg:flex-initial text-xs font-bold bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white px-4.5 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-[0_8px_20px_rgba(14,165,233,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-sky-500/20 cursor-pointer"
          >
            <Navigation className="w-4 h-4 animate-bounce" /> Launch Emergency Fleet
          </button>
          <button 
            onClick={triggerCardiacAlert}
            className="flex-1 lg:flex-initial text-xs font-bold bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white px-4.5 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-[0_8px_20px_rgba(244,63,94,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-rose-500/20 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" /> Inject Vitals Alert
          </button>
        </div>
      </div>

      {/* TOP Executive KPIs Section */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* KPI 1: Bed Occupancy */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-4.5 shadow-[0_4px_20px_0_rgba(15,23,42,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_0_rgba(15,23,42,0.06)] hover:bg-white/80 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-display">Bed Occupancy</span>
            <Bed className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-800 font-mono tracking-tight">{Math.round((occupiedBedsCount / totalBedsCount) * 100)}%</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">{occupiedBedsCount} of {totalBedsCount} Beds</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(occupiedBedsCount / totalBedsCount) * 100}%` }}
            />
          </div>
        </div>

        {/* KPI 2: ICU Capacity */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-4.5 shadow-[0_4px_20px_0_rgba(15,23,42,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_0_rgba(15,23,42,0.06)] hover:bg-white/80 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-display">ICU Utilization</span>
            <Zap className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-800 font-mono tracking-tight">{Math.round((occupiedIcuCount / icuBeds.length) * 100)}%</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">{occupiedIcuCount} of {icuBeds.length} ICU Beds</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-red-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(occupiedIcuCount / icuBeds.length) * 100}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Emergency Queue */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-4.5 shadow-[0_4px_20px_0_rgba(15,23,42,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_0_rgba(15,23,42,0.06)] hover:bg-white/80 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-display">Emergency Queue</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-800 font-mono tracking-tight">{emergencyQueuePatientsCount}</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Awaiting Clinician Triage</p>
          </div>
          <div className="flex gap-1.5 mt-3 text-[9px] font-extrabold">
            <span className="bg-red-500/10 text-red-600 border border-red-500/20 px-2 py-0.5 rounded">RED: {patients.filter(p => p.status === "Emergency Queue" && p.vitals && Number(p.vitals.pulse) > 105).length}</span>
            <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded">AMB: {patients.filter(p => p.status === "Emergency Queue" && p.vitals && Number(p.vitals.pulse) <= 105).length}</span>
          </div>
        </div>

        {/* KPI 4: Active Surgeries */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-4.5 shadow-[0_4px_20px_0_rgba(15,23,42,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_0_rgba(15,23,42,0.06)] hover:bg-white/80 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-display">OT Surgeries</span>
            <Shield className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-800 font-mono tracking-tight">{activeOTSessionCount} / 4</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Active Operation Rooms</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(activeOTSessionCount / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* KPI 5: Fleet Active */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-4.5 shadow-[0_4px_20px_0_rgba(15,23,42,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_0_rgba(15,23,42,0.06)] hover:bg-white/80 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-display">Ambulance Fleet</span>
            <Navigation className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-800 font-mono tracking-tight">{dispatchedAmbulanceCount} / {ambulances.length}</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Dispatched En Route</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-sky-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(dispatchedAmbulanceCount / ambulances.length) * 100}%` }}
            />
          </div>
        </div>

        {/* KPI 6: Equipment Status */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-4.5 shadow-[0_4px_20px_0_rgba(15,23,42,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_0_rgba(15,23,42,0.06)] hover:bg-white/80 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-display">Device Health</span>
            <Cpu className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-800 font-mono tracking-tight">{activeScannersCount} / {biomedicalAssets.length}</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Devices On-line</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-teal-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(activeScannersCount / biomedicalAssets.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: Map + Detailed Telemetry */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Interactive Floor Plan Block (Span 2) */}
        <div className="xl:col-span-2 bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] flex flex-col justify-between hover:shadow-[0_12px_40px_0_rgba(15,23,42,0.06)] transition-all duration-300">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight font-display">Dynamic Hospital Floor Mapping</h3>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">Inspect wing occupancy, medical device links, and average wait-times in real-time</p>
            </div>

            {/* Toggle options */}
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setIsHeatmapMode(!isHeatmapMode)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-sm border cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                  isHeatmapMode 
                    ? "bg-red-500/10 text-red-700 border-red-300/40" 
                    : "bg-white/60 text-slate-600 border-slate-200/60"
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${isHeatmapMode ? "text-red-600" : "text-slate-400"}`} />
                {isHeatmapMode ? "Heatmap Active" : "Heatmap Overlay"}
              </button>

              <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200/55">
                {[
                  { k: "B1", n: "B1" },
                  { k: "GF", n: "GF" },
                  { k: "F1", n: "1F" },
                  { k: "F3", n: "3F" }
                ].map(f => (
                  <button
                    key={f.k}
                    onClick={() => {
                      setActiveFloor(f.k as any);
                      // Auto select first room in floor
                      setSelectedRoom(roomsByFloor[f.k as any][0]?.id || null);
                    }}
                    className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      activeFloor === f.k 
                        ? "bg-white text-emerald-700 shadow-sm" 
                        : "text-slate-500 hover:text-slate-950"
                    }`}
                  >
                    {f.n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Render Active SVG Plan */}
          <div className="relative border border-white/40 bg-slate-50/50 backdrop-blur-sm rounded-2xl p-4 flex justify-center items-center overflow-x-auto min-h-[350px]">
            {isHeatmapMode && (
              <div className="absolute top-3 left-3 bg-red-100/90 text-red-800 text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                OCCUPANCY DENSITY ANALYSIS ACTIVE
              </div>
            )}

            <svg viewBox="0 0 700 360" className="w-full max-w-[700px] h-auto drop-shadow-md">
              {/* Ground structure border outline */}
              <rect x="5" y="5" width="690" height="350" rx="20" fill="#ffffff" fillOpacity="0.3" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 5" />
              
              {/* Floor Plan Corridor line markings */}
              <line x1="260" y1="15" x2="260" y2="345" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="3 3" />
              <line x1="460" y1="15" x2="460" y2="345" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="3 3" />

              {/* Room Blocks mapping */}
              {currentFloorRooms.map((room) => {
                const isSelected = selectedRoom === room.id;
                // Heatmap logic colors
                const percentage = room.bedsCount > 0 ? (room.occupied / room.bedsCount) * 100 : 0;
                let strokeColor = isSelected ? "#059669" : "#94a3b8";
                let fillColor = isSelected ? "rgba(16, 185, 129, 0.15)" : "rgba(248, 250, 252, 0.8)";
                
                if (isHeatmapMode) {
                  if (percentage >= 80) {
                    fillColor = "rgba(239, 68, 68, 0.25)";
                    strokeColor = "#ef4444";
                  } else if (percentage >= 50) {
                    fillColor = "rgba(245, 158, 11, 0.2)";
                    strokeColor = "#f59e0b";
                  } else if (room.bedsCount > 0) {
                    fillColor = "rgba(16, 185, 129, 0.15)";
                    strokeColor = "#10b981";
                  } else {
                    fillColor = "rgba(148, 163, 184, 0.1)";
                    strokeColor = "#cbd5e1";
                  }
                }

                return (
                  <g key={room.id} className="cursor-pointer" onClick={() => setSelectedRoom(room.id)}>
                    {/* Pulsing ring outline if selected */}
                    {isSelected && (
                      <rect
                        x={room.coords.x - 4}
                        y={room.coords.y - 4}
                        width={room.coords.w + 8}
                        height={room.coords.h + 8}
                        rx="16"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="animate-spin duration-[20s]"
                      />
                    )}

                    {/* Room Block Rect */}
                    <rect
                      x={room.coords.x}
                      y={room.coords.y}
                      width={room.coords.w}
                      height={room.coords.h}
                      rx="12"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all duration-300"
                    />

                    {/* Heatmap Pulsing Core */}
                    {isHeatmapMode && percentage >= 80 && (
                      <circle
                        cx={room.coords.x + room.coords.w - 18}
                        cy={room.coords.y + 18}
                        r="6"
                        fill="#ef4444"
                        className="animate-ping"
                      />
                    )}

                    {/* Room label */}
                    <text
                      x={room.coords.x + room.coords.w / 2}
                      y={room.coords.y + room.coords.h / 2 - 10}
                      textAnchor="middle"
                      className="font-black text-[10px] fill-slate-800 tracking-tight"
                    >
                      {room.name.length > 25 ? `${room.name.slice(0, 25)}...` : room.name}
                    </text>

                    {/* Room status stats */}
                    <text
                      x={room.coords.x + room.coords.w / 2}
                      y={room.coords.y + room.coords.h / 2 + 10}
                      textAnchor="middle"
                      className="font-bold text-[9px] fill-slate-500"
                    >
                      {room.bedsCount > 0 ? `Occupied: ${room.occupied}/${room.bedsCount}` : "Access Node"}
                    </text>

                    {/* Waiting time badge */}
                    <text
                      x={room.coords.x + room.coords.w / 2}
                      y={room.coords.y + room.coords.h / 2 + 25}
                      textAnchor="middle"
                      className={`font-mono text-[8px] font-bold ${
                        room.waitTime === "Immediate" || room.waitTime === "Critical Surge"
                          ? "fill-red-600"
                          : "fill-emerald-600"
                      }`}
                    >
                      Wait: {room.waitTime}
                    </text>
                  </g>
                );
              })}

              {/* Central Elevator & Corridor block labels */}
              <g transform="translate(230, 160) rotate(-90)">
                <text x="0" y="0" textAnchor="middle" className="font-mono text-[8px] font-black fill-slate-300 tracking-widest uppercase">CORRIDOR WEST ALPHA</text>
              </g>
              <g transform="translate(430, 160) rotate(-90)">
                <text x="0" y="0" textAnchor="middle" className="font-mono text-[8px] font-black fill-slate-300 tracking-widest uppercase">CORRIDOR EAST BETA</text>
              </g>
            </svg>
          </div>

          {/* Quick Guidance and Status Legends */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-white/40 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500 inline-block" />
              <span className="font-semibold text-slate-600">Available / Low Load</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500 inline-block" />
              <span className="font-semibold text-slate-600">Moderate Volume</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500 inline-block" />
              <span className="font-semibold text-slate-600">High Capacity / Surge</span>
            </div>
            <div className="text-right text-[10px] text-slate-400 font-bold">
              Tip: Click any zone inside the floor grid to reveal metrics
            </div>
          </div>

        </div>

        {/* Drill-down Interactive Inspector Panel */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] flex flex-col justify-between hover:shadow-[0_12px_40px_0_rgba(15,23,42,0.06)] transition-all duration-300">
          <div>
            <div className="flex items-center gap-2.5 border-b border-slate-200/50 pb-4 mb-4">
              <Compass className="w-5 h-5 text-emerald-600 animate-spin duration-[10s]" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 font-display">Telemetry Inspector</h4>
                <p className="text-[10px] text-emerald-600 font-extrabold tracking-widest uppercase">Zone Drill-Down</p>
              </div>
            </div>

            {selectedRoomDetails ? (
              <div className="space-y-4">
                <div className="bg-white/40 rounded-2xl border border-white/40 p-3.5 shadow-sm">
                  <h5 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    {selectedRoomDetails.name}
                  </h5>
                  <div className="grid grid-cols-2 gap-2.5 mt-3 text-xs">
                    <div className="bg-white/50 p-2.5 rounded-xl border border-white/50">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Zone Rating</span>
                      <span className="font-extrabold text-slate-700">{selectedRoomDetails.status}</span>
                    </div>
                    <div className="bg-white/50 p-2.5 rounded-xl border border-white/50">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Wait-Time Factor</span>
                      <span className="font-extrabold text-red-600">{selectedRoomDetails.waitTime}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-Metric 1: Ward Beds occupancy inside this ward */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Linked Beds & Status</span>
                  {selectedRoomDetails.bedsCount > 0 ? (
                    <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                      {beds
                        .filter(b => b.floor === (activeFloor === "GF" ? "Ground Floor" : activeFloor === "F1" ? "2nd Floor" : activeFloor === "F3" ? "3rd Floor" : "Basement Floor"))
                        .slice(0, 4)
                        .map(bed => (
                          <div key={bed.id} className="flex justify-between items-center bg-white/40 border border-white/30 rounded-xl p-2 text-xs">
                            <span className="font-bold text-slate-700">{bed.number} ({bed.type})</span>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                              bed.status === "Available" 
                                ? "bg-emerald-100 text-emerald-800" 
                                : bed.status === "Occupied" 
                                ? "bg-rose-100 text-rose-800" 
                                : "bg-slate-100 text-slate-800"
                            }`}>
                              {bed.status}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="bg-slate-100/40 border border-slate-200/20 rounded-xl p-3 text-center text-xs text-slate-500 font-medium">
                      No static beds registered in this administrative zone.
                    </div>
                  )}
                </div>

                {/* Sub-Metric 2: Equipment list */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Biomedical Telemetry</span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRoomDetails.equipment.map((eq, i) => (
                      <div key={i} className="bg-white/40 border border-white/30 rounded-xl p-2 flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <Cpu className="w-3.5 h-3.5 text-slate-400" />
                        <span>{eq}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patient list under supervision */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Patient Flow Telemetry</span>
                  <div className="space-y-2">
                    {patients
                      .filter(p => p.status === "Admitted" && p.bedId)
                      .slice(0, 2)
                      .map(pat => (
                        <div key={pat.id} className="bg-emerald-50/40 border border-emerald-100/50 rounded-xl p-3 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-extrabold text-slate-800">{pat.name}</p>
                            <p className="text-[9px] text-slate-400 font-semibold font-mono">Pulse: {pat.vitals?.pulse || "N/A"} | SPO2: {pat.vitals?.spO2 || "N/A"}</p>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black font-mono">{pat.bedId}</span>
                        </div>
                      ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <Building className="w-10 h-10 text-slate-300 mx-auto animate-pulse" />
                <p className="text-xs text-slate-500 font-medium">Select a zone on the floor plan to inspect details</p>
              </div>
            )}
          </div>

          {/* Quick Alert Box */}
          <div className="bg-rose-50/70 border border-rose-200/50 rounded-2xl p-4 text-xs text-rose-900 mt-4">
            <h5 className="font-bold text-rose-950 flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
              Zone Safety Protocol
            </h5>
            <p className="font-medium text-rose-700 leading-relaxed text-[11px]">
              If patient occupancy crosses 90% in any specific ward zone, central ERP triggers an automatic notification requesting patient transfers to Building A.
            </p>
          </div>
        </div>
      </div>

      {/* MID-LEVEL LIVE OPERATIONS PANELS: Emergency Queue + Live OT complex */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Live OT Track & Recovery Complex */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] flex flex-col justify-between hover:shadow-[0_12px_40px_0_rgba(15,23,42,0.06)] transition-all duration-300">
          <div className="border-b border-slate-200/50 pb-4 mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                OT Complex Telemetry Complex
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Active Surgical theatres status & telemetry</p>
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {activeOTSessionCount} Active Surgeries
            </span>
          </div>

          <div className="space-y-4">
            {otSessions.length > 0 ? (
              otSessions.slice(0, 3).map((session, index) => {
                const colors = ["from-indigo-50 to-indigo-100/55", "from-teal-50 to-teal-100/55", "from-amber-50 to-amber-100/55"];
                const progressColors = ["bg-indigo-600", "bg-teal-600", "bg-amber-600"];
                const patientVitals = patients.find(p => p.name === session.patientName)?.vitals || { bp: "120/80", pulse: "76 bpm", spO2: "98%" };

                return (
                  <div key={session.id} className={`bg-gradient-to-r ${colors[index % colors.length]} border border-white/40 rounded-2xl p-4 shadow-sm space-y-3`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-bold text-indigo-700/80 uppercase tracking-widest block font-mono">{session.roomNumber}</span>
                        <h4 className="font-black text-slate-800 text-sm">{session.surgeryName}</h4>
                        <p className="text-xs text-slate-500 font-semibold">Surgeon: {session.primarySurgeonName} | Patient: {session.patientName}</p>
                      </div>
                      <span className="bg-white/80 border border-indigo-200 text-indigo-800 font-black text-[9px] px-2 py-0.5 rounded-lg uppercase">
                        {session.status}
                      </span>
                    </div>

                    {/* Interactive Telemetry Sparkline values */}
                    <div className="grid grid-cols-3 gap-2 py-2 bg-white/40 rounded-xl border border-white/50 text-center">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pulse</span>
                        <span className="text-xs font-black text-rose-600 font-mono flex items-center justify-center gap-1">
                          <HeartPulse className="w-3 h-3 text-rose-500 animate-pulse" />
                          {patientVitals.pulse}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">SPO2</span>
                        <span className="text-xs font-black text-teal-600 font-mono">{patientVitals.spO2}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Blood Pres</span>
                        <span className="text-xs font-black text-slate-700 font-mono">{patientVitals.bp}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-extrabold text-slate-500">
                        <span>Elapsed: {session.startTime}</span>
                        <span>Duration: {session.estimatedDuration}</span>
                      </div>
                      <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`${progressColors[index % progressColors.length]} h-full rounded-full animate-pulse`} 
                          style={{ width: index === 0 ? "75%" : index === 1 ? "40%" : "90%" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 font-medium">No live OT sessions scheduled.</div>
            )}
          </div>
        </div>

        {/* Emergency Triage & Queue Intelligence */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] flex flex-col justify-between hover:shadow-[0_12px_40px_0_rgba(15,23,42,0.06)] transition-all duration-300">
          <div className="border-b border-slate-200/50 pb-4 mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-600" />
                Emergency Queue & Triage Desk
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Triage level assignments and immediate floor admissions</p>
            </div>
            <span className="text-[10px] bg-red-100 text-red-800 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {emergencyQueuePatientsCount} Pending Triage
            </span>
          </div>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {patients.filter(p => p.status === "Emergency Queue").length > 0 ? (
              patients
                .filter(p => p.status === "Emergency Queue")
                .map((patient) => {
                  const pulse = Number(patient.vitals?.pulse.replace(" bpm", "")) || 80;
                  const isCritical = pulse > 105;

                  return (
                    <div key={patient.id} className="bg-white/40 border border-white/40 rounded-2xl p-3.5 shadow-sm hover:bg-white/60 transition flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-800 text-xs">{patient.name}</h4>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                            isCritical ? "bg-red-100 text-red-700 animate-pulse" : "bg-amber-100 text-amber-700"
                          }`}>
                            {isCritical ? "Triage RED" : "Triage AMBER"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          Age: {patient.age} | Blood: {patient.bloodType} | BP: {patient.vitals?.bp}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold">
                          Arrived: {patient.vitals?.lastUpdated || "Just now"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => admitEmergencyPatient(patient.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-2 rounded-xl transition shadow hover:shadow-emerald-600/10 cursor-pointer"
                        >
                          Admit Bed
                        </button>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="bg-slate-50/40 border border-slate-200/20 rounded-2xl p-8 text-center text-xs text-slate-400 font-semibold">
                No patients in emergency queue. Use "Simulate Emergency" button to trigger mock intake!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* LOWER LEVEL LIVE SECTIONS: Interactive Ambulance Radar Map & Biomedical / Staff Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Ambulance Live Location Radar Map */}
        <div className="xl:col-span-2 bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] flex flex-col justify-between hover:shadow-[0_12px_40px_0_rgba(15,23,42,0.06)] transition-all duration-300">
          <div className="border-b border-slate-200/50 pb-4 mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
                <Navigation className="w-5 h-5 text-sky-600 animate-bounce" />
                Ambulance Live Location Radar
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Active ALS/BLS fleet tracking coordinates & ETA parameters</p>
            </div>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {dispatchedAmbulanceCount} En Route
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Radar Container */}
            <div className="lg:col-span-2 relative bg-slate-950/90 rounded-2xl p-4 overflow-hidden flex items-center justify-center min-h-[220px] shadow-inner">
              {/* Radar circular lines */}
              <div className="absolute border border-emerald-500/10 rounded-full w-[180px] h-[180px]" />
              <div className="absolute border border-emerald-500/20 rounded-full w-[120px] h-[120px]" />
              <div className="absolute border border-emerald-500/30 rounded-full w-[60px] h-[60px]" />
              {/* Radar sweeping line */}
              <div className="absolute w-[220px] h-[220px] bg-gradient-to-tr from-transparent via-transparent to-emerald-500/10 rounded-full animate-spin duration-[6s] pointer-events-none" />

              {/* Central Target hospital block */}
              <div className="absolute flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-400 p-2 rounded-xl border border-emerald-500/40 shadow-lg text-[9px] font-black uppercase">
                <Building className="w-4 h-4 text-emerald-400 mb-0.5" />
                <span>HQ HOSPITAL</span>
              </div>

              {/* Ambulance markers */}
              {ambulances.map((amb, idx) => {
                const angle = (idx * 72) * (Math.PI / 180);
                const radius = amb.status === "Available" ? 40 : amb.status === "Dispatched" ? 85 : 125;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div 
                    key={amb.id}
                    className="absolute cursor-pointer flex flex-col items-center"
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    onClick={() => setSelectedAmbulanceId(amb.id)}
                    whileHover={{ scale: 1.2 }}
                  >
                    <div className={`p-1.5 rounded-full shadow-lg border animate-pulse ${
                      amb.status === "Available" 
                        ? "bg-emerald-500 text-slate-950 border-emerald-400" 
                        : "bg-sky-500 text-white border-sky-300"
                    }`}>
                      <Navigation className="w-3.5 h-3.5 transform rotate-45" />
                    </div>
                    <span className="text-[7px] text-white bg-slate-800/90 px-1 py-0.5 rounded font-mono font-bold mt-1 shadow">
                      {amb.vehicleNumber}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* List side with stats */}
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Vehicles</span>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {ambulances.map((amb) => (
                  <div 
                    key={amb.id} 
                    onClick={() => setSelectedAmbulanceId(amb.id)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer text-xs ${
                      selectedAmbulanceId === amb.id 
                        ? "bg-sky-50 border-sky-300 shadow-sm" 
                        : "bg-white/40 border-white/40 hover:bg-white/60"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800">{amb.vehicleNumber}</span>
                      <span className={`text-[8px] font-black uppercase px-1 rounded ${
                        amb.status === "Available" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : "bg-sky-100 text-sky-800 animate-pulse"
                      }`}>
                        {amb.status === "Dispatched" ? "DISPATCH" : amb.status}
                      </span>
                    </div>
                    {amb.destinationName && (
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">To: {amb.destinationName}</p>
                    )}
                    <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
                      <div className="bg-sky-500 h-1 rounded-full" style={{ width: `${amb.fuelLevel}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Biomedical Devices & Staff Availability overview */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] flex flex-col justify-between hover:shadow-[0_12px_40px_0_rgba(15,23,42,0.06)] transition-all duration-300">
          <div>
            <div className="border-b border-slate-200/50 pb-4 mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-teal-600" />
                  Staff & Asset Calibration
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Active device calibration & available staff registry</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Asset list snippet */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Biomedical Scanner Nodes</span>
                <div className="space-y-2">
                  {biomedicalAssets.slice(0, 2).map((asset) => (
                    <div key={asset.id} className="bg-white/40 border border-white/30 rounded-xl p-2.5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-extrabold text-slate-800">{asset.name}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">Model: {asset.serialNumber} | Usage: {asset.usageHours} hours</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        asset.status === "Active" || asset.status === "In Use"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff Snippet */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Active Emergency Clinicians</span>
                <div className="space-y-2">
                  {employees
                    .filter(e => e.role === UserRole.DOCTOR && e.attendanceStatus === "Present")
                    .slice(0, 2)
                    .map((doctor) => (
                      <div key={doctor.id} className="bg-emerald-50/40 border border-emerald-100/50 rounded-xl p-2.5 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-[10px]">
                            {doctor.name.split(" ")[1]?.slice(0, 2) || "Dr"}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800">{doctor.name}</p>
                            <p className="text-[9px] text-slate-400 font-semibold">{doctor.specialization || "Emergency Medicine"}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono bg-white text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                          {doctor.shift.split(" ")[0]}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-2xl p-3.5 text-[11px] text-emerald-800 mt-4 font-semibold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Staff attendance coordinates sync successfully.</span>
          </div>
        </div>

      </div>

      {/* EXECUTIVE KPIs ANALYTICAL CHART SECTION */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] hover:shadow-[0_12px_40px_0_rgba(15,23,42,0.06)] transition-all duration-300 space-y-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Executive KPIs & Command Center Analytics
          </h3>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Triage through-rate trends, emergency arrival densities, and ward turnover margins</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Average Waiting Time */}
          <div className="bg-white/40 border border-white/40 rounded-2xl p-4 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Waiting Time Flow (Hourly)</span>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpiHistoryData}>
                  <defs>
                    <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} unit="m" />
                  <Tooltip />
                  <Area type="monotone" dataKey="waitTime" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorWait)" name="Wait Time" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: ER Throughput */}
          <div className="bg-white/40 border border-white/40 rounded-2xl p-4 shadow-sm space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Patient Intake Throughput</span>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiHistoryData}>
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} />
                  <Tooltip />
                  <Bar dataKey="throughput" fill="#10b981" radius={[4, 4, 0, 0]} name="Intake Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Active Alerts Log */}
          <div className="bg-white/40 border border-white/40 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2.5">Live Alert Telemetry Feed</span>
              <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className="flex gap-2 text-xs border-b border-slate-100/40 pb-2">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 inline-block ${
                      alert.severity === "critical" ? "bg-red-500 animate-ping" : "bg-amber-500"
                    }`} />
                    <div className="flex-1 leading-tight">
                      <p className="font-extrabold text-slate-800">{alert.msg}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{alert.room} | {alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setActiveAlerts([])}
              className="text-[10px] font-bold text-slate-500 hover:text-emerald-700 transition mt-3 text-left flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark all alerts acknowledged
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
