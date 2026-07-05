/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, Bed, Sparkles, AlertTriangle, CheckCircle, 
  Clock, Plus, Search, ArrowRight, ArrowLeftRight, Trash2, 
  ShieldAlert, Brush, MapPin, TrendingDown, Users, Flame, Info
} from "lucide-react";
import { Patient, Bed as BedType, PatientMovement, WaitingListEntry } from "../../types";

interface PatientFlowManagerProps {
  patients: Patient[];
  beds: BedType[];
  onUpdateBeds: (updated: BedType[]) => void;
  onUpdatePatients: (updated: Patient[]) => void;
  addLog: (action: string) => void;
}

export const PatientFlowManager: React.FC<PatientFlowManagerProps> = ({
  patients,
  beds,
  onUpdateBeds,
  onUpdatePatients,
  addLog
}) => {
  // Filters & UI States
  const [selectedFloor, setSelectedFloor] = useState<string>("All Floors");
  const [selectedBedType, setSelectedBedType] = useState<string>("All Types");
  const [searchTerm, setSearchTerm] = useState<string>("All"); // or search input
  const [bedSearchQuery, setBedSearchQuery] = useState<string>("");
  
  // Custom states for Waitlist and Movement Timeline
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([
    {
      id: "WTL-001",
      patientId: "PAT-006",
      patientName: "Nusrat Jahan",
      requestDate: "2026-07-04",
      requiredBedType: "General Ward",
      urgency: "Urgent",
      reason: "Post-op appendicitis ward observation"
    },
    {
      id: "WTL-002",
      patientId: "PAT-007",
      patientName: "Kamrul Islam",
      requestDate: "2026-07-04",
      requiredBedType: "ICU",
      urgency: "Critical",
      reason: "Post-trauma pelvic reconstruction recovery"
    },
    {
      id: "WTL-003",
      patientId: "PAT-NEW-1",
      patientName: "Farid Uddin",
      requestDate: "2026-07-04",
      requiredBedType: "VIP Cabin",
      urgency: "Routine",
      reason: "Scheduled cardiology monitoring (VIP request)"
    },
    {
      id: "WTL-004",
      patientId: "PAT-NEW-2",
      patientName: "Tahmina Chowdhury",
      requestDate: "2026-07-04",
      requiredBedType: "Isolation",
      urgency: "Urgent",
      reason: "Suspected active pulmonary tuberculosis"
    }
  ]);

  const [movements, setMovements] = useState<PatientMovement[]>([
    {
      id: "MVT-001",
      patientId: "PAT-001",
      patientName: "Abdur Rahim",
      fromBed: "ER-101",
      toBed: "ICU-101",
      timestamp: "2026-07-04 10:15 AM",
      reason: "Transferred from Emergency due to acute coronary syndrome escalation."
    },
    {
      id: "MVT-002",
      patientId: "PAT-003",
      patientName: "Kabir Hossain",
      fromBed: "OT-Room-03",
      toBed: "GW-201",
      timestamp: "2026-07-04 04:30 PM",
      reason: "Post-operative laparoscopic hernioplasty recovery ward assignment."
    },
    {
      id: "MVT-003",
      patientId: "PAT-005",
      patientName: "Sufia Khatun",
      fromBed: "OPD-Consultation",
      toBed: "SP-301",
      timestamp: "2026-07-03 01:45 PM",
      reason: "Admission for chronic kidney disease dialysis preparation."
    }
  ]);

  // Form states for adding to waiting list
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [newWaitPatientName, setNewWaitPatientName] = useState("");
  const [newWaitBedType, setNewWaitBedType] = useState<BedType["type"]>("General Ward");
  const [newWaitUrgency, setNewWaitUrgency] = useState<WaitingListEntry["urgency"]>("Routine");
  const [newWaitReason, setNewWaitReason] = useState("");

  // Transfer overlay modal/dropdown states
  const [transferringPatientId, setTransferringPatientId] = useState<string | null>(null);
  const [transferSourceBedId, setTransferSourceBedId] = useState<string | null>(null);

  // Manual assignment dropdown states
  const [assigningBedId, setAssigningBedId] = useState<string | null>(null);

  // Drag over states
  const [draggedOverBedId, setDraggedOverBedId] = useState<string | null>(null);

  // Helper lists
  const floors = ["All Floors", "Ground Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor"];
  const bedTypes = ["All Types", "ICU", "Isolation", "VIP Cabin", "General Ward", "Semi-Private", "Emergency"];

  // Core stats calculation
  const totalBedsCount = beds.length;
  const occupiedBedsCount = beds.filter(b => b.status === "Occupied").length;
  const availableBedsCount = beds.filter(b => b.status === "Available").length;
  const maintenanceCount = beds.filter(b => b.status === "Maintenance").length;
  const occupancyRate = totalBedsCount > 0 ? Math.round((occupiedBedsCount / totalBedsCount) * 100) : 0;

  const icuBeds = beds.filter(b => b.type === "ICU");
  const availableIcuCount = icuBeds.filter(b => b.status === "Available").length;

  const vipBeds = beds.filter(b => b.type === "VIP Cabin");
  const availableVipCount = vipBeds.filter(b => b.status === "Available").length;

  const isolationBeds = beds.filter(b => b.type === "Isolation");
  const availableIsoCount = isolationBeds.filter(b => b.status === "Available").length;

  const dirtyBedsCount = beds.filter(b => b.cleaningStatus === "Dirty" || b.cleaningStatus === "Cleaning").length;
  const highDischargeCount = beds.filter(b => b.status === "Occupied" && b.dischargeLikelihood === "High").length;

  // Floor stats for occupancy heatmap
  const getFloorOccupancyStats = (floorName: string) => {
    const floorBeds = beds.filter(b => b.floor === floorName);
    const total = floorBeds.length;
    if (total === 0) return { total: 0, occupied: 0, percentage: 0 };
    const occupied = floorBeds.filter(b => b.status === "Occupied").length;
    return {
      total,
      occupied,
      percentage: Math.round((occupied / total) * 100)
    };
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, patientId: string, sourceBedId?: string) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ patientId, sourceBedId }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, bedId: string) => {
    e.preventDefault();
    const bed = beds.find(b => b.id === bedId);
    if (bed && bed.status === "Available" && bed.cleaningStatus !== "Dirty") {
      setDraggedOverBedId(bedId);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverBedId(null);
  };

  const handleDrop = (e: React.DragEvent, targetBedId: string) => {
    e.preventDefault();
    setDraggedOverBedId(null);
    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (!dataStr) return;
      const { patientId, sourceBedId } = JSON.parse(dataStr);
      
      executeTransfer(patientId, targetBedId, sourceBedId);
    } catch (err) {
      console.error("Drop processing failed", err);
    }
  };

  // Central Transfer Assignment Engine
  const executeTransfer = (patientId: string, targetBedId: string, sourceBedId?: string) => {
    const patient = patients.find(p => p.id === patientId) || {
      id: patientId,
      name: waitingList.find(w => w.patientId === patientId)?.patientName || "Unknown Patient"
    };
    
    const targetBed = beds.find(b => b.id === targetBedId);
    if (!targetBed) return;

    if (targetBed.status !== "Available") {
      alert(`Target bed ${targetBed.number} is not available.`);
      return;
    }

    if (targetBed.cleaningStatus === "Dirty") {
      alert(`Bed ${targetBed.number} requires sanitization and cleaning before admission.`);
      return;
    }

    // Step 1: Update target bed
    let updatedBeds = beds.map(b => {
      if (b.id === targetBedId) {
        return {
          ...b,
          status: "Occupied" as const,
          patientId: patientId,
          // Generate default predictions for mock gameplay
          predictedDischargeDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          dischargeLikelihood: "Medium" as const
        };
      }
      // Step 2: Clear old bed if it was a transfer
      if (sourceBedId && b.id === sourceBedId) {
        return {
          ...b,
          status: "Available" as const,
          patientId: undefined,
          cleaningStatus: "Dirty" as const, // requires cleaning after patient vacates
          predictedDischargeDate: undefined,
          dischargeLikelihood: undefined
        };
      }
      return b;
    });

    onUpdateBeds(updatedBeds);

    // Step 3: Update Patient state bedId and status
    const updatedPatients = patients.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          bedId: targetBedId,
          status: "Admitted" as const
        };
      }
      return p;
    });

    // Handle adding new patients to state if they were pre-registered in waitlist but not in global patients list
    const patientExists = patients.some(p => p.id === patientId);
    if (!patientExists) {
      const waitlistEntry = waitingList.find(w => w.patientId === patientId);
      const newPatient: Patient = {
        id: patientId,
        name: waitlistEntry?.patientName || "New Patient",
        age: 38,
        gender: "Male",
        bloodType: "B+",
        phone: "+880-1700-112233",
        email: "flow.patient@example.com",
        address: "Dhaka Clinical Ward",
        freeTreatmentEligible: false,
        status: "Admitted",
        bedId: targetBedId,
        admissionDate: new Date().toISOString().split("T")[0],
        vitals: { bp: "120/80", temp: "98.6 F", pulse: "74 bpm", spO2: "98%", lastUpdated: "Just now" },
        medicalHistory: [
          { diagnosis: waitlistEntry?.reason || "Bed Flow Admission", date: "2026-07-04", notes: "Transferred from waitlist to active care bed." }
        ]
      };
      onUpdatePatients([...patients, newPatient]);
    } else {
      onUpdatePatients(updatedPatients);
    }

    // Step 4: Remove from waitlist if applicable
    setWaitingList(prev => prev.filter(w => w.patientId !== patientId));

    // Step 5: Append to movement timeline log
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fromBedLabel = sourceBedId ? beds.find(b => b.id === sourceBedId)?.number : "Waitlist Queue";
    const toBedLabel = targetBed.number;

    const newMvt: PatientMovement = {
      id: `MVT-${Date.now().toString().slice(-4)}`,
      patientId,
      patientName: patient.name,
      fromBed: fromBedLabel,
      toBed: toBedLabel,
      timestamp: `Today, ${nowStr}`,
      reason: sourceBedId 
        ? `Transferred internally from ${fromBedLabel} to ${toBedLabel} for specialized floor management.`
        : `Admitted directly from Waiting List into ${toBedLabel} (${targetBed.type}).`
    };

    setMovements(prev => [newMvt, ...prev]);
    addLog(`Transferred Patient ${patient.name} [${patientId}] ${sourceBedId ? `from bed ${fromBedLabel} ` : ""}to bed ${toBedLabel}`);
    
    // Clear modals
    setTransferringPatientId(null);
    setTransferSourceBedId(null);
    setAssigningBedId(null);
  };

  // Auto match waitlisted patient to best available bed
  const handleAutoMatch = (entry: WaitingListEntry) => {
    // Find first available bed matching type
    const candidateBed = beds.find(b => b.type === entry.requiredBedType && b.status === "Available" && b.cleaningStatus !== "Dirty");
    
    if (candidateBed) {
      executeTransfer(entry.patientId, candidateBed.id);
      alert(`Successfully auto-assigned ${entry.patientName} to available bed ${candidateBed.number} (${candidateBed.type}) on the ${candidateBed.floor}!`);
    } else {
      // Fallback: search for any "Available" bed
      const anyBed = beds.find(b => b.status === "Available" && b.cleaningStatus !== "Dirty");
      if (anyBed) {
        if (window.confirm(`No exact ${entry.requiredBedType} bed available. Would you like to allocate general alternative bed ${anyBed.number} (${anyBed.type}, ${anyBed.floor})?`)) {
          executeTransfer(entry.patientId, anyBed.id);
        }
      } else {
        alert(`Admission Blocked: No beds are currently vacant in the entire hospital matching or substituting the requested criteria.`);
      }
    }
  };

  // Toggle Room Cleaning workflow
  const handleUpdateCleaning = (bedId: string, currentCleaning: BedType["cleaningStatus"]) => {
    let nextStatus: BedType["cleaningStatus"] = "Clean";
    let message = "";

    if (currentCleaning === "Dirty") {
      nextStatus = "Cleaning";
      message = "Sanitization team dispatched. Cleaning in progress.";
    } else if (currentCleaning === "Cleaning") {
      nextStatus = "Clean";
      message = "Room cleaning completed. Sterile environment certified.";
    } else {
      nextStatus = "Dirty";
      message = "Bed marked dirty. Flagged for urgent sanitization.";
    }

    const updated = beds.map(b => b.id === bedId ? { ...b, cleaningStatus: nextStatus } : b);
    onUpdateBeds(updated);
    addLog(`Bed ${beds.find(b => b.id === bedId)?.number} cleaning status updated to: ${nextStatus}`);
  };

  // Predict Discharge / Action trigger
  const handleDischargePatient = (bedId: string, patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    const bed = beds.find(b => b.id === bedId);
    if (!bed || !patient) return;

    if (window.confirm(`Are you sure you want to approve medical discharge for ${patient.name} from bed ${bed.number}?`)) {
      // Update Bed to empty and DIRTY
      const updatedBeds = beds.map(b => {
        if (b.id === bedId) {
          return {
            ...b,
            status: "Available" as const,
            patientId: undefined,
            cleaningStatus: "Dirty" as const,
            predictedDischargeDate: undefined,
            dischargeLikelihood: undefined
          };
        }
        return b;
      });
      onUpdateBeds(updatedBeds);

      // Update Patient status to Discharged
      const updatedPatients = patients.map(p => p.id === patientId ? { ...p, status: "Discharged" as const, bedId: undefined } : p);
      onUpdatePatients(updatedPatients);

      // Add to movement log
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMvt: PatientMovement = {
        id: `MVT-${Date.now().toString().slice(-4)}`,
        patientId,
        patientName: patient.name,
        fromBed: bed.number,
        toBed: "Home (Discharged)",
        timestamp: `Today, ${nowStr}`,
        reason: `Discharged from ${bed.number} (${bed.type}) post recovery clinical evaluation clearance.`
      };
      setMovements(prev => [newMvt, ...prev]);

      addLog(`Approved clinical discharge for Patient ${patient.name} [${patientId}] from bed ${bed.number}`);
    }
  };

  // Add custom transfer simulation log
  const [customPatName, setCustomPatName] = useState("");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleAddCustomMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPatName || !customTo) return;

    const newMvt: PatientMovement = {
      id: `MVT-${Date.now().toString().slice(-4)}`,
      patientId: `PAT-SCH-${Math.floor(100 + Math.random() * 900)}`,
      patientName: customPatName,
      fromBed: customFrom || "N/A",
      toBed: customTo,
      timestamp: "Just Now",
      reason: customReason || "Simulated emergency internal patient rerouting."
    };

    setMovements(prev => [newMvt, ...prev]);
    addLog(`Logged manual movement record for ${customPatName}`);
    
    // reset form
    setCustomPatName("");
    setCustomFrom("");
    setCustomTo("");
    setCustomReason("");
  };

  // Add custom Waitlist entry
  const handleAddToWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaitPatientName || !newWaitReason) return;

    const newEntry: WaitingListEntry = {
      id: `WTL-0${(waitingList.length + 1).toString().padStart(2, '0')}`,
      patientId: `PAT-WAIT-${Date.now().toString().slice(-4)}`,
      patientName: newWaitPatientName,
      requestDate: new Date().toISOString().split("T")[0],
      requiredBedType: newWaitBedType,
      urgency: newWaitUrgency,
      reason: newWaitReason
    };

    setWaitingList(prev => [...prev, newEntry]);
    addLog(`Added ${newWaitPatientName} to the Smart Bed Waiting List`);
    
    // clear form
    setNewWaitPatientName("");
    setNewWaitReason("");
    setShowWaitlistForm(false);
  };

  // Remove waitlist item
  const handleRemoveWaitlist = (id: string) => {
    const entry = waitingList.find(w => w.id === id);
    if (entry) {
      setWaitingList(prev => prev.filter(w => w.id !== id));
      addLog(`Removed ${entry.patientName} from bed waitlist queue`);
    }
  };

  // Filtered beds list
  const filteredBeds = beds.filter(bed => {
    const matchesFloor = selectedFloor === "All Floors" || bed.floor === selectedFloor;
    const matchesType = selectedBedType === "All Types" || bed.type === selectedBedType;
    
    let matchesSearch = true;
    if (bedSearchQuery) {
      const q = bedSearchQuery.toLowerCase();
      const patient = patients.find(p => p.id === bed.patientId);
      matchesSearch = bed.number.toLowerCase().includes(q) || 
                      bed.type.toLowerCase().includes(q) || 
                      (patient && patient.name.toLowerCase().includes(q)) ||
                      (patient && patient.id.toLowerCase().includes(q));
    }

    return matchesFloor && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Upper Module Command Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">Smart Bed & Patient Flow Deck</h3>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              AI Flow Predictor Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Monitor real-time bed census, track ward cleaning operations, manage active transfers, and review machine-learned discharge forecasts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWaitlistForm(!showWaitlistForm)}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add to Waiting List
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hospital Census</span>
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-800">{occupancyRate}%</div>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">
              {occupiedBedsCount} of {totalBedsCount} beds active
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ICU Allocation</span>
            <Bed className="w-5 h-5 text-rose-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-800">{availableIcuCount} Vacant</div>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">
              Out of {icuBeds.length} critical ICU nodes
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">VIP Cabins / Isolation</span>
            <MapPin className="w-5 h-5 text-purple-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-800">{availableVipCount + availableIsoCount} Free</div>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">
              {availableVipCount} VIP & {availableIsoCount} Isolation vacant
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sanitization Backlog</span>
            <Brush className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-800">{dirtyBedsCount} Pending</div>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">
              Beds flagged dirty or cleaning
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-4 shadow-sm flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discharge Forecast</span>
            <TrendingDown className="w-5 h-5 text-teal-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-800">{highDischargeCount} Predict</div>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">
              High-likelihood today/tomorrow
            </div>
          </div>
        </div>

      </div>

      {/* Add to Waiting List Modal / Inline Form */}
      {showWaitlistForm && (
        <form onSubmit={handleAddToWaitlist} className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
          <div className="md:col-span-4 border-b border-white/40 pb-2 flex justify-between items-center">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              Register Patient on Bed Waitlist Queue
            </h4>
            <button type="button" onClick={() => setShowWaitlistForm(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xs">Cancel</button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Patient Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Rowshon Ara"
              value={newWaitPatientName}
              onChange={e => setNewWaitPatientName(e.target.value)}
              className="w-full text-xs bg-white/70 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Required Bed Type</label>
            <select
              value={newWaitBedType}
              onChange={e => setNewWaitBedType(e.target.value as BedType["type"])}
              className="w-full text-xs bg-white/70 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
            >
              <option value="ICU">ICU (Critical)</option>
              <option value="Isolation">Isolation Room</option>
              <option value="VIP Cabin">VIP Cabin Suite</option>
              <option value="General Ward">General Ward</option>
              <option value="Semi-Private">Semi-Private Room</option>
              <option value="Emergency">Emergency Bed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Urgency Priority</label>
            <select
              value={newWaitUrgency}
              onChange={e => setNewWaitUrgency(e.target.value as WaitingListEntry["urgency"])}
              className="w-full text-xs bg-white/70 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
            >
              <option value="Routine">Routine (Low)</option>
              <option value="Urgent">Urgent (Medium)</option>
              <option value="Critical">Critical (High)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Clinical Indication / Reason</label>
            <input
              type="text"
              required
              placeholder="e.g. Oxygen saturation dropping, post-op observation"
              value={newWaitReason}
              onChange={e => setNewWaitReason(e.target.value)}
              className="w-full text-xs bg-white/70 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs py-2 px-5 rounded-xl transition"
            >
              Queue Waitlist Registry
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Occupancy Analysis Heatmap (Left/Top) & Waitlist / Timelines (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Occupancy Heatmap Widget */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Wards Occupancy Heatmap</h4>
                <p className="text-[10px] text-slate-400 font-medium">Interactive capacity density ratios categorized by facility floor</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {floors.filter(f => f !== "All Floors").map(floor => {
              const stats = getFloorOccupancyStats(floor);
              const isHigh = stats.percentage > 75;
              const isMedium = stats.percentage > 40 && stats.percentage <= 75;

              return (
                <div key={floor} className="bg-white/40 border border-slate-100 p-3 rounded-xl flex flex-col justify-between hover:shadow-inner transition">
                  <span className="text-[10px] font-extrabold text-slate-600">{floor}</span>
                  <div className="mt-2">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-lg font-black text-slate-800">{stats.percentage}%</span>
                      <span className="text-[9px] text-slate-500 font-bold">{stats.occupied}/{stats.total} Beds</span>
                    </div>
                    {/* Heatmap color gradient bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${stats.percentage}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh ? "bg-gradient-to-r from-orange-500 to-rose-500" :
                          isMedium ? "bg-gradient-to-r from-amber-400 to-emerald-500" :
                          "bg-gradient-to-r from-teal-400 to-emerald-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Waitlist Panel */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Smart Waitlist Queue</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{waitingList.length} patients prioritized</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {waitingList.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                  No patients currently queued in the waiting list.
                </div>
              ) : (
                waitingList.map((entry) => {
                  const isCritical = entry.urgency === "Critical";
                  const isUrgent = entry.urgency === "Urgent";
                  
                  return (
                    <div 
                      key={entry.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, entry.patientId)}
                      className="group bg-white/50 hover:bg-white border border-slate-100 p-2.5 rounded-xl flex items-center justify-between gap-3 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 text-xs">{entry.patientName}</span>
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                            isCritical ? "bg-rose-100 text-rose-700 border border-rose-200" :
                            isUrgent ? "bg-amber-100 text-amber-700 border border-amber-200" :
                            "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}>
                            {entry.urgency}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          Needs: <span className="text-slate-600">{entry.requiredBedType}</span> | {entry.reason.slice(0, 36)}...
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Auto allocation */}
                        <button
                          onClick={() => handleAutoMatch(entry)}
                          title="Auto allocate matching bed"
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800 rounded-lg transition"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveWaitlist(entry.id)}
                          title="Remove from queue"
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-2.5 flex items-start gap-2 mt-2">
            <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-[9px] text-indigo-700 font-semibold leading-relaxed">
              <strong>Drag & Drop Assignment</strong>: Drag any patient card from this queue directly onto an available floor bed card below to instantly trigger ward admission and medical charting.
            </p>
          </div>
        </div>

      </div>

      {/* Floors Census Grid Visualizer (Filters and Layout) */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-sm space-y-6">
        
        {/* Filters Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap gap-2">
            {floors.map(floor => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-extrabold transition cursor-pointer ${
                  selectedFloor === floor
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white/50 text-slate-600 hover:bg-white border border-slate-200"
                }`}
              >
                {floor}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search bed, patient..."
                value={bedSearchQuery}
                onChange={e => setBedSearchQuery(e.target.value)}
                className="text-xs bg-white/70 border border-slate-200 rounded-xl pl-9 pr-4 py-2 w-full sm:w-48 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedBedType}
              onChange={e => setSelectedBedType(e.target.value)}
              className="text-xs bg-white/70 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-slate-700"
            >
              {bedTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

          </div>
        </div>

        {/* Live Beds Core Map Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredBeds.map((bed) => {
              const patient = patients.find(p => p.id === bed.patientId);
              const isOccupied = bed.status === "Occupied";
              const isMaintenance = bed.status === "Maintenance";
              const isAvailable = bed.status === "Available";
              
              const isOver = draggedOverBedId === bed.id;

              // Type styles
              const isIcu = bed.type === "ICU";
              const isIsolation = bed.type === "Isolation";
              const isVip = bed.type === "VIP Cabin";
              const isEmergency = bed.type === "Emergency";

              return (
                <motion.div
                  key={bed.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onDragOver={(e) => handleDragOver(e, bed.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, bed.id)}
                  className={`relative rounded-2xl p-4.5 border transition-all flex flex-col justify-between min-h-[180px] ${
                    isOver 
                      ? "bg-emerald-50 border-emerald-400 border-dashed scale-102 ring-2 ring-emerald-500/20" 
                      : isOccupied
                        ? "bg-white/80 border-slate-200 hover:shadow-md"
                        : isMaintenance
                          ? "bg-slate-50 border-slate-200 opacity-70"
                          : "bg-white/40 hover:bg-white/70 border-dashed border-slate-300 hover:border-slate-400"
                  }`}
                >
                  
                  {/* Bed Header */}
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Bed className={`w-4 h-4 ${
                            isOccupied ? "text-emerald-600" : isMaintenance ? "text-slate-400" : "text-slate-400"
                          }`} />
                          <span className="font-black text-slate-800 text-sm">{bed.number}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">{bed.floor} • {bed.building}</span>
                      </div>
                      
                      {/* Bed type badge */}
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isIcu ? "bg-rose-100 text-rose-700" :
                        isIsolation ? "bg-amber-100 text-amber-700 animate-pulse" :
                        isVip ? "bg-purple-100 text-purple-700" :
                        isEmergency ? "bg-red-100 text-red-700 font-bold" :
                        "bg-teal-50 text-teal-800"
                      }`}>
                        {bed.type}
                      </span>
                    </div>

                    {/* Occupant content */}
                    {isOccupied && patient ? (
                      <div 
                        draggable
                        onDragStart={(e) => handleDragStart(e, patient.id, bed.id)}
                        className="mt-3 bg-slate-50/75 rounded-xl p-2.5 border border-slate-100 space-y-2 cursor-grab active:cursor-grabbing hover:bg-slate-50 hover:border-slate-300 transition-all"
                      >
                        <div className="flex justify-between items-baseline">
                          <span className="font-extrabold text-xs text-slate-800 tracking-tight block truncate max-w-[120px]" title={patient.name}>{patient.name}</span>
                          <span className="text-[9px] text-slate-500 font-bold shrink-0">{patient.age}y • {patient.gender[0]}</span>
                        </div>
                        
                        {/* Vitals */}
                        {patient.vitals && (
                          <div className="grid grid-cols-3 gap-1 text-[8px] font-extrabold text-slate-500 border-t border-slate-100 pt-1.5">
                            <div>BP: <span className="text-slate-700">{patient.vitals.bp}</span></div>
                            <div>HR: <span className="text-slate-700">{patient.vitals.pulse}</span></div>
                            <div>SpO2: <span className="text-rose-600">{patient.vitals.spO2}</span></div>
                          </div>
                        )}

                        {/* Forecast Discharge Predictor */}
                        {bed.predictedDischargeDate && (
                          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-lg p-1.5 text-[8px] flex justify-between items-center text-slate-600">
                            <div>
                              Forecast: <span className="text-emerald-700 font-bold">{bed.predictedDischargeDate}</span>
                            </div>
                            <span className={`px-1 rounded-sm text-[7px] font-black ${
                              bed.dischargeLikelihood === "High" ? "bg-emerald-100 text-emerald-800" :
                              bed.dischargeLikelihood === "Medium" ? "bg-amber-100 text-amber-800" :
                              "bg-slate-200 text-slate-600"
                            }`}>
                              {bed.dischargeLikelihood} Likelihood
                            </span>
                          </div>
                        )}
                      </div>
                    ) : isMaintenance ? (
                      <div className="mt-4 text-center py-4 text-xs text-slate-400 font-bold flex flex-col items-center gap-1">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Out of Service (Maintenance)
                      </div>
                    ) : (
                      <div className="mt-4 text-center py-5 border border-dashed border-slate-200 rounded-xl text-[10px] text-slate-400 font-semibold">
                        Vacant (Available)
                        <span className="block text-[8px] text-slate-300 mt-1">Drag waitlist patient here</span>
                      </div>
                    )}
                  </div>

                  {/* Bed Action Footer */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    
                    {/* Cleaning state switcher */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateCleaning(bed.id, bed.cleaningStatus)}
                        className={`p-1.5 rounded-lg flex items-center gap-1 transition ${
                          bed.cleaningStatus === "Clean" ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black" :
                          bed.cleaningStatus === "Cleaning" ? "bg-amber-50 hover:bg-amber-100 text-amber-700 font-black animate-pulse" :
                          "bg-rose-50 hover:bg-rose-100 text-rose-700 font-black"
                        }`}
                        title="Toggle Cleaning workflow status"
                      >
                        <Brush className="w-3 h-3" />
                        <span>{bed.cleaningStatus || "Clean"}</span>
                      </button>
                    </div>

                    {/* Operational Actions */}
                    <div className="flex items-center gap-1">
                      {isOccupied && patient ? (
                        <>
                          {/* Transfer action */}
                          <button
                            onClick={() => {
                              setTransferringPatientId(patient.id);
                              setTransferSourceBedId(bed.id);
                            }}
                            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold rounded-lg transition"
                          >
                            Transfer
                          </button>
                          
                          {/* Discharge */}
                          <button
                            onClick={() => handleDischargePatient(bed.id, patient.id)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold rounded-lg transition"
                          >
                            Discharge
                          </button>
                        </>
                      ) : isMaintenance ? (
                        <button
                          onClick={() => {
                            const updated = beds.map(b => b.id === bed.id ? { ...b, status: "Available" as const, cleaningStatus: "Clean" as const } : b);
                            onUpdateBeds(updated);
                            addLog(`Returned bed ${bed.number} to available rotation`);
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                        >
                          Restore
                        </button>
                      ) : (
                        // Quick manual assign
                        <button
                          onClick={() => setAssigningBedId(bed.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition"
                        >
                          Quick Assign
                        </button>
                      )}
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* Internal Transfer Modal Overlays */}
      {transferringPatientId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100 animate-scaleUp">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                <ArrowLeftRight className="w-5 h-5 text-indigo-500" />
                Select Patient Transfer Target
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select an available, sterilized destination bed for Patient ID: <strong>{transferringPatientId}</strong>
              </p>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {beds.filter(b => b.status === "Available" && b.cleaningStatus === "Clean").length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                  No empty, clean beds available for immediate transfer!
                </div>
              ) : (
                beds.filter(b => b.status === "Available" && b.cleaningStatus === "Clean").map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      if (transferringPatientId && transferSourceBedId) {
                        executeTransfer(transferringPatientId, b.id, transferSourceBedId);
                      }
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-150 hover:border-emerald-300 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-extrabold text-xs text-slate-800">{b.number} ({b.type})</div>
                      <div className="text-[10px] text-slate-500 font-medium">{b.floor} • {b.building}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setTransferringPatientId(null);
                  setTransferSourceBedId(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Assign Waitlisted Patient Modal Overlay */}
      {assigningBedId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100 animate-scaleUp">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-5 h-5 text-emerald-500" />
                Assign Waitlisted Patient
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select a queued patient to occupy available bed: <strong>{beds.find(b => b.id === assigningBedId)?.number}</strong>
              </p>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {waitingList.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                  No patients waiting on the queue. Try dragging admitted patients in other departments.
                </div>
              ) : (
                waitingList.map(entry => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      if (assigningBedId) {
                        executeTransfer(entry.patientId, assigningBedId);
                      }
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-150 hover:border-emerald-300 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-extrabold text-xs text-slate-800">{entry.patientName}</div>
                      <div className="text-[10px] text-slate-500 font-semibold">Needs: {entry.requiredBedType} | Priority: {entry.urgency}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setAssigningBedId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movements Log and Simulated Transfers Creator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Movements Chronological Timeline */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-600" />
              Patient Movement History Timeline
            </h4>
            <span className="text-[10px] font-bold text-slate-400">Audited Bed Changes</span>
          </div>

          <div className="relative border-l-2 border-emerald-100 ml-3.5 pl-5 space-y-4 max-h-[220px] overflow-y-auto">
            {movements.map((m) => (
              <div key={m.id} className="relative group">
                {/* Timeline node */}
                <span className="absolute -left-7.5 top-1 bg-white border-2 border-emerald-500 rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  <span className="bg-emerald-500 rounded-full w-1.5 h-1.5" />
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800">{m.patientName}</span>
                    <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500">{m.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    {m.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Transfer Simulation Creator */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-sm space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
            <ArrowLeftRight className="w-4 h-4 text-indigo-500" />
            Simulate Internal Rerouting
          </h4>
          <form onSubmit={handleAddCustomMovement} className="space-y-3">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rowshon Ara"
                value={customPatName}
                onChange={e => setCustomPatName(e.target.value)}
                className="w-full text-xs bg-white/70 border border-slate-200 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">From Unit</label>
                <input
                  type="text"
                  placeholder="e.g. ICU-101"
                  value={customFrom}
                  onChange={e => setCustomFrom(e.target.value)}
                  className="w-full text-xs bg-white/70 border border-slate-200 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">To Unit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cabin 402"
                  value={customTo}
                  onChange={e => setCustomTo(e.target.value)}
                  className="w-full text-xs bg-white/70 border border-slate-200 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rerouting Reason</label>
              <input
                type="text"
                placeholder="e.g. Discharged from high dependency"
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                className="w-full text-xs bg-white/70 border border-slate-200 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-xl transition"
            >
              Simulate & Log Movement
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
