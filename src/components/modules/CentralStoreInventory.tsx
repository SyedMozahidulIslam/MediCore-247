/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Package, Boxes, FileText, Truck, ArrowLeftRight, QrCode, 
  AlertTriangle, TrendingUp, Plus, Search, Trash2, Filter, 
  CheckCircle, XCircle, PlusCircle, RefreshCw, Clock, Sparkles, 
  Info, Calendar, Phone, Mail, MapPin, Check, DollarSign
} from "lucide-react";
import { 
  InventoryItem, Supplier, PurchaseRequest, DepartmentTransfer, InventoryCategory 
} from "../../types";
import { 
  mockInventoryItems, mockSuppliers, mockPurchaseRequests, mockDepartmentTransfers 
} from "../../data/inventoryData";

interface CentralStoreInventoryProps {
  addLog: (action: string) => void;
}

export const CentralStoreInventory: React.FC<CentralStoreInventoryProps> = ({ addLog }) => {
  // Live state
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(mockPurchaseRequests);
  const [transfers, setTransfers] = useState<DepartmentTransfer[]>(mockDepartmentTransfers);

  // UI Tabs
  // "depot" | "forecasting" | "procurement" | "transfers" | "suppliers"
  const [activeSubTab, setActiveSubTab] = useState<string>("depot");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [stockStatusFilter, setStockStatusFilter] = useState<string>("All"); // "All" | "Low Stock" | "Out of Stock" | "Near Expiry"

  // Barcode / QR simulator modal state
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);

  // Form toggles
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showNewPRModal, setShowNewPRModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<InventoryCategory>("Medical Supplies");
  const [newItemSku, setNewItemSku] = useState("");
  const [newItemQty, setNewItemQty] = useState(100);
  const [newItemUnit, setNewItemUnit] = useState("Pieces");
  const [newItemMinStock, setNewItemMinStock] = useState(20);
  const [newItemSupplier, setNewItemSupplier] = useState(mockSuppliers[0]?.id || "");
  const [newItemLocation, setNewItemLocation] = useState("Aisle A, Shelf 1");
  const [newItemPrice, setNewItemPrice] = useState(10);
  const [newItemExpiry, setNewItemExpiry] = useState("");

  // New Supplier form state
  const [newSupName, setNewSupName] = useState("");
  const [newSupContact, setNewSupContact] = useState("");
  const [newSupPhone, setNewSupPhone] = useState("");
  const [newSupEmail, setNewSupEmail] = useState("");
  const [newSupAddress, setNewSupAddress] = useState("");

  // New Purchase Request form state
  const [newPRItemId, setNewPRItemId] = useState("");
  const [newPRQty, setNewPRQty] = useState(100);
  const [newPRUrgency, setNewPRUrgency] = useState<"Routine" | "Urgent" | "Emergency">("Routine");

  // New Transfer form state
  const [newTransItemId, setNewTransItemId] = useState("");
  const [newTransToDept, setNewTransToDept] = useState("Emergency Department");
  const [newTransQty, setNewTransQty] = useState(50);
  const [newTransRequestedBy, setNewTransRequestedBy] = useState("Senior Registrar");

  // Constants
  const categories: InventoryCategory[] = [
    "Medical Supplies",
    "Surgical Instruments",
    "PPE",
    "Oxygen Cylinders",
    "Laboratory Consumables",
    "Office Supplies",
    "Linens",
    "Food Inventory",
    "Cleaning Materials"
  ];

  // Helper stats
  const totalItemsCount = items.length;
  const totalStockUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalInventoryValue = items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
  
  const lowStockItems = items.filter(item => item.quantity <= item.minStockLevel && item.quantity > 0);
  const outOfStockItems = items.filter(item => item.quantity === 0);
  
  // Calculate expiry status (near expiry if within 90 days of 2026-07-05)
  const isNearExpiry = (dateStr?: string) => {
    if (!dateStr) return false;
    const expiry = new Date(dateStr);
    const currentDate = new Date("2026-07-05");
    const diffTime = expiry.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 90;
  };

  const isAlreadyExpired = (dateStr?: string) => {
    if (!dateStr) return false;
    const expiry = new Date(dateStr);
    const currentDate = new Date("2026-07-05");
    return expiry.getTime() < currentDate.getTime();
  };

  const expiredItemsCount = items.filter(item => isAlreadyExpired(item.expiryDate)).length;
  const nearExpiryCount = items.filter(item => isNearExpiry(item.expiryDate)).length;

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (stockStatusFilter === "Low Stock") {
      matchesStatus = item.quantity <= item.minStockLevel && item.quantity > 0;
    } else if (stockStatusFilter === "Out of Stock") {
      matchesStatus = item.quantity === 0;
    } else if (stockStatusFilter === "Near Expiry") {
      matchesStatus = isNearExpiry(item.expiryDate) || isAlreadyExpired(item.expiryDate);
    }

    return matchesCategory && matchesSearch && matchesStatus;
  });

  // Action handlers
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemSku) return;

    const newItem: InventoryItem = {
      id: `INV-${newItemCategory.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: newItemName,
      sku: newItemSku,
      category: newItemCategory,
      quantity: Number(newItemQty),
      unit: newItemUnit,
      minStockLevel: Number(newItemMinStock),
      supplierId: newItemSupplier,
      expiryDate: newItemExpiry || undefined,
      location: newItemLocation,
      lastRestocked: "2026-07-05",
      pricePerUnit: Number(newItemPrice),
      forecastedDemand: Math.round(Number(newItemQty) * 1.15)
    };

    setItems(prev => [newItem, ...prev]);
    addLog(`Registered new inventory stock item: ${newItemName} (${newItemCategory})`);
    
    // Reset
    setNewItemName("");
    setNewItemSku("");
    setNewItemQty(100);
    setNewItemMinStock(20);
    setNewItemExpiry("");
    setShowAddItemModal(false);
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName || !newSupContact) return;

    const newSup: Supplier = {
      id: `SPL-0${(suppliers.length + 1).toString().padStart(2, '0')}`,
      name: newSupName,
      contactPerson: newSupContact,
      phone: newSupPhone,
      email: newSupEmail,
      address: newSupAddress,
      status: "Active"
    };

    setSuppliers(prev => [...prev, newSup]);
    addLog(`Registered trusted logistics supplier: ${newSupName}`);
    
    // Reset
    setNewSupName("");
    setNewSupContact("");
    setNewSupPhone("");
    setNewSupEmail("");
    setNewSupAddress("");
    setShowAddSupplierModal(false);
  };

  const handleCreatePR = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find(i => i.id === newPRItemId);
    if (!item) return;

    const supplier = suppliers.find(s => s.id === item.supplierId) || { name: "Direct Supplier" };

    const newPR: PurchaseRequest = {
      id: `PRQ-${Math.floor(100 + Math.random() * 900)}`,
      itemId: item.id,
      itemName: item.name,
      quantityRequested: Number(newPRQty),
      estimatedCost: Number(newPRQty) * item.pricePerUnit,
      supplierId: item.supplierId,
      supplierName: supplier.name,
      requestedBy: "Inventory Procurement Bot",
      requestDate: "2026-07-05",
      status: "Pending Approval",
      urgency: newPRUrgency
    };

    setPurchaseRequests(prev => [newPR, ...prev]);
    addLog(`Submitted purchase order request for ${newPRQty}x ${item.name}`);
    setShowNewPRModal(false);
  };

  // Instant reorder alert triggers
  const triggerAutoReorder = (item: InventoryItem) => {
    const qty = Math.max(item.minStockLevel * 3 - item.quantity, 100);
    const supplier = suppliers.find(s => s.id === item.supplierId) || { name: "Default Supplier" };

    const newPR: PurchaseRequest = {
      id: `PRQ-${Math.floor(100 + Math.random() * 900)}`,
      itemId: item.id,
      itemName: item.name,
      quantityRequested: qty,
      estimatedCost: qty * item.pricePerUnit,
      supplierId: item.supplierId,
      supplierName: supplier.name,
      requestedBy: "Automated AI Reorder Agent",
      requestDate: "2026-07-05",
      status: "Approved", // Pre-approved for critical supplies!
      urgency: "Urgent"
    };

    setPurchaseRequests(prev => [newPR, ...prev]);
    addLog(`AI Agent auto-triggered replenishment order for ${item.name} (${qty} units)`);
    alert(`Automated Procurement alert dispatched! Purchase Order ${newPR.id} created and auto-approved for ${qty}x ${item.name}.`);
  };

  const handleUpdatePRStatus = (prId: string, nextStatus: PurchaseRequest["status"]) => {
    setPurchaseRequests(prev => prev.map(pr => {
      if (pr.id === prId) {
        // If status changes to Delivered, we automatically increment stock!
        if (nextStatus === "Delivered") {
          setItems(prevItems => prevItems.map(item => {
            if (item.id === pr.itemId) {
              return {
                ...item,
                quantity: item.quantity + pr.quantityRequested,
                lastRestocked: "2026-07-05"
              };
            }
            return item;
          }));
          addLog(`Procured supplies received: Added ${pr.quantityRequested} units to ${pr.itemName} stock.`);
        }
        return { ...pr, status: nextStatus };
      }
      return pr;
    }));
    addLog(`Procurement workflow request ${prId} marked as: ${nextStatus}`);
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find(i => i.id === newTransItemId);
    if (!item) return;

    if (item.quantity < newTransQty) {
      alert(`Insufficient stock! Central warehouse only has ${item.quantity} ${item.unit} available.`);
      return;
    }

    const newTrans: DepartmentTransfer = {
      id: `TRN-${Math.floor(100 + Math.random() * 900)}`,
      itemId: item.id,
      itemName: item.name,
      fromDepartment: "Central Warehouse Depot",
      toDepartment: newTransToDept,
      quantity: Number(newTransQty),
      requestedBy: newTransRequestedBy,
      status: "Pending",
      date: "2026-07-05"
    };

    // Deduct stock immediately to hold inventory
    setItems(prev => prev.map(i => {
      if (i.id === item.id) {
        return { ...i, quantity: i.quantity - Number(newTransQty) };
      }
      return i;
    }));

    setTransfers(prev => [newTrans, ...prev]);
    addLog(`Initiated internal transfer of ${newTransQty}x ${item.name} to ${newTransToDept}`);
    setShowTransferModal(false);
  };

  const handleUpdateTransferStatus = (trnId: string, nextStatus: DepartmentTransfer["status"]) => {
    setTransfers(prev => prev.map(trn => {
      if (trn.id === trnId) {
        // If rejected, refund the stock back to central warehouse
        if (nextStatus === "Rejected" && trn.status !== "Rejected") {
          setItems(prevItems => prevItems.map(item => {
            if (item.id === trn.itemId) {
              return { ...item, quantity: item.quantity + trn.quantity };
            }
            return item;
          }));
          addLog(`Internal transfer ${trnId} rejected. ${trn.quantity} units refunded to Central Warehouse.`);
        }
        return { ...trn, status: nextStatus };
      }
      return trn;
    }));
    addLog(`Internal ward dispatch ${trnId} updated to: ${nextStatus}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Central Store Command Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">Hospital Central Store & Logistics Deck</h3>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Dynamic Demand Forecasting Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Monitor medical supplies, PPE, laboratory consumables, and oxygen reserves. Raise and process purchase orders, coordinate intra-ward dispatches, track product expiries, and receive real-time reorder warning metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setNewItemSku(`SKU-${Math.floor(100000 + Math.random() * 900000)}`);
              setShowAddItemModal(true);
            }}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Stock Item
          </button>
          <button
            onClick={() => setShowTransferModal(true)}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Dispatch Transfer
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        
        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Depot Net Valuation</span>
            <Package className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-800">৳ {totalInventoryValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <p className="text-[9px] text-slate-500 font-bold mt-1">
              Across {totalItemsCount} distinct materials
            </p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical Reorders</span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-rose-600">{lowStockItems.length + outOfStockItems.length} Warnings</div>
            <p className="text-[9px] text-slate-500 font-bold mt-1">
              {outOfStockItems.length} items completely depleted
            </p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expiry Alarms</span>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-amber-600">{nearExpiryCount + expiredItemsCount} Items</div>
            <p className="text-[9px] text-slate-500 font-bold mt-1">
              {expiredItemsCount} expired, {nearExpiryCount} short-shelf-life
            </p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Procurement Queue</span>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-blue-600">{purchaseRequests.filter(r => r.status === "Pending Approval" || r.status === "Approved").length} Active</div>
            <p className="text-[9px] text-slate-500 font-bold mt-1">
              {purchaseRequests.filter(r => r.status === "Ordered").length} shipments in-transit
            </p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-4 shadow-sm flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Intra-Ward Dispatches</span>
            <Truck className="w-5 h-5 text-purple-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-purple-600">{transfers.filter(t => t.status === "Pending" || t.status === "Dispatched").length} Active</div>
            <p className="text-[9px] text-slate-500 font-bold mt-1">
              Direct department handovers today
            </p>
          </div>
        </div>

      </div>

      {/* Internal Mini Nav Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        <button
          onClick={() => setActiveSubTab("depot")}
          className={`px-4 py-2.5 font-extrabold text-xs transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "depot"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Boxes className="w-4 h-4" />
          Active Inventory Depot
        </button>

        <button
          onClick={() => setActiveSubTab("forecasting")}
          className={`px-4 py-2.5 font-extrabold text-xs transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "forecasting"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Stock Forecasting & Reorder Alerts
          {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
            <span className="bg-rose-100 text-rose-700 text-[9px] font-black px-2 py-0.5 rounded-full ml-1 animate-pulse">
              {lowStockItems.length + outOfStockItems.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("procurement")}
          className={`px-4 py-2.5 font-extrabold text-xs transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "procurement"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          Purchase Requests
        </button>

        <button
          onClick={() => setActiveSubTab("transfers")}
          className={`px-4 py-2.5 font-extrabold text-xs transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "transfers"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          Intra-Ward Transfers
        </button>

        <button
          onClick={() => setActiveSubTab("suppliers")}
          className={`px-4 py-2.5 font-extrabold text-xs transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "suppliers"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Truck className="w-4 h-4" />
          Logistics Suppliers
        </button>
      </div>

      {/* Primary Sub-tab Output Context */}
      <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-6 shadow-xs min-h-[350px]">
        
        {/* TAB 1: Inventory Depot Table */}
        {activeSubTab === "depot" && (
          <div className="space-y-4">
            
            {/* Search and Filters row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Filter Wards:</span>
                
                {/* Category select */}
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Stock alert state */}
                <select
                  value={stockStatusFilter}
                  onChange={e => setStockStatusFilter(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Stock Levels</option>
                  <option value="Low Stock">Alert: Low Stock</option>
                  <option value="Out of Stock">Alert: Out of Stock</option>
                  <option value="Near Expiry">Alarm: Near Expiry / Expired</option>
                </select>
              </div>

              {/* Text Search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search item, SKU, location..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Main Inventory Grid/Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">SKU / QR Code</th>
                    <th className="p-4">Item Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Warehouse Stock</th>
                    <th className="p-4">Depot Location</th>
                    <th className="p-4">Expiry Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 bg-white/40">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                        No warehouse items found matching the selected search query or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => {
                      const isLow = item.quantity <= item.minStockLevel && item.quantity > 0;
                      const isOut = item.quantity === 0;
                      const isNearExp = isNearExpiry(item.expiryDate);
                      const isExp = isAlreadyExpired(item.expiryDate);

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setScannedItem(item)}
                                title="Click to view simulated QR / Barcode tracker"
                                className="p-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>
                              <div className="font-mono text-[10px] text-slate-500 tracking-tight">
                                {item.sku}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="text-slate-800 font-extrabold text-sm">{item.name}</div>
                              <div className="text-[9px] text-slate-400 mt-0.5">Value: ৳{item.pricePerUnit} / {item.unit}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className={`text-sm font-black ${
                                isOut ? "text-rose-600" : isLow ? "text-amber-600" : "text-slate-800"
                              }`}>
                                {item.quantity.toLocaleString()} <span className="text-[10px] text-slate-400 font-medium">{item.unit}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                {isOut ? (
                                  <span className="bg-rose-100 text-rose-800 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-sm">OUT OF STOCK</span>
                                ) : isLow ? (
                                  <span className="bg-amber-100 text-amber-800 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-sm">LOW STOCK Alert</span>
                                ) : (
                                  <span className="text-[9px] text-slate-400 font-bold">Min requirement: {item.minStockLevel}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {item.location}
                            </div>
                          </td>
                          <td className="p-4">
                            {item.expiryDate ? (
                              <div>
                                <div className={`text-[11px] font-bold ${
                                  isExp ? "text-rose-600 font-black line-through" : isNearExp ? "text-amber-600 font-black" : "text-slate-600"
                                }`}>
                                  {item.expiryDate}
                                </div>
                                {isExp ? (
                                  <span className="text-[8px] font-black bg-rose-100 text-rose-700 px-1 rounded-sm uppercase">EXPIRED</span>
                                ) : isNearExp ? (
                                  <span className="text-[8px] font-black bg-amber-100 text-amber-700 px-1 rounded-sm uppercase animate-pulse">NEAR EXPIRY</span>
                                ) : null}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold">N/A (Stable)</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Direct restock trigger */}
                              <button
                                onClick={() => {
                                  const amt = prompt(`Enter restock amount of ${item.unit} received at Central Store:`, "100");
                                  if (amt && !isNaN(Number(amt))) {
                                    setItems(prev => prev.map(i => i.id === item.id ? {
                                      ...i,
                                      quantity: i.quantity + Number(amt),
                                      lastRestocked: "2026-07-05"
                                    } : i));
                                    addLog(`Direct manual restock at depot: Added ${amt} units to ${item.name}`);
                                    alert(`Successfully manually restocked ${amt} units of ${item.name}!`);
                                  }
                                }}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black transition"
                              >
                                Restock
                              </button>
                              
                              {(isLow || isOut) && (
                                <button
                                  onClick={() => triggerAutoReorder(item)}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-black transition flex items-center gap-1"
                                >
                                  <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                                  Auto Reorder
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: AI Forecasting & Predictive Alerts */}
        {activeSubTab === "forecasting" && (
          <div className="space-y-6">
            
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-blue-900 text-sm">Predictive Analytics & Seasonality Forecasts</h4>
                <p className="text-xs text-blue-700 font-semibold leading-relaxed mt-1">
                  Machine Learning engines have processed historical ward dispatch patterns, seasonal flu trends, and surgery schedules to predict patient flow stock consumption for the coming month. Use these forecasts to execute smart procurement before stockouts block operations!
                </p>
              </div>
            </div>

            {/* List of critical recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column: Understocked / Low stock alerts */}
              <div className="bg-white/80 border border-slate-100 rounded-2xl p-5 space-y-4">
                <h5 className="font-black text-slate-800 text-xs flex items-center gap-1.5 text-rose-600">
                  <AlertTriangle className="w-4.5 h-4.5" />
                  Active Deficit Alerts (Needs Immediate Replenishment)
                </h5>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {items.filter(i => i.quantity <= i.minStockLevel).map(item => {
                    const forecastedShortfall = Math.max((item.forecastedDemand || item.minStockLevel * 2) - item.quantity, 0);

                    return (
                      <div key={item.id} className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-extrabold text-slate-800 text-xs">{item.name}</div>
                          <div className="text-[10px] text-slate-500 font-bold mt-1">
                            Current: <span className="text-rose-600 font-black">{item.quantity}</span> / Req: {item.minStockLevel} {item.unit}
                          </div>
                          <div className="text-[9px] text-blue-600 font-black mt-0.5">
                            ★ Predicted next month demand: {item.forecastedDemand} units
                          </div>
                        </div>

                        <button
                          onClick={() => triggerAutoReorder(item)}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] py-1.5 px-3 rounded-lg shadow-xs transition"
                        >
                          Trigger Reorder
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: High Expiry Risk / Dead Stock */}
              <div className="bg-white/80 border border-slate-100 rounded-2xl p-5 space-y-4">
                <h5 className="font-black text-slate-800 text-xs flex items-center gap-1.5 text-amber-600">
                  <Calendar className="w-4.5 h-4.5" />
                  Clinical Expiry Risks (Pre-emptive Relocation/Transfer)
                </h5>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {items.filter(i => isNearExpiry(i.expiryDate) || isAlreadyExpired(i.expiryDate)).map(item => {
                    const isExp = isAlreadyExpired(item.expiryDate);

                    return (
                      <div key={item.id} className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-extrabold text-slate-800 text-xs">{item.name}</div>
                          <div className="text-[10px] mt-1 flex items-center gap-1.5">
                            <span className="text-slate-500 font-bold">Expires:</span>
                            <span className={`font-black ${isExp ? "text-rose-600" : "text-amber-600 animate-pulse"}`}>
                              {item.expiryDate}
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                            Warehouse Depot: {item.location}
                          </p>
                        </div>

                        {isExp ? (
                          <button
                            onClick={() => {
                              if (window.confirm(`Mark ${item.name} as quarantined for disposal?`)) {
                                setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: 0 } : i));
                                addLog(`Quarantined and disposed expired stock: ${item.name}`);
                              }
                            }}
                            className="bg-slate-200 text-slate-700 hover:bg-rose-600 hover:text-white font-black text-[10px] py-1.5 px-3 rounded-lg transition"
                          >
                            Disposal
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setNewTransItemId(item.id);
                              setShowTransferModal(true);
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-black text-[10px] py-1.5 px-3 rounded-lg transition"
                          >
                            Deploy/Transfer
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: Purchase Requests (PR) Procurement */}
        {activeSubTab === "procurement" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Logistics Purchase Orders (PO) Pipeline</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Verify active external procurement requests, authorize vendor purchases, and receive delivered stock.</p>
              </div>
              <button
                onClick={() => setShowNewPRModal(true)}
                className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                New Purchase Request
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">PR ID</th>
                    <th className="p-4">Item Requested</th>
                    <th className="p-4">Supplier</th>
                    <th className="p-4">Units Required</th>
                    <th className="p-4">Estimated Value</th>
                    <th className="p-4">Pipeline Status</th>
                    <th className="p-4 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 bg-white/40">
                  {purchaseRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                        No purchase orders requested yet.
                      </td>
                    </tr>
                  ) : (
                    purchaseRequests.map(pr => {
                      const isPending = pr.status === "Pending Approval";
                      const isApproved = pr.status === "Approved";
                      const isOrdered = pr.status === "Ordered";
                      const isDelivered = pr.status === "Delivered";

                      return (
                        <tr key={pr.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-mono text-[10px] text-slate-500">{pr.id}</td>
                          <td className="p-4">
                            <div>
                              <span className="font-black text-slate-800 text-sm block">{pr.itemName}</span>
                              <span className="text-[9px] text-slate-400">Requested by: {pr.requestedBy}</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-500 font-bold">{pr.supplierName}</td>
                          <td className="p-4 font-extrabold text-sm">{pr.quantityRequested.toLocaleString()}</td>
                          <td className="p-4 font-black text-slate-800">৳ {pr.estimatedCost.toLocaleString('en-IN')}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              isPending ? "bg-amber-100 text-amber-800" :
                              isApproved ? "bg-blue-100 text-blue-800" :
                              isOrdered ? "bg-purple-100 text-purple-800 animate-pulse" :
                              isDelivered ? "bg-emerald-100 text-emerald-800" :
                              "bg-slate-100 text-slate-600"
                            }`}>
                              {pr.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isPending && (
                                <>
                                  <button
                                    onClick={() => handleUpdatePRStatus(pr.id, "Approved")}
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                                    title="Approve purchase request"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdatePRStatus(pr.id, "Rejected")}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition"
                                    title="Reject purchase request"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}

                              {isApproved && (
                                <button
                                  onClick={() => handleUpdatePRStatus(pr.id, "Ordered")}
                                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition"
                                >
                                  Place Order with Vendor
                                </button>
                              )}

                              {isOrdered && (
                                <button
                                  onClick={() => handleUpdatePRStatus(pr.id, "Delivered")}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition"
                                >
                                  Log Delivery Receipts
                                </button>
                              )}

                              {isDelivered && (
                                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                  Supplies Stocked
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 4: Department Transfers */}
        {activeSubTab === "transfers" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Internal Ward Handovers & Transfers</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Track and coordinate high-efficiency stock distribution from the Central Store to specific hospital floors and clinical departments.</p>
              </div>
              <button
                onClick={() => setShowTransferModal(true)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Dispatch Transfer
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Transfer ID</th>
                    <th className="p-4">Item Details</th>
                    <th className="p-4">From (Source)</th>
                    <th className="p-4">To (Destination)</th>
                    <th className="p-4">Transfer Qty</th>
                    <th className="p-4">Handoff Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 bg-white/40">
                  {transfers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                        No inter-department handovers dispatched yet.
                      </td>
                    </tr>
                  ) : (
                    transfers.map(trn => {
                      const isPending = trn.status === "Pending";
                      const isDispatched = trn.status === "Dispatched";
                      const isCompleted = trn.status === "Completed";
                      const isRejected = trn.status === "Rejected";

                      return (
                        <tr key={trn.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-mono text-[10px] text-slate-500">{trn.id}</td>
                          <td className="p-4">
                            <div>
                              <span className="font-black text-slate-800 text-sm block">{trn.itemName}</span>
                              <span className="text-[9px] text-slate-400">Date: {trn.date} | By: {trn.requestedBy}</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-500 font-bold">{trn.fromDepartment}</td>
                          <td className="p-4 text-slate-800 font-black">{trn.toDepartment}</td>
                          <td className="p-4 font-black text-sm">{trn.quantity.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              isPending ? "bg-amber-100 text-amber-800" :
                              isDispatched ? "bg-purple-100 text-purple-800 animate-pulse" :
                              isCompleted ? "bg-emerald-100 text-emerald-800" :
                              "bg-slate-100 text-slate-600"
                            }`}>
                              {trn.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isPending && (
                                <button
                                  onClick={() => handleUpdateTransferStatus(trn.id, "Dispatched")}
                                  className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-lg transition"
                                >
                                  Dispatch Shipment
                                </button>
                              )}

                              {isDispatched && (
                                <button
                                  onClick={() => handleUpdateTransferStatus(trn.id, "Completed")}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition"
                                >
                                  Confirm Ward Delivery
                                </button>
                              )}

                              {isCompleted && (
                                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 justify-end">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                  Delivered
                                </span>
                              )}

                              {isPending && (
                                <button
                                  onClick={() => handleUpdateTransferStatus(trn.id, "Rejected")}
                                  className="p-1 bg-rose-50 hover:bg-rose-150 text-rose-600 rounded-lg transition"
                                  title="Cancel or Reject Handoff"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 5: Supplier Management */}
        {activeSubTab === "suppliers" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Logistics Supplier Directory</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Coordinate with registered manufacturers and chemical/gas distributors authorized for hospital supplies.</p>
              </div>
              <button
                onClick={() => setShowAddSupplierModal(true)}
                className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Supplier
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map(sup => (
                <div key={sup.id} className="bg-white/80 border border-slate-150 p-4 rounded-2xl flex flex-col justify-between hover:shadow-md transition">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono text-slate-400 font-bold">{sup.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                        sup.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                      }`}>
                        {sup.status}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-black text-slate-800 text-sm leading-snug">{sup.name}</h5>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">Contact: {sup.contactPerson}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{sup.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{sup.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{sup.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => {
                        const nextStatus = sup.status === "Active" ? "Inactive" : "Active";
                        setSuppliers(prev => prev.map(s => s.id === sup.id ? { ...s, status: nextStatus } : s));
                        addLog(`Changed supplier status of ${sup.name} to: ${nextStatus}`);
                      }}
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-800 transition"
                    >
                      Toggle {sup.status === "Active" ? "Inactive" : "Active"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* MODAL overlay: QR / Barcode Simulator */}
      {scannedItem && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-white/60 text-center animate-scaleUp">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{scannedItem.id}</span>
              <h4 className="font-black text-slate-800 text-base mt-1">{scannedItem.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">Central Warehouse Track SKU Tracker</p>
            </div>

            {/* Visual simulation of high-contrast barcode/QR lines */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center space-y-4">
              
              {/* QR representation using modular styled blocks */}
              <div className="bg-white border-4 border-white p-3 shadow-inner rounded-xl relative">
                <div className="w-32 h-32 flex flex-col justify-between">
                  <div className="flex justify-between h-8">
                    <div className="w-8 bg-slate-900 rounded-sm" />
                    <div className="w-16 bg-slate-900 h-2 mt-2" />
                    <div className="w-8 bg-slate-900 rounded-sm" />
                  </div>
                  <div className="flex justify-between h-8 items-center">
                    <div className="w-4 bg-slate-900 h-4" />
                    <div className="w-16 bg-slate-900 h-8 rounded-xs" />
                    <div className="w-4 bg-slate-900 h-4" />
                  </div>
                  <div className="flex justify-between h-8 items-end">
                    <div className="w-8 bg-slate-900 h-8 rounded-sm" />
                    <div className="w-12 bg-slate-900 h-4" />
                    <div className="w-6 bg-slate-900 h-6" />
                  </div>
                </div>
              </div>

              {/* SKU display */}
              <div className="space-y-1">
                <div className="font-mono text-xs font-black tracking-widest text-slate-800">{scannedItem.sku}</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Category: {scannedItem.category}</div>
              </div>
            </div>

            <div className="space-y-1 text-left text-xs font-bold text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <div>📍 Location: <span className="text-slate-800">{scannedItem.location}</span></div>
              <div>📦 On-Hand: <span className="text-emerald-700">{scannedItem.quantity} {scannedItem.unit}</span></div>
              {scannedItem.expiryDate && (
                <div>⌛ Clinical Expiry: <span className="text-rose-600">{scannedItem.expiryDate}</span></div>
              )}
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  alert(`Dispatched print command for SKU barcode stickers to Central Store label printer.`);
                  addLog(`Printed barcode labels for SKU: ${scannedItem.sku}`);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
              >
                Print Barcode Label
              </button>
              <button
                onClick={() => setScannedItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Register New Stock Item */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-white/60 animate-scaleUp">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h4 className="font-black text-slate-800 text-base flex items-center gap-1.5">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                Register New Stock Material
              </h4>
              <button onClick={() => setShowAddItemModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>

            <form onSubmit={handleAddItem} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sterile Gauze Box"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Material SKU Barcode</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SKU-12345"
                  value={newItemSku}
                  onChange={e => setNewItemSku(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Material Category</label>
                <select
                  value={newItemCategory}
                  onChange={e => setNewItemCategory(e.target.value as InventoryCategory)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-bold text-slate-700"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Initial Qty</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItemQty}
                    onChange={e => setNewItemQty(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="Pieces, Boxes, etc."
                    value={newItemUnit}
                    onChange={e => setNewItemUnit(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price Per Unit (৳ BDT)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={newItemPrice}
                  onChange={e => setNewItemPrice(Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Min Reorder Level</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newItemMinStock}
                  onChange={e => setNewItemMinStock(Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Warehouse Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aisle B, Shelf 4"
                  value={newItemLocation}
                  onChange={e => setNewItemLocation(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={newItemExpiry}
                  onChange={e => setNewItemExpiry(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 focus:outline-none font-semibold text-slate-700"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Assigned Vendor / Supplier</label>
                <select
                  value={newItemSupplier}
                  onChange={e => setNewItemSupplier(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-bold text-slate-700"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.contactPerson})</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Register Stock Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Dispatch Department Transfer */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/60 animate-scaleUp">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h4 className="font-black text-slate-800 text-base flex items-center gap-1.5">
                <ArrowLeftRight className="w-5 h-5 text-indigo-600" />
                Dispatch Department Transfer
              </h4>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>

            <form onSubmit={handleCreateTransfer} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Material from Depot</label>
                <select
                  value={newTransItemId}
                  onChange={e => {
                    setNewTransItemId(e.target.value);
                    const selected = items.find(i => i.id === e.target.value);
                    if (selected) {
                      setNewTransQty(Math.min(selected.quantity, 50));
                    }
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-bold text-slate-700"
                  required
                >
                  <option value="">-- Choose Stock Item --</option>
                  {items.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.name} [Depot stock: {i.quantity} {i.unit}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Destination Ward / Department</label>
                <select
                  value={newTransToDept}
                  onChange={e => setNewTransToDept(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-bold text-slate-700"
                >
                  <option value="Emergency Department">Emergency Department (ER)</option>
                  <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                  <option value="Operating Theatre (OT)">Operating Theatre (OT) Complex</option>
                  <option value="General Ward 2nd Floor">General Ward 2nd Floor</option>
                  <option value="Paediatrics Ward">Paediatrics Ward</option>
                  <option value="Radiology & Diagnostics">Radiology & Diagnostics</option>
                  <option value="Outpatient Consultation (OPD)">Outpatient Clinic (OPD)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Transfer Qty</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newTransQty}
                    onChange={e => setNewTransQty(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Requested By</label>
                  <input
                    type="text"
                    required
                    value={newTransRequestedBy}
                    onChange={e => setNewTransRequestedBy(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Dispatch Ward Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Raise New Purchase Request */}
      {showNewPRModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/60 animate-scaleUp">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h4 className="font-black text-slate-800 text-base flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-emerald-600" />
                Raise Procurement Order Request
              </h4>
              <button onClick={() => setShowNewPRModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>

            <form onSubmit={handleCreatePR} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Supply Item</label>
                <select
                  value={newPRItemId}
                  onChange={e => {
                    setNewPRItemId(e.target.value);
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-bold text-slate-700"
                  required
                >
                  <option value="">-- Choose Stock Item --</option>
                  {items.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.name} (৳ {i.pricePerUnit} / {i.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Quantity Requested</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPRQty}
                    onChange={e => setNewPRQty(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Urgency Status</label>
                  <select
                    value={newPRUrgency}
                    onChange={e => setNewPRUrgency(e.target.value as "Routine" | "Urgent" | "Emergency")}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-bold text-slate-700"
                  >
                    <option value="Routine">Routine (Low)</option>
                    <option value="Urgent">Urgent (Medium)</option>
                    <option value="Emergency">Emergency (High)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewPRModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Submit Order Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Register New Supplier */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/60 animate-scaleUp">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h4 className="font-black text-slate-800 text-base flex items-center gap-1.5">
                <Truck className="w-5 h-5 text-emerald-600" />
                Add Logistics Vendor Partner
              </h4>
              <button onClick={() => setShowAddSupplierModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>

            <form onSubmit={handleAddSupplier} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vendor/Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka Medical Gases Co."
                  value={newSupName}
                  onChange={e => setNewSupName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Key Contact Person</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Aslam Chowdury"
                  value={newSupContact}
                  onChange={e => setNewSupContact(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+880-1700-000000"
                    value={newSupPhone}
                    onChange={e => setNewSupPhone(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sales@company.com"
                    value={newSupEmail}
                    onChange={e => setNewSupEmail(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Corporate Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gulshan-1, Dhaka"
                  value={newSupAddress}
                  onChange={e => setNewSupAddress(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Register Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
