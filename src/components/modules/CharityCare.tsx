/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Award, ShieldCheck, Heart, User, Sparkles, Filter, CheckCircle2, Coins, Landmark } from "lucide-react";
import { CharityVerification, Patient } from "../../types";

interface CharityCareProps {
  charityCases: CharityVerification[];
  patients: Patient[];
  onUpdateCharityStatus: (id: string, status: "Verified" | "Rejected", aidType?: string) => void;
}

export const CharityCare: React.FC<CharityCareProps> = ({ charityCases, patients, onUpdateCharityStatus }) => {
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [incomeInput, setIncomeInput] = useState<number>(35000);
  const [docInput, setDocInput] = useState<"NID/Income Certificate" | "Social Welfare Card" | "Freedom Fighter Certificate">("NID/Income Certificate");
  const [sponsorInput, setSponsorInput] = useState("MediCore Zakat & Charity Trust");
  const [aidInput, setAidInput] = useState("100% Free Medicine & Consultation");
  const [patientIdInput, setPatientIdInput] = useState("");

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === patientIdInput);
    if (!pat) {
      alert("Entered Patient ID does not exist in standard registration!");
      return;
    }

    // Call callback or add directly
    alert("New charity medical aid request queued for verification.");
    setPatientIdInput("");
  };

  return (
    <div className="space-y-6">
      {/* Impact Indicators bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Total Free Aid Disbursed</span>
            <span className="text-2xl font-extrabold text-slate-800">4,55,000 BDT</span>
            <p className="text-[10px] text-slate-500 font-medium mt-1">Funded entirely by sponsors & Zakat</p>
          </div>
          <div className="bg-emerald-100 p-3.5 rounded-xl text-emerald-700">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block mb-1">Surgical Aid Operations</span>
            <span className="text-2xl font-extrabold text-slate-800">32 Successful Cases</span>
            <p className="text-[10px] text-slate-500 font-medium mt-1">100% successful post-op recovery</p>
          </div>
          <div className="bg-teal-100 p-3.5 rounded-xl text-teal-700">
            <Heart className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/80 to-teal-950/80 backdrop-blur-md text-white rounded-3xl p-5 shadow-sm border border-white/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">Verification SLA</span>
            <span className="text-2xl font-mono font-extrabold">2.4 Hours</span>
            <p className="text-[10px] text-emerald-300/80 font-medium mt-1">Live clinical aid approvals</p>
          </div>
          <div className="bg-emerald-500/20 p-3.5 rounded-xl text-emerald-400">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Charity Verification list */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/40 pb-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Charity Aid Verification Desk</h3>
              <p className="text-xs text-slate-500 font-medium">Verify income thresholds, upload certificates, and allocate donor sponsor funds</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {charityCases.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  selectedCaseId === c.id
                    ? "bg-white text-emerald-800 border-emerald-400/50 shadow-sm"
                    : "bg-white/40 border-white/40 hover:bg-white/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{c.patientName}</h5>
                    <p className="text-[10px] text-slate-500 font-semibold">Supporting Doc: {c.supportingDocument}</p>
                    <p className="text-[10px] text-slate-600 font-bold">Annual Income: {c.annualIncome.toLocaleString()} BDT</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Donor Sponsor</p>
                    <p className="text-xs text-slate-700 font-extrabold flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                      {c.donationFundSponsor}
                    </p>
                  </div>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-lg border uppercase ${
                    c.status === "Verified" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Inspector Side Card */}
        {(() => {
          const currentCase = charityCases.find(c => c.id === selectedCaseId) || charityCases[0];
          if (!currentCase) return null;

          const qualifies = currentCase.annualIncome < 50000;

          return (
            <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 space-y-4">
              <div className="border-b border-white/40 pb-3">
                <span className="text-[10px] bg-white/70 text-slate-700 border border-white/60 font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider shadow-sm">Inspector Suite</span>
                <h4 className="font-extrabold text-slate-800 text-sm mt-2">{currentCase.patientName}</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">Verification ID: {currentCase.id}</p>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Income Check:</span>
                  <span className={`font-bold ${qualifies ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {currentCase.annualIncome.toLocaleString()} BDT / Year
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Income Limit Status:</span>
                  <span className={`font-extrabold flex items-center gap-1 ${qualifies ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {qualifies ? "QUALIFIED (<50k)" : "EXCEEDED"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verification Doc:</span>
                  <span className="text-slate-800 font-extrabold">{currentCase.supportingDocument}</span>
                </div>
                <div className="flex justify-between border-b border-white/40 pb-3">
                  <span className="text-slate-500">Allocated Aid Type:</span>
                  <span className="text-emerald-700 font-black text-right">{currentCase.approvedAidType}</span>
                </div>

                {currentCase.status === "Pending" ? (
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => onUpdateCharityStatus(currentCase.id, "Verified")}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
                    >
                      Verify & Allocate Donation Funds
                    </button>
                    <button
                      onClick={() => onUpdateCharityStatus(currentCase.id, "Rejected")}
                      className="w-full py-2 bg-white/40 hover:bg-white/60 border border-white/50 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      Reject Application
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-50/60 backdrop-blur-sm border border-emerald-200/50 p-3 rounded-xl flex items-center gap-2 text-emerald-800 text-[11px] font-bold">
                    <Award className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <div>
                      <p className="font-extrabold text-emerald-950">VERIFIED CHARITY PROFILE</p>
                      <p className="text-[10px] text-emerald-700 font-medium mt-0.5">Funded via {currentCase.donationFundSponsor}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
