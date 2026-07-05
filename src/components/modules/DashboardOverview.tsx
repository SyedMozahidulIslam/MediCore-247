/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { 
  Activity, Users, Bed, CreditCard, Ambulance, 
  HeartPulse, ShieldAlert, CheckCircle, Flame
} from "lucide-react";
import { Patient, Bed as BedType, Ambulance as AmbulanceType, Medicine } from "../../types";

interface DashboardOverviewProps {
  patients: Patient[];
  beds: BedType[];
  ambulances: AmbulanceType[];
  medicines: Medicine[];
  onNavigate: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  patients,
  beds,
  ambulances,
  medicines,
  onNavigate
}) => {
  // Compute key stats dynamically
  const totalAdmissions = patients.length;
  const activeERCases = patients.filter(p => p.status === "Emergency Queue").length;
  const occupiedICUBeds = beds.filter(b => b.type === "ICU" && b.status === "Occupied").length;
  const totalICUBeds = beds.filter(b => b.type === "ICU").length;
  const availableAmbulances = ambulances.filter(a => a.status === "Available").length;
  const lowStockMedicines = medicines.filter(m => m.stock < m.minStock).length;

  // Render bento stat card helper
  const renderStatCard = (
    title: string,
    value: string | number,
    subText: string,
    icon: React.ReactNode,
    colorClass: string,
    onClickTab?: string
  ) => (
    <div 
      onClick={() => onClickTab && onNavigate(onClickTab)}
      className={`bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white/50 shadow-sm flex items-center justify-between transition-all duration-300 hover:translate-y-[-2px] hover:bg-white/80 hover:shadow-md ${onClickTab ? 'cursor-pointer' : ''}`}
    >
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</span>
        <span className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">{value}</span>
        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
          {subText}
        </span>
      </div>
      <div className={`p-4 rounded-xl ${colorClass}`}>
        {icon}
      </div>
    </div>
  );

  // Recharts Chart Data
  const admissionTrendData = [
    { name: "Jan", Admissions: 120, Discharges: 95 },
    { name: "Feb", Admissions: 140, Discharges: 115 },
    { name: "Mar", Admissions: 210, Discharges: 180 },
    { name: "Apr", Admissions: 180, Discharges: 190 },
    { name: "May", Admissions: 240, Discharges: 210 },
    { name: "Jun", Admissions: 295, Discharges: 240 },
    { name: "Jul", Admissions: 310, Discharges: 280 }
  ];

  const departmentPerformanceData = [
    { name: "Cardiology", Patients: 145, Satisfaction: 98, color: "#10b981" },
    { name: "Neurology", Patients: 98, Satisfaction: 96, color: "#0d9488" },
    { name: "Pediatrics", Patients: 180, Satisfaction: 97, color: "#34d399" },
    { name: "Orthopedics", Patients: 110, Satisfaction: 94, color: "#059669" },
    { name: "Emergency", Patients: 240, Satisfaction: 92, color: "#0f766e" },
    { name: "Oncology", Patients: 85, Satisfaction: 99, color: "#14b8a6" }
  ];

  const bedOccupancyData = [
    { name: "Occupied Beds", value: beds.filter(b => b.status === "Occupied").length, color: "#059669" },
    { name: "Available Beds", value: beds.filter(b => b.status === "Available").length, color: "#34d399" },
    { name: "Maintenance", value: beds.filter(b => b.status === "Maintenance").length, color: "#f59e0b" }
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Alerts Banner */}
      {activeERCases > 0 || lowStockMedicines > 0 ? (
        <div className="bg-amber-50/60 backdrop-blur-md border border-amber-200/50 rounded-3xl p-5 flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100/80 p-2 rounded-xl text-amber-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm">Real-time Emergency Intel</h4>
              <p className="text-xs text-amber-800 font-medium">
                There are currently <span className="font-bold">{activeERCases} unallocated emergency cases</span> in the ER and <span className="font-bold">{lowStockMedicines} critical stock items</span> requiring pharmacy purchase approval.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate("Emergency Department")}
            className="text-xs bg-amber-600/90 text-white font-semibold hover:bg-amber-700 px-3.5 py-1.5 rounded-xl shadow-sm transition"
          >
            Dispatch Now
          </button>
        </div>
      ) : null}

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {renderStatCard(
          "Active Patient Admissions",
          totalAdmissions,
          "+14.2% Growth (MTD)",
          <Users className="w-6 h-6 text-emerald-600" />,
          "bg-emerald-50 text-emerald-600",
          "Digital Medical Records"
        )}
        {renderStatCard(
          "Emergency Queue Cases",
          activeERCases,
          "Triage response <8 mins",
          <HeartPulse className="w-6 h-6 text-teal-600" />,
          "bg-teal-50 text-teal-600",
          "Emergency Department"
        )}
        {renderStatCard(
          "ICU Bed Occupancy",
          `${occupiedICUBeds}/${totalICUBeds}`,
          "92.4% Bed Efficiency",
          <Bed className="w-6 h-6 text-emerald-700" />,
          "bg-emerald-50 text-emerald-700",
          "Ward Management"
        )}
        {renderStatCard(
          "Dispatched Ambulances",
          `${ambulances.length - availableAmbulances}/${ambulances.length}`,
          "Live telemetry online",
          <Ambulance className="w-6 h-6 text-teal-700" />,
          "bg-teal-50 text-teal-700",
          "Ambulance Command Center"
        )}
      </div>

      {/* Chart Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics: Admission & Discharge Trends */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Hospital Traffic Dynamics</h3>
              <p className="text-xs text-slate-500 font-medium">Monthly patient flow tracking (Admissions vs. Discharges)</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                Admissions
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-teal-400" />
                Discharges
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={admissionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDischarges" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="Admissions" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAdmissions)" />
                <Area type="monotone" dataKey="Discharges" stroke="#14b8a6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDischarges)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Bed Allocations */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-800 mb-1">Interactive Bed Status</h3>
          <p className="text-xs text-slate-500 font-medium mb-6">Real-time occupancy breakdown</p>
          <div className="h-56 flex justify-center items-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bedOccupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bedOccupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col justify-center items-center">
              <span className="text-2xl font-extrabold text-slate-800">
                {Math.round((beds.filter(b => b.status === "Occupied").length / beds.length) * 100)}%
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Occupied</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center mt-4">
            {bedOccupancyData.map((b, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-700">{b.value}</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: b.color }} />
                  {b.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Performance Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6 lg:col-span-2">
          <h3 className="text-base font-bold text-slate-800 mb-1">Department Quality Indexes</h3>
          <p className="text-xs text-slate-500 font-medium mb-6">Patient satisfaction index by clinical specialty</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="Satisfaction" fill="#10b981" radius={[8, 8, 0, 0]}>
                  {departmentPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Executive Quick Logs */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Administrative Audit Logs</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Latest actions synced to block records</p>
            <div className="space-y-3.5">
              <div className="flex gap-3 text-xs">
                <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg h-5 font-bold font-mono">10:32</span>
                <div>
                  <p className="font-bold text-slate-700">Ambulance AMB-001 Dispatched</p>
                  <p className="text-[10px] text-slate-500 font-medium">To Banani Accident Site - Driver Kiron</p>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded-lg h-5 font-bold font-mono">10:14</span>
                <div>
                  <p className="font-bold text-slate-700">Charity verification complete</p>
                  <p className="text-[10px] text-slate-500 font-medium">Patient Kabir Hossain approved for hernia aid</p>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg h-5 font-bold font-mono">09:55</span>
                <div>
                  <p className="font-bold text-slate-700">Stock Reorder Alert Triggered</p>
                  <p className="text-[10px] text-slate-500 font-medium">Ceftron 1g IV stock dropped below critical limit</p>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate("Audit Logs & Security")}
            className="w-full text-center py-2 text-xs bg-white/40 hover:bg-white/75 border border-white/50 rounded-xl font-bold text-slate-600 transition mt-4 cursor-pointer"
          >
            Access Audit Core
          </button>
        </div>
      </div>
    </div>
  );
};
