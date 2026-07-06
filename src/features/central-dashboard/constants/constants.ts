export const TOP_METRICS = [
  { label: "Total DB Size", value: "1.13 Cr" },
  { label: "Total digitization/migration", value: "0.45 Cr" },
  { label: "Total Slip Capture", value: "0.70 Cr" },
  { label: "Total Live Enrollment", value: "0.32 Cr" },
  { label: "Total Chance Print", value: "0.67 Cr" },
];

export const MIDDLE_METRICS = [
  {
    type: "split",
    stats: [
      { label: "Total Hit", value: "8,167" },
      { label: "Total No Hit", value: "23,118" },
    ]
  },
  {
    type: "single",
    label: "Total Active Users",
    value: "3850"
  },
  {
    type: "split",
    stats: [
      { label: "Total Hit", value: "8,167" },
      { label: "Total No Hit", value: "23,118" },
    ]
  },
];

export const CATEGORY_DATA = [
  { name: 'Arrested', value: 400, fill: '#ef4444' },   // red-500
  { name: 'Convicted', value: 300, fill: '#f97316' },  // orange-500
  { name: 'Externeee', value: 300, fill: '#eab308' },  // yellow-500
  { name: 'Deportee', value: 200, fill: '#84cc16' },   // lime-500
  { name: 'UDB', value: 278, fill: '#14b8a6' },        // teal-500
  { name: 'Civil', value: 189, fill: '#06b6d4' },      // cyan-500
  { name: 'Suspect', value: 239, fill: '#3b82f6' },    // blue-500
  { name: 'UIFP', value: 349, fill: '#8b5cf6' },       // violet-500
  { name: 'Absconder', value: 100, fill: '#ec4899' },  // pink-500
  { name: 'Interpol', value: 50, fill: '#64748b' },    // slate-500
];

export const STATE_DATA = [
  { name: 'Maharashtra', value: 1520, fill: '#ef4444' }, // red-500
  { name: 'Uttar Pradesh', value: 1340, fill: '#f97316' }, // orange-500
  { name: 'Karnataka', value: 980, fill: '#eab308' }, // yellow-500
  { name: 'Tamil Nadu', value: 850, fill: '#22c55e' }, // green-500
  { name: 'Gujarat', value: 620, fill: '#3b82f6' }, // blue-500
];

export const DISTRICT_DATA = [
  { name: 'Mumbai (Maharashtra)', value: 450, fill: '#8b5cf6' }, // violet-500
  { name: 'Delhi (Delhi)', value: 380, fill: '#d946ef' }, // fuchsia-500
  { name: 'Bengaluru (Karnataka)', value: 310, fill: '#ec4899' }, // pink-500
  { name: 'Chennai (Tamil Nadu)', value: 240, fill: '#f43f5e' }, // rose-500
  { name: 'Ahmedabad (Gujarat)', value: 190, fill: '#06b6d4' }, // cyan-500
];

export const ChartsData = [
  {
    id: "categoryChart",
    title: "Categories",
    data: CATEGORY_DATA,
  },
  {
    id: "stateChart",
    title: "Top 5 States (HIT)",
    data: STATE_DATA,
  },
  {
    id: "districtChart",
    title: "Top 5 Districts (NO-HIT)",
    data: DISTRICT_DATA,
  },
];
