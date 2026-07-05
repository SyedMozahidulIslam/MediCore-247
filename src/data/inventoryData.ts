/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InventoryItem, Supplier, PurchaseRequest, DepartmentTransfer } from "../types";

export const mockSuppliers: Supplier[] = [
  {
    id: "SPL-001",
    name: "Medisource Pharmaceuticals & Supplies Ltd.",
    contactPerson: "Dr. Anisur Rahman",
    phone: "+880-1711-223344",
    email: "contact@medisource.com.bd",
    address: "Tejgaon Industrial Area, Dhaka-1208",
    status: "Active"
  },
  {
    id: "SPL-002",
    name: "Apex Surgical Instruments Corp.",
    contactPerson: "Tahmid Hossain",
    phone: "+880-1819-334455",
    email: "orders@apexsurgical.com",
    address: "Kazi Nazrul Islam Avenue, Dhaka-1215",
    status: "Active"
  },
  {
    id: "SPL-003",
    name: "Bengal Oxygen Co.",
    contactPerson: "Mamun-or-Rashid",
    phone: "+880-1912-445566",
    email: "support@bengaloxygen.com.bd",
    address: "Chittagong Road, Narayanganj",
    status: "Active"
  },
  {
    id: "SPL-004",
    name: "Dhaka Diagnostics & Lab Consumables",
    contactPerson: "Nusrat Jahan",
    phone: "+880-1678-556677",
    email: "sales@dhakadiagnostics.com",
    address: "Green Road, Dhanmondi, Dhaka",
    status: "Active"
  },
  {
    id: "SPL-005",
    name: "National Stationers & Office Supplies",
    contactPerson: "Rafiqul Islam",
    phone: "+880-1552-667788",
    email: "info@nationalstationers.com",
    address: "Motijheel C/A, Dhaka-1000",
    status: "Active"
  },
  {
    id: "SPL-006",
    name: "Green Linens & Hospital Garments",
    contactPerson: "Shamima Nasrin",
    phone: "+880-1712-778899",
    email: "garments@greenlinens.com",
    address: "Mirpur-10, Dhaka-1216",
    status: "Active"
  },
  {
    id: "SPL-007",
    name: "Bengal Agro Food Distributors",
    contactPerson: "Belal Ahmed",
    phone: "+880-1301-889900",
    email: "wholesale@bengalagro.com",
    address: "Kawran Bazar, Dhaka-1215",
    status: "Active"
  },
  {
    id: "SPL-008",
    name: "Elite Cleaners & Chemical Industries",
    contactPerson: "Sajid Khan",
    phone: "+880-1799-990011",
    email: "industrial@eliteclean.com",
    address: "Savar, Dhaka",
    status: "Active"
  }
];

export const mockInventoryItems: InventoryItem[] = [
  // Medical Supplies
  {
    id: "INV-MED-001",
    name: "Syringe 5ml with Needle",
    sku: "MED-SYR5ML-9082",
    category: "Medical Supplies",
    quantity: 12000,
    unit: "Pieces",
    minStockLevel: 2500,
    supplierId: "SPL-001",
    expiryDate: "2028-11-15",
    location: "Aisle A, Shelf 2",
    lastRestocked: "2026-06-12",
    pricePerUnit: 8.5,
    forecastedDemand: 13500
  },
  {
    id: "INV-MED-002",
    name: "IV Cannula 20G (Pink)",
    sku: "MED-CAN20G-4122",
    category: "Medical Supplies",
    quantity: 1800,
    unit: "Pieces",
    minStockLevel: 2000, // Low stock alert!
    supplierId: "SPL-001",
    expiryDate: "2027-09-30",
    location: "Aisle A, Shelf 3",
    lastRestocked: "2026-05-10",
    pricePerUnit: 35.0,
    forecastedDemand: 2200
  },
  {
    id: "INV-MED-003",
    name: "Sterile Gauze Pads 4x4",
    sku: "MED-GAU4X4-2193",
    category: "Medical Supplies",
    quantity: 8500,
    unit: "Pieces",
    minStockLevel: 1500,
    supplierId: "SPL-001",
    expiryDate: "2029-01-20",
    location: "Aisle B, Shelf 1",
    lastRestocked: "2026-06-18",
    pricePerUnit: 12.0,
    forecastedDemand: 9000
  },
  {
    id: "INV-MED-004",
    name: "Adhesive Bandages Box",
    sku: "MED-BANDBX-7611",
    category: "Medical Supplies",
    quantity: 450,
    unit: "Boxes",
    minStockLevel: 100,
    supplierId: "SPL-001",
    expiryDate: "2028-04-10",
    location: "Aisle B, Shelf 2",
    lastRestocked: "2026-06-01",
    pricePerUnit: 180.0,
    forecastedDemand: 500
  },

  // Surgical Instruments
  {
    id: "INV-SRG-001",
    name: "Disposable Scalpel #11",
    sku: "SRG-SCALP11-3829",
    category: "Surgical Instruments",
    quantity: 3400,
    unit: "Pieces",
    minStockLevel: 800,
    supplierId: "SPL-002",
    expiryDate: "2030-05-25",
    location: "Aisle C, Shelf 1",
    lastRestocked: "2026-06-20",
    pricePerUnit: 45.0,
    forecastedDemand: 3600
  },
  {
    id: "INV-SRG-002",
    name: "Artery Forceps Curved",
    sku: "SRG-ARFORC-1092",
    category: "Surgical Instruments",
    quantity: 120,
    unit: "Pieces",
    minStockLevel: 50,
    supplierId: "SPL-002",
    location: "Aisle C, Shelf 4",
    lastRestocked: "2025-12-05",
    pricePerUnit: 650.0,
    forecastedDemand: 130
  },
  {
    id: "INV-SRG-003",
    name: "Surgical Scissors Blunt/Sharp",
    sku: "SRG-SCISBS-0921",
    category: "Surgical Instruments",
    quantity: 85,
    unit: "Pieces",
    minStockLevel: 40,
    supplierId: "SPL-002",
    location: "Aisle C, Shelf 5",
    lastRestocked: "2026-01-14",
    pricePerUnit: 480.0,
    forecastedDemand: 90
  },

  // PPE
  {
    id: "INV-PPE-001",
    name: "N95 Particulate Respirator",
    sku: "PPE-N95RESP-5561",
    category: "PPE",
    quantity: 1200,
    unit: "Pieces",
    minStockLevel: 3000, // CRITICAL LOW STOCK ALERT!
    supplierId: "SPL-001",
    expiryDate: "2028-06-30",
    location: "Aisle D, Shelf 1",
    lastRestocked: "2026-03-22",
    pricePerUnit: 120.0,
    forecastedDemand: 4500
  },
  {
    id: "INV-PPE-002",
    name: "Surgical Face Mask 3-Ply",
    sku: "PPE-MASK3PLY-7711",
    category: "PPE",
    quantity: 45000,
    unit: "Pieces",
    minStockLevel: 10000,
    supplierId: "SPL-001",
    expiryDate: "2028-12-10",
    location: "Aisle D, Shelf 2",
    lastRestocked: "2026-06-25",
    pricePerUnit: 2.2,
    forecastedDemand: 40000
  },
  {
    id: "INV-PPE-003",
    name: "Nitrile Examination Gloves Medium",
    sku: "PPE-GLVNIT-1918",
    category: "PPE",
    quantity: 240,
    unit: "Boxes", // 1 box = 100 pcs
    minStockLevel: 400, // Low stock!
    supplierId: "SPL-001",
    expiryDate: "2027-11-20",
    location: "Aisle D, Shelf 4",
    lastRestocked: "2026-04-12",
    pricePerUnit: 450.0,
    forecastedDemand: 350
  },
  {
    id: "INV-PPE-004",
    name: "Disposable Protective Gown",
    sku: "PPE-GOWNDIS-9021",
    category: "PPE",
    quantity: 1500,
    unit: "Pieces",
    minStockLevel: 500,
    supplierId: "SPL-001",
    expiryDate: "2029-02-15",
    location: "Aisle D, Shelf 5",
    lastRestocked: "2026-06-05",
    pricePerUnit: 95.0,
    forecastedDemand: 1800
  },

  // Oxygen Cylinders
  {
    id: "INV-OXY-001",
    name: "Medical Oxygen Cylinder 47L",
    sku: "OXY-47LCYL-3329",
    category: "Oxygen Cylinders",
    quantity: 85,
    unit: "Cylinders",
    minStockLevel: 30,
    supplierId: "SPL-003",
    location: "Oxygen Storage Depot",
    lastRestocked: "2026-06-29",
    pricePerUnit: 7500.0,
    forecastedDemand: 95
  },
  {
    id: "INV-OXY-002",
    name: "Portable Oxygen Cylinder 2.9L",
    sku: "OXY-29LPOR-4411",
    category: "Oxygen Cylinders",
    quantity: 42,
    unit: "Cylinders",
    minStockLevel: 15,
    supplierId: "SPL-003",
    location: "Oxygen Storage Depot",
    lastRestocked: "2026-06-25",
    pricePerUnit: 4500.0,
    forecastedDemand: 45
  },
  {
    id: "INV-OXY-003",
    name: "Oxygen Regulator & Flowmeter",
    sku: "OXY-REGMTR-2291",
    category: "Oxygen Cylinders",
    quantity: 12,
    unit: "Pieces",
    minStockLevel: 25, // ALERT: Under stocked!
    supplierId: "SPL-003",
    location: "Aisle E, Shelf 1",
    lastRestocked: "2025-09-11",
    pricePerUnit: 2800.0,
    forecastedDemand: 30
  },

  // Laboratory Consumables
  {
    id: "INV-LAB-001",
    name: "Vacutainer Blood Collection Tubes",
    sku: "LAB-VACUBLD-4011",
    category: "Laboratory Consumables",
    quantity: 5200,
    unit: "Pieces",
    minStockLevel: 1500,
    supplierId: "SPL-004",
    expiryDate: "2027-08-18",
    location: "Aisle F, Shelf 1",
    lastRestocked: "2026-05-14",
    pricePerUnit: 28.0,
    forecastedDemand: 5500
  },
  {
    id: "INV-LAB-002",
    name: "Glass Microscope Slides Pack",
    sku: "LAB-GLASLD-3021",
    category: "Laboratory Consumables",
    quantity: 110,
    unit: "Packs",
    minStockLevel: 30,
    supplierId: "SPL-004",
    location: "Aisle F, Shelf 2",
    lastRestocked: "2026-03-08",
    pricePerUnit: 350.0,
    forecastedDemand: 120
  },
  {
    id: "INV-LAB-003",
    name: "PCR Test Reagents Kit",
    sku: "LAB-PCRREAG-9901",
    category: "Laboratory Consumables",
    quantity: 8,
    unit: "Kits", // 1 kit = 96 runs
    minStockLevel: 10, // ALERT!
    supplierId: "SPL-004",
    expiryDate: "2026-10-31", // Approaching expiry!
    location: "Lab Refrigerator B",
    lastRestocked: "2026-04-01",
    pricePerUnit: 14500.0,
    forecastedDemand: 15
  },

  // Office Supplies
  {
    id: "INV-OFF-001",
    name: "A4 Photocopy Paper Ream",
    sku: "OFF-A4REAME-1299",
    category: "Office Supplies",
    quantity: 85,
    unit: "Reams",
    minStockLevel: 50,
    supplierId: "SPL-005",
    location: "Aisle G, Shelf 1",
    lastRestocked: "2026-06-15",
    pricePerUnit: 420.0,
    forecastedDemand: 100
  },
  {
    id: "INV-OFF-002",
    name: "Medical Record File Folders",
    sku: "OFF-FOLDRCD-8812",
    category: "Office Supplies",
    quantity: 450,
    unit: "Pieces",
    minStockLevel: 1000, // ALERT: Under stocked!
    supplierId: "SPL-005",
    location: "Aisle G, Shelf 3",
    lastRestocked: "2026-02-10",
    pricePerUnit: 15.0,
    forecastedDemand: 1200
  },

  // Linens
  {
    id: "INV-LIN-001",
    name: "Hospital Bed Sheets (Blue Cotton)",
    sku: "LIN-SHEETBL-9811",
    category: "Linens",
    quantity: 950,
    unit: "Pieces",
    minStockLevel: 300,
    supplierId: "SPL-006",
    location: "Aisle H, Shelf 1",
    lastRestocked: "2026-05-18",
    pricePerUnit: 380.0,
    forecastedDemand: 1000
  },
  {
    id: "INV-LIN-002",
    name: "Disposable Pillow Cases",
    sku: "LIN-PILOCAS-2211",
    category: "Linens",
    quantity: 1400,
    unit: "Pieces",
    minStockLevel: 500,
    supplierId: "SPL-006",
    location: "Aisle H, Shelf 3",
    lastRestocked: "2026-06-11",
    pricePerUnit: 45.0,
    forecastedDemand: 1500
  },

  // Food Inventory
  {
    id: "INV-FOD-001",
    name: "Clinical Fortified Meal Packs",
    sku: "FOD-CLINML-3990",
    category: "Food Inventory",
    quantity: 640,
    unit: "Packs",
    minStockLevel: 200,
    supplierId: "SPL-007",
    expiryDate: "2026-09-15", // Short expiry
    location: "Dietary Cold Store A",
    lastRestocked: "2026-06-20",
    pricePerUnit: 110.0,
    forecastedDemand: 800
  },
  {
    id: "INV-FOD-002",
    name: "Standard Diet Rice (50kg Bag)",
    sku: "FOD-RIC50KG-7711",
    category: "Food Inventory",
    quantity: 15,
    unit: "Bags",
    minStockLevel: 10,
    supplierId: "SPL-007",
    expiryDate: "2027-06-30",
    location: "Dry Food Warehouse",
    lastRestocked: "2026-05-02",
    pricePerUnit: 3400.0,
    forecastedDemand: 20
  },

  // Cleaning Materials
  {
    id: "INV-CLN-001",
    name: "Hospital Grade Disinfectant (5L)",
    sku: "CLN-DISIN5L-8822",
    category: "Cleaning Materials",
    quantity: 140,
    unit: "Cans",
    minStockLevel: 50,
    supplierId: "SPL-008",
    expiryDate: "2028-03-31",
    location: "Aisle J, Shelf 1",
    lastRestocked: "2026-06-15",
    pricePerUnit: 1250.0,
    forecastedDemand: 150
  },
  {
    id: "INV-CLN-002",
    name: "Microfiber Wet Mop Head",
    sku: "CLN-MOPWETH-0012",
    category: "Cleaning Materials",
    quantity: 18,
    unit: "Pieces",
    minStockLevel: 30, // ALERT: Under stocked!
    supplierId: "SPL-008",
    location: "Aisle J, Shelf 4",
    lastRestocked: "2026-01-20",
    pricePerUnit: 220.0,
    forecastedDemand: 40
  }
];

export const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: "PRQ-001",
    itemId: "INV-MED-002",
    itemName: "IV Cannula 20G (Pink)",
    quantityRequested: 3000,
    estimatedCost: 105000, // 3000 * 35 BDT
    supplierId: "SPL-001",
    supplierName: "Medisource Pharmaceuticals & Supplies Ltd.",
    requestedBy: "Senior Nurse Shamima",
    requestDate: "2026-07-04",
    status: "Pending Approval",
    urgency: "Urgent"
  },
  {
    id: "PRQ-002",
    itemId: "INV-PPE-001",
    itemName: "N95 Particulate Respirator",
    quantityRequested: 5000,
    estimatedCost: 600000, // 5000 * 120 BDT
    supplierId: "SPL-001",
    supplierName: "Medisource Pharmaceuticals & Supplies Ltd.",
    requestedBy: "Dr. Kabir Hossain (Infection Control)",
    requestDate: "2026-07-03",
    status: "Approved",
    urgency: "Urgent"
  },
  {
    id: "PRQ-003",
    itemId: "INV-OXY-003",
    itemName: "Oxygen Regulator & Flowmeter",
    quantityRequested: 20,
    estimatedCost: 56000, // 20 * 2800 BDT
    supplierId: "SPL-003",
    supplierName: "Bengal Oxygen Co.",
    requestedBy: "Engr. Monir (Biomedical Dept)",
    requestDate: "2026-07-05",
    status: "Pending Approval",
    urgency: "Emergency"
  },
  {
    id: "PRQ-004",
    itemId: "INV-OFF-002",
    itemName: "Medical Record File Folders",
    quantityRequested: 1500,
    estimatedCost: 22500, // 1500 * 15 BDT
    supplierId: "SPL-005",
    supplierName: "National Stationers & Office Supplies",
    requestedBy: "Anwarul Karim (Records Dept)",
    requestDate: "2026-07-01",
    status: "Ordered",
    urgency: "Routine"
  }
];

export const mockDepartmentTransfers: DepartmentTransfer[] = [
  {
    id: "TRN-001",
    itemId: "INV-OXY-001",
    itemName: "Medical Oxygen Cylinder 47L",
    fromDepartment: "Central Warehouse Depot",
    toDepartment: "Intensive Care Unit (ICU)",
    quantity: 5,
    requestedBy: "Dr. Abdur Rahim",
    status: "Completed",
    date: "2026-07-04"
  },
  {
    id: "TRN-002",
    itemId: "INV-PPE-002",
    itemName: "Surgical Face Mask 3-Ply",
    fromDepartment: "Central Warehouse Depot",
    toDepartment: "Emergency Department",
    quantity: 5000,
    requestedBy: "Senior Coordinator Dr. Nusrat",
    status: "Dispatched",
    date: "2026-07-05"
  },
  {
    id: "TRN-003",
    itemId: "INV-MED-001",
    itemName: "Syringe 5ml with Needle",
    fromDepartment: "Central Warehouse Depot",
    toDepartment: "Paediatrics Ward",
    quantity: 1000,
    requestedBy: "Ward Sister Bilkis",
    status: "Pending",
    date: "2026-07-05"
  }
];
