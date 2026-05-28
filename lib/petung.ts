import { computeWeton } from "./jawa";
import { getPasaranForDate } from "./jawa";

const dayNeptu: Record<number, number> = {
  0: 5, 1: 4, 2: 3, 3: 7, 4: 8, 5: 6, 6: 9,
};

const pasaranNeptu: Record<string, number> = {
  Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8,
};

export function getNeptu(weton: string): number {
  const parts = weton.split(" ");
  if (parts.length < 2) return 0;
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const dy = dayNames.indexOf(parts[0]);
  if (dy === -1) return 0;
  const ps = parts[1];
  return (dayNeptu[dy] || 0) + (pasaranNeptu[ps] || 0);
}

export function getNeptuFromDate(year: number, month: number, day: number): number {
  const weton = computeWeton(year, month, day);
  return weton.totalNeptu;
}

export interface PetungResult {
  totalNeptu: number;
  divisor: number;
  remainder: number;
  label: string;
  meaning: string;
  description: string;
  isGood: boolean;
  score: number;
}

interface PancasudaEntry {
  label: string;
  meaning: string;
  description: string;
  isGood: boolean;
  score: number;
}

const pancasudaTable: Record<number, PancasudaEntry> = {
  1: { label: "Sandang", meaning: "Rezeki Melimpah", description: "Sangat baik. Rezeki lancar, usaha membuahkan hasil, hidup berkecukupan.", isGood: true, score: 5 },
  2: { label: "Pangan", meaning: "Berkecukupan", description: "Baik. Hidup berkecukupan, kebutuhan tercukupi, rezeki cukup.", isGood: true, score: 4 },
  3: { label: "Bejo", meaning: "Beruntung Tapi Tertantang", description: "Cukup baik. Akan mendapat keberuntungan namun ada tantangan dari orang sekitar.", isGood: true, score: 3 },
  4: { label: "Lara", meaning: "Sakit / Rugi", description: "Kurang baik. Rentan mengalami kerugian, sakit, atau kesulitan.", isGood: false, score: 1 },
  0: { label: "Pati", meaning: "Keburukan / Gagal", description: "Tidak baik. Usaha atau hajat dikhawatirkan menemui kegagalan, musibah.", isGood: false, score: 0 },
};

const guruRatuTable: Record<number, { label: string; meaning: string; description: string; isGood: boolean; score: number }> = {
  1: { label: "Guru", meaning: "Lancar & Dihormati", description: "Sangat baik. Rezeki lancar, dihormati orang lain, kehidupan harmonis.", isGood: true, score: 5 },
  2: { label: "Ratu", meaning: "Bahagia & Mulia", description: "Sangat baik. Mendapat kebahagiaan, kemuliaan, dan keberuntungan.", isGood: true, score: 5 },
  3: { label: "Rogoh", meaning: "Rentan Kemasukan", description: "Kurang baik. Rentan terhadap hal-hal negatif seperti kemalingan.", isGood: false, score: 1 },
  0: { label: "Sempoyong", meaning: "Tidak Kuat", description: "Tidak baik. Tidak kuat menghadapi cobaan, mudah goyah.", isGood: false, score: 0 },
};

export function calculateGeneralGoodDay(personNeptu: number, targetDayNeptu: number): PetungResult {
  const total = personNeptu + targetDayNeptu;
  const remainder = total % 5;
  const entry = pancasudaTable[remainder];
  return {
    totalNeptu: total,
    divisor: 5,
    remainder,
    label: entry.label,
    meaning: entry.meaning,
    description: entry.description,
    isGood: entry.isGood,
    score: entry.score,
  };
}

export function calculateMovingHouse(personNeptu: number, targetDayNeptu: number): PetungResult {
  const total = personNeptu + targetDayNeptu;
  const remainder = total % 4;
  const entry = guruRatuTable[remainder];
  return {
    totalNeptu: total,
    divisor: 4,
    remainder,
    label: entry.label,
    meaning: entry.meaning,
    description: entry.description,
    isGood: entry.isGood,
    score: entry.score,
  };
}

export function calculateStartingBusiness(personNeptu: number, targetDayNeptu: number): PetungResult {
  return calculateGeneralGoodDay(personNeptu, targetDayNeptu);
}

export function findGoodDays(year: number, month: number, personNeptu: number, purpose: "general" | "moving" | "business"): { date: Date; result: PetungResult }[] {
  const daysCount = new Date(year, month, 0).getDate();
  const results: { date: Date; result: PetungResult }[] = [];
  for (let d = 1; d <= daysCount; d++) {
    const targetNeptu = getNeptuFromDate(year, month, d);
    let result: PetungResult;
    switch (purpose) {
      case "moving":
        result = calculateMovingHouse(personNeptu, targetNeptu);
        break;
      case "business":
        result = calculateStartingBusiness(personNeptu, targetNeptu);
        break;
      default:
        result = calculateGeneralGoodDay(personNeptu, targetNeptu);
    }
    if (result.isGood) {
      results.push({ date: new Date(year, month - 1, d), result });
    }
  }
  return results.sort((a, b) => b.result.score - a.result.score);
}

export interface WeddingResult {
  totalNeptu: number;
  label: string;
  meaning: string;
  description: string;
  isGood: boolean;
}

const weddingTable: Record<number, { label: string; meaning: string; description: string; isGood: boolean }> = {
  1: { label: "Pegat", meaning: "Cerai / Pisah", description: "Cenderung bermasalah, rawan perceraian, pertengkaran.", isGood: false },
  2: { label: "Ratu", meaning: "Pasangan Sejati", description: "Istimewa. Pasangan harmonis, dihormati, disegani orang lain.", isGood: true },
  3: { label: "Jodoh", meaning: "Jodoh Sejati", description: "Sangat baik. Berjodoh, rumah tangga rukun, saling menerima.", isGood: true },
  4: { label: "Topo", meaning: "Kesusahan Awal", description: "Cukup. Awalnya susah, namun akhirnya bahagia dan sukses.", isGood: true },
  5: { label: "Tinari", meaning: "Bahagia & Berkah", description: "Sangat baik. Rumah tangga bahagia, rezeki melimpah.", isGood: true },
  6: { label: "Padu", meaning: "Pertengkaran", description: "Kurang baik. Sering bertengkar meski tidak sampai cerai.", isGood: false },
  7: { label: "Sujanan", meaning: "Perselingkuhan", description: "Kurang baik. Rawan perselingkuhan, ketidaksetiaan.", isGood: false },
  8: { label: "Pesthi", meaning: "Kekal & Harmonis", description: "Sangat baik. Rumah tangga kekal, rukun, harmonis selamanya.", isGood: true },
};

export function calculateWedding(person1Neptu: number, person2Neptu: number): WeddingResult {
  const total = person1Neptu + person2Neptu;
  const key = ((total - 1) % 8) + 1;
  const entry = weddingTable[key];
  return {
    totalNeptu: total,
    label: entry.label,
    meaning: entry.meaning,
    description: entry.description,
    isGood: entry.isGood,
  };
}

export function calculateWeddingWithDay(person1Neptu: number, person2Neptu: number, weddingDayNeptu: number): WeddingResult {
  return calculateWedding(person1Neptu + weddingDayNeptu, person2Neptu);
}

export function getWetonFromDate(year: number, month: number, day: number): string {
  return computeWeton(year, month, day).weton;
}

export function getPurposeLabel(purpose: string): string {
  const labels: Record<string, string> = {
    general: "Hari Baik (Pancasuda)",
    moving: "Pindah Rumah",
    business: "Memulai Usaha",
    wedding: "Kecocokan Jodoh",
  };
  return labels[purpose] || purpose;
}

export function getDayNames(): string[] {
  return ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
}

export function getPasaranNames(): string[] {
  return ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
}
