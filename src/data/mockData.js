// Mock Data for MediWaste AI
export const HOSPITAL_DEPARTMENTS = [
  { id: 'ICU', name: 'Intensive Care Unit (ICU)', floor: '3rd Floor - Wing A', code: 'ICU' },
  { id: 'WARD_3', name: 'Ward 3 (Post-Op Surgical)', floor: '2nd Floor - Wing B', code: 'W3' },
  { id: 'OT_1', name: 'Operation Theatre 1 (General)', floor: '4th Floor - Clean Zone', code: 'OT1' },
  { id: 'OT_2', name: 'Operation Theatre 2 (Orthopedics)', floor: '4th Floor - Clean Zone', code: 'OT2' },
  { id: 'EMERGENCY', name: 'Emergency & Trauma Center', floor: 'Ground Floor - Bay 1', code: 'ER' },
  { id: 'ONCOLOGY', name: 'Oncology Daycare Unit', floor: '1st Floor - Wing C', code: 'ONC' },
  { id: 'PATHOLOGY', name: 'Pathology & Microbiology Lab', floor: 'Basement 1', code: 'LAB' },
  { id: 'PEDIATRIC', name: 'Pediatric Care Ward', floor: '2nd Floor - Wing A', code: 'PED' },
  { id: 'DIALYSIS', name: 'Hemodialysis Unit', floor: '1st Floor - Wing B', code: 'DIA' }
];

export const DEMO_USERS = [
  {
    id: 'usr-admin-1',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@meditrack.hospital',
    role: 'Admin',
    department: 'Infection Control & Safety',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-staff-1',
    name: 'Mark Peterson, RN',
    email: 'nurse.mark@meditrack.hospital',
    role: 'Staff',
    department: 'Intensive Care Unit (ICU)',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-staff-2',
    name: 'Priya Sharma, CST',
    email: 'tech.priya@meditrack.hospital',
    role: 'Staff',
    department: 'Operation Theatre 1',
    avatar: 'https://images.unsplash.com/photo-1594824813576-90c74b1cb9a9?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_DEPARTMENT_BINS = [
  // ICU Bins
  {
    id: 'BIN-ICU-YEL-01',
    binCode: 'Y-ICU-01',
    departmentId: 'ICU',
    category: 'YELLOW',
    locationTag: 'Bay A (Beds 1-6)',
    maxCapacityKg: 20.0,
    currentFillKg: 13.5,
    lastEmptied: '2026-09-06T08:30:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-ICU-YEL-02',
    binCode: 'Y-ICU-02',
    departmentId: 'ICU',
    category: 'YELLOW',
    locationTag: 'Bay B (Beds 7-12)',
    maxCapacityKg: 20.0,
    currentFillKg: 4.2,
    lastEmptied: '2026-09-06T14:00:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-ICU-RED-01',
    binCode: 'R-ICU-01',
    departmentId: 'ICU',
    category: 'RED',
    locationTag: 'Central Nurse Station',
    maxCapacityKg: 18.0,
    currentFillKg: 15.2, // ~84% Warning
    lastEmptied: '2026-09-06T06:00:00Z',
    status: 'Warning'
  },
  {
    id: 'BIN-ICU-RED-02',
    binCode: 'R-ICU-02',
    departmentId: 'ICU',
    category: 'RED',
    locationTag: 'Isolation Bay',
    maxCapacityKg: 18.0,
    currentFillKg: 3.1,
    lastEmptied: '2026-09-06T15:30:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-ICU-WHT-01',
    binCode: 'W-ICU-01',
    departmentId: 'ICU',
    category: 'WHITE',
    locationTag: 'Medication Prep Counter',
    maxCapacityKg: 10.0,
    currentFillKg: 6.8,
    lastEmptied: '2026-09-05T20:00:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-ICU-BLU-01',
    binCode: 'B-ICU-01',
    departmentId: 'ICU',
    category: 'BLUE',
    locationTag: 'Central Medicine Utility',
    maxCapacityKg: 15.0,
    currentFillKg: 5.0,
    lastEmptied: '2026-09-06T09:00:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-ICU-BLK-01',
    binCode: 'K-ICU-01',
    departmentId: 'ICU',
    category: 'BLACK',
    locationTag: 'Corridor Entry',
    maxCapacityKg: 25.0,
    currentFillKg: 12.0,
    lastEmptied: '2026-09-06T12:00:00Z',
    status: 'Operational'
  },

  // Ward 3 Bins
  {
    id: 'BIN-W3-YEL-01',
    binCode: 'Y-W3-01',
    departmentId: 'WARD_3',
    category: 'YELLOW',
    locationTag: 'Dressing & Treatment Room',
    maxCapacityKg: 20.0,
    currentFillKg: 18.6, // 93% Critical
    lastEmptied: '2026-09-05T18:00:00Z',
    status: 'Critical'
  },
  {
    id: 'BIN-W3-YEL-02',
    binCode: 'Y-W3-02',
    departmentId: 'WARD_3',
    category: 'YELLOW',
    locationTag: 'Sub-utility Station West',
    maxCapacityKg: 20.0,
    currentFillKg: 2.5,
    lastEmptied: '2026-09-06T16:00:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-W3-RED-01',
    binCode: 'R-W3-01',
    departmentId: 'WARD_3',
    category: 'RED',
    locationTag: 'Main Nursing Desk',
    maxCapacityKg: 18.0,
    currentFillKg: 8.5,
    lastEmptied: '2026-09-06T10:00:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-W3-WHT-01',
    binCode: 'W-W3-01',
    departmentId: 'WARD_3',
    category: 'WHITE',
    locationTag: 'Injection Tray Station',
    maxCapacityKg: 10.0,
    currentFillKg: 3.2,
    lastEmptied: '2026-09-06T11:00:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-W3-BLU-01',
    binCode: 'B-W3-01',
    departmentId: 'WARD_3',
    category: 'BLUE',
    locationTag: 'Dirty Utility Room',
    maxCapacityKg: 15.0,
    currentFillKg: 6.4,
    lastEmptied: '2026-09-06T09:30:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-W3-BLK-01',
    binCode: 'K-W3-01',
    departmentId: 'WARD_3',
    category: 'BLACK',
    locationTag: 'Visitor Waiting Area',
    maxCapacityKg: 25.0,
    currentFillKg: 9.0,
    lastEmptied: '2026-09-06T14:00:00Z',
    status: 'Operational'
  },

  // OT 1 Bins
  {
    id: 'BIN-OT1-YEL-01',
    binCode: 'Y-OT1-01',
    departmentId: 'OT_1',
    category: 'YELLOW',
    locationTag: 'Surgical Scrub Zone',
    maxCapacityKg: 25.0,
    currentFillKg: 8.0,
    lastEmptied: '2026-09-06T13:00:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-OT1-RED-01',
    binCode: 'R-OT1-01',
    departmentId: 'OT_1',
    category: 'RED',
    locationTag: 'Anesthesia Cart Area',
    maxCapacityKg: 20.0,
    currentFillKg: 11.0,
    lastEmptied: '2026-09-06T12:00:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-OT1-WHT-01',
    binCode: 'W-OT1-01',
    departmentId: 'OT_1',
    category: 'WHITE',
    locationTag: 'Sharps Table / Mayo Stand',
    maxCapacityKg: 12.0,
    currentFillKg: 4.5,
    lastEmptied: '2026-09-06T11:30:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-OT1-BLU-01',
    binCode: 'B-OT1-01',
    departmentId: 'OT_1',
    category: 'BLUE',
    locationTag: 'Sterile Processing Sump',
    maxCapacityKg: 15.0,
    currentFillKg: 7.0,
    lastEmptied: '2026-09-06T10:00:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-OT1-BLK-01',
    binCode: 'K-OT1-01',
    departmentId: 'OT_1',
    category: 'BLACK',
    locationTag: 'Outer Scrub Air-Lock',
    maxCapacityKg: 20.0,
    currentFillKg: 5.0,
    lastEmptied: '2026-09-06T15:00:00Z',
    status: 'Operational'
  },

  // Emergency Room Bins
  {
    id: 'BIN-ER-YEL-01',
    binCode: 'Y-ER-01',
    departmentId: 'EMERGENCY',
    category: 'YELLOW',
    locationTag: 'Resuscitation Bay 1',
    maxCapacityKg: 25.0,
    currentFillKg: 19.5, // 78% Warning
    lastEmptied: '2026-09-06T07:00:00Z',
    status: 'Warning'
  },
  {
    id: 'BIN-ER-RED-01',
    binCode: 'R-ER-01',
    departmentId: 'EMERGENCY',
    category: 'RED',
    locationTag: 'Trauma Bay 2',
    maxCapacityKg: 20.0,
    currentFillKg: 7.8,
    lastEmptied: '2026-09-06T14:00:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-ER-WHT-01',
    binCode: 'W-ER-01',
    departmentId: 'EMERGENCY',
    category: 'WHITE',
    locationTag: 'Rapid IV Access Station',
    maxCapacityKg: 10.0,
    currentFillKg: 5.5,
    lastEmptied: '2026-09-06T13:30:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-ER-BLU-01',
    binCode: 'B-ER-01',
    departmentId: 'EMERGENCY',
    category: 'BLUE',
    locationTag: 'Crash Cart Station',
    maxCapacityKg: 15.0,
    currentFillKg: 3.2,
    lastEmptied: '2026-09-06T15:00:00Z',
    status: 'Operational'
  },
  {
    id: 'BIN-ER-BLK-01',
    binCode: 'K-ER-01',
    departmentId: 'EMERGENCY',
    category: 'BLACK',
    locationTag: 'Triage Desk',
    maxCapacityKg: 30.0,
    currentFillKg: 14.0,
    lastEmptied: '2026-09-06T12:30:00Z',
    status: 'Operational'
  }
];

// Preset Medical Waste Scenarios for Instant AI Testing
export const PRESET_WASTE_SAMPLES = [
  {
    id: 'sample-sharps-needle',
    title: 'Hypodermic Syringe with Fixed Needle',
    category: 'WHITE',
    detectedType: 'Sharps / Contaminated Needle',
    confidence: 0.984,
    description: 'Disposable 5ml hypodermic syringe with 21G bevel needle attached, residual saline solution observed.',
    estimatedWeightKg: 0.15,
    hazardRisk: 'Puncture wound & bloodborne pathogen transmission (HBV/HCV/HIV)',
    colorCode: 'White',
    treatmentRule: 'Puncture-proof translucent sharps container. Dry heat sterilization / encapsulation.',
    imageBadge: 'Needle & Syringe',
    thumbnail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'sample-infectious-gauze',
    title: 'Blood-Soaked Surgical Gauze & Cotton Swabs',
    category: 'YELLOW',
    detectedType: 'Infectious / Anatomical Soiled Waste',
    confidence: 0.965,
    description: 'Post-operative wound dressing pads and cotton balls saturated with biological fluid/blood.',
    estimatedWeightKg: 0.45,
    hazardRisk: 'Biohazard pathogen infection vector. Highly infectious biological material.',
    colorCode: 'Yellow',
    treatmentRule: 'Non-chlorinated yellow plastic biohazard bag. High-temperature incineration or plasma pyrolysis.',
    imageBadge: 'Bloodied Gauze',
    thumbnail: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'sample-plastic-iv-tubing',
    title: 'IV Infusion Line & Empty Saline Bottle',
    category: 'RED',
    detectedType: 'Contaminated Recyclable Plastics',
    confidence: 0.972,
    description: 'Polypropylene 500ml normal saline bottle, roller clamp and flexible PVC tubing without metal needle.',
    estimatedWeightKg: 0.35,
    hazardRisk: 'Contaminated clinical plastic apparatus; non-puncture recyclable.',
    colorCode: 'Red',
    treatmentRule: 'Red autoclavable bag. Autoclaving followed by shredding and certified plastics recycling.',
    imageBadge: 'IV Set & Bottle',
    thumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'sample-glass-ampoules',
    title: 'Broken Glass Antibiotic Ampoules & Vials',
    category: 'BLUE',
    detectedType: 'Glassware & Medicine Ampoules',
    confidence: 0.958,
    description: 'Clear borosilicate glass medicine ampoules (opened) and fractured glass vials with trace antibiotic residue.',
    estimatedWeightKg: 0.28,
    hazardRisk: 'Laceration hazard & minor chemical exposure from glass fragments.',
    colorCode: 'Blue',
    treatmentRule: 'Puncture-resistant blue box / container with blue marking. Sodium hypochlorite disinfection / glass recycling.',
    imageBadge: 'Glass Ampoules',
    thumbnail: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'sample-general-paper',
    title: 'Clean Office Paper, Wrappers & Food Packaging',
    category: 'BLACK',
    detectedType: 'General Non-Hazardous Municipal Waste',
    confidence: 0.991,
    description: 'Dry sterile glove outer packaging cartons, office printouts, paper hand towels, and clean food containers.',
    estimatedWeightKg: 0.60,
    hazardRisk: 'None. Safe domestic/municipal refuse.',
    colorCode: 'Black',
    treatmentRule: 'Black garbage bag. Municipal solid waste disposal / municipal recycling.',
    imageBadge: 'General Trash',
    thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'sample-scalpel-blade',
    title: 'Disposable Surgical Scalpel & Suture Needle',
    category: 'WHITE',
    detectedType: 'Sharps / Surgical Blade',
    confidence: 0.988,
    description: 'Stainless steel #10 scalpel blade and curved suture needle with trace blood coagulum.',
    estimatedWeightKg: 0.08,
    hazardRisk: 'Acute laceration and deep puncture biohazard risk.',
    colorCode: 'White',
    treatmentRule: 'Rigid puncture-proof translucent sharps box. Encapsulation / dry heat sterilisation.',
    imageBadge: 'Scalpel & Suture',
    thumbnail: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'sample-chemo-blister',
    title: 'Cytotoxic & Expired Pharmaceutical Blister Pack',
    category: 'YELLOW',
    detectedType: 'Cytotoxic / Expired Pharmaceutical',
    confidence: 0.947,
    description: 'Expired cytotoxic antineoplastic chemotherapy tablets in foil blister pack, labeled biohazard.',
    estimatedWeightKg: 0.20,
    hazardRisk: 'Mutagenic/teratogenic chemical toxicity; hazardous pharmaceutical agents.',
    colorCode: 'Yellow',
    treatmentRule: 'Yellow biohazard bag marked CYTOTOXIC. High-temperature incineration (>1200°C).',
    imageBadge: 'Cytotoxic Pharma',
    thumbnail: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'sample-latex-gloves',
    title: 'Used Examination Nitrile Gloves & Catheter',
    category: 'RED',
    detectedType: 'Contaminated Disposable Plastics / Rubber',
    confidence: 0.963,
    description: 'Light blue nitrile examination gloves and latex Foley catheter, non-puncturing.',
    estimatedWeightKg: 0.30,
    hazardRisk: 'Surface bio-contamination; clinical grade recyclable polymer.',
    colorCode: 'Red',
    treatmentRule: 'Red color-coded biomedical bin. Autoclave/microwave followed by polymer recycling.',
    imageBadge: 'Nitrile Gloves',
    thumbnail: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=300&auto=format&fit=crop&q=80'
  }
];

// Pre-seeded Realistic Collection History
export const INITIAL_WASTE_LOGS = [
  {
    id: 'LOG-2026-0906-001',
    timestamp: '2026-09-06T15:20:00Z',
    wasteTitle: 'Hypodermic Syringes with Needles (x4)',
    wasteType: 'Sharps / Contaminated Needle',
    category: 'WHITE',
    binColor: 'White',
    binCode: 'W-ICU-01',
    departmentId: 'ICU',
    departmentName: 'Intensive Care Unit (ICU)',
    weightKg: 0.32,
    confidence: 0.985,
    hazardNotes: 'Puncture risk. Discarded immediately after arterial blood gas sampling.',
    loggedBy: {
      id: 'usr-staff-1',
      name: 'Mark Peterson, RN',
      role: 'Staff'
    },
    status: 'Collected',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
    disposalTimestamp: null,
    disposedBy: null,
    disposalMethod: null
  },
  {
    id: 'LOG-2026-0906-002',
    timestamp: '2026-09-06T14:45:00Z',
    wasteTitle: 'Surgical Laparotomy Dressing Gauze',
    wasteType: 'Infectious / Anatomical Soiled Waste',
    category: 'YELLOW',
    binColor: 'Yellow',
    binCode: 'Y-OT1-01',
    departmentId: 'OT_1',
    departmentName: 'Operation Theatre 1 (General)',
    weightKg: 1.85,
    confidence: 0.971,
    hazardNotes: 'High biohazard. Soiled with peritoneal fluid and blood.',
    loggedBy: {
      id: 'usr-staff-2',
      name: 'Priya Sharma, CST',
      role: 'Staff'
    },
    status: 'Collected',
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&auto=format&fit=crop&q=80',
    disposalTimestamp: null,
    disposedBy: null,
    disposalMethod: null
  },
  {
    id: 'LOG-2026-0906-003',
    timestamp: '2026-09-06T13:10:00Z',
    wasteTitle: 'Infusion Tubing & Empty Dextrose 500ml',
    wasteType: 'Contaminated Recyclable Plastics',
    category: 'RED',
    binColor: 'Red',
    binCode: 'R-W3-01',
    departmentId: 'WARD_3',
    departmentName: 'Ward 3 (Post-Op Surgical)',
    weightKg: 0.42,
    confidence: 0.965,
    hazardNotes: 'Tubing drained, needle decoupled and safely routed to white box.',
    loggedBy: {
      id: 'usr-staff-1',
      name: 'Mark Peterson, RN',
      role: 'Staff'
    },
    status: 'Disposed',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=300&auto=format&fit=crop&q=80',
    disposalTimestamp: '2026-09-06T17:00:00Z',
    disposedBy: 'Dr. Sarah Jenkins (Infection Officer)',
    disposalMethod: 'Autoclave Batch #AC-904 -> Authorized Medical Plastic Recycler'
  },
  {
    id: 'LOG-2026-0906-004',
    timestamp: '2026-09-06T11:25:00Z',
    wasteTitle: 'Broken Cefotaxime Glass Vials (x6)',
    wasteType: 'Glassware & Medicine Ampoules',
    category: 'BLUE',
    binColor: 'Blue',
    binCode: 'B-ER-01',
    departmentId: 'EMERGENCY',
    departmentName: 'Emergency & Trauma Center',
    weightKg: 0.50,
    confidence: 0.952,
    hazardNotes: 'Sharp glass edges. Handled with protective forceps.',
    loggedBy: {
      id: 'usr-admin-1',
      name: 'Dr. Sarah Jenkins',
      role: 'Admin'
    },
    status: 'Disposed',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&auto=format&fit=crop&q=80',
    disposalTimestamp: '2026-09-06T16:30:00Z',
    disposedBy: 'Dr. Sarah Jenkins (Infection Officer)',
    disposalMethod: 'Chemical Disinfection (1% Sodium Hypochlorite) -> Glass Foundry Unit'
  },
  {
    id: 'LOG-2026-0906-005',
    timestamp: '2026-09-06T10:15:00Z',
    wasteTitle: 'Sterile Packaging Cartons & Paper Hand Towels',
    wasteType: 'General Non-Hazardous Municipal Waste',
    category: 'BLACK',
    binColor: 'Black',
    binCode: 'K-ICU-01',
    departmentId: 'ICU',
    departmentName: 'Intensive Care Unit (ICU)',
    weightKg: 1.20,
    confidence: 0.995,
    hazardNotes: 'Non-hazardous. Unused product packaging from shift restocking.',
    loggedBy: {
      id: 'usr-staff-1',
      name: 'Mark Peterson, RN',
      role: 'Staff'
    },
    status: 'Disposed',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&auto=format&fit=crop&q=80',
    disposalTimestamp: '2026-09-06T14:00:00Z',
    disposedBy: 'Sanitation Logistics Team',
    disposalMethod: 'Municipal Segregated Waste Compact -> City Resource Recovery'
  },
  {
    id: 'LOG-2026-0905-006',
    timestamp: '2026-09-05T21:40:00Z',
    wasteTitle: 'Explanted Orthopedic Fixation Screws',
    wasteType: 'Glassware & Metallic Implants',
    category: 'BLUE',
    binColor: 'Blue',
    binCode: 'B-OT1-01',
    departmentId: 'OT_1',
    departmentName: 'Operation Theatre 1 (General)',
    weightKg: 0.22,
    confidence: 0.941,
    hazardNotes: 'Titanium hardware explanted from femur repair.',
    loggedBy: {
      id: 'usr-staff-2',
      name: 'Priya Sharma, CST',
      role: 'Staff'
    },
    status: 'Disposed',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&auto=format&fit=crop&q=80',
    disposalTimestamp: '2026-09-06T09:00:00Z',
    disposedBy: 'Dr. Sarah Jenkins (Infection Officer)',
    disposalMethod: 'Thermal Autoclave -> Metal Smelting Reclamation'
  },
  {
    id: 'LOG-2026-0905-007',
    timestamp: '2026-09-05T19:15:00Z',
    wasteTitle: 'Expired Methotrexate Chemotherapy Vials',
    wasteType: 'Cytotoxic / Expired Pharmaceutical',
    category: 'YELLOW',
    binColor: 'Yellow',
    binCode: 'Y-W3-01',
    departmentId: 'WARD_3',
    departmentName: 'Ward 3 (Post-Op Surgical)',
    weightKg: 0.48,
    confidence: 0.962,
    hazardNotes: 'Cytotoxic agent. Double-bagged in certified yellow hazardous polymer.',
    loggedBy: {
      id: 'usr-staff-1',
      name: 'Mark Peterson, RN',
      role: 'Staff'
    },
    status: 'Collected',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80',
    disposalTimestamp: null,
    disposedBy: null,
    disposalMethod: null
  }
];