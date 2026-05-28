import { gregorianToJDN, jdnToGregorian, type GregorianDate } from "./dateUtils";

export interface HijriDate {
  year: number;
  month: number;
  day: number;
}

const HIJRI_EPOCH = 1948439.5;

const hijriMonthNames: Record<string, string[]> = {
  id: [
    "Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir",
    "Jumadil Awwal", "Jumadil Akhir", "Rajab", "Sya'ban",
    "Ramadhan", "Syawwal", "Dzul Qa'dah", "Dzul Hijjah",
  ],
  en: [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
  ],
};

export function isHijriLeapYear(year: number): boolean {
  return (year * 11 + 14) % 30 < 11;
}

export function getHijriMonthLength(year: number, month: number): number {
  if (month % 2 === 1) return 30;
  if (month < 12) return 29;
  return isHijriLeapYear(year) ? 30 : 29;
}

export function jdnToHijri(jd: number): HijriDate {
  jd = Math.floor(jd) + 0.5;
  const year = Math.floor((30 * (jd - HIJRI_EPOCH) + 10646) / 10631);
  let firstOfYear = HIJRI_EPOCH + Math.floor((10631 * year - 10646) / 30);
  let adjustedYear = year;
  if (jd < firstOfYear) {
    adjustedYear--;
    firstOfYear = HIJRI_EPOCH + Math.floor((10631 * adjustedYear - 10646) / 30);
  }
  const dayOfYear = Math.floor(jd - firstOfYear) + 1;
  let remaining = dayOfYear;
  let month = 1;
  for (; month <= 12; month++) {
    const daysInMonth = getHijriMonthLength(adjustedYear, month);
    if (remaining <= daysInMonth) break;
    remaining -= daysInMonth;
  }
  return { year: adjustedYear, month, day: remaining };
}

export function gregorianToHijri(year: number, month: number, day: number): HijriDate {
  const jd = gregorianToJDN(year, month, day);
  return jdnToHijri(jd);
}

export function hijriToJDN(year: number, month: number, day: number): number {
  const firstOfYear = HIJRI_EPOCH + Math.floor((10631 * year - 10646) / 30);
  let totalDays = 0;
  for (let m = 1; m < month; m++) {
    totalDays += getHijriMonthLength(year, m);
  }
  totalDays += day - 1;
  return firstOfYear + totalDays;
}

export function hijriToGregorian(year: number, month: number, day: number): GregorianDate {
  const jd = hijriToJDN(year, month, day);
  return jdnToGregorian(jd);
}

export function getHijriMonthName(month: number, lang: "id" | "en" = "id"): string {
  return hijriMonthNames[lang][month - 1];
}

export function getHijriDateString(hijri: HijriDate, lang: "id" | "en" = "id"): string {
  return `${hijri.day} ${getHijriMonthName(hijri.month, lang)} ${hijri.year} H`;
}

export function getHijriYearForGregorian(gy: number): number {
  return Math.floor((gy - 622) * (33 / 32));
}
