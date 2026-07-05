/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Printer, Download, FileText, CheckCircle2, TrendingUp, Filter, BarChart } from "lucide-react";
import { Patient, Bed, Medicine, Ambulance } from "../../types";

interface ReportGeneratorProps {
  patients: Patient[];
  beds: Bed[];
  medicines: Medicine[];
  ambulances: Ambulance[];
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  patients,
  beds,
  medicines,
  ambulances
}) => {
  const [selectedReportType, setSelectedReportType] = useState("Hospital Performance");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: "PDF" | "Excel") => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Success! Generated and compiled MediCore 247 clinical report for ${selectedReportType} in ${format} format!`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Selector Deck */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 grid grid-cols-1 md:grid-cols-3 gap-5 items-center justify-between">
        <div className="md:col-span-2">
          <h3 className="text-base font-bold text-slate-800">Corporate BI Reporting Engine</h3>
          <p className="text-xs text-slate-500 font-medium">Export audit ledger books, clinical performance charts, and medical inventory catalogs</p>
        </div>

        <select
          value={selectedReportType}
          onChange={(e) => setSelectedReportType(e.target.value)}
          className="px-3.5 py-2.5 text-xs bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl focus:outline-none focus:border-emerald-500 font-bold text-slate-700 transition cursor-pointer"
        >
          <option value="Hospital Performance">Hospital Performance Ledger</option>
          <option value="Billing & Financial claims">Billing & Claims ledger</option>
          <option value="Pharmacy Stocks & Expiries">Pharmacy stock ledger</option>
          <option value="HR Shift Schedule & Attendance">HR Shift & Payroll ledger</option>
        </select>
      </div>

      {/* Dynamic Ledger Preview Mockup */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/40 pb-4 mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h4 className="font-extrabold text-slate-800 text-sm">{selectedReportType} Report Preview</h4>
          </div>
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => handleExport("PDF")}
              disabled={isExporting}
              className="px-3.5 py-2 bg-slate-850 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              {isExporting ? "Compiling PDF..." : "Export PDF"}
            </button>
            <button
              onClick={() => handleExport("Excel")}
              disabled={isExporting}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Compiling Excel..." : "Export Excel"}
            </button>
          </div>
        </div>

        {/* Dynamic preview contents representing our mock data values */}
        {selectedReportType === "Hospital Performance" && (
          <div className="space-y-4 text-xs">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/40 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-inner">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total active inpatients</span>
                <span className="font-mono text-base font-extrabold text-slate-800">{patients.filter(p => p.status === "Admitted").length} Patients</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Bed Occupancy index</span>
                <span className="font-mono text-base font-extrabold text-emerald-700">
                  {Math.round((beds.filter(b => b.status === "Occupied").length / beds.length) * 100)}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Critical Low medicines</span>
                <span className="font-mono text-base font-extrabold text-rose-600">{medicines.filter(m => m.stock < m.minStock).length} Alarms</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Available Emergency Fleet</span>
                <span className="font-mono text-base font-extrabold text-slate-800">{ambulances.filter(a => a.status === "Available").length} Ready</span>
              </div>
            </div>

            {/* Render stylized clinical performance tables */}
            <div className="border border-white/40 rounded-xl overflow-hidden shadow-inner">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-white/40 border-b border-white/30">
                    <th className="p-3 font-bold text-slate-500 uppercase text-[9px]">Department Index</th>
                    <th className="p-3 font-bold text-slate-500 uppercase text-[9px]">Occupied Wards</th>
                    <th className="p-3 font-bold text-slate-500 uppercase text-[9px]">Clinical Wait times</th>
                    <th className="p-3 font-bold text-slate-500 uppercase text-[9px] text-right">Quality Index</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/20 last:border-b-0 hover:bg-white/40 transition">
                    <td className="p-3 font-bold text-slate-800">Cardiology wing</td>
                    <td className="p-3 font-semibold text-slate-600">8 Beds active</td>
                    <td className="p-3 font-semibold text-slate-600">12 Mins avg</td>
                    <td className="p-3 text-right font-extrabold text-emerald-700">98.2%</td>
                  </tr>
                  <tr className="border-b border-white/20 last:border-b-0 hover:bg-white/40 transition">
                    <td className="p-3 font-bold text-slate-800">Neurosurgery suite</td>
                    <td className="p-3 font-semibold text-slate-600">4 Beds active</td>
                    <td className="p-3 font-semibold text-slate-600">18 Mins avg</td>
                    <td className="p-3 text-right font-extrabold text-emerald-700">96.8%</td>
                  </tr>
                  <tr className="border-b border-white/20 last:border-b-0 hover:bg-white/40 transition">
                    <td className="p-3 font-bold text-slate-800">OPD Consultation Clinics</td>
                    <td className="p-3 font-semibold text-slate-600">45 Patients / Day</td>
                    <td className="p-3 font-semibold text-slate-600">8 Mins avg</td>
                    <td className="p-3 text-right font-extrabold text-emerald-700">95.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReportType === "Billing & Financial claims" && (
          <div className="space-y-4 text-xs">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/40 grid grid-cols-2 md:grid-cols-3 gap-4 shadow-inner">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total MTD gross billing</span>
                <span className="font-mono text-base font-extrabold text-slate-800">42,88,400 BDT</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Outstanding claims</span>
                <span className="font-mono text-base font-extrabold text-amber-600">5,40,000 BDT</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Disbursed charity subsidy</span>
                <span className="font-mono text-base font-extrabold text-emerald-700">4,55,000 BDT</span>
              </div>
            </div>

            <div className="border border-white/40 rounded-xl overflow-hidden shadow-inner">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-white/40 border-b border-white/30">
                    <th className="p-3 font-bold text-slate-500 uppercase text-[9px]">Claim Account</th>
                    <th className="p-3 font-bold text-slate-500 uppercase text-[9px]">Sponsor Organization</th>
                    <th className="p-3 font-bold text-slate-500 uppercase text-[9px]">Status</th>
                    <th className="p-3 font-bold text-slate-500 uppercase text-[9px] text-right">Sum BDT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/20 last:border-b-0 hover:bg-white/40 transition">
                    <td className="p-3 font-bold text-slate-800">MetLife Al-Amanah</td>
                    <td className="p-3 font-semibold text-slate-600">Sultana Begum Case</td>
                    <td className="p-3"><span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">Paid</span></td>
                    <td className="p-3 text-right font-mono font-bold text-slate-800">1,82,000 BDT</td>
                  </tr>
                  <tr className="border-b border-white/20 last:border-b-0 hover:bg-white/40 transition">
                    <td className="p-3 font-bold text-slate-800">Kuwait Relief Alliance</td>
                    <td className="p-3 font-semibold text-slate-600">Kabir Hossain Charity Case</td>
                    <td className="p-3"><span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">Verified</span></td>
                    <td className="p-3 text-right font-mono font-bold text-slate-800">1,45,000 BDT</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Default fallback previews */}
        {selectedReportType !== "Hospital Performance" && selectedReportType !== "Billing & Financial claims" && (
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 text-center text-slate-500 border border-white/45 shadow-inner">
            <BarChart className="w-10 h-10 text-slate-400 mx-auto mb-2 animate-pulse" />
            <p className="font-bold">Database matched tables loaded successfully.</p>
            <p className="text-[10px] text-slate-500/80 mt-1">Press PDF or Excel compilation buttons above to fetch current data values.</p>
          </div>
        )}
      </div>
    </div>
  );
};
