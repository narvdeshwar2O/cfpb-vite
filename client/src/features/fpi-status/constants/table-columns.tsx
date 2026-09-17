/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef, HeaderGroup } from "@/components/ui/data-table";

export function createColumns(
  locationKey: string,
  locationLabel: string,
  numberCols: { key: string; label: string }[]
): ColumnDef<any>[] {
  return [
    {
      key: "id",
      label: "Sl. No",
      headerClassName: "text-center align-middle w-20 border-r border-slate-200",
      cellClassName: "text-center align-middle font-medium text-slate-700 border-r border-slate-200",
      render: (_, idx) => idx + 1
    },
    {
      key: locationKey,
      label: locationLabel,
      headerClassName: "text-center align-middle border-r border-slate-200 min-w-32",
      cellClassName: "text-center align-middle border-r border-slate-200 min-w-32",
      render: (row: any) => {
        const val = row[locationKey];
        if (!val) return "N/A";
        return <span className="font-medium text-slate-700 uppercase">{String(val)}</span>;
      }
    },
    ...numberCols.map(col => ({
      key: col.key,
      label: col.label,
      headerClassName: "text-center align-middle border-r border-slate-200 min-w-28",
      cellClassName: "text-center align-middle border-r border-slate-200",
      render: (row: Record<string, any>) => Number(row[col.key] || 0).toLocaleString()
    }))
  ];
}

// 1. Human Body Offences
export const HUMAN_BODY_COLS = createColumns("state", "State/UTs/CLEAs", [
  { key: "murder", label: "Murder Sec. 302 IPC/ 103 (1) & (2) BNS" },
  { key: "culpable_homicide", label: "Culpable Homicide Sec. 304 IPC/ 105 BNS" },
  { key: "death_negligence", label: "Causing death by Negligence Sec 304-A IPC/ 106 BNS" },
  { key: "dowry_death", label: "Dowry Deaths Sec 304B IPC/ 80 BNS" },
  { key: "abedment_suicide", label: "Abetment of suicide Sec 305, 306 IPC/ 107, 108 BNS" },
  { key: "attempt_murder", label: "Attempt to Murder & Culpable homicide Sec 307 &Sec 308 IPC/ 109, 110 BNS" },
  { key: "griveous_hurt", label: "Grievous Hurt Sec 324, 325,326, 332, 333 & 353 IPC/ 117 (2,3,4), 118 (1,2), 121(1,2) r/w, 132 BNS" },
  { key: "acid_attack", label: "Acid attack Sec 326A,326B IPC/ 124 (1&2) BNS" },
  { key: "assault_women", label: "Assault on Women Sec 354, 354 A,B,C,D IPC/ 74, 75, 76, 77, 78 BNS" },
  { key: "kidnapping", label: "Kidnapping & Abduction Sec 363, 363A, 364, 364A, 365, 366 A,B & 367, 368 IPC/ 137 To 140 (1,2,3,4), 141, 142 BNS" },
  { key: "human_trafficking", label: "Human trafficking Sec 370, 370A, 372, 373 IPC/ 98, 99 BNS" },
  { key: "rape", label: "Rape Sec 376 IPC/ 64, 65, 66, 67, 68, 69, 70, 71 r/w, 72(1) BNS" }
]);

export const HUMAN_BODY_HEADERS: HeaderGroup[] = [
  { label: "Sl. No", colSpan: 1, rowSpan: 2 },
  { label: "State/UTs/CLEAs", colSpan: 1, rowSpan: 2 },
  { label: "IPC/BNS - Offences against/affecting Human Body", colSpan: 12 }
];

// 2. Property Offences
export const PROPERTY_COLS = createColumns("state", "State/UTs/CLEAs", [
  { key: "theft", label: "Theft Sec 379,382 IPC/ 303, 305-307 BNS" },
  { key: "burglary", label: "Burglary Sec 454 to460 r/w, 380 IPC/ 329(4),332-334 r/w,303 or 331 r/w 305 BNS" },
  { key: "robbery", label: "Robbery Sec 392,394,397 IPC/ 309(4),309(6),311 BNS" },
  { key: "dacoity", label: "Dacoity Sec 395, 397 & 396 IPC/ 310(2&3), 311 BNS" },
  { key: "forgery", label: "Forgery, Cheating & Fraud Sec 420 r/w, 465, 468-471IPC 318(4) r/w 336(2) (3) (4),340 (2) BNS" },
  { key: "counterfeiting", label: "Counterfeiting Sec 231-235, 237, 238-240 & 242-254, 255-260, 472, 473,489-A to 489-E IPC/ 178, 181, 183-186, 187-188, 341 (1) (2) (3) (4) BNS" },
  { key: "other", label: "Other IPC/ BNS Crimes" }
]);

export const PROPERTY_HEADERS: HeaderGroup[] = [
  { label: "Sl. No", colSpan: 1, rowSpan: 2 },
  { label: "State/UTs/CLEAs", colSpan: 1, rowSpan: 2 },
  { label: "IPC/BNS -Offences Against Property", colSpan: 4 },
  { label: "IPC/BNS -Offences Relating to Document & Property Marks", colSpan: 3 }
];

// 3. Expert Opinion
export const EXPERT_OPINION_COLS = createColumns("state", "State/UTs/CLEAs", [
  { key: "sup_lv", label: "SUPLVQ" },
  { key: "sup_rv", label: "SUPRVQ" }
]);

export const EXPERT_OPINION_HEADERS: HeaderGroup[][] = [
  [
    { label: "Sl. No", colSpan: 1, rowSpan: 2 },
    { label: "State/UTs/CLEAs", colSpan: 1, rowSpan: 2 },
    { label: "Expert Opinion Recorded In Cases of", colSpan: 2 }
  ]
];

// 4. Ten Prints Enrolled
export const TEN_PRINTS_COLS = createColumns("state", "State/UTs/CLEAs", [
  { key: "tp_enroll", label: "Total no. of Ten Prints enrolled" },
  { key: "tp_intra_tptp_hit", label: "With same State NFN" },
  { key: "tp_inter_tptp_hit", label: "With other State NFN" },
  { key: "tp_intra_tppul_hit", label: "With Same state ID" },
  { key: "tp_inter_tppul_hit", label: "With other State ID" },
  { key: "tp_no_hit", label: "Total no. of TP NOHIT" },
]);

export const TEN_PRINTS_HEADERS: HeaderGroup[][] = [
  [
    { label: "Sl. No", colSpan: 1, rowSpan: 4 },
    { label: "State/UTs/CLEAs", colSpan: 1, rowSpan: 4 },
    { label: "Total no. of TP (Arrested and Record) Enrolled Related Information", colSpan: 7 }
  ],
  [
    { label: "Total no. of Ten Prints enrolled", colSpan: 1, rowSpan: 3 },
    { label: "Total no. of TP HIT", colSpan: 4 },
    { label: "Total no. of TP NOHIT", colSpan: 1, rowSpan: 3 },
  ],
  [
    { label: "With TP to TP", colSpan: 2 },
    { label: "With Unsolved Latent (UL)", colSpan: 2 }
  ]
];

// 5. Chance Print
export const CHANCE_PRINT_COLS = createColumns("state", "State/UTs/CLEAs", [
  { key: "lt_enroll", label: "Total no. of Chance prints enrolled" },
  { key: "lt_intra_hit", label: "With state NFN" },
  { key: "lt_inter_hit", label: "With other state NFN" },
  { key: "lt_no_hit", label: "Total no. of Chance prints Untraced" },

]);

export const CHANCE_PRINT_HEADERS: HeaderGroup[][] = [
  [
    { label: "Sl. No", colSpan: 1, rowSpan: 2 },
    { label: "State/UTs/CLEAs", colSpan: 1, rowSpan: 2 },
    { label: "Total no. of Chance prints enrolled", colSpan: 1, rowSpan: 2 },
    { label: "Total no. of Chance Prints Traced", colSpan: 2 },
    { label: "Total no. of Chance prints Untraced", colSpan: 1, rowSpan: 2 },
  ]
];

// 6. Foreigners TP
export const FOREIGNERS_TP_COLS = createColumns("country", "Name of the country of origin", [
  { key: "foreigner_convicted_enroll", label: "No. of convicts TP enrolled" },
  { key: "foreigner_arrested_enroll", label: "No. of arrestee TP enrolled" },
  { key: "tp_hit", label: "No. of TP HIT" },
  { key: "tp_no_hit", label: "No. of TP NOHIT" }
]);
