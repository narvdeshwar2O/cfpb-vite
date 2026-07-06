export const TOP_METRICS = [
  { label: "Total DB size", value: "1.13 Cr" },
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
  { name: 'Arrested', value: 400, fill: '#4f46e5' },   // indigo-600
  { name: 'Convicted', value: 300, fill: '#6366f1' },  // indigo-500
  { name: 'Externeee', value: 300, fill: '#818cf8' },  // indigo-400
  { name: 'Deportee', value: 200, fill: '#0ea5e9' },   // sky-500
  { name: 'UDB', value: 278, fill: '#38bdf8' },        // sky-400
  { name: 'Civil', value: 189, fill: '#7dd3fc' },      // sky-300
  { name: 'Suspect', value: 239, fill: '#14b8a6' },    // teal-500
  { name: 'UIFP', value: 349, fill: '#2dd4bf' },       // teal-400
  { name: 'Absconder', value: 100, fill: '#8b5cf6' },  // violet-500
  { name: 'Interpol', value: 50, fill: '#a78bfa' },    // violet-400
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
