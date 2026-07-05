/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, MapPin, Award, Star, MessageSquare, DollarSign, CalendarCheck } from "lucide-react";
import { Employee, UserRole, AvailabilityStatus } from "../../types";

interface DoctorExplorerProps {
  doctors: Employee[];
  onBookAppointment: (doctor: Employee) => void;
}

export const DoctorExplorer: React.FC<DoctorExplorerProps> = ({ doctors, onBookAppointment }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedBuilding, setSelectedBuilding] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");

  // Get unique departments & buildings for filters
  const departments = ["All", ...Array.from(new Set(doctors.map(d => d.department)))];
  const buildings = ["All", ...Array.from(new Set(doctors.map(d => d.building).filter(Boolean)))];

  // Filter logic
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (doc.specialization && doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = selectedDept === "All" || doc.department === selectedDept;
    const matchesBuilding = selectedBuilding === "All" || doc.building === selectedBuilding;
    
    let matchesRating = true;
    if (selectedRating !== "All") {
      const minStars = parseInt(selectedRating);
      matchesRating = (doc.rating || 0) >= minStars;
    }

    return matchesSearch && matchesDept && matchesBuilding && matchesRating;
  });

  const getStatusBadge = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Available</span>;
      case AvailabilityStatus.IN_CONSULTATION:
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">In Consultation</span>;
      case AvailabilityStatus.ON_SURGERY:
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">In Surgery</span>;
      case AvailabilityStatus.EMERGENCY:
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">On Emergency</span>;
      case AvailabilityStatus.BREAK:
        return <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">On Break</span>;
      default:
        return <span className="bg-slate-50 text-slate-400 border border-slate-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Offline</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Filter Panel */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Premium Clinical Registry</h3>
            <p className="text-xs text-slate-500 font-medium">Verify credentials, floor allocations, and dispatch consultations</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-white/70 px-3 py-1 rounded-full border border-white/60 shadow-sm">
            {filteredDoctors.length} Specialists Registered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search doctor or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/40 hover:bg-white/60 focus:bg-white/80 border border-white/50 focus:border-emerald-500 rounded-xl focus:outline-none transition duration-200 font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-700 transition"
          >
            <option value="All">All Departments</option>
            {departments.filter(d => d !== "All").map((dept, i) => (
              <option key={i} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-700 transition"
          >
            <option value="All">All Buildings</option>
            {buildings.filter(b => b !== "All").map((bld, i) => (
              <option key={i} value={bld as string}>{bld as string}</option>
            ))}
          </select>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-700 transition"
          >
            <option value="All">All Star Categories</option>
            <option value="4.8">Senior Consultant (4.8+ ★)</option>
            <option value="4.5">Specialist (4.5+ ★)</option>
            <option value="4.2">Associate (4.2+ ★)</option>
          </select>
        </div>
      </div>

      {/* Doctor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 hover:translate-y-[-4px] hover:bg-white/80 hover:shadow-md transition-all duration-300 relative flex flex-col justify-between overflow-hidden"
          >
            {/* Top decorative gradient bar based on department */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            
            <div>
              <div className="flex items-start justify-between mb-3.5">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                    {doc.name}
                  </h4>
                  <p className="text-xs text-emerald-600 font-bold mt-0.5">{doc.specialization}</p>
                </div>
                {getStatusBadge(doc.availability)}
              </div>

              {/* Sub-details */}
              <div className="space-y-2 text-xs text-slate-500 mb-4 border-b border-white/40 pb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-600">{doc.qualification}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-700">{doc.floor}, {doc.building}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-600">Languages: {doc.languages?.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div>
              <div className="flex items-center justify-between text-xs mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-slate-800">{doc.rating?.toFixed(1)}</span>
                  <span className="text-slate-500 font-semibold text-[10px]">({doc.experience} yrs exp)</span>
                </div>
                <div className="flex items-center gap-0.5 text-slate-800">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-extrabold text-sm">{doc.fee} BDT</span>
                  <span className="text-slate-500 font-semibold text-[10px]">/ visit</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] bg-white/40 rounded-xl p-2.5 mb-4 font-semibold text-slate-600 border border-white/40">
                <span>Shift: {doc.shift.split(" ")[0]}</span>
                <span className="text-emerald-600 font-bold bg-white/80 px-2 py-0.5 rounded-lg border border-white/60">
                  {doc.starCategory?.split(" ")[0]} Rating
                </span>
              </div>

              <button
                onClick={() => onBookAppointment(doc)}
                disabled={doc.availability === AvailabilityStatus.OFFLINE || doc.availability === AvailabilityStatus.VACATION}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-sm text-xs flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                Dispatch Patient Token
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
