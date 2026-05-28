import { getDayName } from "./dateUtils";

export interface WetonInfo {
  dayName: string;
  pasaran: string;
  neptuHari: number;
  neptuPasaran: number;
  totalNeptu: number;
  weton: string;
  description?: string;
}

const pasaranNames = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

const dayNeptu: Record<number, number> = {
  0: 5, 1: 4, 2: 3, 3: 7, 4: 8, 5: 6, 6: 9,
};

const pasaranNeptu: Record<number, number> = {
  0: 5, 1: 9, 2: 7, 3: 4, 4: 8,
};

// Known reference: 17 August 1945 = Friday (5) with pasaran Legi (0)
const REFERENCE_DATE = new Date(1945, 7, 17);
const REFERENCE_DAY = 5;
const REFERENCE_PASARAN = 0;

export function computeWeton(year: number, month: number, day: number): WetonInfo {
  const date = new Date(year, month - 1, day);
  const targetDay = date.getDay();
  const diffMs = date.getTime() - REFERENCE_DATE.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const pasaranIndex = ((REFERENCE_PASARAN + diffDays) % 5 + 5) % 5;
  const neptuHari = dayNeptu[targetDay];
  const neptuPas = pasaranNeptu[pasaranIndex];
  const total = neptuHari + neptuPas;
  const dayName = getDayName(targetDay);
  const pasaran = pasaranNames[pasaranIndex];
  const descriptions: Record<number, string> = {
    7: "Paling naas, hati-hati dalam bertindak",
    8: "Naas, cenderung sulit dalam rezeki",
    9: "Kurang baik, mudah sakit",
    10: "Kurang beruntung, banyak cobaan",
    11: "Cukup baik, rezeki lancar",
    12: "Baik, kuat dalam spiritual",
    13: "Sangat baik, berwibawa",
    14: "Sangat baik, sukses dalam usaha",
    15: "Istimewa, kaya raya dan mulia",
    16: "Istimewa, banyak rezeki",
    17: "Istimewa, selamat dan sejahtera",
    18: "Paling istimewa, segala kebaikan",
  };

  return {
    dayName,
    pasaran,
    neptuHari,
    neptuPasaran: neptuPas,
    totalNeptu: total,
    weton: `${dayName} ${pasaran}`,
    description: descriptions[total] || "Netral",
  };
}

export function getPasaranName(index: number): string {
  return pasaranNames[((index % 5) + 5) % 5];
}

export function getPasaranForDate(year: number, month: number, day: number): string {
  const date = new Date(year, month - 1, day);
  const diffMs = date.getTime() - REFERENCE_DATE.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const pasaranIndex = ((REFERENCE_PASARAN + diffDays) % 5 + 5) % 5;
  return pasaranNames[pasaranIndex];
}

export function getNeptuDescription(total: number): string {
  if (total <= 7) return "Kurang baik";
  if (total <= 10) return "Cukup";
  if (total <= 13) return "Baik";
  if (total <= 15) return "Sangat baik";
  return "Istimewa";
}
