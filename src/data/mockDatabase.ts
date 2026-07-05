/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Patient, Bed, Appointment, Medicine, 
  LaboratoryTest, RadiologyStudy, OperationTheatreSession, 
  Ambulance, CharityVerification, Department, AvailabilityStatus, UserRole
} from "../types";
import { employeesData } from "./employees";

// Extract doctors list for mappings
const doctors = employeesData.filter(e => e.role === UserRole.DOCTOR);

export const mockBeds: Bed[] = [
  { id: "BED-ICU-101", number: "ICU-101", type: "ICU", floor: "3rd Floor", building: "Building B", status: "Occupied", patientId: "PAT-001" },
  { id: "BED-ICU-102", number: "ICU-102", type: "ICU", floor: "3rd Floor", building: "Building B", status: "Occupied", patientId: "PAT-002" },
  { id: "BED-ICU-103", number: "ICU-103", type: "ICU", floor: "3rd Floor", building: "Building B", status: "Available" },
  { id: "BED-ICU-104", number: "ICU-104", type: "ICU", floor: "3rd Floor", building: "Building B", status: "Maintenance" },
  { id: "BED-GW-201", number: "GW-201", type: "General Ward", floor: "2nd Floor", building: "Building C", status: "Occupied", patientId: "PAT-003" },
  { id: "BED-GW-202", number: "GW-202", type: "General Ward", floor: "2nd Floor", building: "Building C", status: "Occupied", patientId: "PAT-004" },
  { id: "BED-GW-203", number: "GW-203", type: "General Ward", floor: "2nd Floor", building: "Building C", status: "Available" },
  { id: "BED-GW-204", number: "GW-204", type: "General Ward", floor: "2nd Floor", building: "Building C", status: "Available" },
  { id: "BED-GW-205", number: "GW-205", type: "General Ward", floor: "2nd Floor", building: "Building C", status: "Available" },
  { id: "BED-SP-301", number: "SP-301", type: "Semi-Private", floor: "2nd Floor", building: "Building F", status: "Occupied", patientId: "PAT-005" },
  { id: "BED-SP-302", number: "SP-302", type: "Semi-Private", floor: "2nd Floor", building: "Building F", status: "Available" },
  { id: "BED-EM-001", number: "ER-101", type: "Emergency", floor: "Ground Floor", building: "Building B", status: "Occupied", patientId: "PAT-006" },
  { id: "BED-EM-002", number: "ER-102", type: "Emergency", floor: "Ground Floor", building: "Building B", status: "Occupied", patientId: "PAT-007" },
  { id: "BED-EM-003", number: "ER-103", type: "Emergency", floor: "Ground Floor", building: "Building B", status: "Available" }
];

export const mockPatients: Patient[] = [
  {
    id: "PAT-001",
    name: "Abdur Rahim",
    age: 58,
    gender: "Male",
    bloodType: "A+",
    phone: "+880-1712-454589",
    email: "abdur.rahim@example.com",
    address: "Mirpur-10, Dhaka",
    insuranceProvider: "Delta Life Insurance",
    insurancePolicyNo: "DL-908722-A",
    freeTreatmentEligible: false,
    status: "Admitted",
    assignedDoctorId: doctors[0]?.id || "EMP-017",
    bedId: "BED-ICU-101",
    admissionDate: "2026-06-28",
    vitals: { bp: "140/90", temp: "99.1 F", pulse: "88 bpm", spO2: "94%", lastUpdated: "2 mins ago" },
    medicalHistory: [
      { diagnosis: "Acute Coronary Syndrome", date: "2026-06-28", notes: "Admitted post-angioplasty. Needs continuous cardiac rhythm monitoring." },
      { diagnosis: "Hypertension", date: "2020-04-12", notes: "Chronic hypertension under daily Losartan therapy." }
    ]
  },
  {
    id: "PAT-002",
    name: "Sultana Begum",
    age: 64,
    gender: "Female",
    bloodType: "B-",
    phone: "+880-1819-333444",
    email: "sultana.b@example.com",
    address: "Banani, Dhaka",
    insuranceProvider: "MetLife Al-Amanah",
    insurancePolicyNo: "ML-334211",
    freeTreatmentEligible: false,
    status: "Admitted",
    assignedDoctorId: doctors[1]?.id || "EMP-018",
    bedId: "BED-ICU-102",
    admissionDate: "2026-07-01",
    vitals: { bp: "115/75", temp: "101.4 F", pulse: "104 bpm", spO2: "92%", lastUpdated: "5 mins ago" },
    medicalHistory: [
      { diagnosis: "Severe Lobar Pneumonia", date: "2026-07-01", notes: "Placed on low-flow oxygen. Responding well to IV Ceftriaxone." }
    ]
  },
  {
    id: "PAT-003",
    name: "Kabir Hossain",
    age: 42,
    gender: "Male",
    bloodType: "O+",
    phone: "+880-1511-909088",
    email: "kabir.hoss@example.com",
    address: "Dhanmondi, Dhaka",
    freeTreatmentEligible: true,
    freeTreatmentReason: "Government Poor Medical Aid Program (Verified)",
    status: "Admitted",
    assignedDoctorId: doctors[2]?.id || "EMP-019",
    bedId: "BED-GW-201",
    admissionDate: "2026-07-03",
    vitals: { bp: "120/80", temp: "98.6 F", pulse: "72 bpm", spO2: "98%", lastUpdated: "1 hour ago" },
    medicalHistory: [
      { diagnosis: "Hernioplasty Recovery", date: "2026-07-03", notes: "Post-op general surgical floor admission. Incision dry and clean." }
    ]
  },
  {
    id: "PAT-004",
    name: "Jahanara Akhter",
    age: 29,
    gender: "Female",
    bloodType: "AB+",
    phone: "+880-1913-445566",
    email: "jahanara.a@example.com",
    address: "Uttara, Dhaka",
    insuranceProvider: "Green Delta Insurance",
    insurancePolicyNo: "GD-778841",
    freeTreatmentEligible: false,
    status: "Admitted",
    assignedDoctorId: doctors[3]?.id || "EMP-020",
    bedId: "BED-GW-202",
    admissionDate: "2026-07-02",
    vitals: { bp: "110/70", temp: "98.4 F", pulse: "68 bpm", spO2: "99%", lastUpdated: "12 mins ago" },
    medicalHistory: [
      { diagnosis: "Postpartum Recovery", date: "2026-07-02", notes: "Healthy delivery of baby boy. Routine lactation support and recovery checks." }
    ]
  },
  {
    id: "PAT-005",
    name: "Sufia Khatun",
    age: 72,
    gender: "Female",
    bloodType: "O-",
    phone: "+880-1733-112233",
    email: "sufia.k@example.com",
    address: "Mohakhali, Dhaka",
    freeTreatmentEligible: true,
    freeTreatmentReason: "Social Welfare Charity Board Fund (Approved)",
    status: "Admitted",
    assignedDoctorId: doctors[4]?.id || "EMP-021",
    bedId: "BED-SP-301",
    admissionDate: "2026-07-03",
    vitals: { bp: "155/95", temp: "98.2 F", pulse: "80 bpm", spO2: "96%", lastUpdated: "35 mins ago" },
    medicalHistory: [
      { diagnosis: "Chronic Kidney Disease Stage IV", date: "2026-07-03", notes: "Admitted for emergency hemodialysis access revision." }
    ]
  },
  {
    id: "PAT-006",
    name: "Nusrat Jahan",
    age: 23,
    gender: "Female",
    bloodType: "A-",
    phone: "+880-1615-556677",
    email: "nusrat.j@example.com",
    address: "Gulshan, Dhaka",
    freeTreatmentEligible: false,
    status: "Emergency Queue",
    assignedDoctorId: doctors[5]?.id || "EMP-022",
    bedId: "BED-EM-001",
    admissionDate: "2026-07-04",
    vitals: { bp: "100/60", temp: "102.3 F", pulse: "112 bpm", spO2: "95%", lastUpdated: "Just now" },
    medicalHistory: [
      { diagnosis: "Acute Appendicitis", date: "2026-07-04", notes: "Emergency presentation. Severe right lower quadrant guarding. Pending surgical consult." }
    ]
  },
  {
    id: "PAT-007",
    name: "Kamrul Islam",
    age: 35,
    gender: "Male",
    bloodType: "B+",
    phone: "+880-1798-223344",
    email: "kamrul.is@example.com",
    address: "Rampura, Dhaka",
    freeTreatmentEligible: true,
    freeTreatmentReason: "Ambulance trauma disaster support",
    status: "Emergency Queue",
    assignedDoctorId: doctors[6]?.id || "EMP-023",
    bedId: "BED-EM-002",
    admissionDate: "2026-07-04",
    vitals: { bp: "135/85", temp: "98.6 F", pulse: "95 bpm", spO2: "97%", lastUpdated: "Just now" },
    medicalHistory: [
      { diagnosis: "Compound Fracture Right Femur", date: "2026-07-04", notes: "RTA victim. Stabilized splinting done. Scheduled for emergency ORIF." }
    ]
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: "APT-001",
    patientId: "PAT-OPD-1",
    patientName: "Sumon Ahmed",
    doctorId: doctors[0]?.id || "EMP-017",
    doctorName: doctors[0]?.name || "Dr. Salim",
    department: doctors[0]?.department || Department.CARDIOLOGY,
    date: "2026-07-05",
    timeSlot: "09:30 AM - 10:00 AM",
    status: "Scheduled",
    tokenNumber: "T-CAR-01",
    type: "Consultation"
  },
  {
    id: "APT-002",
    patientId: "PAT-OPD-2",
    patientName: "Meherun Nesa",
    doctorId: doctors[2]?.id || "EMP-019",
    doctorName: doctors[2]?.name || "Dr. Kabir",
    department: doctors[2]?.department || Department.PEDIATRICS,
    date: "2026-07-05",
    timeSlot: "10:15 AM - 10:45 AM",
    status: "Scheduled",
    tokenNumber: "T-PED-03",
    type: "Follow-up"
  },
  {
    id: "APT-003",
    patientId: "PAT-OPD-3",
    patientName: "Mofizur Rahman",
    doctorId: doctors[4]?.id || "EMP-021",
    doctorName: doctors[4]?.name || "Dr. Sufia",
    department: doctors[4]?.department || Department.ORTHOPEDICS,
    date: "2026-07-05",
    timeSlot: "11:00 AM - 11:30 AM",
    status: "In-Progress",
    tokenNumber: "T-ORT-05",
    type: "Consultation"
  },
  {
    id: "APT-004",
    patientId: "PAT-OPD-4",
    patientName: "Zinat Ara",
    doctorId: doctors[5]?.id || "EMP-022",
    doctorName: doctors[5]?.name || "Dr. Nusrat",
    department: doctors[5]?.department || Department.ONCOLOGY,
    date: "2026-07-05",
    timeSlot: "12:00 PM - 12:30 PM",
    status: "Scheduled",
    tokenNumber: "T-ONC-02",
    type: "Diagnostic Test"
  }
];

export const mockMedicines: Medicine[] = [
  {
    id: "MED-001",
    name: "Napa Extend",
    genericName: "Paracetamol BP 665mg",
    category: "Tablet",
    stock: 25000,
    minStock: 5000,
    expiryDate: "2028-09-30",
    batchNumber: "NP-9882",
    supplier: "Beximco Pharmaceuticals Ltd.",
    location: "Aisle A",
    price: 3.5,
    alternatives: ["Ace XR", "Fast Extended", "Parapyrol"]
  },
  {
    id: "MED-002",
    name: "Seclo 20",
    genericName: "Omeprazole USP 20mg",
    category: "Capsule",
    stock: 18000,
    minStock: 3000,
    expiryDate: "2028-02-15",
    batchNumber: "SC-1002",
    supplier: "Square Pharmaceuticals PLC",
    location: "Aisle B",
    price: 6.0,
    alternatives: ["Losectil 20", "Proseptin 20", "Vergel 20"]
  },
  {
    id: "MED-003",
    name: "Ceftron 1g IV",
    genericName: "Ceftriaxone Sodium USP 1g",
    category: "Injection",
    stock: 450,
    minStock: 500, // Trigger restock alert
    expiryDate: "2027-05-12",
    batchNumber: "CF-5541",
    supplier: "Incepta Pharmaceuticals Ltd.",
    location: "Cold Storage",
    price: 185.0,
    alternatives: ["Triject 1g", "Rocephin 1g", "Xone 1g"]
  },
  {
    id: "MED-004",
    name: "Fexo 120",
    genericName: "Fexofenadine HCl 120mg",
    category: "Tablet",
    stock: 9000,
    minStock: 2000,
    expiryDate: "2028-12-25",
    batchNumber: "FX-1120",
    supplier: "Acme Laboratories Ltd.",
    location: "Aisle C",
    price: 9.0,
    alternatives: ["Telfast 120", "Alatrol 10", "Fenadin 120"]
  },
  {
    id: "MED-005",
    name: "Tusca Syrup",
    genericName: "Dextromethorphan + Guaifenesin",
    category: "Syrup",
    stock: 150,
    minStock: 300, // Trigger restock alert
    expiryDate: "2026-11-30", // Expiry alert soon
    batchNumber: "TS-0091",
    supplier: "Sandoz Novartis Group",
    location: "Aisle B",
    price: 85.0,
    alternatives: ["Adryll", "Brofex", "Sedil Syrup"]
  }
];

export const mockLaboratoryTests: LaboratoryTest[] = [
  {
    id: "LAB-001",
    patientId: "PAT-001",
    patientName: "Abdur Rahim",
    testName: "High Sensitivity Troponin I",
    category: "Biochemistry",
    requestedByDoctorId: "EMP-017",
    requestedByDoctorName: doctors[0]?.name || "Dr. Salim",
    requestedDate: "2026-07-04",
    status: "Completed",
    resultDate: "2026-07-04",
    sampleBarCode: "BC-LAB-99018",
    results: [
      { parameter: "Troponin I", value: "48.2", referenceRange: "0.0 - 0.04", unit: "ng/mL", isAbnormal: true },
      { parameter: "CK-MB", value: "32.4", referenceRange: "0.0 - 5.0", unit: "ng/mL", isAbnormal: true }
    ]
  },
  {
    id: "LAB-002",
    patientId: "PAT-002",
    patientName: "Sultana Begum",
    testName: "Complete Blood Count (CBC)",
    category: "Hematology",
    requestedByDoctorId: "EMP-018",
    requestedByDoctorName: doctors[1]?.name || "Dr. Sultana",
    requestedDate: "2026-07-04",
    status: "Processing",
    sampleBarCode: "BC-LAB-11045"
  },
  {
    id: "LAB-003",
    patientId: "PAT-005",
    patientName: "Sufia Khatun",
    testName: "Serum Creatinine & Electrolytes",
    category: "Biochemistry",
    requestedByDoctorId: "EMP-021",
    requestedByDoctorName: doctors[4]?.name || "Dr. Sufia",
    requestedDate: "2026-07-04",
    status: "Completed",
    resultDate: "2026-07-04",
    sampleBarCode: "BC-LAB-33421",
    results: [
      { parameter: "Serum Creatinine", value: "4.8", referenceRange: "0.6 - 1.2", unit: "mg/dL", isAbnormal: true },
      { parameter: "Potassium (K+)", value: "5.6", referenceRange: "3.5 - 5.0", unit: "mmol/L", isAbnormal: true },
      { parameter: "Sodium (Na+)", value: "134", referenceRange: "135 - 145", unit: "mmol/L", isAbnormal: false }
    ]
  }
];

export const mockRadiologyStudies: RadiologyStudy[] = [
  {
    id: "RAD-001",
    patientId: "PAT-002",
    patientName: "Sultana Begum",
    studyType: "X-Ray",
    requestedByDoctorId: "EMP-018",
    requestedByDoctorName: doctors[1]?.name || "Dr. Sultana",
    requestedDate: "2026-07-03",
    status: "Completed",
    findings: "Consolidation with air bronchograms in the right lower lung lobe. Suggestive of acute lobar pneumonia. No pleural effusion or cardiomegaly detected.",
    technicianName: "Fiaz Al Abid"
  },
  {
    id: "RAD-002",
    patientId: "PAT-007",
    patientName: "Kamrul Islam",
    studyType: "CT Scan",
    requestedByDoctorId: "EMP-023",
    requestedByDoctorName: doctors[6]?.name || "Dr. Kamrul",
    requestedDate: "2026-07-04",
    status: "Processing",
    technicianName: "Al Sahariar Shawon"
  }
];

export const mockOTSessions: OperationTheatreSession[] = [
  {
    id: "OTS-001",
    patientId: "PAT-007",
    patientName: "Kamrul Islam",
    surgeryName: "ORIF Femur Reconstruction",
    primarySurgeonId: doctors[4]?.id || "EMP-021",
    primarySurgeonName: doctors[4]?.name || "Dr. Sufia (Orthopedics)",
    assistantSurgeonName: "Dr. Tanbin Nishad",
    anesthesiologistName: "Dr. Sheikh Sifat Roshidi",
    scrubNurseName: "Nurse Latifa Rahman Mahi",
    roomNumber: "OT Room-03",
    status: "Preparation",
    startTime: "23:00",
    estimatedDuration: "2.5 Hours"
  },
  {
    id: "OTS-002",
    patientId: "PAT-003",
    patientName: "Kabir Hossain",
    surgeryName: "Laparoscopic Hernioplasty",
    primarySurgeonId: doctors[6]?.id || "EMP-023",
    primarySurgeonName: doctors[6]?.name || "Dr. Kamrul",
    assistantSurgeonName: "Dr. Maruf Hasan Robin",
    anesthesiologistName: "Dr. Rumi Islam Ruhi",
    scrubNurseName: "Nurse Sumaiya Jannat",
    roomNumber: "OT Room-01",
    status: "Completed",
    startTime: "16:00",
    estimatedDuration: "1.5 Hours",
    elapsedTime: "Completed in 1h 20m"
  }
];

export const mockAmbulances: Ambulance[] = [
  {
    id: "AMB-001",
    vehicleNumber: "DHAKA METRO-CHA-55-9011",
    type: "Advanced Life Support (ALS)",
    driverName: "Kiron Rahman",
    driverPhone: "+880-1711-229988",
    status: "Heading to Hospital",
    currentLatitude: 23.8103,
    currentLongitude: 90.4125,
    destinationName: "MediCore Emergency Gate",
    fuelLevel: 85,
    nextMaintenance: "2026-08-10"
  },
  {
    id: "AMB-002",
    vehicleNumber: "DHAKA METRO-CHA-22-1456",
    type: "Basic Life Support (BLS)",
    driverName: "Md Mahid Alom",
    driverPhone: "+880-1923-456789",
    status: "Dispatched",
    currentLatitude: 23.7561,
    currentLongitude: 90.3872,
    destinationName: "Rampura Intersection Accident",
    fuelLevel: 62,
    nextMaintenance: "2026-07-25"
  },
  {
    id: "AMB-003",
    vehicleNumber: "DHAKA METRO-CHA-11-8899",
    type: "Advanced Life Support (ALS)",
    driverName: "Md Yeasin Nur Rahman",
    driverPhone: "+880-1512-334455",
    status: "Available",
    currentLatitude: 23.8223,
    currentLongitude: 90.4219,
    fuelLevel: 94,
    nextMaintenance: "2026-08-01"
  }
];

export const mockCharityVerifications: CharityVerification[] = [
  {
    id: "CHV-001",
    patientId: "PAT-003",
    patientName: "Kabir Hossain",
    annualIncome: 45000, // Very low income
    supportingDocument: "NID/Income Certificate",
    verifiedByAdminName: "Shahparan Rownak",
    status: "Verified",
    approvedAidType: "Free Surgery & ICU Support",
    donationFundSponsor: "Kuwait Relief Charity Alliance"
  },
  {
    id: "CHV-002",
    patientId: "PAT-005",
    patientName: "Sufia Khatun",
    annualIncome: 30000,
    supportingDocument: "Social Welfare Card",
    verifiedByAdminName: "Md Wasiul Islam",
    status: "Verified",
    approvedAidType: "100% Free Medicine & Consultation",
    donationFundSponsor: "MediCore Zakat & Charity Trust"
  }
];
