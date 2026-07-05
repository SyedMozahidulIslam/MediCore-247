/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Employee, UserRole, Department, AvailabilityStatus } from "../types";

// Raw list of names provided by the user
export const RAW_NAMES = [
  "Salim Rahaman Dipu", "Shahparan Rownak", "Md Wasiul Islam", "Sahriar Hossain Dipto", "Nazmul Hasan", 
  "Mehedi Hasan", "Shakhawat Hossain Shoaib", "Isbatul Tahsin", "Readuanul Farid Fahim", "Tanvir Anjum Rakin", 
  "Fimu Jinat", "Latifa Rahman Mahi", "Nasib Araf", "Nazifa Tasnim", "Akram Hoque Khan", "Ishrak Hossain Toki", 
  "Ra Fee", "Muhammad Naim Khan", "Nuzhat Kamal", "Kawsar Ahmed", "Farabi Ahmed Milon", "Anika Hossain", 
  "Md Fazle Rabby", "Mushfiqur Rahman Papon", "Sumaiya Jannat", "AB Nirob", "Tanvir Rifat", "NakShatra Sharmili", 
  "আনমনাজেরিন ফিজা", "Afif Aiman", "Ibrahim Masum", "Nazmi Akter Sneha", "Honour Chakma", "Burhan Uddin Khan Shuvo", 
  "Fuad Hasan", "Arifur Rahman Arif", "মোঃ সাব্বির হোসেন", "Tajul Islam Rudro", "Md. Jobayer Hossain", 
  "Fahim Mojumder", "Shamsul Hooda", "Tawhid Avik", "Hasibul Hasib", "Shantanur Rahman", "Mubin Raian", 
  "Rabbul Hussein Fahad", "Shahrin Islam Shafi", "Tamim Shadman", "Amit Hasan Khan", "Sajan Sarker", 
  "Nafisa Yesmin", "Shakhawat Hossain", "Fowad Hasan", "Shah Riaj Chowdhury", "Mahamudul Hasan Jiyon", 
  "Suraiya Akter Sammi", "কায়কোবাদ", "Shahidah Shome", "A.S. Tasin", "Chowdhury Jifam Tahmid", "Fahim Rahman", 
  "Mohona Islam Sukonna", "Imtiyaj Muhammad Utsha", "SG Sagor", "Md Arifuzzaman Arif", "Kh Raad", 
  "Jaiefa Islam Toma", "Hannan Maruf", "Mohammad Gias Kamal", "Imtiyaz Moohit", "Shanawaz Hossain Rishad", 
  "Mohammad Shohag Shahariyar", "Eshaat Alam", "Abir Ahammed Chowdhury", "মারুফ উজ জামান", "Tariqul Islam Ayaan", 
  "Md. Salman", "Sayed Arafat", "Rayed Riasat", "Jannatull Fardos", "Tanvin Mahmud Tonmoy", "HR RedOne", 
  "Mottasim Billah Sadi", "Ifteza Ahmed", "Rabiul Hasan", "Subrina Mehenaz", "Sk Abyad", "Mu Mu", 
  "Md Golam Sarwar", "Jawad Hossen Khan Sihan", "Fazle Rabbi", "Fatema Sultana Ratri", "Meem Islam", 
  "Mahedi Hasan Khan", "Israt Jahan", "Abdullah Al Mamun", "Syed Shariful", "Urmy Khandaker", "HR Habib", 
  "Nowshin Zaman", "MD Ashikul Islam", "Shakila Rowshan", "Sayman Mehedi Pritom", "Fiaz Al Abid", 
  "AS Khan Sakib", "Al Sahariar Shawon", "Nafis Anjum Tanim", "Abu Hasib Nirob", "Minul Rekat", 
  "Noorjahan Provati Bhuiya", "Hussain Md Sahariyar", "Tamim Bhuiyan", "Arafat Rahaman Jahin", "Fahim Faysal", 
  "Kiron Rahman", "Md Mahid Alom", "Md Yeasin Nur Rahman", "Kamrul Islam", "Sayedul Karim", "Iftikhar Ahmed", 
  "Maisha Siddiqua Momo", "Najib Hasan Nibir", "Nayeema Islam Nakshi", "Tanbin Nishad", "Islam Saif", 
  "A. Al Mahmud Pias", "Maruf Hasan Robin", "S.M Karimul Hassan", "Mahedi Hasan Nishat", "ফাতেমা সুলতানা রাত্রী", 
  "Nayem Sarker", "Tarif Ishmam Abdullah", "Ahtesam Ul Hoq Chishti", "Rumi Islam Ruhi", "Md Hasanul Haque Rumman", 
  "Sheikh Sifat Roshidi", "Shidratul Muntaha Binte Farooq", "Mh Dîhàñ", "Rakibul Hassan", "Ahamed Shafi", 
  "Nomanul Hasan", "ইসবাতুল ইসলাম", "Farzana Masud Bithi", "Md. Rafi", "Irfan Kabir Abir", "KH Borhan Siyam", 
  "Bijoy Ghosh", "Sumaiya Monir", "Araf Shawon", "Benzir Ahammed Shawon", "Sé Tû", "Moniruzzaman Monir", 
  "Nahiyan Fahad Sayem", "Ashraful Islam", "Shaila Meraz Jhumu", "Hindol Ghose", "Hossain Mazumdar", 
  "Ayesha Akter Papia", "Abdullah Hasan", "Miftahul Jannat", "MAisha Hassan", "Lamiya Mehzabien", 
  "Mahbub Hassan Emon", "Harun Mazumder Anik", "Rahimul Haque Afrad", "Tanha Ahmed Nijhum", "Miraj Hossain", 
  "Taiub Ali", "Tanbir Ahammad Sayem", "Alif Meraj", "Shadman Shakib", "A. F. H Dhrubo", "Md. Mahfuzur Shahed", 
  "Jamiul Muhammad Chashi", "Mahmud Hossain", "MH Rakib", "Fiad Sarowar", "মোঃ ফজলে রাব্বী", "Masud Rana", 
  "Mejbah Chowdhury Riyadh", "MD Ismail Hossain", "Ar Pranto", "Fatema Tuz Johora", "MD AL Rakib", 
  "Morium Bristy", "Shakil Ahmed", "Abdullah Jayed", "Morshed Sagor", "Esfer Sami", "Imtiaj Sajin", 
  "Kawsar Ahamed Rony", "Manif Orin", "Rashidul Hasan Ratul", "Ashiquar Ãñík", "Md Faiaj Bin Rahman", 
  "Salman Farsi", "H R Sifat", "MD Waliullah", "Arafat Tanjim", "Tanvir Ahammed", "Kazi Mohammed Zaber", 
  "Faruque Rumi", "Fahad Bhuiyan", "FN Fazle", "Saydul Haque", "Ritu Minha", "Dewan M Durnto", 
  "Mainul Kaysar", "MD Rezwan Islam", "Shomrat Nur Sani", "Cm Samiul Ayan", "Namira Rahman Barisha", 
  "SU Z An", "Fahmid Hossain Hamim", "Mortoza Hossain Rocky", "Maria Islam", "Joy Nandi Jr.", "Nur Esa Miran", 
  "Antara Alim", "Firoza Khatun", "Abdulla Al Mamun", "Fahim Muntasir Soumyo", "Tofael Ahamed", "ফজলে রাব্বি", 
  "মারিয়া মোহিনী", "RiD MaHir", "Shadid Siyam", "Fahim Ahmed", "Sadaf Kibria Sufal", "Rakibul Islam", 
  "Tanvir Ann Noor", "Suhajabin Leeyana", "Samiul Nafiz", "Mushfiqur Rashid", "Yaminur Rahman Farib", 
  "Tanvir Hasan Prince", "Mithila Mohshin", "Hamim Ruwayfi", "Abu Suffian", "Nujhat Saleh", "Sifat Soha Noor", 
  "Nadira Meem", "Md. Abu Sayem", "Fuad Alvi", "Atif Syed", "Jabir Mahmud Rifat", "Munshi Hasib", 
  "AvRo E ImRan", "Sumiya Akter", "Muhammad Ikram Khan", "Shojib Ahammed", "Symun Shultana", "Trader Sudipta Deb", 
  "Sikder Mahfuz", "Yana Ahmed", "Aklima Hakim Anika", "Mahamudul Hasan", "Jannat Jeni", "Md Ferdous Khan", 
  "Zahur Ovi", "Ankita Mon", "Ariiyan Raz Nahid", "Rehnaf Leon", "Natasha Ahmed", "Sheikh Sajin", 
  "Shawgat Alrazi Supto", "Naimur Rahman", "Šà J Á Ñ", "Sumaya Suimee", "Sumiya Sultana", "Adiba Haque Pronidhi", 
  "Argho Utsho", "Asif Chowdhury", "SM Akash", "Md Minul Islam", "Sh Ismail", "Dr-Jannatul Ferdous Anny", 
  "Nushrat Jahan Chowdhury", "আমাতুল কারিম", "Tanha Nurain Naba", "Shah Amanullah", "Mehran Hossen", 
  "Lutfur Rahman Rana", "Sayed Ibn Matin Sourab", "M TI Rony", "Md. Mainul Hasan Mahin", "Adib Hasan", 
  "F. M Abir Hossain", "Sairat Jamin Shefa", "Mushfikur Islam Siam", "Munim Mubashshir", "Angel Hafsa", 
  "Ema Afsan", "Iqbalur Rahman", "Afeda Oshîn", "Ahammed Sani", "Shahriar Hussain", "A.K. Mohd Hemel Haque", 
  "Hasan Mamun", "বায়তুল আবেদীন বেনিয়াম", "Shanjid Haque Shachchaw", "Ashraful Islam Nayem", "R. A. Shah Sultan", 
  "Al Ifran Lam", "Hasibul Hassan", "Asif Ahmed", "Tashiqur Rahman Irrfan", "Arif Hossain", "Kazi Iftakher Rahman", 
  "Anysha Shawana Sharif", "Mohammad Olid Afzal", "Humayra Afifa Rifa", "Ismail Sunny", "হাসান আল বান্নাহ", 
  "Sakib Al Hasan", "MD Shajalal", "Shahdat Hossain", "Sumit Bosu Raj", "Shourov Haque", "Talukder Alif Mahmood", 
  "Omar Faruq", "Azfar Sadat Khan", "Opu Sultan", "Minhaz Husain", "Jobair Alam", "Ragib Yasir Hashit", 
  "Mehedi Hasan Anim", "Fabiha Tazri Okita", "Jahangir Alam", "Abid Hasan Ovi", "Ahamed Ashik Efty", 
  "Syed Tanvila", "KM Hossain", "Anay Sarker", "Md Abu Sayed Sarker", "Abdullah", "Rahat Bhuiyan", 
  "Rosul SK", "Shahriar Kabir Turja", "Asraful Islam Ashik", "Redowan Khan Hridoy", "Risul Islam Rifat", 
  "Mehedi Ashraf Simanto", "Hadi Uzzaman", "K.M. Mosabbir", "Ah Sam", "Ruman Ahmed", "Md Abdur Rauf", 
  "Rid Dat", "Junayed Alauddin", "Zihad Abdur Rahman", "Rafsan", "Phunsukh Wangdu", "Joy Sarker", 
  "Abu Yousuf Neshad", "Hassan Shuvoo", "Niaz Uddin Rizon", "Iftekher Hossain", "Shamsun Nahar Purnata", 
  "Arif Alam", "Adison Rozario", "Ashrafur Rahman Abid", "Mojahidul Islam Rakib", "Amrita Biswas", 
  "Abrar Faiyaz", "Nawaz Hossain", "Rajib Ashraf", "Anika Z", "Liyana Lia Ahmed", "Arman Jumon", 
  "Afroza Akter Etiy", "Minhuj Uddin Joy", "Juthi Kabir", "Rifat Islam Akash", "Tamjeeda Osman Meghla", 
  "Rubayat Sharmin Barna", "Md Sabur Ahammad Khan", "Kazi Rashidun Mahin", "Nure Tasnim", "Safayet Haque Tayef", 
  "Sayed Golam Rabbani", "Sha Din", "Chowdhury Reza Tanjim", "Shohrab Uddin", "Mehedi Hasan Shawon", 
  "Esrat Jahan", "Mahmudul Irfan", "Osama Islam Abir", "Sumaiya Akter", "Farhana", "Mejbah Ahammad", 
  "Humayun Rashid", "Irfan H Sajid", "Muhaimanul Islam Hemal", "MD Ashraful Islam", "JaHid Hasan Chowdhury", 
  "Jamsony Akter Falgon", "Shara Mahin", "Nabiul Hossain", "Hossain Arfan Rion", "Shahdia Rahman Raisa", 
  "Mohammad Abdulla", "Md. Edrish Prodhan", "Nudrat Fariha Oishee", "Tanjir Ahmed Nadim", "Najmus Sakib", 
  "Nufsat Rifah", "Mahadi Hasan", "Saba Mahzabeen", "Jowel Rana"
];

// Specialties for doctors
const SPECIALTIES = [
  { spec: "Interventional Cardiology", dept: Department.CARDIOLOGY, fee: 1500, floor: "4th Floor", building: "Building A (Cardiology Block)" },
  { spec: "Pediatric Cardiology", dept: Department.CARDIOLOGY, fee: 1200, floor: "4th Floor", building: "Building A (Cardiology Block)" },
  { spec: "Electrophysiology", dept: Department.CARDIOLOGY, fee: 1800, floor: "4th Floor", building: "Building A (Cardiology Block)" },
  { spec: "Clinical Neurology", dept: Department.NEUROLOGY, fee: 1400, floor: "3rd Floor", building: "Building B (Neuro & Trauma)" },
  { spec: "Neurosurgery", dept: Department.NEUROLOGY, fee: 2000, floor: "3rd Floor", building: "Building B (Neuro & Trauma)" },
  { spec: "General Pediatrics", dept: Department.PEDIATRICS, fee: 800, floor: "2nd Floor", building: "Building C (Maternal & Child)" },
  { spec: "Neonatology", dept: Department.PEDIATRICS, fee: 1100, floor: "2nd Floor", building: "Building C (Maternal & Child)" },
  { spec: "Joint Replacement Surgery", dept: Department.ORTHOPEDICS, fee: 1600, floor: "1st Floor", building: "Building D (Orthopedics)" },
  { spec: "Spine Surgery", dept: Department.ORTHOPEDICS, fee: 1900, floor: "1st Floor", building: "Building D (Orthopedics)" },
  { spec: "Surgical Oncology", dept: Department.ONCOLOGY, fee: 1700, floor: "5th Floor", building: "Building E (Oncology Block)" },
  { spec: "Medical Oncology", dept: Department.ONCOLOGY, fee: 1400, floor: "5th Floor", building: "Building E (Oncology Block)" },
  { spec: "Clinical Dermatology", dept: Department.DERMATOLOGY, fee: 900, floor: "Ground Floor", building: "Building F (OPD Wing)" },
  { spec: "Internal Medicine", dept: Department.GENERAL_MEDICINE, fee: 800, floor: "Ground Floor", building: "Building F (OPD Wing)" },
  { spec: "Obstetrics & Gynaecology", dept: Department.GYNAECOLOGY, fee: 1000, floor: "2nd Floor", building: "Building C (Maternal & Child)" },
  { spec: "Laparoscopic Surgery", dept: Department.SURGERY, fee: 1300, floor: "3rd Floor", building: "Building B (Neuro & Trauma)" },
  { spec: "Emergency Triage Care", dept: Department.EMERGENCY, fee: 500, floor: "Ground Floor", building: "Building B (Neuro & Trauma)" }
];

const QUALIFICATIONS = [
  "MBBS, MD, FRCP (London)", "MBBS, MS, MCh (Neurosurgery)", "MBBS, DCH, MD (Pediatrics)",
  "MBBS, MS (Orthopedics), Fellow in Joint Replacement", "MBBS, FCPS (Dermatology)",
  "MBBS, MD, FACC (USA)", "MBBS, FCPS, MS (Gynaecology)", "MBBS, FRCS (Edinburgh)"
];

const SHIFTS = [
  "Morning (06:00 - 14:00)",
  "Evening (14:00 - 22:00)",
  "Night (22:00 - 06:00)"
] as const;

const LANGUAGES = [
  ["English", "Bengali"],
  ["English", "Bengali", "Hindi"],
  ["English", "Bengali", "German"],
  ["English", "Bengali", "Arabic"]
];

const STAR_CATEGORIES = [
  "Senior Consultant (★★★★★)",
  "Specialist (★★★★)",
  "Associate (★★★)",
  "Resident (★★)"
];

// This list maps roles to raw names sequentially to ensure every single name is uniquely represented!
export const getGeneratedEmployees = (): Employee[] => {
  const employees: Employee[] = [];

  // 1. Supreme Admin (Strict Requirement)
  employees.push({
    id: "EMP-001",
    name: "SMI Fahim",
    role: UserRole.SUPREME_ADMIN,
    department: Department.ADMINISTRATION,
    email: "smi.fahim@medicore247.com",
    phone: "+880-1700-000001",
    availability: AvailabilityStatus.AVAILABLE,
    floor: "6th Floor",
    building: "Building G (Executive Command)",
    shift: "Morning (06:00 - 14:00)",
    salary: 250000,
    attendanceStatus: "Present"
  });

  // Assign roles based on the rest of the list
  RAW_NAMES.forEach((name, index) => {
    const id = `EMP-${(index + 2).toString().padStart(3, '0')}`;
    const email = `${name.toLowerCase().replace(/[^a-z]/g, "")}@medicore247.com`;
    const phone = `+880-17${Math.floor(1000000 + Math.random() * 9000000)}`;
    const shift = SHIFTS[index % 3];
    const salary = Math.floor(40000 + (index % 10) * 15000);
    
    // Determine Role
    let role = UserRole.NURSE;
    let department = Department.GENERAL_MEDICINE;
    let specObj: typeof SPECIALTIES[0] | undefined;
    let experience: number | undefined;
    let qualification: string | undefined;
    let fee: number | undefined;
    let rating: number | undefined;
    let starCategory: string | undefined;
    let floor = "1st Floor";
    let building = "Building F (OPD Wing)";

    if (index === 0) {
      role = UserRole.HOSPITAL_DIRECTOR;
      department = Department.ADMINISTRATION;
      floor = "6th Floor";
      building = "Building G (Executive Command)";
    } else if (index >= 1 && index <= 5) {
      role = UserRole.HR_DEPARTMENT;
      department = Department.HR;
      floor = "5th Floor";
      building = "Building G (Executive Command)";
    } else if (index >= 6 && index <= 15) {
      role = UserRole.FRONT_DESK;
      department = Department.ADMINISTRATION;
      floor = "Ground Floor";
      building = "Building F (OPD Wing)";
    } else if (index >= 16 && index <= 95) {
      // Create Doctors (80 Doctors across all specializations)
      role = UserRole.DOCTOR;
      specObj = SPECIALTIES[index % SPECIALTIES.length];
      department = specObj.dept;
      experience = 5 + (index % 25);
      qualification = QUALIFICATIONS[index % QUALIFICATIONS.length];
      fee = specObj.fee;
      floor = specObj.floor;
      building = specObj.building;
      
      // Calculate rating & star category
      rating = 4.0 + (index % 11) * 0.1; // 4.0 to 5.0
      if (rating >= 4.8) starCategory = "★★★★★ Senior Consultant";
      else if (rating >= 4.5) starCategory = "★★★★ Specialist";
      else if (rating >= 4.2) starCategory = "★★★ Associate";
      else starCategory = "★★ Resident";
    } else if (index >= 96 && index <= 160) {
      role = UserRole.NURSE;
      department = index % 2 === 0 ? Department.GENERAL_MEDICINE : Department.EMERGENCY;
      floor = index % 2 === 0 ? "2nd Floor" : "Ground Floor";
      building = "Building B (Neuro & Trauma)";
    } else if (index >= 161 && index <= 180) {
      role = UserRole.PHARMACY;
      department = Department.PHARMACY;
      floor = "Ground Floor";
      building = "Building F (OPD Wing)";
    } else if (index >= 181 && index <= 200) {
      role = UserRole.LABORATORY;
      department = Department.LABORATORY;
      floor = "1st Floor";
      building = "Building E (Oncology Block)";
    } else if (index >= 201 && index <= 215) {
      role = UserRole.RADIOLOGY;
      department = Department.RADIOLOGY;
      floor = "Ground Floor";
      building = "Building E (Oncology Block)";
    } else if (index >= 216 && index <= 230) {
      role = UserRole.AMBULANCE_TEAM;
      department = Department.AMBULANCE;
      floor = "Basement Parking";
      building = "Building H (Ambulance Garage)";
    } else if (index >= 231 && index <= 245) {
      role = UserRole.EMERGENCY_DEPARTMENT;
      department = Department.EMERGENCY;
      floor = "Ground Floor";
      building = "Building B (Neuro & Trauma)";
    } else if (index >= 246 && index <= 255) {
      role = UserRole.OT_MANAGEMENT;
      department = Department.SURGERY;
      floor = "3rd Floor";
      building = "Building B (Neuro & Trauma)";
    } else {
      role = UserRole.FINANCE;
      department = Department.FINANCE;
      floor = "1st Floor";
      building = "Building G (Executive Command)";
    }

    // Assign dynamic availability
    const availabilities = [
      AvailabilityStatus.AVAILABLE,
      AvailabilityStatus.IN_CONSULTATION,
      AvailabilityStatus.ON_SURGERY,
      AvailabilityStatus.EMERGENCY,
      AvailabilityStatus.BREAK,
      AvailabilityStatus.OFFLINE
    ];
    // Keep most available
    const availability = index % 5 === 0 ? availabilities[index % availabilities.length] : AvailabilityStatus.AVAILABLE;

    const attendances = ["Present", "Absent", "On Leave"] as const;
    const attendanceStatus = index % 15 === 0 ? attendances[1] : (index % 25 === 0 ? attendances[2] : attendances[0]);

    employees.push({
      id,
      name,
      role,
      department,
      specialization: specObj?.spec,
      experience,
      qualification,
      availability,
      floor,
      building,
      languages: LANGUAGES[index % LANGUAGES.length],
      fee,
      rating,
      starCategory,
      email,
      phone,
      shift,
      salary,
      attendanceStatus,
      skills: specObj ? [specObj.spec, "Clinical Decision Support", "Patient Empathy"] : ["Teamwork", "EHR Systems"]
    });
  });

  return employees;
};

export const employeesData = getGeneratedEmployees();
