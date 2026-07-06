/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  SUPREME_ADMIN = "Supreme Administrator",
  HOSPITAL_DIRECTOR = "Hospital Director",
  HR_DEPARTMENT = "HR Department",
  FRONT_DESK = "Front Desk",
  DOCTOR = "Doctor",
  NURSE = "Nurse",
  PHARMACY = "Pharmacy",
  LABORATORY = "Laboratory",
  RADIOLOGY = "Radiology",
  AMBULANCE_TEAM = "Ambulance Team",
  EMERGENCY_DEPARTMENT = "Emergency Department",
  OT_MANAGEMENT = "OT Management",
  FINANCE = "Finance",
  PATIENT = "Patient"
}

export enum Department {
  CARDIOLOGY = "Cardiology",
  NEUROLOGY = "Neurology",
  PEDIATRICS = "Pediatrics",
  ORTHOPEDICS = "Orthopedics",
  EMERGENCY = "Emergency Medicine",
  ONCOLOGY = "Oncology",
  DERMATOLOGY = "Dermatology",
  GENERAL_MEDICINE = "General Medicine",
  GYNAECOLOGY = "Gynaecology & Obstetrics",
  SURGERY = "General Surgery",
  PHARMACY = "Pharmacy Services",
  LABORATORY = "Laboratory Services",
  RADIOLOGY = "Radiology & Imaging",
  ADMINISTRATION = "Administration",
  HR = "Human Resources",
  FINANCE = "Finance & Billing",
  AMBULANCE = "Emergency Dispatch"
}

export enum AvailabilityStatus {
  AVAILABLE = "Available",
  IN_CONSULTATION = "In Consultation",
  ON_SURGERY = "On Surgery",
  EMERGENCY = "Emergency",
  BREAK = "Break",
  OFFLINE = "Offline",
  VACATION = "Vacation"
}

export interface Employee {
  id: string;
  name: string;
  role: UserRole;
  department: Department;
  specialization?: string;
  experience?: number; // years
  qualification?: string;
  availability: AvailabilityStatus;
  floor?: string;
  building?: string;
  languages?: string[];
  fee?: number;
  rating?: number;
  starCategory?: string;
  email: string;
  phone: string;
  shift: "Morning (06:00 - 14:00)" | "Evening (14:00 - 22:00)" | "Night (22:00 - 06:00)";
  salary?: number;
  attendanceStatus?: "Present" | "Absent" | "On Leave";
  skills?: string[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  insuranceProvider?: string;
  insurancePolicyNo?: string;
  freeTreatmentEligible: boolean;
  freeTreatmentReason?: string;
  status: "Admitted" | "Discharged" | "Outpatient" | "Emergency Queue" | "OT Prep";
  assignedDoctorId?: string;
  bedId?: string;
  admissionDate?: string;
  medicalHistory: {
    diagnosis: string;
    date: string;
    notes: string;
  }[];
  vitals?: {
    bp: string;
    temp: string; // e.g., 98.6 F
    pulse: string; // e.g., 72 bpm
    spO2: string; // e.g., 98%
    lastUpdated: string;
  };
}

export interface Bed {
  id: string;
  number: string;
  type: "ICU" | "OT" | "General Ward" | "Semi-Private" | "Emergency" | "VIP Cabin" | "Isolation";
  floor: string;
  building: string;
  status: "Available" | "Occupied" | "Maintenance" | "Reserved";
  patientId?: string;
  cleaningStatus?: "Clean" | "Dirty" | "Cleaning";
  predictedDischargeDate?: string;
  dischargeLikelihood?: "High" | "Medium" | "Low";
}

export interface PatientMovement {
  id: string;
  patientId: string;
  patientName: string;
  fromBed?: string;
  toBed: string;
  timestamp: string;
  reason: string;
}

export interface WaitingListEntry {
  id: string;
  patientId: string;
  patientName: string;
  requestDate: string;
  requiredBedType: "ICU" | "OT" | "General Ward" | "Semi-Private" | "Emergency" | "VIP Cabin" | "Isolation";
  urgency: "Routine" | "Urgent" | "Critical";
  reason: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: Department;
  date: string;
  timeSlot: string;
  status: "Scheduled" | "In-Progress" | "Completed" | "Cancelled";
  tokenNumber: string;
  type: "Consultation" | "Follow-up" | "Emergency" | "Diagnostic Test";
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: "Tablet" | "Capsule" | "Syrup" | "Injection" | "Ointment" | "IV Fluid";
  stock: number;
  minStock: number; // For alerts
  expiryDate: string;
  batchNumber: string;
  supplier: string;
  location: "Cold Storage" | "Aisle A" | "Aisle B" | "Aisle C";
  price: number;
  alternatives: string[];
}

export interface LaboratoryTest {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  category: "Hematology" | "Biochemistry" | "Microbiology" | "Pathology";
  requestedByDoctorId: string;
  requestedByDoctorName: string;
  requestedDate: string;
  status: "Pending Sample" | "Sample Collected" | "Processing" | "Completed";
  resultDate?: string;
  results?: {
    parameter: string;
    value: string;
    referenceRange: string;
    unit: string;
    isAbnormal: boolean;
  }[];
  sampleBarCode: string;
}

export interface RadiologyStudy {
  id: string;
  patientId: string;
  patientName: string;
  studyType: "X-Ray" | "MRI" | "CT Scan" | "Ultrasound" | "PET Scan";
  requestedByDoctorId: string;
  requestedByDoctorName: string;
  requestedDate: string;
  status: "Scheduled" | "Processing" | "Completed";
  imageUrl?: string; // Prompt-generated mock URL or placeholder SVG
  findings?: string;
  technicianName: string;
}

export interface OperationTheatreSession {
  id: string;
  patientId: string;
  patientName: string;
  surgeryName: string;
  primarySurgeonId: string;
  primarySurgeonName: string;
  assistantSurgeonName: string;
  anesthesiologistName: string;
  scrubNurseName: string;
  roomNumber: string;
  status: "Preparation" | "Active Surgery" | "Recovery" | "Completed";
  startTime: string;
  estimatedDuration: string; // e.g. "2 hours"
  elapsedTime?: string; // live tracker status countdown
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  type: "Advanced Life Support (ALS)" | "Basic Life Support (BLS)";
  driverName: string;
  driverPhone: string;
  status: "Available" | "Dispatched" | "At Location" | "Heading to Hospital" | "Maintenance";
  currentLatitude: number;
  currentLongitude: number;
  destinationName?: string;
  fuelLevel: number; // percentage
  nextMaintenance: string;
}

export interface CharityVerification {
  id: string;
  patientId: string;
  patientName: string;
  annualIncome: number;
  supportingDocument: "NID/Income Certificate" | "Social Welfare Card" | "Freedom Fighter Certificate";
  verifiedByAdminName: string;
  status: "Pending" | "Verified" | "Rejected";
  approvedAidType: "100% Free Medicine & Consultation" | "Free Surgery & ICU Support" | "Partial Hospital Bed Subsidy";
  donationFundSponsor: string;
}

export interface RepairRecord {
  id: string;
  date: string;
  issue: string;
  solution?: string;
  cost: number;
  technician: string;
  status: "Resolved" | "Pending Parts" | "In Progress";
}

export interface BiomedicalAsset {
  id: string;
  name: string;
  type: "MRI" | "CT Scan" | "X-Ray" | "Ventilator" | "ECG Machine" | "Monitor" | "Infusion Pump" | "Surgical Equipment";
  status: "Active" | "In Use" | "Maintenance" | "Out of Calibration" | "Repairing" | "Decommissioned";
  department: Department;
  location: string;
  serialNumber: string;
  manufacturer: string;
  purchaseDate: string;
  price: number; // in BDT
  warrantyExpiry: string;
  warrantyProvider: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  maintenanceFrequency: "Monthly" | "Quarterly" | "Bi-annually" | "Annually";
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  calibrationFrequency: "Monthly" | "Quarterly" | "Bi-annually" | "Annually";
  usageHours: number;
  downtimePercentage: number; // e.g. 1.5%
  assignedTo?: string; // e.g., Patient Name, OT Room Number, or Doctor ID
  repairHistory: RepairRecord[];
}

export type InventoryCategory =
  | "Medical Supplies"
  | "Surgical Instruments"
  | "PPE"
  | "Oxygen Cylinders"
  | "Laboratory Consumables"
  | "Office Supplies"
  | "Linens"
  | "Food Inventory"
  | "Cleaning Materials";

export interface InventoryItem {
  id: string;
  name: string;
  sku: string; // QR / Barcode string representation
  category: InventoryCategory;
  quantity: number;
  unit: string;
  minStockLevel: number;
  supplierId: string;
  expiryDate?: string;
  location: string;
  lastRestocked: string;
  pricePerUnit: number; // in BDT
  forecastedDemand?: number; // projected stock required next month
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: "Active" | "Inactive";
}

export interface PurchaseRequest {
  id: string;
  itemId: string;
  itemName: string;
  quantityRequested: number;
  estimatedCost: number;
  supplierId: string;
  supplierName: string;
  requestedBy: string;
  requestDate: string;
  status: "Pending Approval" | "Approved" | "Ordered" | "Delivered" | "Rejected";
  urgency: "Routine" | "Urgent" | "Emergency";
}

export interface DepartmentTransfer {
  id: string;
  itemId: string;
  itemName: string;
  fromDepartment: string;
  toDepartment: string;
  quantity: number;
  requestedBy: string;
  status: "Pending" | "Approved" | "Dispatched" | "Completed" | "Rejected";
  date: string;
}
