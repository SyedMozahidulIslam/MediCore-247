/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Printer, Coins, RefreshCw, Award, Filter, ShieldCheck, Mail, Phone, CalendarRange } from "lucide-react";
import { Employee, UserRole } from "../../types";

interface HRModuleProps {
  employees: Employee[];
  onUpdateEmployeeAttendance: (id: string, status: Employee["attendanceStatus"]) => void;
}

export const HRModule: React.FC<HRModuleProps> = ({ employees, onUpdateEmployeeAttendance }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedShift, setSelectedShift] = useState("All");
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [showBadgePrint, setShowBadgePrint] = useState(false);

  // Filter lists
  const roles = ["All", ...Array.from(new Set(employees.map(e => e.role)))];
  const shifts = ["All", "Morning", "Evening", "Night"];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "All" || emp.role === selectedRole;
    
    let matchesShift = true;
    if (selectedShift !== "All") {
      matchesShift = emp.shift.startsWith(selectedShift);
    }

    return matchesSearch && matchesRole && matchesShift;
  });

  const selectedEmp = employees.find(e => e.id === selectedEmpId) || filteredEmployees[0];

  const handleProcessPayroll = () => {
    const totalPayroll = filteredEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);
    alert(`Success! Handled clinical payroll for ${filteredEmployees.length} filtered employees. Total: ${totalPayroll.toLocaleString()} BDT transferred.`);
  };

  return (
    <div className="space-y-6">
      {/* Upper stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Corporate Registry</span>
            <span className="text-2xl font-extrabold text-slate-800">{employees.length} Personnel</span>
            <p className="text-[10px] text-emerald-700 font-semibold mt-1">100% database match records</p>
          </div>
          <div className="bg-teal-50 text-teal-700 p-3.5 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">On-Shift Attendance</span>
            <span className="text-2xl font-extrabold text-slate-800">
              {employees.filter(e => e.attendanceStatus === "Present").length} Present
            </span>
            <p className="text-[10px] text-amber-700 font-semibold mt-1">
              {employees.filter(e => e.attendanceStatus === "On Leave").length} Authorized Leaves
            </p>
          </div>
          <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/80 to-teal-950/80 backdrop-blur-md text-white rounded-3xl p-5 shadow-sm border border-white/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">Clinical Payroll Budget</span>
            <span className="text-2xl font-mono font-extrabold">
              {filteredEmployees.reduce((sum, e) => sum + (e.salary || 0), 0).toLocaleString()} BDT
            </span>
            <p className="text-[10px] text-emerald-300/80 font-medium mt-1">For currently filtered list</p>
          </div>
          <button
            onClick={handleProcessPayroll}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Coins className="w-4 h-4" />
            Pay Salaries
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Full Directory filters & table */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-b border-white/40 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">Interactive Staff Directory</h3>
              <p className="text-xs text-slate-500 font-medium">Click on any name to check shifts, print badges, or edit authorized attendance leaves</p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search name, code, skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/85 border border-white/50 rounded-xl focus:outline-none focus:border-emerald-500 font-semibold text-slate-800 placeholder-slate-400 transition"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 text-xs bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl focus:outline-none focus:border-emerald-500 font-semibold text-slate-600 transition"
            >
              <option value="All">All Roles</option>
              {roles.filter(r => r !== "All").map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>

            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="px-3 py-2 text-xs bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl focus:outline-none focus:border-emerald-500 font-semibold text-slate-600 transition"
            >
              <option value="All">All Shifts</option>
              {shifts.filter(s => s !== "All").map((s, i) => (
                <option key={i} value={s}>{s} Shift</option>
              ))}
            </select>
          </div>

          {/* Employee Grid/List */}
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto pr-1">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="pb-2.5 font-bold text-slate-500 uppercase text-[10px]">Name / ID</th>
                  <th className="pb-2.5 font-bold text-slate-500 uppercase text-[10px]">Role / Department</th>
                  <th className="pb-2.5 font-bold text-slate-500 uppercase text-[10px]">Shift</th>
                  <th className="pb-2.5 font-bold text-slate-500 uppercase text-[10px] text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmpId(emp.id);
                      setShowBadgePrint(false);
                    }}
                    className={`border-b border-white/20 last:border-b-0 hover:bg-white/40 cursor-pointer transition ${
                      selectedEmp?.id === emp.id ? "bg-white/70 shadow-sm" : ""
                    }`}
                  >
                    <td className="py-3">
                      <div>
                        <p className="font-extrabold text-slate-800">{emp.name}</p>
                        <p className="text-[9px] text-slate-500 font-mono font-bold mt-0.5">{emp.id}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="font-bold text-slate-700">{emp.role}</p>
                        <p className="text-[9px] text-slate-500 font-semibold">{emp.department}</p>
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-slate-600">{emp.shift.split(" ")[0]}</td>
                    <td className="py-3 text-right">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-lg border uppercase ${
                        emp.attendanceStatus === "Present" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        emp.attendanceStatus === "Absent" ? "bg-rose-50 text-rose-700 border-rose-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {emp.attendanceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Clinician details and ID badge generator */}
        {selectedEmp && (
          <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 space-y-5">
            {!showBadgePrint ? (
              <div className="space-y-4">
                <div className="border-b border-white/40 pb-3">
                  <span className="text-[10px] bg-white/70 text-slate-700 border border-white/60 font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider shadow-sm">{selectedEmp.role}</span>
                  <h4 className="font-extrabold text-slate-800 text-sm mt-2">{selectedEmp.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">{selectedEmp.id} | {selectedEmp.department}</p>
                </div>

                <div className="space-y-3 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedEmp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedEmp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarRange className="w-3.5 h-3.5 text-slate-400" />
                    <span>Shift: {selectedEmp.shift}</span>
                  </div>
                  <div className="flex items-center gap-2 border-t border-white/40 pt-3">
                    <Coins className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-slate-800 font-bold">Salary Rate: {selectedEmp.salary?.toLocaleString()} BDT / month</span>
                  </div>
                </div>

                {/* Skills/Qualifications list */}
                {selectedEmp.skills && (
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Corporate Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEmp.skills.map((skill, idx) => (
                        <span key={idx} className="bg-white/70 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-lg border border-white/60 shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leaves Management */}
                <div className="bg-white/30 backdrop-blur-sm border border-white/40 p-3.5 rounded-2xl space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Authorization Leaves Desk</span>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => onUpdateEmployeeAttendance(selectedEmp.id, "Present")}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] shadow-sm transition cursor-pointer"
                    >
                      On Duty
                    </button>
                    <button
                      onClick={() => onUpdateEmployeeAttendance(selectedEmp.id, "On Leave")}
                      className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[10px] shadow-sm transition cursor-pointer"
                    >
                      Authorize Leave
                    </button>
                  </div>
                </div>

                {/* Trigger Print ID Badge */}
                <button
                  onClick={() => setShowBadgePrint(true)}
                  className="w-full py-2.5 bg-slate-850 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Generate Corporate ID Badge
                </button>
              </div>
            ) : (
              /* Printable Corporate ID Badge preview */
              <div className="space-y-4">
                <div className="border border-white/30 rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-teal-950 text-white relative shadow-md overflow-hidden text-center flex flex-col justify-between h-[340px]">
                  {/* Decorative badge overlay */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

                  <div className="space-y-1">
                    <span className="font-black text-xs tracking-wider text-emerald-400">MEDICORE 247</span>
                    <p className="text-[8px] text-teal-300 font-extrabold uppercase tracking-widest">HOSPITAL CORPORATE STAFF</p>
                  </div>

                  <div className="my-4 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center font-bold text-xl text-white mb-2 shadow-inner">
                      {selectedEmp.name.charAt(0)}
                    </div>
                    <h4 className="font-extrabold text-base text-white">{selectedEmp.name}</h4>
                    <p className="text-xs text-emerald-400 font-bold mt-0.5">{selectedEmp.role}</p>
                    <p className="text-[9px] text-teal-300/80 font-bold">{selectedEmp.department}</p>
                  </div>

                  <div className="border-t border-teal-900 pt-3 flex justify-between items-center text-[9px] text-teal-300 font-mono">
                    <span>ID: {selectedEmp.id}</span>
                    <span className="font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400">SECURE CHIP RFID</span>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      alert("Pushed to corporate badge laser printing queue!");
                      setShowBadgePrint(false);
                    }}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Print Badge
                  </button>
                  <button
                    onClick={() => setShowBadgePrint(false)}
                    className="py-2 px-3 bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
