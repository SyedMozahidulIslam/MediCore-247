/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BiomedicalAsset, Department } from "../types";

export const mockBiomedicalAssets: BiomedicalAsset[] = [
  {
    id: "EQ-MRI-001",
    name: "Siemens Magnetom Lumina 3T MRI",
    type: "MRI",
    status: "Active",
    department: Department.RADIOLOGY,
    location: "Radiology Wing - Suite 101",
    serialNumber: "SN-982741-LUM",
    manufacturer: "Siemens Healthineers",
    purchaseDate: "2024-03-15",
    price: 185000000, // 18.5 Crore BDT
    warrantyExpiry: "2029-03-15",
    warrantyProvider: "Siemens Bangladesh Ltd.",
    lastMaintenanceDate: "2026-05-10",
    nextMaintenanceDate: "2026-11-10",
    maintenanceFrequency: "Bi-annually",
    lastCalibrationDate: "2026-02-20",
    nextCalibrationDate: "2026-08-20",
    calibrationFrequency: "Bi-annually",
    usageHours: 4210,
    downtimePercentage: 1.8,
    assignedTo: "Radiology Team - Lead Radiologist",
    repairHistory: [
      {
        id: "REP-MRI-001",
        date: "2025-08-14",
        issue: "Helium cooling system pressure drop alert",
        solution: "Refilled liquid helium coolant and calibrated magnetic pressure valves",
        cost: 320000,
        technician: "M. Rahman (Siemens BioMed Specialist)",
        status: "Resolved"
      }
    ]
  },
  {
    id: "EQ-CTS-002",
    name: "GE Revolution Maxima CT Scanner",
    type: "CT Scan",
    status: "In Use",
    department: Department.RADIOLOGY,
    location: "Radiology Wing - Suite 103",
    serialNumber: "SN-338291-CTS",
    manufacturer: "GE HealthCare",
    purchaseDate: "2024-06-20",
    price: 125000000, // 12.5 Crore BDT
    warrantyExpiry: "2027-06-20",
    warrantyProvider: "GE Bangladesh Healthcare",
    lastMaintenanceDate: "2026-06-05",
    nextMaintenanceDate: "2026-09-05",
    maintenanceFrequency: "Quarterly",
    lastCalibrationDate: "2026-06-05",
    nextCalibrationDate: "2026-09-05",
    calibrationFrequency: "Quarterly",
    usageHours: 5890,
    downtimePercentage: 2.3,
    assignedTo: "Radiology Dept - Patient Salim Khan (Study ID: Rad-883)",
    repairHistory: [
      {
        id: "REP-CTS-001",
        date: "2025-11-03",
        issue: "Slip-ring brush wear leading to scan artifacting",
        solution: "Replaced slip-ring assembly and performed phantom imaging calibration tests",
        cost: 450000,
        technician: "H. Zaman (GE Senior Engineer)",
        status: "Resolved"
      }
    ]
  },
  {
    id: "EQ-XRY-003",
    name: "Carestream DRX-Evolution Plus Digital X-Ray",
    type: "X-Ray",
    status: "Active",
    department: Department.RADIOLOGY,
    location: "Radiology Wing - Room X-1",
    serialNumber: "SN-552910-XRY",
    manufacturer: "Carestream Health",
    purchaseDate: "2023-11-10",
    price: 32000000,
    warrantyExpiry: "2026-11-10",
    warrantyProvider: "Carestream Service BD",
    lastMaintenanceDate: "2026-04-12",
    nextMaintenanceDate: "2026-10-12",
    maintenanceFrequency: "Bi-annually",
    lastCalibrationDate: "2026-04-12",
    nextCalibrationDate: "2026-10-12",
    calibrationFrequency: "Bi-annually",
    usageHours: 7820,
    downtimePercentage: 0.9,
    assignedTo: "X-Ray Lab 1 Staff",
    repairHistory: []
  },
  {
    id: "EQ-VENT-004",
    name: "Hamilton-C1 Mechanical Ventilator",
    type: "Ventilator",
    status: "In Use",
    department: Department.CARDIOLOGY,
    location: "ICU - Bed ICU-101",
    serialNumber: "SN-HAM-44820",
    manufacturer: "Hamilton Medical",
    purchaseDate: "2025-01-10",
    price: 4500000,
    warrantyExpiry: "2028-01-10",
    warrantyProvider: "Hamilton Med Service Center",
    lastMaintenanceDate: "2026-06-18",
    nextMaintenanceDate: "2026-07-18",
    maintenanceFrequency: "Monthly",
    lastCalibrationDate: "2026-06-18",
    nextCalibrationDate: "2026-07-18",
    calibrationFrequency: "Monthly",
    usageHours: 2450,
    downtimePercentage: 1.2,
    assignedTo: "Abdur Rahim (Patient ID: PAT-001)",
    repairHistory: [
      {
        id: "REP-VENT-001",
        date: "2025-10-05",
        issue: "Oxygen sensor failure alarm",
        solution: "Replaced electrochemical O2 sensor cell and tested oxygen blending ratio accuracy",
        cost: 25000,
        technician: "Farhan Ahmed (Lead Hospital BioMed)",
        status: "Resolved"
      }
    ]
  },
  {
    id: "EQ-VENT-005",
    name: "Dräger Babylog VN500 Neonatal Ventilator",
    type: "Ventilator",
    status: "Maintenance",
    department: Department.PEDIATRICS,
    location: "NICU Block - Bed NICU-04",
    serialNumber: "SN-DRG-88291",
    manufacturer: "Dräger",
    purchaseDate: "2024-08-01",
    price: 6200000,
    warrantyExpiry: "2027-08-01",
    warrantyProvider: "Dräger Bangladesh Corp.",
    lastMaintenanceDate: "2026-05-02",
    nextMaintenanceDate: "2026-07-02", // Due or past due
    maintenanceFrequency: "Monthly",
    lastCalibrationDate: "2026-05-02",
    nextCalibrationDate: "2026-06-02", // OVERDUE FOR CALIBRATION
    calibrationFrequency: "Monthly",
    usageHours: 3950,
    downtimePercentage: 4.1,
    assignedTo: "NICU Floor Manager",
    repairHistory: [
      {
        id: "REP-VENT-002",
        date: "2026-07-01",
        issue: "Inspiratory valve solenoid micro-leakage",
        solution: "Replacing flow sensor assembly and diaphragm valves",
        cost: 65000,
        technician: "Anisur Rahman (Hospital BioMed Engineer)",
        status: "In Progress"
      }
    ]
  },
  {
    id: "EQ-ECG-006",
    name: "GE MAC 2000 ECG Machine",
    type: "ECG Machine",
    status: "Active",
    department: Department.CARDIOLOGY,
    location: "Cardiology OPD - Room 204",
    serialNumber: "SN-ECG-11293",
    manufacturer: "GE HealthCare",
    purchaseDate: "2025-02-14",
    price: 850000,
    warrantyExpiry: "2028-02-14",
    warrantyProvider: "GE Bangladesh Healthcare",
    lastMaintenanceDate: "2026-05-15",
    nextMaintenanceDate: "2026-11-15",
    maintenanceFrequency: "Bi-annually",
    lastCalibrationDate: "2026-05-15",
    nextCalibrationDate: "2026-11-15",
    calibrationFrequency: "Bi-annually",
    usageHours: 850,
    downtimePercentage: 0.2,
    assignedTo: "Dr. Salim Rahaman (Cardiology OPD)",
    repairHistory: []
  },
  {
    id: "EQ-MON-007",
    name: "Philips IntelliVue MX550 Patient Monitor",
    type: "Monitor",
    status: "In Use",
    department: Department.EMERGENCY,
    location: "ER - Trauma Bay A",
    serialNumber: "SN-PHL-99827",
    manufacturer: "Philips Healthcare",
    purchaseDate: "2024-11-05",
    price: 1800000,
    warrantyExpiry: "2027-11-05",
    warrantyProvider: "Philips Medical Support BD",
    lastMaintenanceDate: "2026-06-10",
    nextMaintenanceDate: "2026-09-10",
    maintenanceFrequency: "Quarterly",
    lastCalibrationDate: "2026-06-10",
    nextCalibrationDate: "2026-09-10",
    calibrationFrequency: "Quarterly",
    usageHours: 6120,
    downtimePercentage: 1.5,
    assignedTo: "Emergency Care Queue (PAT-006)",
    repairHistory: [
      {
        id: "REP-MON-001",
        date: "2026-03-22",
        issue: "SpO2 module port connectivity intermittent",
        solution: "Soldered female board connector Pins and updated telemetry firmwares",
        cost: 12000,
        technician: "Farhan Ahmed (Lead Hospital BioMed)",
        status: "Resolved"
      }
    ]
  },
  {
    id: "EQ-INF-008",
    name: "Alaris GP Volumetric Infusion Pump",
    type: "Infusion Pump",
    status: "Active",
    department: Department.GENERAL_MEDICINE,
    location: "General Ward - Station B",
    serialNumber: "SN-ALA-33829-G",
    manufacturer: "BD Alaris",
    purchaseDate: "2025-03-22",
    price: 380000,
    warrantyExpiry: "2028-03-22",
    warrantyProvider: "BD Alaris distributor BD",
    lastMaintenanceDate: "2026-06-25",
    nextMaintenanceDate: "2026-09-25",
    maintenanceFrequency: "Quarterly",
    lastCalibrationDate: "2026-06-25",
    nextCalibrationDate: "2026-09-25",
    calibrationFrequency: "Quarterly",
    usageHours: 2900,
    downtimePercentage: 0.5,
    assignedTo: "Nurse Duty Station B",
    repairHistory: []
  },
  {
    id: "EQ-SURG-009",
    name: "Stryker Core 2 Power Surgical Console",
    type: "Surgical Equipment",
    status: "Active",
    department: Department.SURGERY,
    location: "OT - Operating Room 1",
    serialNumber: "SN-STR-77291",
    manufacturer: "Stryker",
    purchaseDate: "2024-05-18",
    price: 5500000,
    warrantyExpiry: "2027-05-18",
    warrantyProvider: "Stryker Service BD Ltd.",
    lastMaintenanceDate: "2026-06-01",
    nextMaintenanceDate: "2026-09-01",
    maintenanceFrequency: "Quarterly",
    lastCalibrationDate: "2026-06-01",
    nextCalibrationDate: "2026-09-01",
    calibrationFrequency: "Quarterly",
    usageHours: 1980,
    downtimePercentage: 1.1,
    assignedTo: "OT Surgery Team (Surg-01)",
    repairHistory: [
      {
        id: "REP-SUR-001",
        date: "2025-07-20",
        issue: "Footswitch controller unresponsive",
        solution: "Replaced high-flex connector cable and sterilized dual footswitch contactors",
        cost: 35000,
        technician: "Anisur Rahman (Hospital BioMed Engineer)",
        status: "Resolved"
      }
    ]
  },
  {
    id: "EQ-SURG-010",
    name: "Covidien Valleylab ForceTriad Energy Platform",
    type: "Surgical Equipment",
    status: "Out of Calibration",
    department: Department.SURGERY,
    location: "OT - Operating Room 2",
    serialNumber: "SN-COV-882910",
    manufacturer: "Medtronic Covidien",
    purchaseDate: "2023-10-12",
    price: 7800000,
    warrantyExpiry: "2026-10-12",
    warrantyProvider: "Medtronic Service BD",
    lastMaintenanceDate: "2026-03-10",
    nextMaintenanceDate: "2026-06-10", // Maintenance OVERDUE
    lastCalibrationDate: "2026-03-10",
    nextCalibrationDate: "2026-06-10", // Calibration OVERDUE
    calibrationFrequency: "Quarterly",
    maintenanceFrequency: "Quarterly",
    usageHours: 4120,
    downtimePercentage: 3.5,
    assignedTo: "OT Support Desk",
    repairHistory: [
      {
        id: "REP-SUR-002",
        date: "2026-06-28",
        issue: "RF output discrepancy during monopolar activation",
        solution: "Requires power supply rail board calibration",
        cost: 0,
        technician: "Anisur Rahman (Hospital BioMed Engineer)",
        status: "Pending Parts"
      }
    ]
  }
];
