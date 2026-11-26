export type CareerPinBarId = "college" | "denso" | "phoenix" | "luxasia";
export type CareerStageId = CareerPinBarId | "full-time-target";
export type MapPresetId = "corridor" | "rtu" | "ortigas" | "bgc";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface SlabPoint {
  x: number;
  z: number;
}

export interface CareerMapPin {
  barId: CareerPinBarId;
  indexLabel: string;
  shortLabel: string;
  pillLabel: string;
  building: string;
  district: string;
  organization: string;
  role: string;
  period: string;
  metricBadge: string;
  experienceSummary: string;
  tools: string[];
  status: "completed" | "current";
  lat: number;
  lng: number;
  towerHeight: number;
  towerFootprint: [number, number];
  /** Offset in slab world units (x, z) for the floating pin anchor so neighboring BGC towers never collide */
  stemOffset: [number, number];
  stemExtraHeight: number;
  preset: MapPresetId;
}

export interface RoadSegment {
  id: string;
  tier: "highway" | "arterial" | "cbd" | "bridge";
  points: Array<[number, number]>; // [lat, lng]
}

export interface BuildingMassing {
  lat: number;
  lng: number;
  width: number;
  depth: number;
  height: number;
  rotationY?: number;
  district: "bgc" | "ortigas" | "pasig" | "mandaluyong" | "makati";
}

export interface CameraPreset {
  id: MapPresetId;
  label: string;
  shortLabel: string;
  position: [number, number, number];
  target: [number, number, number];
}

/**
 * Semi-landscape Metro Manila corridor bounding box (~7.7 km E-W x ~5.1 km N-S):
 * Covers Makati/EDSA & West BGC (west) -> Ortigas CBD & C-5 (center) -> RTU Pasig & Maybunga (east).
 */
export const SLAB_BOUNDS = {
  minLng: 121.036,
  maxLng: 121.108,
  minLat: 14.543,
  maxLat: 14.589,
  width: 15.2,
  depth: 10.0,
  thickness: 0.56,
} as const;

/**
 * Projects WGS84 (lat, lng) inside Metro Manila onto Three.js slab coordinates (x, z).
 * -x = West (Makati/BGC), +x = East (RTU Pasig)
 * -z = North (North Ortigas), +z = South (South BGC / McKinley)
 */
export function projectLatLngToSlab(lat: number, lng: number): SlabPoint {
  const u = (lng - SLAB_BOUNDS.minLng) / (SLAB_BOUNDS.maxLng - SLAB_BOUNDS.minLng);
  const v = (lat - SLAB_BOUNDS.minLat) / (SLAB_BOUNDS.maxLat - SLAB_BOUNDS.minLat);

  return {
    x: (u - 0.5) * SLAB_BOUNDS.width,
    z: (0.5 - v) * SLAB_BOUNDS.depth,
  };
}

/**
 * Privacy-safe career milestones positioned at exact real-world building coordinates.
 * Public metadata exposes ONLY building name + city/district (never street or floor numbers).
 */
export const CAREER_MAP_PINS: CareerMapPin[] = [
  {
    barId: "college",
    indexLabel: "01",
    shortLabel: "RTU Pasig",
    pillLabel: "RTU PASIG",
    building: "RTU Pasig Campus",
    district: "Pasig City",
    organization: "Rizal Technological University",
    role: "BS Computer Engineering Graduate",
    period: "Aug 2022 – Jul 2026",
    metricBadge: "Engineering + Analytics Foundation",
    experienceSummary:
      "Built a strong foundation in software engineering, structured MySQL databases, machine learning, and real-time AIoT telemetry systems.",
    tools: ["Python", "MySQL", "XGBoost", "React", "Arduino"],
    status: "completed",
    lat: 14.573,
    lng: 121.0994,
    towerHeight: 0.72,
    towerFootprint: [0.42, 0.32],
    stemOffset: [0, 0],
    stemExtraHeight: 0.68,
    preset: "rtu",
  },
  {
    barId: "denso",
    indexLabel: "02",
    shortLabel: "Denso Ten",
    pillLabel: "DENSO TEN",
    building: "Hanston Square",
    district: "Ortigas Center, Pasig",
    organization: "Denso Ten Solutions Philippines",
    role: "Data Analyst Intern",
    period: "Feb 2026 – Apr 2026",
    metricBadge: "75%-80% Reporting Time Reduction",
    experienceSummary:
      "Automated engineering operations workflows with Python and Excel VBA, engineered MySQL defect tracking tools, and built Power BI dashboards.",
    tools: ["Python", "MySQL", "Power BI", "Power Apps", "Excel VBA"],
    status: "completed",
    lat: 14.57936,
    lng: 121.05865,
    towerHeight: 1.24,
    towerFootprint: [0.28, 0.28],
    stemOffset: [0, 0],
    stemExtraHeight: 0.74,
    preset: "ortigas",
  },
  {
    barId: "phoenix",
    indexLabel: "03",
    shortLabel: "Phoenix",
    pillLabel: "PHOENIX",
    building: "Udenna Tower",
    district: "BGC, Taguig",
    organization: "Phoenix Petroleum Philippines",
    role: "Data Science Intern",
    period: "Jun 2026 – Jul 2026",
    metricBadge: "83% Report Time Cut & XGBoost",
    experienceSummary:
      "Engineered automated SQL warehouse ETL pipelines, built 1-to-3-day XGBoost canister demand forecast models, and cut daily reporting from 30 min to 5 min.",
    tools: ["Python", "SQL Warehouse", "ETL", "XGBoost", "Apps Script"],
    status: "completed",
    lat: 14.548,
    lng: 121.0475,
    towerHeight: 1.34,
    towerFootprint: [0.18, 0.18],
    stemOffset: [0.34, 0.24],
    stemExtraHeight: 0.56,
    preset: "bgc",
  },
  {
    barId: "luxasia",
    indexLabel: "04",
    shortLabel: "LUXASIA",
    pillLabel: "LUXASIA",
    building: "Three/NEO",
    district: "BGC, Taguig",
    organization: "Luxasia Pte. Ltd & Leap Commerce",
    role: "Data Analyst Intern",
    period: "Jul 2026 – Present",
    metricBadge: "Active Role: Commercial Data & BI",
    experienceSummary:
      "Driving Shopee and Lazada e-commerce analytics across the Philippines and Thailand using SQL, Python ETL web automation, and Power BI.",
    tools: ["SQL", "Python", "Power BI", "ETL Automation", "E-Commerce BI"],
    status: "current",
    lat: 14.5534,
    lng: 121.0466,
    towerHeight: 1.56,
    towerFootprint: [0.2, 0.2],
    stemOffset: [-0.34, -0.24],
    stemExtraHeight: 0.68,
    preset: "bgc",
  },
];

/**
 * Pasig River + Napindan Channel centerline (West -> East)
 * Sweeps from Rockwell/Guadalupe between Ortigas & BGC toward San Joaquin & Laguna de Bay.
 */
export const PASIG_RIVER_CENTERLINE: Array<[number, number]> = [
  [14.5668, 121.0355],
  [14.5683, 121.0412],
  [14.5685, 121.046],  // Guadalupe Bridge (EDSA)
  [14.5678, 121.0505],
  [14.5663, 121.0549], // Kalayaan / BGC-Ortigas Link Bridge
  [14.5637, 121.0608], // Pineda bend
  [14.5605, 121.0662], // Bagong Ilog C-5 Bridge
  [14.5576, 121.0718],
  [14.5552, 121.0772], // San Joaquin / Marikina River Confluence
  [14.5522, 121.0852],
  [14.5488, 121.0955],
  [14.5452, 121.1085],
];

/**
 * Marikina River centerline branching north from San Joaquin confluence,
 * separating Capitol Commons / Pasig Proper from Maybunga / RTU Pasig.
 */
export const MARIKINA_RIVER_CENTERLINE: Array<[number, number]> = [
  [14.5552, 121.0772],
  [14.5605, 121.0802],
  [14.5668, 121.0828],
  [14.5738, 121.0842],
  [14.5815, 121.0828],
  [14.5895, 121.0815],
];

/**
 * Manggahan Floodway along the eastern Pasig boundary near Maybunga / Rosario.
 */
export const MANGGAHAN_FLOODWAY_CENTERLINE: Array<[number, number]> = [
  [14.5525, 121.1085],
  [14.5645, 121.1066],
  [14.5765, 121.1044],
  [14.5895, 121.1018],
];

/**
 * Recognizable Metro Manila highways, bridges, and Ortigas / BGC / Pasig street corridors.
 */
export const CORRIDOR_ROADS: RoadSegment[] = [
  // EDSA (South Makati -> Guadalupe Bridge -> Shaw -> Ortigas Ave)
  {
    id: "edsa",
    tier: "highway",
    points: [
      [14.543, 121.0362],
      [14.5548, 121.0408],
      [14.5685, 121.046],
      [14.5765, 121.0504],
      [14.5812, 121.0536],
      [14.589, 121.0568],
    ],
  },
  // C-5 / Carlos P. Garcia Ave / E. Rodriguez Jr. Ave
  {
    id: "c5",
    tier: "highway",
    points: [
      [14.543, 121.0556],
      [14.5498, 121.0568],
      [14.5562, 121.0618],
      [14.5605, 121.0662],
      [14.5695, 121.0704],
      [14.5808, 121.0744],
      [14.589, 121.0768],
    ],
  },
  // BGC-Ortigas Center Link (Kalayaan / Sta. Monica-Lawton Bridge -> Brixton -> Fairlane -> Ortigas)
  {
    id: "bgc-ortigas-link",
    tier: "bridge",
    points: [
      [14.5572, 121.0522],
      [14.5618, 121.0538],
      [14.5663, 121.0549],
      [14.5718, 121.0566],
      [14.5758, 121.0585],
    ],
  },
  // Ortigas Avenue & Ortigas Ave Extension (West -> East toward Rosario / Pasig)
  {
    id: "ortigas-ave",
    tier: "highway",
    points: [
      [14.5888, 121.054],
      [14.5882, 121.0635],
      [14.5882, 121.0768],
      [14.5884, 121.084],
      [14.588, 121.0985],
      [14.5876, 121.1078],
    ],
  },
  // Shaw Boulevard -> Pasig Boulevard -> Vargas Bridge -> Pasig Proper
  {
    id: "shaw-pasig-blvd",
    tier: "arterial",
    points: [
      [14.5835, 121.048],
      [14.5812, 121.0536],
      [14.5772, 121.0587],
      [14.5736, 121.0635],
      [14.5655, 121.0672],
      [14.5612, 121.0755],
      [14.5602, 121.0825],
    ],
  },
  // Kalayaan Avenue (Makati -> North BGC -> C-5)
  {
    id: "kalayaan-ave",
    tier: "arterial",
    points: [
      [14.5592, 121.0418],
      [14.5582, 121.0478],
      [14.5578, 121.0545],
      [14.5568, 121.0618],
    ],
  },
  // Ortigas CBD Grid: Julia Vargas Ave, ADB Ave, San Miguel Ave, Meralco Ave, Emerald/F. Ortigas Jr.
  {
    id: "julia-vargas",
    tier: "cbd",
    points: [
      [14.5838, 121.0554],
      [14.583, 121.0634],
      [14.5815, 121.0744],
    ],
  },
  {
    id: "adb-ave",
    tier: "cbd",
    points: [
      [14.5862, 121.0562],
      [14.5858, 121.0632],
    ],
  },
  {
    id: "san-miguel-ave",
    tier: "cbd",
    points: [
      [14.5855, 121.0585],
      [14.57936, 121.05865],
      [14.5768, 121.0588],
    ],
  },
  {
    id: "f-ortigas-emerald",
    tier: "cbd",
    points: [
      [14.5882, 121.0612],
      [14.5795, 121.0614],
    ],
  },
  {
    id: "meralco-ave",
    tier: "arterial",
    points: [
      [14.5882, 121.0635],
      [14.581, 121.0636],
      [14.5736, 121.0635],
    ],
  },
  // East Pasig / Maybunga / RTU Corridor: Dr. Sixto Antonio Ave, C. Raymundo Ave, Eusebio Ave, Sandoval Ave
  {
    id: "c-raymundo-ave",
    tier: "arterial",
    points: [
      [14.5884, 121.0858],
      [14.5765, 121.0872],
      [14.565, 121.0855],
    ],
  },
  {
    id: "eusebio-sandoval-rtu",
    tier: "arterial",
    points: [
      [14.588, 121.0968],
      [14.5795, 121.0978],
      [14.573, 121.0994],
      [14.5665, 121.0998],
      [14.5632, 121.0915],
    ],
  },
  {
    id: "mercedes-ave-pasig",
    tier: "cbd",
    points: [
      [14.5662, 121.0855],
      [14.5698, 121.0942],
      [14.573, 121.0994],
      [14.5742, 121.1045],
    ],
  },
  // BGC Street Grid: 32nd St, 30th St, 26th St, McKinley Pkwy, Rizal Dr, 3rd Ave, 4th Ave, 5th Ave, 7th Ave, 9th Ave, 11th Ave
  {
    id: "bgc-32nd-st",
    tier: "arterial",
    points: [
      [14.5558, 121.0445],
      [14.5552, 121.0505],
      [14.5544, 121.0568],
    ],
  },
  {
    id: "bgc-30th-st",
    tier: "cbd",
    points: [
      [14.5536, 121.0442],
      [14.5534, 121.0466],
      [14.553, 121.0508],
      [14.5524, 121.0552],
    ],
  },
  {
    id: "bgc-28th-st",
    tier: "cbd",
    points: [
      [14.5514, 121.0446],
      [14.5511, 121.0472],
      [14.5508, 121.0512],
      [14.5504, 121.0554],
    ],
  },
  {
    id: "bgc-26th-st",
    tier: "cbd",
    points: [
      [14.5495, 121.0448],
      [14.5493, 121.0475],
      [14.5491, 121.0508],
      [14.5488, 121.0564],
    ],
  },
  {
    id: "mckinley-pkwy",
    tier: "arterial",
    points: [
      [14.5448, 121.0385],
      [14.5468, 121.0458],
      [14.5468, 121.0512],
      [14.5462, 121.0558],
    ],
  },
  {
    id: "bgc-rizal-dr",
    tier: "cbd",
    points: [
      [14.5556, 121.0452],
      [14.5532, 121.0451],
      [14.5504, 121.0454],
      [14.548, 121.0475],
      [14.5468, 121.0482],
    ],
  },
  {
    id: "bgc-3rd-ave",
    tier: "cbd",
    points: [
      [14.5556, 121.0465],
      [14.5534, 121.0466],
      [14.5495, 121.0467],
    ],
  },
  {
    id: "bgc-4th-ave",
    tier: "cbd",
    points: [
      [14.5555, 121.0475],
      [14.5511, 121.0475],
      [14.548, 121.0475],
      [14.5466, 121.0476],
    ],
  },
  {
    id: "bgc-5th-ave",
    tier: "arterial",
    points: [
      [14.5562, 121.049],
      [14.5515, 121.0492],
      [14.5452, 121.0494],
    ],
  },
  {
    id: "bgc-7th-ave",
    tier: "cbd",
    points: [
      [14.5572, 121.0508],
      [14.5488, 121.051],
    ],
  },
  {
    id: "bgc-9th-ave",
    tier: "cbd",
    points: [
      [14.5575, 121.0526],
      [14.5488, 121.0528],
    ],
  },
  {
    id: "bgc-11th-ave",
    tier: "cbd",
    points: [
      [14.5574, 121.0545],
      [14.5485, 121.0548],
    ],
  },
];

/**
 * Curated surrounding 3D urban building massings across BGC, Ortigas CBD,
 * Mandaluyong/Greenfield, Makati/Rockwell, Bridgetowne, and Pasig.
 * Excludes exact coordinates of the 4 hero career towers so hero towers stand proud.
 */
export const SKYLINE_MASSINGS: BuildingMassing[] = [
  // --- BGC High-Rise Skyline (West, High Street, Uptown, South) ---
  // Kept clear of the De Jesus Oval / 28th-26th St pocket between Three/NEO (14.5534) & Udenna Tower (14.5480)
  { lat: 14.555, lng: 121.0456, width: 0.22, depth: 0.2, height: 0.88, district: "bgc" },
  { lat: 14.5548, lng: 121.0478, width: 0.24, depth: 0.2, height: 1.04, district: "bgc" },
  { lat: 14.5542, lng: 121.0496, width: 0.26, depth: 0.22, height: 1.28, district: "bgc" },
  { lat: 14.5536, lng: 121.0512, width: 0.3, depth: 0.24, height: 1.44, district: "bgc" }, // Grand Hyatt / Uptown edge
  { lat: 14.5562, lng: 121.0522, width: 0.28, depth: 0.24, height: 1.18, district: "bgc" }, // Uptown BGC
  { lat: 14.5566, lng: 121.054, width: 0.26, depth: 0.22, height: 1.02, district: "bgc" },
  { lat: 14.555, lng: 121.0532, width: 0.24, depth: 0.22, height: 0.94, district: "bgc" },
  { lat: 14.5522, lng: 121.0496, width: 0.26, depth: 0.22, height: 1.12, district: "bgc" }, // Shangri-La / PSE along 5th Ave
  { lat: 14.5518, lng: 121.0514, width: 0.28, depth: 0.18, height: 0.62, district: "bgc" }, // Bonifacio High Street
  { lat: 14.5516, lng: 121.0532, width: 0.26, depth: 0.18, height: 0.66, district: "bgc" },
  { lat: 14.5498, lng: 121.0498, width: 0.24, depth: 0.22, height: 0.96, district: "bgc" }, // 5th Ave south
  { lat: 14.5496, lng: 121.0516, width: 0.26, depth: 0.22, height: 1.06, district: "bgc" },
  { lat: 14.5494, lng: 121.0534, width: 0.24, depth: 0.22, height: 0.88, district: "bgc" },
  { lat: 14.5496, lng: 121.0554, width: 0.36, depth: 0.28, height: 0.48, district: "bgc" }, // Market! Market!
  { lat: 14.5472, lng: 121.0548, width: 0.34, depth: 0.24, height: 0.78, district: "bgc" }, // SM Aura Tower
  { lat: 14.5472, lng: 121.0498, width: 0.22, depth: 0.22, height: 0.88, district: "bgc" },
  { lat: 14.5476, lng: 121.0518, width: 0.22, depth: 0.2, height: 0.76, district: "bgc" },
  { lat: 14.5532, lng: 121.0444, width: 0.2, depth: 0.2, height: 0.68, district: "bgc" },  // Burgos Circle west

  // --- Ortigas Center CBD Skyline (San Miguel, ADB, Emerald, Meralco, Capitol Commons) ---
  { lat: 14.5844, lng: 121.0566, width: 0.38, depth: 0.28, height: 0.56, district: "ortigas" }, // Megamall podium
  { lat: 14.5868, lng: 121.0592, width: 0.34, depth: 0.26, height: 0.64, district: "ortigas" }, // ADB complex
  { lat: 14.5872, lng: 121.0616, width: 0.24, depth: 0.22, height: 1.16, district: "ortigas" }, // Robinsons / Galleria
  { lat: 14.5852, lng: 121.0614, width: 0.24, depth: 0.22, height: 1.22, district: "ortigas" }, // F. Ortigas / Emerald towers
  { lat: 14.5832, lng: 121.0614, width: 0.24, depth: 0.22, height: 1.08, district: "ortigas" },
  { lat: 14.5812, lng: 121.0612, width: 0.24, depth: 0.22, height: 1.14, district: "ortigas" },
  { lat: 14.5826, lng: 121.0588, width: 0.24, depth: 0.22, height: 1.02, district: "ortigas" }, // San Miguel north
  { lat: 14.5812, lng: 121.057, width: 0.28, depth: 0.24, height: 1.18, district: "ortigas" },  // Shangri-La Plaza / St. Francis
  { lat: 14.578, lng: 121.0568, width: 0.22, depth: 0.2, height: 0.86, district: "ortigas" },
  { lat: 14.5782, lng: 121.0604, width: 0.22, depth: 0.2, height: 0.92, district: "ortigas" },
  { lat: 14.5844, lng: 121.0636, width: 0.24, depth: 0.22, height: 0.96, district: "ortigas" }, // Meralco Ave corridor
  { lat: 14.582, lng: 121.0642, width: 0.26, depth: 0.22, height: 1.04, district: "ortigas" },  // Tektite / Exchange Rd
  { lat: 14.5796, lng: 121.0636, width: 0.22, depth: 0.2, height: 0.84, district: "ortigas" },
  { lat: 14.5748, lng: 121.0628, width: 0.26, depth: 0.24, height: 1.1, district: "ortigas" },  // Capitol Commons
  { lat: 14.5734, lng: 121.0646, width: 0.24, depth: 0.22, height: 0.96, district: "ortigas" },

  // --- Mandaluyong / Greenfield / Rockwell / Makati Fringe ---
  { lat: 14.5786, lng: 121.0518, width: 0.24, depth: 0.22, height: 0.88, district: "mandaluyong" }, // Greenfield
  { lat: 14.5762, lng: 121.0496, width: 0.22, depth: 0.2, height: 0.82, district: "mandaluyong" },
  { lat: 14.5712, lng: 121.0476, width: 0.22, depth: 0.2, height: 0.76, district: "mandaluyong" }, // Pioneer
  { lat: 14.5654, lng: 121.0392, width: 0.26, depth: 0.22, height: 1.14, district: "makati" },      // Rockwell Center
  { lat: 14.5646, lng: 121.0414, width: 0.24, depth: 0.22, height: 0.98, district: "makati" },

  // --- C-5 / Bridgetowne / Arcovia / Pasig Proper / RTU Maybunga Surroundings ---
  { lat: 14.5858, lng: 121.0785, width: 0.28, depth: 0.24, height: 0.78, district: "pasig" }, // Bridgetowne / Ortigas East
  { lat: 14.5836, lng: 121.0758, width: 0.26, depth: 0.22, height: 0.72, district: "pasig" }, // Tiendesitas / Frontera
  { lat: 14.5768, lng: 121.0732, width: 0.24, depth: 0.22, height: 0.68, district: "pasig" }, // Arcovia
  { lat: 14.5618, lng: 121.0802, width: 0.24, depth: 0.22, height: 0.44, district: "pasig" }, // Pasig City Hall / Kapasigan
  { lat: 14.5642, lng: 121.0835, width: 0.22, depth: 0.2, height: 0.38, district: "pasig" },
  { lat: 14.5754, lng: 121.0972, width: 0.26, depth: 0.2, height: 0.36, district: "pasig" },  // Eusebio Ave / Maybunga blocks
  { lat: 14.5712, lng: 121.0976, width: 0.24, depth: 0.2, height: 0.34, district: "pasig" },
  { lat: 14.5742, lng: 121.1016, width: 0.24, depth: 0.2, height: 0.38, district: "pasig" },
  { lat: 14.5706, lng: 121.1012, width: 0.22, depth: 0.18, height: 0.32, district: "pasig" },
];

/**
 * District surface labels engraved subtly onto the 3D slab.
 */
export const DISTRICT_LABELS = [
  { text: "ORTIGAS CENTER", lat: 14.5855, lng: 121.0665 },
  { text: "BONIFACIO GLOBAL CITY", lat: 14.5452, lng: 121.0505 },
  { text: "PASIG CITY", lat: 14.5795, lng: 121.0935 },
  { text: "PASIG RIVER", lat: 14.5635, lng: 121.0595 },
] as const;

/**
 * Camera fly-to presets in Three.js world space.
 */
export const CAMERA_PRESETS: Record<MapPresetId, CameraPreset> = {
  corridor: {
    id: "corridor",
    label: "Full Corridor",
    shortLabel: "Corridor",
    position: [0.15, 11.3, 14.2],
    target: [0.05, 0.25, 0.1],
  },
  rtu: {
    id: "rtu",
    label: "RTU Pasig",
    shortLabel: "Pasig",
    position: [5.9, 4.3, 4.6],
    target: [5.4, 0.35, -1.5],
  },
  ortigas: {
    id: "ortigas",
    label: "Ortigas CBD",
    shortLabel: "Ortigas",
    position: [-2.1, 4.6, 2.8],
    target: [-2.6, 0.55, -2.9],
  },
  bgc: {
    id: "bgc",
    label: "BGC Close-Up",
    shortLabel: "BGC",
    position: [-3.8, 4.4, 8.2],
    target: [-5.2, 0.65, 3.3],
  },
};

/**
 * Returns minimum 2D distance from a slab point (x, z) to a projected polyline,
 * used to carve river channels and mask out terrain dots cleanly.
 */
export function distanceToPolylineSlab(
  px: number,
  pz: number,
  polylineLatLng: Array<[number, number]>,
): number {
  let minDistSq = Infinity;
  for (let i = 0; i < polylineLatLng.length - 1; i++) {
    const a = projectLatLngToSlab(polylineLatLng[i][0], polylineLatLng[i][1]);
    const b = projectLatLngToSlab(polylineLatLng[i + 1][0], polylineLatLng[i + 1][1]);
    const abx = b.x - a.x;
    const abz = b.z - a.z;
    const lenSq = abx * abx + abz * abz;
    let t = 0;
    if (lenSq > 1e-8) {
      t = Math.max(0, Math.min(1, ((px - a.x) * abx + (pz - a.z) * abz) / lenSq));
    }
    const cx = a.x + t * abx;
    const cz = a.z + t * abz;
    const dx = px - cx;
    const dz = pz - cz;
    const dSq = dx * dx + dz * dz;
    if (dSq < minDistSq) minDistSq = dSq;
  }
  return Math.sqrt(minDistSq);
}

/**
 * Checks whether a slab coordinate (x, z) falls inside the Pasig River,
 * Marikina River, or Manggahan Floodway water channels.
 */
export function isWaterChannelAtSlab(x: number, z: number): boolean {
  if (distanceToPolylineSlab(x, z, PASIG_RIVER_CENTERLINE) < 0.27) return true;
  if (distanceToPolylineSlab(x, z, MARIKINA_RIVER_CENTERLINE) < 0.2) return true;
  if (distanceToPolylineSlab(x, z, MANGGAHAN_FLOODWAY_CENTERLINE) < 0.22) return true;
  return false;
}


/**
 * Safely computes frame delta seconds from requestAnimationFrame timestamps.
 * Guards against initial rAF VSync timestamps preceding performance.now() (which would yield negative dt).
 */
export function computeFrameDeltaSeconds(nowMs: number, prevTimeMs: number | null): number {
  if (prevTimeMs === null || !Number.isFinite(nowMs) || !Number.isFinite(prevTimeMs)) {
    return 0;
  }
  return Math.max(0, Math.min(0.05, (nowMs - prevTimeMs) / 1000));
}

/**
 * Maps any real-valued progress (including negative values) onto a valid segment index + [0, 1] fraction
 * for a polyline of length `pointCount` (>= 2).
 */
export function getTrajectorySampleIndices(
  progress: number,
  pointCount: number,
): { index: number; nextIndex: number; alpha: number } {
  if (pointCount < 2 || !Number.isFinite(progress)) {
    return { index: 0, nextIndex: 0, alpha: 0 };
  }
  const unitT = ((progress % 1) + 1) % 1;
  const scaled = unitT * (pointCount - 1);
  const index = Math.min(pointCount - 2, Math.max(0, Math.floor(scaled)));
  const alpha = Math.max(0, Math.min(1, scaled - index));
  return { index, nextIndex: index + 1, alpha };
}

export interface CareerGraphStage {
  id: CareerStageId;
  indexLabel: string;
  shortLabel: string;
  pillLabel: string;
  building: string;
  district: string;
  organization: string;
  role: string;
  period: string;
  metricBadge: string;
  experienceSummary: string;
  tools: string[];
  status: "completed" | "current" | "target";
  image: string;
  imagePosition?: string;
  graphPos: [number, number];
  graphHeight: number;
  graphFootprint: [number, number];
}

export const CAREER_GRAPH_STAGES: CareerGraphStage[] = [
  {
    id: "college",
    indexLabel: "01",
    shortLabel: "College",
    pillLabel: "RTU PASIG",
    building: "RTU Pasig Campus",
    district: "Pasig City",
    organization: "Rizal Technological University",
    role: "BS Computer Engineering Graduate",
    period: "Aug 2022 – Jul 2026",
    metricBadge: "Engineering + Analytics Foundation",
    experienceSummary:
      "Built a strong foundation in software engineering, structured MySQL databases, machine learning, and real-time AIoT telemetry systems.",
    tools: ["Python", "MySQL", "XGBoost", "React", "Arduino"],
    status: "completed",
    image: "/assets/images/kevin-graduation-portrait-web.jpg",
    imagePosition: "center 20%",
    graphPos: [-4.8, 0.25],
    graphHeight: 1.45,
    graphFootprint: [1.12, 1.12],
  },
  {
    id: "denso",
    indexLabel: "02",
    shortLabel: "Denso Ten",
    pillLabel: "DENSO TEN",
    building: "Hanston Square",
    district: "Ortigas Center, Pasig",
    organization: "Denso Ten Solutions Philippines",
    role: "Data Analyst Intern",
    period: "Feb 2026 – Apr 2026",
    metricBadge: "75%-80% Reporting Time Reduction",
    experienceSummary:
      "Automated engineering operations workflows with Python and Excel VBA, engineered MySQL defect tracking tools, and built Power BI dashboards.",
    tools: ["Python", "MySQL", "Power BI", "Power Apps", "Excel VBA"],
    status: "completed",
    image: "/assets/images/career/denso-analytics.png",
    graphPos: [-2.4, 0.25],
    graphHeight: 2.15,
    graphFootprint: [1.12, 1.12],
  },
  {
    id: "phoenix",
    indexLabel: "03",
    shortLabel: "Phoenix",
    pillLabel: "PHOENIX",
    building: "Udenna Tower",
    district: "BGC, Taguig",
    organization: "Phoenix Petroleum Philippines",
    role: "Data Science Intern",
    period: "Jun 2026 – Jul 2026",
    metricBadge: "83% Report Time Cut & XGBoost",
    experienceSummary:
      "Engineered automated SQL warehouse ETL pipelines, built 1-to-3-day XGBoost canister demand forecast models, and cut daily reporting from 30 min to 5 min.",
    tools: ["Python", "SQL Warehouse", "ETL", "XGBoost", "Apps Script"],
    status: "completed",
    image: "/assets/images/career/phoenix-forecasting.png",
    graphPos: [0.0, 0.25],
    graphHeight: 2.85,
    graphFootprint: [1.12, 1.12],
  },
  {
    id: "luxasia",
    indexLabel: "04",
    shortLabel: "LUXASIA",
    pillLabel: "LUXASIA",
    building: "Three/NEO",
    district: "BGC, Taguig",
    organization: "Luxasia Pte. Ltd & Leap Commerce",
    role: "Data Analyst Intern",
    period: "Jul 2026 – Present",
    metricBadge: "Active Role: Commercial Data & BI",
    experienceSummary:
      "Driving Shopee and Lazada e-commerce analytics across the Philippines and Thailand using SQL, Python ETL web automation, and Power BI.",
    tools: ["SQL", "Python", "Power BI", "ETL Automation", "E-Commerce BI"],
    status: "current",
    image: "/assets/images/career/luxasia-internship.jpg",
    imagePosition: "center 22%",
    graphPos: [2.4, 0.25],
    graphHeight: 3.55,
    graphFootprint: [1.12, 1.12],
  },
  {
    id: "full-time-target",
    indexLabel: "05",
    shortLabel: "Full-Time Target",
    pillLabel: "TARGET ROLE",
    building: "Enterprise Data Team",
    district: "Metro Manila / Hybrid",
    organization: "Future Employer",
    role: "Data Analyst / Data Scientist",
    period: "Future",
    metricBadge: "Ready to Contribute & Grow",
    experienceSummary:
      "Target full-time data role focused on reliable pipelines, reporting automation, analytics engineering, and measurable business outcomes.",
    tools: ["SQL", "Python", "Power BI", "XGBoost", "ETL Pipelines"],
    status: "target",
    image: "/assets/images/career/full-time-job-icon-3d.png",
    graphPos: [4.8, 0.25],
    graphHeight: 4.25,
    graphFootprint: [1.12, 1.12],
  },
];

export const GRAPH_CAMERA_PRESET: CameraPreset = {
  id: "corridor",
  label: "All Stages",
  shortLabel: "Stages",
  position: [0.0, 5.4, 13.6],
  target: [0.0, 1.95, 0.2],
};

export function getGraphCameraFramingForStage(stage: CareerGraphStage): {
  position: [number, number, number];
  target: [number, number, number];
} {
  return {
    position: [stage.graphPos[0] + 1.35, stage.graphHeight + 2.2, stage.graphPos[1] + 6.2],
    target: [stage.graphPos[0], stage.graphHeight * 0.52, stage.graphPos[1]],
  };
}

/**
 * Advances a scalar morph factor strictly within [0, 1] toward `target` (0 = Graph, 1 = Map).
 */
export function computeMorphProgress(
  current: number,
  target: number,
  dt: number,
  durationSeconds = 0.85,
): number {
  const clampedCurrent = Number.isFinite(current) ? Math.max(0, Math.min(1, current)) : 0;
  const clampedTarget = Number.isFinite(target) ? Math.max(0, Math.min(1, target)) : 0;
  const safeDt = Number.isFinite(dt) ? Math.max(0, dt) : 0;
  const safeDuration = Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds : 0.85;
  const maxStep = safeDt / safeDuration;
  const diff = clampedTarget - clampedCurrent;
  if (Math.abs(diff) <= maxStep) {
    return clampedTarget;
  }
  return Math.max(0, Math.min(1, clampedCurrent + Math.sign(diff) * maxStep));
}

/**
 * Returns interpolated world position, Y scale multipliers, and visibility/opacity for a stage
 * as the scene morphs between Graph mode (morph = 0) and Metro Manila Map mode (morph = 1).
 */
export function getStageMorphState(
  stageId: CareerStageId,
  morph: number,
): {
  x: number;
  z: number;
  graphScaleY: number;
  mapScaleY: number;
  opacity: number;
  visibleInMode: boolean;
} {
  const m = Number.isFinite(morph) ? Math.max(0, Math.min(1, morph)) : 0;
  const ease = m * m * (3 - 2 * m);
  const stage = CAREER_GRAPH_STAGES.find((s) => s.id === stageId) ?? CAREER_GRAPH_STAGES[0];
  const [gx, gz] = stage.graphPos;

  if (stageId === "full-time-target") {
    return {
      x: gx,
      z: gz,
      graphScaleY: Math.max(0.001, 1 - ease),
      mapScaleY: 0,
      opacity: Math.max(0, 1 - ease),
      visibleInMode: m < 0.98,
    };
  }

  const pin = CAREER_MAP_PINS.find((p) => p.barId === stageId);
  const mapPt = pin ? projectLatLngToSlab(pin.lat, pin.lng) : { x: gx, z: gz };

  return {
    x: gx + (mapPt.x - gx) * ease,
    z: gz + (mapPt.z - gz) * ease,
    graphScaleY: Math.max(0.001, 1 - ease),
    mapScaleY: Math.max(0.001, ease),
    opacity: 1,
    visibleInMode: true,
  };
}
