/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Activity, Users, Bed, CreditCard, Ambulance, HeartPulse, 
  ShieldAlert, CheckCircle, Pill, Shield, Award, Landmark, 
  Map, ClipboardList, HelpCircle, Bell, LogOut, ChevronRight, Menu, X
} from "lucide-react";

// Shared and module components
import { ClockWidget } from "./components/shared/ClockWidget";
import { DashboardOverview } from "./components/modules/DashboardOverview";
import { DoctorExplorer } from "./components/modules/DoctorExplorer";
import { DoctorAvailability } from "./components/modules/DoctorAvailability";
import { HospitalMap } from "./components/modules/HospitalMap";
import { AmbulanceCommand } from "./components/modules/AmbulanceCommand";
import { PharmacyIntelligence } from "./components/modules/PharmacyIntelligence";
import { OTTracker } from "./components/modules/OTTracker";
import { CharityCare } from "./components/modules/CharityCare";
import { PatientPortal } from "./components/modules/PatientPortal";
import { HRModule } from "./components/modules/HRModule";
import { ReportGenerator } from "./components/modules/ReportGenerator";

// Mock Databases
import { 
  mockPatients, mockBeds, mockAmbulances, mockMedicines, 
  mockOTSessions, mockCharityVerifications 
} from "./data/mockDatabase";
import { employeesData } from "./data/employees";
import { Patient, Bed as BedType, Ambulance as AmbulanceType, Medicine, OperationTheatreSession, CharityVerification, Employee, UserRole } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard Overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // States for live interconnected databases
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [beds, setBeds] = useState<BedType[]>(mockBeds);
  const [ambulances, setAmbulances] = useState<AmbulanceType[]>(mockAmbulances);
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [otSessions, setOtSessions] = useState<OperationTheatreSession[]>(mockOTSessions);
  const [charityCases, setCharityCases] = useState<CharityVerification[]>(mockCharityVerifications);
  const [employees, setEmployees] = useState<Employee[]>(employeesData);

  // Actions Audit Logs state
  const [auditLogs, setAuditLogs] = useState<{ id: string; action: string; user: string; time: string }[]>([
    { id: "LOG-01", action: "Authorized Supreme Command Core Sync", user: "SMI Fahim", time: "10:32" },
    { id: "LOG-02", action: "Pushed clinical telemetry updates for PAT-001", user: "Dr. Salim Rahaman Dipu", time: "10:15" },
    { id: "LOG-03", action: "Dispatched ALS Ambulance fleet to Banani R11", user: "SMI Fahim", time: "09:55" }
  ]);

  const addLog = (action: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setAuditLogs(prev => [
      { id: `LOG-${now.getTime().toString().slice(-4)}`, action, user: "SMI Fahim (Supreme)", time: timeStr },
      ...prev
    ]);
  };

  // State Updates Callback
  const handleUpdateAmbulance = (updated: AmbulanceType) => {
    setAmbulances(prev => prev.map(a => a.id === updated.id ? updated : a));
    addLog(`Updated Ambulance fleet status: ${updated.id} to ${updated.status}`);
  };

  const handleRestockMedicine = (id: string, amount: number) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, stock: m.stock + amount } : m));
    addLog(`Approved pharmacy bulk restock for formula ID: ${id}`);
  };

  const handleUpdateEmployeeAttendance = (id: string, status: Employee["attendanceStatus"]) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, attendanceStatus: status } : e));
    addLog(`Modified attendance logs: Employee ${id} is now ${status}`);
  };

  const handleUpdatePatientVitals = (id: string, vitals: Patient["vitals"]) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, vitals } : p));
    addLog(`Recorded patient telemetry vitals check for code: ${id}`);
  };

  const handleUpdateCharityStatus = (id: string, status: "Verified" | "Rejected") => {
    setCharityCases(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    addLog(`Approved welfare review for charity ledger ID: ${id}`);
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
    // Set matching bed to occupied
    if (newPatient.bedId) {
      setBeds(prev => prev.map(b => b.id === newPatient.bedId ? { ...b, status: "Occupied", patientId: newPatient.id } : b));
    }
    addLog(`Admitted patient intake registration: ${newPatient.name} [${newPatient.id}]`);
  };

  const handleAddOTSession = (newSession: OperationTheatreSession) => {
    setOtSessions(prev => [newSession, ...prev]);
    addLog(`Scheduled operating theatre surgery room booking: ${newSession.surgeryName}`);
  };

  // Define tab navigation elements
  const tabItems = [
    { name: "Dashboard Overview", icon: <Activity className="w-4 h-4" /> },
    { name: "Doctor Explorer", icon: <Users className="w-4 h-4" /> },
    { name: "Doctor Availability", icon: <CalendarRange className="w-4 h-4" /> },
    { name: "Hospital Map", icon: <Map className="w-4 h-4" /> },
    { name: "Ambulance Command Center", icon: <Ambulance className="w-4 h-4" /> },
    { name: "Pharmacy Intelligence", icon: <Pill className="w-4 h-4" /> },
    { name: "OT Tracker Complex", icon: <Shield className="w-4 h-4" /> },
    { name: "Charity Care Hub", icon: <Landmark className="w-4 h-4" /> },
    { name: "Patient Records Core", icon: <HeartPulse className="w-4 h-4" /> },
    { name: "Interactive HR Directory", icon: <Award className="w-4 h-4" /> },
    { name: "Analytical Reports", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "Audit Logs & Security", icon: <ShieldAlert className="w-4 h-4" /> }
  ];

  const handleDispatchTokenFromExplorer = (doctor: Employee) => {
    alert(`Token dispatched for ${doctor.name}! Slot booked at ${doctor.floor}, OPD block.`);
    setActiveTab("Doctor Availability");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex overflow-hidden font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <div 
        className={`bg-white/30 backdrop-blur-xl text-slate-700 flex flex-col justify-between border-r border-white/40 transition-all duration-300 z-30 ${
          sidebarOpen ? "w-64 min-w-[256px]" : "w-20 min-w-[80px]"
        }`}
      >
        <div>
          {/* Main App branding */}
          <div className="p-5 border-b border-white/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-900 flex items-center justify-center font-black text-sm shadow-sm">
                M2
              </div>
              {sidebarOpen && (
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm tracking-wide text-slate-800">MediCore 247</span>
                  <span className="text-[9px] text-emerald-600 font-extrabold tracking-widest uppercase">Smart ERP</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-500 hover:text-emerald-600 transition hidden md:block cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3.5 space-y-1">
            {tabItems.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    isActive
                      ? "bg-white/60 text-emerald-700 border border-white/60 shadow-sm backdrop-blur-md"
                      : "hover:bg-white/30 text-slate-600 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-emerald-600" : "text-slate-400"}>{tab.icon}</span>
                    {sidebarOpen && <span>{tab.name}</span>}
                  </div>
                  {sidebarOpen && isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Supreme Admin context details */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/40 bg-white/50 m-3.5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-xs shadow-md">
                SF
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">SMI Fahim</span>
                <span className="text-[9px] text-emerald-600 font-extrabold">Supreme Admin</span>
              </div>
            </div>
            <button 
              onClick={() => alert("Supreme session logout. MediCore remains online 24/7.")}
              className="text-slate-500 hover:text-rose-600 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navbar Header */}
        <header className="bg-white/30 backdrop-blur-md border-b border-white/40 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 text-slate-600 hover:bg-white/40 rounded-lg md:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-xl font-black text-slate-800 tracking-tight">{activeTab}</h1>
              <p className="text-xs text-slate-500 font-medium">MediCore 247 clinical platform control system</p>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick telemetry indices */}
            <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                Hospital Active: <span className="font-bold text-slate-700">100%</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>
                Ward Occupancy: <span className="font-bold text-slate-700">{Math.round((beds.filter(b => b.status === "Occupied").length / beds.length) * 100)}%</span>
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Tab Content */}
        <main className="p-6 flex-1 space-y-6">
          {activeTab === "Dashboard Overview" && (
            <DashboardOverview 
              patients={patients} 
              beds={beds} 
              ambulances={ambulances} 
              medicines={medicines}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "Doctor Explorer" && (
            <DoctorExplorer 
              doctors={employees.filter(e => e.role === UserRole.DOCTOR)} 
              onBookAppointment={handleDispatchTokenFromExplorer}
            />
          )}

          {activeTab === "Doctor Availability" && (
            <DoctorAvailability doctors={employees.filter(e => e.role === UserRole.DOCTOR)} />
          )}

          {activeTab === "Hospital Map" && <HospitalMap />}

          {activeTab === "Ambulance Command Center" && (
            <AmbulanceCommand ambulances={ambulances} onUpdateAmbulance={handleUpdateAmbulance} />
          )}

          {activeTab === "Pharmacy Intelligence" && (
            <PharmacyIntelligence medicines={medicines} onRestockMedicine={handleRestockMedicine} />
          )}

          {activeTab === "OT Tracker Complex" && (
            <OTTracker otSessions={otSessions} onAddSession={handleAddOTSession} />
          )}

          {activeTab === "Charity Care Hub" && (
            <CharityCare charityCases={charityCases} patients={patients} onUpdateCharityStatus={handleUpdateCharityStatus} />
          )}

          {activeTab === "Patient Records Core" && (
            <PatientPortal 
              patients={patients} 
              beds={beds} 
              onAddPatient={handleAddPatient} 
              onUpdatePatientVitals={handleUpdatePatientVitals}
            />
          )}

          {activeTab === "Interactive HR Directory" && (
            <HRModule employees={employees} onUpdateEmployeeAttendance={handleUpdateEmployeeAttendance} />
          )}

          {activeTab === "Analytical Reports" && (
            <ReportGenerator patients={patients} beds={beds} medicines={medicines} ambulances={ambulances} />
          )}

          {activeTab === "Audit Logs & Security" && (
            <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-800">Command Security Audit Logs</h3>
                <p className="text-xs text-slate-500 font-medium">Cryptographic logging actions synced to local storage nodes</p>
              </div>

              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center bg-white/40 border border-white/40 rounded-xl p-3.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-slate-700">{log.action}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">User Node: {log.user}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono font-bold">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating clock widget column on desktop to give dynamic healthcare dashboard vibes */}
      <div className="hidden xl:block w-80 p-6 border-l border-white/40 bg-white/30 backdrop-blur-md shadow-sm overflow-y-auto space-y-6">
        <ClockWidget />

        {/* Live System Alerts section */}
        <div className="bg-white/50 backdrop-blur-md border border-white/50 rounded-3xl p-5 space-y-3 shadow-inner">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-emerald-600" />
            Live System telemetry
          </span>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-white/60 border border-white/40 rounded-xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Active Surgeries</span>
              <span className="text-rose-600 font-mono font-extrabold text-[10px] bg-rose-50 px-2 py-0.5 rounded-lg animate-pulse">
                {otSessions.filter(s => s.status === "Active Surgery").length} Running
              </span>
            </div>
            <div className="p-2.5 bg-white/60 border border-white/40 rounded-xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Ambulance Dispatch</span>
              <span className="text-teal-700 font-mono font-extrabold text-[10px] bg-teal-50 px-2 py-0.5 rounded-lg">
                {ambulances.filter(a => a.status === "Dispatched").length} Engaged
              </span>
            </div>
            <div className="p-2.5 bg-white/60 border border-white/40 rounded-xl flex items-center justify-between">
              <span className="font-bold text-slate-700">Low Stock Meds</span>
              <span className="text-amber-700 font-mono font-extrabold text-[10px] bg-amber-50 px-2 py-0.5 rounded-lg">
                {medicines.filter(m => m.stock < m.minStock).length} Alarms
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CalendarRangeProps {
  className?: string;
}

const CalendarRange: React.FC<CalendarRangeProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M17 14h-6"/>
    <path d="M13 18H7"/>
    <path d="M7 14h.01"/>
    <path d="M17 18h.01"/>
  </svg>
);
