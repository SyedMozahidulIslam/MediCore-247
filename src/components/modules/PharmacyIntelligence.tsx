/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Pill, Search, AlertTriangle, AlertCircle, ShoppingCart, RefreshCw, Thermometer, QrCode, CheckCircle } from "lucide-react";
import { Medicine } from "../../types";

interface PharmacyIntelligenceProps {
  medicines: Medicine[];
  onRestockMedicine: (id: string, amount: number) => void;
}

export const PharmacyIntelligence: React.FC<PharmacyIntelligenceProps> = ({ medicines, onRestockMedicine }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedId, setSelectedMedId] = useState("");
  const [barcodeScanInput, setBarcodeScanInput] = useState("");
  const [barcodeScanResult, setBarcodeScanResult] = useState<Medicine | null>(null);

  const filteredMeds = medicines.filter(
    m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         m.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBarcodeScan = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = barcodeScanInput.trim();
    // Simulate finding a medicine by typing or clicking simulated barcode formats
    const found = medicines.find(m => m.batchNumber.includes(cleanCode) || m.id.includes(cleanCode));
    if (found) {
      setBarcodeScanResult(found);
    } else {
      setBarcodeScanResult(null);
      alert("Barcode or Batch code not matched in pharmacy database!");
    }
  };

  const handleRestock = (id: string) => {
    onRestockMedicine(id, 5000); // Add 5000 units
    alert("Purchase requisition approved! Medicine stock reloaded successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Upper Panel: Search and Cold Storage telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Pharmacy Inventory Directory</h3>
              <p className="text-xs text-slate-500 font-medium">Real-time stock levels, generic formulas, and restock levels</p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-white/70 px-3 py-1 rounded-full border border-white/60 shadow-sm">
              {medicines.length} Unique Formulations Stocked
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by medicine name or generic composition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/40 hover:bg-white/60 focus:bg-white/85 border border-white/50 focus:border-teal-500 rounded-xl focus:outline-none transition font-semibold text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Cold Storage Vault Telemetry */}
        <div className="bg-gradient-to-br from-teal-950/80 to-emerald-950/80 backdrop-blur-md text-white rounded-3xl p-5 shadow-sm border border-white/20 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-teal-400" />
              Cold Storage Vault 1
            </span>
            <div>
              <span className="text-3xl font-mono font-extrabold tracking-tight">4.2 °C</span>
              <span className="text-xs text-teal-200/80 block mt-1">Live Vaccine & Injection Temp</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider mt-1.5">OPTIMAL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table list */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 lg:col-span-2 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-white/40">
                <th className="pb-3 font-bold text-slate-500 uppercase text-[10px]">Medicine</th>
                <th className="pb-3 font-bold text-slate-500 uppercase text-[10px]">Stock</th>
                <th className="pb-3 font-bold text-slate-500 uppercase text-[10px]">Location</th>
                <th className="pb-3 font-bold text-slate-500 uppercase text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeds.map((med) => {
                const isLow = med.stock < med.minStock;
                return (
                  <tr 
                    key={med.id} 
                    onClick={() => {
                      setSelectedMedId(med.id);
                      setBarcodeScanResult(null);
                    }}
                    className={`border-b border-white/20 last:border-b-0 hover:bg-white/40 cursor-pointer transition ${
                      selectedMedId === med.id ? "bg-white/70" : ""
                    }`}
                  >
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isLow ? 'bg-rose-50 text-rose-600' : 'bg-teal-50 text-teal-600'}`}>
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{med.name}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">{med.genericName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-col">
                        <span className={`font-extrabold ${isLow ? 'text-rose-600' : 'text-slate-700'}`}>
                          {med.stock.toLocaleString()} units
                        </span>
                        {isLow && (
                          <span className="text-[9px] text-rose-500 font-extrabold flex items-center gap-0.5 mt-0.5">
                            <AlertCircle className="w-3 h-3" />
                            CRITICAL LOW STOCK
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 font-semibold text-slate-600">{med.location}</td>
                    <td className="py-3.5 text-right">
                      {isLow ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestock(med.id);
                          }}
                          className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 ml-auto shadow-sm transition cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Approve Reorder
                        </button>
                      ) : (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-lg">Healthy</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Info panel + barcode scanning */}
        <div className="space-y-6">
          {/* Barcode scanner mockup */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-teal-600" />
              Barcode Scanner Terminal
            </h4>
            <form onSubmit={handleBarcodeScan} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Batch/Batch Code (e.g. NP-9882)"
                value={barcodeScanInput}
                onChange={(e) => setBarcodeScanInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/85 border border-white/50 focus:outline-none rounded-lg font-semibold text-slate-800 placeholder-slate-400 transition"
              />
              <button 
                type="submit"
                className="px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center shadow-sm cursor-pointer"
              >
                Scan
              </button>
            </form>

            {barcodeScanResult && (
              <div className="bg-emerald-50/60 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-3 text-xs space-y-1.5">
                <p className="font-extrabold text-emerald-950 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  MATCH FOUND
                </p>
                <p className="text-slate-800 font-bold">{barcodeScanResult.name} ({barcodeScanResult.category})</p>
                <p className="text-[10px] text-slate-500 font-semibold">Generic: {barcodeScanResult.genericName}</p>
                <p className="text-[10px] text-slate-500 font-semibold">Stock: {barcodeScanResult.stock} | Location: {barcodeScanResult.location}</p>
              </div>
            )}
          </div>

          {/* Alternative Suggestion Inspector */}
          {(() => {
            const currentMed = barcodeScanResult || medicines.find(m => m.id === selectedMedId) || medicines[0];
            if (!currentMed) return null;

            return (
              <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 space-y-4">
                <div className="border-b border-white/40 pb-3">
                  <span className="text-[10px] bg-white/70 text-slate-700 border border-white/60 font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider shadow-sm">{currentMed.category}</span>
                  <h4 className="font-extrabold text-slate-800 text-sm mt-2">{currentMed.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{currentMed.genericName}</p>
                </div>

                <div className="space-y-3.5 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch Code:</span>
                    <span className="text-slate-800 font-mono">{currentMed.batchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expiration Date:</span>
                    <span className={`text-slate-800 ${new Date(currentMed.expiryDate) < new Date() ? 'text-rose-600 font-bold' : ''}`}>{currentMed.expiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Approved Supplier:</span>
                    <span className="text-slate-800 text-right">{currentMed.supplier}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/40 pb-3">
                    <span className="text-slate-500">Base Unit Fee:</span>
                    <span className="text-emerald-700 font-extrabold">{currentMed.price.toFixed(2)} BDT</span>
                  </div>

                  {/* Alternative Suggester */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Alternative Suggestions</span>
                    <div className="flex flex-wrap gap-2">
                      {currentMed.alternatives.map((alt, idx) => (
                        <span key={idx} className="bg-white/70 text-teal-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/60 shadow-sm">
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
