// WHO & Biomedical Waste Management Rules Color Coding Reference

export const WASTE_CATEGORIES = {
  YELLOW: {
    id: 'YELLOW',
    name: 'Yellow Category',
    binColor: 'Yellow',
    hex: '#facc15',
    darkHex: '#ca8a04',
    bgClass: 'bg-amber-100 text-amber-900 border-amber-300',
    badgeClass: 'bg-yellow-400 text-slate-900 font-semibold',
    accentBorder: 'border-yellow-400',
    title: 'Infectious & Anatomical Waste',
    description: 'Human anatomical tissues, soiled surgical dressings, blood bags, body fluid contaminated linen, expired pharmaceutical/cytotoxic items.',
    acceptedItems: [
      'Human tissue & organs',
      'Blood-soaked gauze & cotton',
      'Soiled bandages & dressings',
      'Expired pharmaceuticals',
      'Cytotoxic drugs',
      'Microbiology culture plates',
      'Fluid-filled drainage bags'
    ],
    prohibitedItems: [
      'Sharps (needles/scalpels)',
      'Intact glass vials',
      'Recyclable plastic tubes'
    ],
    treatmentMethod: 'High-Temperature Incineration or Plasma Pyrolysis / Deep Burial',
    hazardRating: 'High Biohazard',
    iconName: 'Biohazard'
  },
  RED: {
    id: 'RED',
    name: 'Red Category',
    binColor: 'Red',
    hex: '#ef4444',
    darkHex: '#b91c1c',
    bgClass: 'bg-red-100 text-red-900 border-red-300',
    badgeClass: 'bg-red-500 text-white font-semibold',
    accentBorder: 'border-red-500',
    title: 'Contaminated Recyclable Plastics',
    description: 'Plastic medical apparatus generated from disposable items (catheters, IV bottles, tubing, syringes without needles, gloves).',
    acceptedItems: [
      'IV tubes and sets',
      'Empty IV saline bottles',
      'Urine bags',
      'Plastic syringes without needles',
      'Surgical & examination gloves',
      'Catheters & suction tips',
      'Dialysis tubing'
    ],
    prohibitedItems: [
      'Needles & metal sharps',
      'Glass ampoules',
      'Pathological tissue'
    ],
    treatmentMethod: 'Autoclaving / Hydroclaving / Microwaving followed by Shredding & Authorized Recycling',
    hazardRating: 'Contaminated Plastic',
    iconName: 'RefreshCw'
  },
  WHITE: {
    id: 'WHITE',
    name: 'White (Translucent)',
    binColor: 'White',
    hex: '#f8fafc',
    darkHex: '#475569',
    bgClass: 'bg-slate-100 text-slate-800 border-slate-300 shadow-sm',
    badgeClass: 'bg-white text-slate-900 border border-slate-300 font-semibold',
    accentBorder: 'border-slate-400',
    title: 'Sharps & Puncture-Proof Container',
    description: 'Contaminated metal sharps that may cause puncture wounds or cuts. Must be placed in puncture-proof, leak-proof, tamper-proof containers.',
    acceptedItems: [
      'Needles (hypodermic & suture)',
      'Syringes with fixed needles',
      'Scalpel blades',
      'Lancets & IV stylets',
      'Surgical guide wires',
      'Trocar pins & needles'
    ],
    prohibitedItems: [
      'Syringes without needles (put in Red)',
      'Cotton / gauze',
      'Glass bottles'
    ],
    treatmentMethod: 'Autoclaving or Dry Heat Sterilization followed by Encapsulation or Metal Shredding',
    hazardRating: 'Extreme Puncture & Bloodborne Hazard',
    iconName: 'AlertTriangle'
  },
  BLUE: {
    id: 'BLUE',
    name: 'Blue Category',
    binColor: 'Blue',
    hex: '#3b82f6',
    darkHex: '#1d4ed8',
    bgClass: 'bg-blue-100 text-blue-900 border-blue-300',
    badgeClass: 'bg-blue-600 text-white font-semibold',
    accentBorder: 'border-blue-600',
    title: 'Glassware & Metallic Implants',
    description: 'Broken or intact medicine glass vials, ampoules, laboratory slides, and metallic orthopedic implants.',
    acceptedItems: [
      'Broken or intact glass ampoules',
      'Antibiotic glass vials',
      'Glass petri dishes & slides',
      'Metallic orthopedic plates & screws',
      'Dental implants',
      'Glass pipettes'
    ],
    prohibitedItems: [
      'Metal needles (put in White)',
      'Plastic IV bottles (put in Red)',
      'Chemical contaminated vials'
    ],
    treatmentMethod: 'Disinfection (Sodium Hypochlorite soaking) or Autoclaving, followed by Glass Recycling',
    hazardRating: 'Cut Hazard / Contaminated Glass',
    iconName: 'Glasses'
  },
  BLACK: {
    id: 'BLACK',
    name: 'Black Category',
    binColor: 'Black',
    hex: '#1e293b',
    darkHex: '#0f172a',
    bgClass: 'bg-slate-200 text-slate-900 border-slate-400',
    badgeClass: 'bg-slate-900 text-white font-semibold',
    accentBorder: 'border-slate-900',
    title: 'General Non-Hazardous Municipal Waste',
    description: 'Non-infected hospital waste comparable to domestic or office refuse. Clean paper, cardboard cartons, food leftovers, packaging materials.',
    acceptedItems: [
      'Clean paper towels & tissue',
      'Carton boxes & drug packaging wrappers',
      'Disposable cups & beverage cans',
      'Food leftovers & kitchen waste',
      'Office paperwork & printing records',
      'Sanitary wrap outside patient rooms'
    ],
    prohibitedItems: [
      'Any item contaminated with blood or body fluid',
      'Medicines or chemicals',
      'Needles, sharps or glass'
    ],
    treatmentMethod: 'Municipal Solid Waste Disposal / Recycling / Landfill',
    hazardRating: 'Non-Hazardous',
    iconName: 'Trash2'
  }
};

/**
 * FIXED, DETERMINISTIC LOOKUP TABLE: Waste Type / Item -> Bin Color Category
 * No randomness: same waste type always maps to the same color code every single time.
 */
export const WASTE_TYPE_TO_BIN_COLOR = {
  // WHITE: Sharps & Puncture Hazards
  'syringe': 'WHITE',
  'syringes': 'WHITE',
  'needle': 'WHITE',
  'needles': 'WHITE',
  'hypodermic needle': 'WHITE',
  'hypodermic syringe': 'WHITE',
  'syringe with needle': 'WHITE',
  'syringe with fixed needle': 'WHITE',
  'sharps / contaminated needle': 'WHITE',
  'sharps / surgical blade': 'WHITE',
  'sharps': 'WHITE',
  'scalpel': 'WHITE',
  'scalpels': 'WHITE',
  'scalpel blade': 'WHITE',
  'blade': 'WHITE',
  'blades': 'WHITE',
  'surgical blade': 'WHITE',
  'lancet': 'WHITE',
  'lancets': 'WHITE',
  'blood lancet': 'WHITE',
  'suture needle': 'WHITE',
  'suture needles': 'WHITE',
  'stylet': 'WHITE',
  'trocar': 'WHITE',
  'razor': 'WHITE',
  'guide wire': 'WHITE',
  'guidewire': 'WHITE',

  // YELLOW: Infectious / Pathological / Anatomical / Cytotoxic / Expired Pharmaceuticals
  'infectious waste': 'YELLOW',
  'pathological waste': 'YELLOW',
  'anatomical waste': 'YELLOW',
  'human tissue': 'YELLOW',
  'infectious / anatomical soiled waste': 'YELLOW',
  'infectious / soiled biological dressing': 'YELLOW',
  'blood-soaked gauze': 'YELLOW',
  'gauze': 'YELLOW',
  'cotton': 'YELLOW',
  'cotton swabs': 'YELLOW',
  'soiled dressing': 'YELLOW',
  'soiled dressings': 'YELLOW',
  'bandage': 'YELLOW',
  'bandages': 'YELLOW',
  'surgical dressings': 'YELLOW',
  'cytotoxic': 'YELLOW',
  'cytotoxic drugs': 'YELLOW',
  'cytotoxic / expired pharmaceutical': 'YELLOW',
  'expired medicine': 'YELLOW',
  'expired pharmaceuticals': 'YELLOW',
  'chemotherapy': 'YELLOW',
  'blood bag': 'YELLOW',
  'placenta': 'YELLOW',
  'microbiology culture': 'YELLOW',

  // RED: Contaminated Recyclable Plastics
  'contaminated recyclable plastics': 'RED',
  'contaminated disposable plastics': 'RED',
  'contaminated disposable plastics / rubber': 'RED',
  'iv tubing': 'RED',
  'iv set': 'RED',
  'infusion set': 'RED',
  'saline bottle': 'RED',
  'empty saline bottle': 'RED',
  'catheter': 'RED',
  'catheters': 'RED',
  'foley catheter': 'RED',
  'gloves': 'RED',
  'examination gloves': 'RED',
  'nitrile gloves': 'RED',
  'latex gloves': 'RED',
  'sterile gloves': 'RED',
  'urine bag': 'RED',
  'urine drainage bag': 'RED',
  'dialysis tubing': 'RED',
  'syringe without needle': 'RED',
  'plastic syringe without needle': 'RED',
  'suction tip': 'RED',
  'cannula': 'RED',

  // BLUE: Glassware & Metallic Implants
  'glassware': 'BLUE',
  'glassware & medicine ampoules': 'BLUE',
  'glassware & metallic implants': 'BLUE',
  'glass ampoule': 'BLUE',
  'glass ampoules': 'BLUE',
  'medicine ampoule': 'BLUE',
  'medicine ampoules': 'BLUE',
  'glass vial': 'BLUE',
  'glass vials': 'BLUE',
  'antibiotic vial': 'BLUE',
  'broken glass': 'BLUE',
  'petri dish': 'BLUE',
  'glass slide': 'BLUE',
  'metallic implants': 'BLUE',
  'orthopedic implants': 'BLUE',
  'titanium screws': 'BLUE',
  'orthopedic plate': 'BLUE',
  'dental implant': 'BLUE',
  'glass pipette': 'BLUE',

  // BLACK: General Non-Hazardous Municipal Waste
  'general waste': 'BLACK',
  'general non-hazardous municipal waste': 'BLACK',
  'municipal waste': 'BLACK',
  'paper': 'BLACK',
  'paper towels': 'BLACK',
  'tissue paper': 'BLACK',
  'cardboard': 'BLACK',
  'cardboard cartons': 'BLACK',
  'carton boxes': 'BLACK',
  'packaging': 'BLACK',
  'clean packaging': 'BLACK',
  'food packaging': 'BLACK',
  'food waste': 'BLACK',
  'office paper': 'BLACK',
  'office paperwork': 'BLACK'
};

/**
 * Deterministic resolution function: takes any waste item string / title / detected type
 * and returns the exact WHO bin category (WHITE, YELLOW, RED, BLUE, BLACK).
 * Guaranteed 100% deterministic, zero randomness.
 */
export function getBinCategoryForWasteType(input) {
  if (!input || typeof input !== 'string') return 'YELLOW';
  const clean = input.trim().toLowerCase();

  // 1. Direct dictionary exact match
  if (WASTE_TYPE_TO_BIN_COLOR[clean]) {
    return WASTE_TYPE_TO_BIN_COLOR[clean];
  }

  // 2. High-priority deterministic keyword rules:

  // WHITE: Sharps & Puncture Hazards
  // Any mention of needles, syringes (unless explicitly without needle), scalpels, blades, lancets
  const isSyringeWithoutNeedle = clean.includes('without needle') || clean.includes('no needle') || clean.includes('w/o needle');
  if (
    clean.includes('needle') ||
    clean.includes('scalpel') ||
    clean.includes('blade') ||
    clean.includes('lancet') ||
    clean.includes('trocar') ||
    clean.includes('stylet') ||
    clean.includes('razor') ||
    (clean.includes('syringe') && !isSyringeWithoutNeedle) ||
    (clean.includes('sharp') && !clean.includes('non-sharp'))
  ) {
    return 'WHITE';
  }

  // BLUE: Glassware & Metallic Implants
  if (
    clean.includes('glass') ||
    clean.includes('ampoule') ||
    clean.includes('vial') ||
    clean.includes('implant') ||
    clean.includes('slide') ||
    clean.includes('petri') ||
    clean.includes('orthopedic') ||
    clean.includes('titanium')
  ) {
    return 'BLUE';
  }

  // RED: Contaminated Recyclable Plastics / Rubber / Tubing / Catheters / Urine bags
  if (
    clean.includes('urine') ||
    clean.includes('tubing') ||
    clean.includes('tube') ||
    clean.includes('catheter') ||
    clean.includes('glove') ||
    clean.includes('saline') ||
    clean.includes('infusion') ||
    clean.includes('iv set') ||
    clean.includes('dialysis') ||
    clean.includes('cannula') ||
    isSyringeWithoutNeedle ||
    clean.includes('plastic')
  ) {
    return 'RED';
  }

  // YELLOW: Infectious, Anatomical, Pathological, Cytotoxic, Soiled, Expired Pharma
  if (
    clean.includes('infectious') ||
    clean.includes('patholog') ||
    clean.includes('anatom') ||
    clean.includes('gauze') ||
    clean.includes('cotton') ||
    clean.includes('dressing') ||
    clean.includes('bandage') ||
    clean.includes('blood') ||
    clean.includes('soiled') ||
    clean.includes('cytotoxic') ||
    clean.includes('chemo') ||
    clean.includes('pharma') ||
    clean.includes('medicine') ||
    clean.includes('tissue') ||
    clean.includes('organ') ||
    clean.includes('swab') ||
    clean.includes('body fluid')
  ) {
    return 'YELLOW';
  }

  // BLACK: General Non-Hazardous Municipal Waste
  if (
    clean.includes('paper') ||
    clean.includes('carton') ||
    clean.includes('cardboard') ||
    clean.includes('food') ||
    clean.includes('packaging') ||
    clean.includes('wrapper') ||
    clean.includes('general') ||
    clean.includes('municipal') ||
    clean.includes('trash')
  ) {
    return 'BLACK';
  }

  // Standard clinical safety fallback: treat unclassified medical material as YELLOW
  return 'YELLOW';
}