export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

export function gregorianToJDN(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) { y--; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
  return Math.floor(jd + 0.5);
}

export function jdnToGregorian(jd: number): GregorianDate {
  const z = Math.floor(jd + 0.5);
  const alpha = Math.floor((z - 1867216.25) / 36524.25);
  const a = z + 1 + alpha - Math.floor(alpha / 4);
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = Math.floor(b - d - Math.floor(30.6001 * e));
  let month = Math.floor(e - 1);
  if (month > 12) month -= 12;
  let year = Math.floor(c - 4715);
  if (month > 2) year--;
  if (year <= 0) year--;
  return { year, month, day };
}

export function getMonthDays(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export function getDayName(id: number, lang: "id" | "en" = "id"): string {
  const names = {
    id: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  };
  return names[lang][id];
}

export function getMonthName(id: number, lang: "id" | "en" = "id"): string {
  const names = {
    id: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  };
  return names[lang][id - 1];
}

export function getMoonPhase(date: Date): { phase: number; name: string; illumination: number } {
  const jd = gregorianToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const newMoonJd = 2451549.5;
  const lunarCycle = 29.53058867;
  const daysSinceNewMoon = jd - newMoonJd;
  const phase = ((daysSinceNewMoon / lunarCycle) % 1 + 1) % 1;

  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;

  let name: string;
  if (phase < 0.025 || phase > 0.975) name = "Bulan Baru";
  else if (phase < 0.25) name = "Bulan Sabit Muda";
  else if (phase < 0.275) name = "Kuartal Pertama";
  else if (phase < 0.475) name = "Bulan Cembung Awal";
  else if (phase < 0.525) name = "Bulan Purnama";
  else if (phase < 0.725) name = "Bulan Cembung Akhir";
  else if (phase < 0.775) name = "Kuartal Ketiga";
  else name = "Bulan Sabit Tua";

  return { phase, name, illumination: Math.round(illumination * 100) };
}

export function getMoonPhaseEn(date: Date): { phase: number; name: string; illumination: number } {
  const jd = gregorianToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const newMoonJd = 2451549.5;
  const lunarCycle = 29.53058867;
  const daysSinceNewMoon = jd - newMoonJd;
  const phase = ((daysSinceNewMoon / lunarCycle) % 1 + 1) % 1;

  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;

  let name: string;
  if (phase < 0.025 || phase > 0.975) name = "New Moon";
  else if (phase < 0.25) name = "Waxing Crescent";
  else if (phase < 0.275) name = "First Quarter";
  else if (phase < 0.475) name = "Waxing Gibbous";
  else if (phase < 0.525) name = "Full Moon";
  else if (phase < 0.725) name = "Waning Gibbous";
  else if (phase < 0.775) name = "Third Quarter";
  else name = "Waning Crescent";

  return { phase, name, illumination: Math.round(illumination * 100) };
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDate(date: Date, format: string = "DD MMMM YYYY", lang: "id" | "en" = "id"): string {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  const monthName = getMonthName(m, lang);
  const dayName = getDayName(date.getDay(), lang);

  return format
    .replace("DD", d.toString().padStart(2, "0"))
    .replace("D", d.toString())
    .replace("MMMM", monthName)
    .replace("MM", m.toString().padStart(2, "0"))
    .replace("YYYY", y.toString())
    .replace("YY", y.toString().slice(-2))
    .replace("dddd", dayName)
    .replace("ddd", dayName.slice(0, 3));
}

export function isDateEqual(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

export function isToday(date: Date): boolean {
  return isDateEqual(date, new Date());
}
