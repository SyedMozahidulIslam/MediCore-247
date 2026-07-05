/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Search, QrCode, Wrench, ShieldCheck, ShieldAlert, Plus, 
  Calendar, Clock, MapPin, DollarSign, Activity, AlertTriangle, 
  CheckCircle, Hammer, ChevronRight, BarChart2, Shield, RefreshCw
} from "lucide-react";
import { 
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from "recharts";
import { BiomedicalAsset, Department, RepairRecord } from "../../types";

interface BiomedicalEquipmentProps {
  assets: BiomedicalAsset[];
  onAddAsset: (newAsset: BiomedicalAsset) => void;
  onUpdateAsset: (updatedAsset: BiomedicalAsset) => void;
  departments: Department[];
}

export const BiomedicalEquipment: React.FC<BiomedicalEquipmentProps> = ({ 
  assets, 
  onAddAsset, 
  onUpdateAsset,
  departments
}) => {
  // Navigation & filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [activeChartTab, setActiveChartTab] = useState<"utilization" | "downtime" | "costs">("utilization");
  
  // Form states for Registering a New Asset
  const [isRegistering, setIsRegistering] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<BiomedicalAsset["type"]>("Ventilator");
  const [newManufacturer, setNewManufacturer] = useState("");
  const [newSerial, setNewSerial] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDept, setNewDept] = useState<Department>(Department.RADIOLOGY);
  const [newLocation, setNewLocation] = useState("");
  const [newWarrantyExpiry, setNewWarrantyExpiry] = useState("2028-07-04");
  const [newWarrantyProvider, setNewWarrantyProvider] = useState("");
  const [newMaintFreq, setNewMaintFreq] = useState<BiomedicalAsset["maintenanceFrequency"]>("Quarterly");
  const [newCalFreq, setNewCalFreq] = useState<BiomedicalAsset["calibrationFrequency"]>("Quarterly");

  // QR/Barcode Simulator State
  const [qrInput, setQrInput] = useState("");
  const [qrScanSuccess, setQrScanSuccess] = useState<string | null>(null);

  // Form states for logging repair
  const [repairIssue, setRepairIssue] = useState("");
  const [repairTechnician, setRepairTechnician] = useState("Anisur Rahman (Hospital BioMed Engineer)");
  const [repairCost, setRepairCost] = useState("");
  const [repairStatus, setRepairStatus] = useState<RepairRecord["status"]>("In Progress");

  // Allocation state
  const [isReallocating, setIsReallocating] = useState(false);
  const [allocDept, setAllocDept] = useState<Department>(Department.RADIOLOGY);
  const [allocLocation, setAllocLocation] = useState("");
  const [allocAssigned, setAllocAssigned] = useState("");

  const todayDateStr = "2026-07-04";

  // Check if a date is overdue compared to today
  const isDateOverdue = (dateStr: string) => {
    const today = new Date(todayDateStr);
    const target = new Date(dateStr);
    return target < today;
  };

  // Unique Asset Types for dropdown filtering
  const assetTypes = [
    "All", "MRI", "CT Scan", "X-Ray", "Ventilator", "ECG Machine", "Monitor", "Infusion Pump", "Surgical Equipment"
  ];

  // Unique Status values for dropdown filtering
  const statusOptions = [
    "All", "Active", "In Use", "Maintenance", "Out of Calibration", "Repairing", "Decommissioned"
  ];

  // Filtered Assets list
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === "All" || asset.type === selectedType;
      const matchesStatus = selectedStatus === "All" || asset.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assets, searchTerm, selectedType, selectedStatus]);

  // Selected Asset (defaults to the first filtered asset if not set)
  const selectedAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId) || filteredAssets[0] || null;
  }, [assets, selectedAssetId, filteredAssets]);

  // Calibration Alerts & Maintenance Alarms counts
  const telemetryMetrics = useMemo(() => {
    let calibrationOverdueCount = 0;
    let maintenanceOverdueCount = 0;
    let totalRepairCost = 0;

    assets.forEach(asset => {
      if (isDateOverdue(asset.nextCalibrationDate) && asset.status !== "Decommissioned") {
        calibrationOverdueCount++;
      }
      if (isDateOverdue(asset.nextMaintenanceDate) && asset.status !== "Decommissioned") {
        maintenanceOverdueCount++;
      }
      asset.repairHistory.forEach(rep => {
        totalRepairCost += rep.cost;
      });
    });

    return {
      calibrationOverdueCount,
      maintenanceOverdueCount,
      totalRepairCost,
      totalAssetsCount: assets.length,
      activeCount: assets.filter(a => a.status === "Active" || a.status === "In Use").length,
      alarmsCount: assets.filter(a => a.status === "Maintenance" || a.status === "Out of Calibration" || a.status === "Repairing").length
    };
  }, [assets]);

  // Chart Analytics data preparation
  const chartData = useMemo(() => {
    // Grouping for equipment types
    const groups: { [key: string]: { totalHours: number; count: number; totalDowntime: number; repairCost: number } } = {};
    
    // Initialize groups
    assetTypes.filter(t => t !== "All").forEach(t => {
      groups[t] = { totalHours: 0, count: 0, totalDowntime: 0, repairCost: 0 };
    });

    assets.forEach(asset => {
      if (groups[asset.type]) {
        groups[asset.type].totalHours += asset.usageHours;
        groups[asset.type].totalDowntime += asset.downtimePercentage;
        groups[asset.type].count += 1;
        
        let assetRepairCost = 0;
        asset.repairHistory.forEach(r => { assetRepairCost += r.cost; });
        groups[asset.type].repairCost += assetRepairCost;
      }
    });

    return Object.keys(groups).map(type => {
      const g = groups[type];
      return {
        name: type,
        "Total Assets": g.count,
        "Average Usage (Hrs)": g.count > 0 ? Math.round(g.totalHours / g.count) : 0,
        "Average Downtime %": g.count > 0 ? parseFloat((g.totalDowntime / g.count).toFixed(1)) : 0,
        "Maintenance Cost (BDT)": g.repairCost,
      };
    });
  }, [assets]);

  // Handle Calibration update
  const handlePerformCalibration = (assetId: string) => {
    const assetToUpdate = assets.find(a => a.id === assetId);
    if (!assetToUpdate) return;

    // Calculate next calibration date (e.g. +6 months)
    const today = new Date(todayDateStr);
    today.setMonth(today.getMonth() + 6);
    const nextCalDateStr = today.toISOString().split("T")[0];

    const updatedAsset: BiomedicalAsset = {
      ...assetToUpdate,
      lastCalibrationDate: todayDateStr,
      nextCalibrationDate: nextCalDateStr,
      // If was out of calibration, return to active
      status: assetToUpdate.status === "Out of Calibration" ? "Active" : assetToUpdate.status
    };

    onUpdateAsset(updatedAsset);
    alert(`Asset ${assetId} calibration recorded successfully. Next calibration scheduled for ${nextCalDateStr}.`);
  };

  // Handle Routine Maintenance update
  const handlePerformMaintenance = (assetId: string) => {
    const assetToUpdate = assets.find(a => a.id === assetId);
    if (!assetToUpdate) return;

    // Calculate next maintenance date (e.g., based on frequency)
    const today = new Date(todayDateStr);
    const monthsToAdd = assetToUpdate.maintenanceFrequency === "Monthly" ? 1 : 
                        assetToUpdate.maintenanceFrequency === "Quarterly" ? 3 :
                        assetToUpdate.maintenanceFrequency === "Bi-annually" ? 6 : 12;
    today.setMonth(today.getMonth() + monthsToAdd);
    const nextMaintDateStr = today.toISOString().split("T")[0];

    const updatedAsset: BiomedicalAsset = {
      ...assetToUpdate,
      lastMaintenanceDate: todayDateStr,
      nextMaintenanceDate: nextMaintDateStr,
      // Restore status to Active/In Use if in Maintenance
      status: assetToUpdate.status === "Maintenance" ? "Active" : assetToUpdate.status
    };

    onUpdateAsset(updatedAsset);
    alert(`Routine BioMed maintenance logged for ${assetId}. Next maintenance schedule: ${nextMaintDateStr}.`);
  };

  // Handle Reallocation
  const handleReallocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    const updatedAsset: BiomedicalAsset = {
      ...selectedAsset,
      department: allocDept,
      location: allocLocation || selectedAsset.location,
      assignedTo: allocAssigned || selectedAsset.assignedTo
    };

    onUpdateAsset(updatedAsset);
    setIsReallocating(false);
    setAllocLocation("");
    setAllocAssigned("");
    alert(`Asset ${selectedAsset.id} has been reallocated to ${allocDept} (${updatedAsset.location}).`);
  };

  // Handle Logging a New Repair Case
  const handleLogRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !repairIssue.trim()) {
      alert("Please provide the repair issue details.");
      return;
    }

    const costNum = parseFloat(repairCost) || 0;
    const newRecord: RepairRecord = {
      id: `REP-${selectedAsset.type.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      date: todayDateStr,
      issue: repairIssue,
      cost: costNum,
      technician: repairTechnician,
      status: repairStatus
    };

    // Determine the device's new status based on the repair status
    let nextStatus: BiomedicalAsset["status"] = selectedAsset.status;
    if (repairStatus === "In Progress") {
      nextStatus = "Repairing";
    } else if (repairStatus === "Pending Parts") {
      nextStatus = "Maintenance";
    } else if (repairStatus === "Resolved") {
      nextStatus = "Active";
      newRecord.solution = "Diagnostic review, system reset, and output validation tests completed.";
    }

    const updatedAsset: BiomedicalAsset = {
      ...selectedAsset,
      status: nextStatus,
      repairHistory: [newRecord, ...selectedAsset.repairHistory]
    };

    onUpdateAsset(updatedAsset);
    setRepairIssue("");
    setRepairCost("");
    alert(`New repair ticket ${newRecord.id} registered. Equipment status updated to: ${nextStatus}.`);
  };

  // Handle Registering a New Asset
  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newManufacturer.trim() || !newSerial.trim()) {
      alert("Please fill out all primary device registration fields.");
      return;
    }

    const priceNum = parseFloat(newPrice) || 120000;
    const generatedId = `EQ-${newType.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newAsset: BiomedicalAsset = {
      id: generatedId,
      name: newName,
      type: newType,
      status: "Active",
      department: newDept,
      location: newLocation || "Biomedical Storage Hub",
      serialNumber: newSerial,
      manufacturer: newManufacturer,
      purchaseDate: todayDateStr,
      price: priceNum,
      warrantyExpiry: newWarrantyExpiry,
      warrantyProvider: newWarrantyProvider || "Manufacturer Direct Service",
      lastMaintenanceDate: todayDateStr,
      nextMaintenanceDate: "2026-10-04", // default 3 months later
      maintenanceFrequency: newMaintFreq,
      lastCalibrationDate: todayDateStr,
      nextCalibrationDate: "2026-10-04",
      calibrationFrequency: newCalFreq,
      usageHours: 0,
      downtimePercentage: 0.0,
      assignedTo: "BioMed Standby Fleet",
      repairHistory: []
    };

    onAddAsset(newAsset);
    setIsRegistering(false);
    
    // Reset Form Fields
    setNewName("");
    setNewManufacturer("");
    setNewSerial("");
    setNewPrice("");
    setNewLocation("");
    
    alert(`Success! Successfully registered ${newAsset.name} as inventory node ${newAsset.id}.`);
  };

  // Handle QR code scanning terminal emulator
  const handleQrScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = qrInput.trim().toUpperCase();
    if (!query) return;

    // Search for ID or Serial
    const found = assets.find(a => a.id.toUpperCase() === query || a.serialNumber.toUpperCase() === query);
    
    if (found) {
      setSelectedAssetId(found.id);
      setQrScanSuccess(found.id);
      setQrInput("");
      setTimeout(() => setQrScanSuccess(null), 3000);
    } else {
      alert(`No medical asset found matching ID or Serial Code: "${qrInput}"`);
    }
  };

  // Pie chart colors for downtime index
  const COLORS = ["#0d9488", "#0f766e", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#ccfbf1", "#e6fffa"];

  return (
    <div className="space-y-6">
      {/* 1. Header & Bento Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Assets Tracked</span>
            <span className="text-2xl font-extrabold text-slate-800">{telemetryMetrics.totalAssetsCount} Devices</span>
            <p className="text-[10px] text-emerald-700 font-semibold mt-1">
              {telemetryMetrics.activeCount} Live Operational Nodes
            </p>
          </div>
          <div className="bg-teal-50 text-teal-700 p-3.5 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-5 shadow-sm flex items-center justify-between font-sans">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Calibration Alarms</span>
            <span className="text-2xl font-extrabold text-slate-800">
              {telemetryMetrics.calibrationOverdueCount} Overdue
            </span>
            <p className="text-[10px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 inline text-amber-500" /> Action required immediately
            </p>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3.5 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Maintenance Queue</span>
            <span className="text-2xl font-extrabold text-slate-800">
              {telemetryMetrics.maintenanceOverdueCount} Due
            </span>
            <p className="text-[10px] text-teal-600 font-semibold mt-1">
              {telemetryMetrics.alarmsCount} Total inactive or repairing
            </p>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3.5 rounded-xl">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-950/80 to-emerald-950/80 backdrop-blur-md text-white rounded-3xl p-5 shadow-sm border border-white/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block mb-1">MTD Maintenance Cost</span>
            <span className="text-2xl font-mono font-extrabold text-white">
              {telemetryMetrics.totalRepairCost.toLocaleString()} BDT
            </span>
            <p className="text-[10px] text-teal-200/80 font-medium mt-1">Accumulated bio-med repairs</p>
          </div>
          <div className="bg-emerald-500/20 p-3.5 rounded-xl text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Interactive Utilization Analytics Dashboard */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/40 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Biomedical Utilization & Performance Analytics</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time charts calculated on active inventory usage, downtime logs, and service overheads</p>
          </div>
          <div className="flex bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl p-1 gap-1 shadow-inner self-start">
            <button
              onClick={() => setActiveChartTab("utilization")}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                activeChartTab === "utilization" ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Mean Usage
            </button>
            <button
              onClick={() => setActiveChartTab("downtime")}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                activeChartTab === "downtime" ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Downtime Index %
            </button>
            <button
              onClick={() => setActiveChartTab("costs")}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                activeChartTab === "costs" ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Expense Overhead
            </button>
          </div>
        </div>

        <div className="h-[240px] w-full font-semibold text-xs">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === "utilization" ? (
              <ReBarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 10 } }} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar name="Average Operational Usage Hours" dataKey="Average Usage (Hrs)" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            ) : activeChartTab === "downtime" ? (
              <ReBarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 10 } }} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar name="Downtime Ratio (%)" dataKey="Average Downtime %" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            ) : (
              <ReBarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar name="Total Maintenance Costs (BDT)" dataKey="Maintenance Cost (BDT)" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Main Split View: Asset Grid on left, Inspector / QR scan on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Directory & List */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/40 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Biomedical Asset Registry</h3>
              <p className="text-xs text-slate-500 font-medium">Verify calibration matrices, repair history, and active unit allocations</p>
            </div>
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition self-start cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Register Asset
            </button>
          </div>

          {/* Quick Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Asset ID, Serial, Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/85 border border-white/50 rounded-xl focus:outline-none focus:border-teal-500 font-semibold text-slate-800 placeholder-slate-400 transition"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl focus:outline-none focus:border-teal-500 font-semibold text-slate-600 cursor-pointer transition"
            >
              <option value="All">All Equipment Types</option>
              {assetTypes.filter(t => t !== "All").map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-white/40 hover:bg-white/60 border border-white/50 rounded-xl focus:outline-none focus:border-teal-500 font-semibold text-slate-600 cursor-pointer transition"
            >
              <option value="All">All Statuses</option>
              {statusOptions.filter(s => s !== "All").map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* List Table */}
          <div className="overflow-x-auto max-h-[440px] overflow-y-auto pr-1">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="pb-2.5 font-bold text-slate-500 uppercase text-[9px]">Asset / ID</th>
                  <th className="pb-2.5 font-bold text-slate-500 uppercase text-[9px]">Location & Allocation</th>
                  <th className="pb-2.5 font-bold text-slate-500 uppercase text-[9px]">Calibration Status</th>
                  <th className="pb-2.5 font-bold text-slate-500 uppercase text-[9px] text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                      No matching biomedical equipment assets found in database.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => {
                    const isSelected = selectedAsset?.id === asset.id;
                    const calibrationOverdue = isDateOverdue(asset.nextCalibrationDate);
                    const maintenanceOverdue = isDateOverdue(asset.nextMaintenanceDate);

                    return (
                      <tr
                        key={asset.id}
                        onClick={() => {
                          setSelectedAssetId(asset.id);
                          setIsReallocating(false);
                        }}
                        className={`border-b border-white/20 last:border-b-0 hover:bg-white/40 cursor-pointer transition ${
                          isSelected ? "bg-white/70 shadow-sm font-semibold" : ""
                        }`}
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl text-xs font-black ${
                              asset.status === "Active" || asset.status === "In Use" 
                                ? "bg-teal-50 text-teal-800 border border-teal-100" 
                                : asset.status === "Maintenance" || asset.status === "Repairing"
                                ? "bg-rose-50 text-rose-800 border border-rose-100"
                                : "bg-amber-50 text-amber-800 border border-amber-100"
                            }`}>
                              {asset.type.slice(0, 3).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-800">{asset.name}</p>
                              <p className="text-[9px] text-slate-500 font-mono font-bold mt-0.5">{asset.id} | {asset.serialNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <p className="font-bold text-slate-700">{asset.department}</p>
                          <p className="text-[9px] text-slate-500 font-semibold">{asset.location}</p>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-col gap-0.5">
                            <span className={`text-[10px] font-bold ${calibrationOverdue ? "text-rose-600" : "text-emerald-700"}`}>
                              Next: {asset.nextCalibrationDate}
                            </span>
                            {calibrationOverdue && (
                              <span className="text-[8px] bg-rose-50 text-rose-700 border border-rose-100 font-bold px-1.5 py-0.2 rounded w-fit uppercase">
                                Overdue
                              </span>
                            )}
                            {maintenanceOverdue && !calibrationOverdue && (
                              <span className="text-[8px] bg-amber-50 text-amber-700 border border-amber-100 font-bold px-1.5 py-0.2 rounded w-fit uppercase">
                                Maint. Due
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-bold border ${
                            asset.status === "Active" 
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                              : asset.status === "In Use"
                              ? "bg-teal-50 text-teal-800 border-teal-200 animate-pulse"
                              : asset.status === "Maintenance"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : asset.status === "Repairing"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-red-50 text-red-800 border-red-200"
                          }`}>
                            {asset.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Inspector / QR Terminal */}
        <div className="space-y-6">
          
          {/* A. Barcode & QR Scan Simulator Terminal */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-teal-600" />
              QR / BioMed Scanner Terminal
            </h4>
            <form onSubmit={handleQrScanSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Scan / Enter Asset ID (e.g. EQ-MRI-001)"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-white/40 hover:bg-white/60 focus:bg-white/85 border border-white/50 focus:outline-none rounded-lg font-semibold text-slate-800 placeholder-slate-400 transition"
              />
              <button 
                type="submit"
                className="px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center shadow-sm cursor-pointer"
              >
                Scan
              </button>
            </form>

            {qrScanSuccess && (
              <div className="bg-emerald-50/60 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-3 text-xs space-y-1 text-emerald-950 font-bold animate-pulse">
                <p className="flex items-center gap-1 text-emerald-800 font-extrabold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  ASSET FEED IDENTIFIED
                </p>
                <p className="text-[10px] text-slate-600">Loaded hardware registry for ID: <span className="font-mono font-black">{qrScanSuccess}</span></p>
              </div>
            )}
          </div>

          {/* B. Detailed Asset Inspector */}
          {selectedAsset ? (
            <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-5 space-y-5">
              
              {/* Device Header */}
              <div className="border-b border-white/40 pb-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-white/70 text-slate-700 border border-white/60 font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider shadow-sm">
                    {selectedAsset.type} SPECIFICATION
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    isDateOverdue(selectedAsset.nextCalibrationDate) ? "bg-rose-50 text-rose-800 border-rose-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}>
                    {isDateOverdue(selectedAsset.nextCalibrationDate) ? "Calib Overdue" : "Calib OK"}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm mt-2">{selectedAsset.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">{selectedAsset.manufacturer} | Serial: <span className="font-mono">{selectedAsset.serialNumber}</span></p>
              </div>

              {/* Specifications grid */}
              <div className="space-y-3.5 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="text-slate-800">{selectedAsset.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-800">{selectedAsset.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Allocation:</span>
                  <span className="text-teal-700 font-extrabold">{selectedAsset.assignedTo || "Standby Fleet"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Purchase Date:</span>
                  <span className="text-slate-800">{selectedAsset.purchaseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Purchase Cost:</span>
                  <span className="text-slate-800 font-mono">{selectedAsset.price.toLocaleString()} BDT</span>
                </div>
                
                {/* Reallocation Panel toggle */}
                {!isReallocating ? (
                  <button
                    onClick={() => {
                      setAllocDept(selectedAsset.department);
                      setAllocLocation(selectedAsset.location);
                      setAllocAssigned(selectedAsset.assignedTo || "");
                      setIsReallocating(true);
                    }}
                    className="w-full py-1.5 bg-white/60 hover:bg-white border border-white/50 text-slate-700 font-bold rounded-xl text-[10px] transition cursor-pointer text-center"
                  >
                    Reallocate Asset / Transfer Location
                  </button>
                ) : (
                  <form onSubmit={handleReallocate} className="bg-white/40 p-3 rounded-2xl border border-white/30 space-y-2.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">Device Allocation Form</span>
                    <div>
                      <label className="text-[9px] text-slate-500 block font-bold mb-1">Transfer to Department</label>
                      <select
                        value={allocDept}
                        onChange={(e) => setAllocDept(e.target.value as Department)}
                        className="w-full px-2 py-1 text-[11px] bg-white border border-white/50 rounded-lg font-semibold text-slate-700"
                      >
                        {departments.map((d, idx) => (
                          <option key={idx} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-500 block font-bold mb-1">Specific Room / Location</label>
                      <input
                        type="text"
                        value={allocLocation}
                        onChange={(e) => setAllocLocation(e.target.value)}
                        placeholder="e.g. ICU Bed 4, Suite 102"
                        className="w-full px-2 py-1 text-[11px] bg-white border border-white/50 rounded-lg font-semibold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-500 block font-bold mb-1">Assigned Patient or Staff</label>
                      <input
                        type="text"
                        value={allocAssigned}
                        onChange={(e) => setAllocAssigned(e.target.value)}
                        placeholder="e.g. Patient PAT-001, Nurse On Duty"
                        className="w-full px-2 py-1 text-[11px] bg-white border border-white/50 rounded-lg font-semibold text-slate-700"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-1 bg-teal-600 text-white font-bold rounded-lg text-[9px] transition cursor-pointer"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsReallocating(false)}
                        className="px-2.5 py-1 bg-white/80 border border-white/40 text-slate-600 font-bold rounded-lg text-[9px] transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Maintenance & Calibration triggers */}
              <div className="bg-white/30 backdrop-blur-sm border border-white/40 p-3.5 rounded-2xl space-y-3 font-semibold text-xs text-slate-700">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">BioMed Calibration & Maintenance Desk</span>
                
                <div className="flex justify-between items-center bg-white/40 p-2.5 rounded-xl border border-white/20">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Routine Maintenance</span>
                    <span className="text-[10px]">Next: <span className={isDateOverdue(selectedAsset.nextMaintenanceDate) ? "text-rose-600 font-bold" : "text-slate-800"}>{selectedAsset.nextMaintenanceDate}</span></span>
                  </div>
                  <button
                    onClick={() => handlePerformMaintenance(selectedAsset.id)}
                    className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-[10px] shadow-sm transition cursor-pointer"
                  >
                    Routine Check
                  </button>
                </div>

                <div className="flex justify-between items-center bg-white/40 p-2.5 rounded-xl border border-white/20">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Device Calibration</span>
                    <span className="text-[10px]">Next: <span className={isDateOverdue(selectedAsset.nextCalibrationDate) ? "text-rose-600 font-bold animate-pulse" : "text-slate-800"}>{selectedAsset.nextCalibrationDate}</span></span>
                  </div>
                  <button
                    onClick={() => handlePerformCalibration(selectedAsset.id)}
                    className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-[10px] shadow-sm transition cursor-pointer"
                  >
                    Calibrate
                  </button>
                </div>

                {/* Warranty Tracker details */}
                <div className="p-2.5 bg-white/40 rounded-xl border border-white/20 text-[10px] space-y-1">
                  <span className="font-extrabold text-slate-500 block text-[9px] uppercase">WARRANTY SENTINEL</span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Provider:</span>
                    <span className="text-slate-800 font-bold">{selectedAsset.warrantyProvider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expires:</span>
                    <span className={`font-bold ${isDateOverdue(selectedAsset.warrantyExpiry) ? "text-rose-600" : "text-emerald-700"}`}>
                      {selectedAsset.warrantyExpiry} {isDateOverdue(selectedAsset.warrantyExpiry) ? "(Expired)" : "(Active)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Repair History & Logger */}
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Hardware Repair Ledger & Ticket Logger</span>

                {/* Repair Logger Form */}
                <form onSubmit={handleLogRepair} className="bg-white/40 p-3.5 rounded-2xl border border-white/30 space-y-2.5">
                  <span className="text-[9px] font-bold text-slate-600 block uppercase">Log New Issue/Maintenance Ticket</span>
                  <div>
                    <input
                      type="text"
                      placeholder="Specify issue (e.g. display flickering, RF mismatch)"
                      value={repairIssue}
                      onChange={(e) => setRepairIssue(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-[11px] bg-white border border-white/50 rounded-lg font-semibold text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Repair Cost (BDT)"
                      value={repairCost}
                      onChange={(e) => setRepairCost(e.target.value)}
                      className="px-2.5 py-1.5 text-[11px] bg-white border border-white/50 rounded-lg font-semibold text-slate-800 placeholder-slate-400"
                    />
                    <select
                      value={repairStatus}
                      onChange={(e) => setRepairStatus(e.target.value as RepairRecord["status"])}
                      className="px-2 py-1.5 text-[11px] bg-white border border-white/50 rounded-lg font-semibold text-slate-700"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Pending Parts">Pending Parts</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Hammer className="w-3.5 h-3.5" />
                    Dispatch Repair Order
                  </button>
                </form>

                {/* Repair History list */}
                <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                  {selectedAsset.repairHistory.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic text-center py-2">No historical repair entries logged.</p>
                  ) : (
                    selectedAsset.repairHistory.map((rep) => (
                      <div key={rep.id} className="p-2.5 bg-white/40 border border-white/20 rounded-xl text-[10px] space-y-1.5 font-semibold text-slate-700">
                        <div className="flex justify-between items-start">
                          <span className="font-mono font-bold text-slate-900">{rep.id}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                            rep.status === "Resolved" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}>
                            {rep.status}
                          </span>
                        </div>
                        <p className="text-slate-800 leading-tight">"{rep.issue}"</p>
                        {rep.solution && (
                          <p className="text-slate-500 text-[9px] font-medium leading-tight">Sol: {rep.solution}</p>
                        )}
                        <div className="flex justify-between text-[9px] text-slate-500 pt-1 border-t border-white/20">
                          <span>{rep.date} | By {rep.technician}</span>
                          <span className="text-teal-700 font-bold">{rep.cost > 0 ? `${rep.cost.toLocaleString()} BDT` : "Warranty Covered"}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* 4. Registration Modal/Drawer */}
      {isRegistering && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-white/50 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-600" />
                  Medical Device Registration
                </h4>
                <p className="text-[10px] text-slate-500 font-semibold">Integrate a new clinical device node with full telemetry logs</p>
              </div>
              <button 
                onClick={() => setIsRegistering(false)} 
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterAsset} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Equipment Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hamilton-C1 Ventilator"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Equipment Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as BiomedicalAsset["type"])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
                  >
                    <option value="MRI">MRI</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="Ventilator">Ventilator</option>
                    <option value="ECG Machine">ECG Machine</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Infusion Pump">Infusion Pump</option>
                    <option value="Surgical Equipment">Surgical Equipment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siemens Healthineers"
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Serial Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SN-88291-ICU"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Purchase Price (BDT)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 4500000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department Allocation</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value as Department)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
                  >
                    {departments.map((d, idx) => (
                      <option key={idx} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location Room/Bay</label>
                  <input
                    type="text"
                    placeholder="e.g. ICU Room 3, Bay B"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Warranty Expiry Date</label>
                  <input
                    type="date"
                    value={newWarrantyExpiry}
                    onChange={(e) => setNewWarrantyExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Warranty Provider Representative</label>
                  <input
                    type="text"
                    placeholder="e.g. Siemens Support BD"
                    value={newWarrantyProvider}
                    onChange={(e) => setNewWarrantyProvider(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 text-[9px] uppercase">Maint Freq</label>
                    <select
                      value={newMaintFreq}
                      onChange={(e) => setNewMaintFreq(e.target.value as BiomedicalAsset["maintenanceFrequency"])}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Bi-annually">Bi-annually</option>
                      <option value="Annually">Annually</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 text-[9px] uppercase">Cal Freq</label>
                    <select
                      value={newCalFreq}
                      onChange={(e) => setNewCalFreq(e.target.value as BiomedicalAsset["calibrationFrequency"])}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Bi-annually">Bi-annually</option>
                      <option value="Annually">Annually</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition cursor-pointer text-center shadow-sm"
                >
                  Confirm Registration
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
