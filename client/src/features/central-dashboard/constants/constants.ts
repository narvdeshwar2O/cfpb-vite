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
  { name: 'Arrested', value: 400, fill: '#60a5fa' },   // blue-400
  { name: 'Convicted', value: 300, fill: '#34d399' },  // emerald-400
  { name: 'Externeee', value: 300, fill: '#fbbf24' },  // amber-400
  { name: 'Deportee', value: 200, fill: '#a78bfa' },   // violet-400
  { name: 'UDB', value: 278, fill: '#f472b6' },        // pink-400
  { name: 'Civil', value: 189, fill: '#2dd4bf' },      // teal-400
  { name: 'Suspect', value: 239, fill: '#fb923c' },    // orange-400
  { name: 'UIFP', value: 349, fill: '#38bdf8' },       // sky-400
  { name: 'Absconder', value: 100, fill: '#818cf8' },  // indigo-400
  { name: 'Interpol', value: 50, fill: '#94a3b8' },    // slate-400
];

export const STATE_DATA = [
  { name: 'Maharashtra', value: 1520, fill: '#60a5fa' }, // blue-400
  { name: 'Uttar Pradesh', value: 1340, fill: '#34d399' }, // emerald-400
  { name: 'Karnataka', value: 980, fill: '#fbbf24' }, // amber-400
  { name: 'Tamil Nadu', value: 850, fill: '#a78bfa' }, // violet-400
  { name: 'Gujarat', value: 620, fill: '#f472b6' }, // pink-400
];

export const DISTRICT_DATA = [
  { name: 'Mumbai (Maharashtra)', value: 450, fill: '#a78bfa' }, // violet-400
  { name: 'Delhi (Delhi)', value: 380, fill: '#f472b6' }, // pink-400
  { name: 'Bengaluru (Karnataka)', value: 310, fill: '#2dd4bf' }, // teal-400
  { name: 'Chennai (Tamil Nadu)', value: 240, fill: '#fb923c' }, // orange-400
  { name: 'Ahmedabad (Gujarat)', value: 190, fill: '#38bdf8' }, // sky-400
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
