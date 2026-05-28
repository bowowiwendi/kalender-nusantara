import { gregorianToHijri, hijriToGregorian, getHijriMonthName } from "./hijri";
import { getShioAnimal, estimateChineseNewYear } from "./chineseCalendar";

export interface Holiday {
  date: string;
  title: string;
  description: string;
  type: "islamic" | "national" | "jawa" | "imlek" | "international";
}

const islamicHolidays: { month: number; day: number; title: string }[] = [
  { month: 1, day: 1, title: "Tahun Baru Hijriyah" },
  { month: 1, day: 10, title: "Asyura" },
  { month: 3, day: 12, title: "Maulid Nabi Muhammad SAW" },
  { month: 7, day: 27, title: "Isra' Mi'raj" },
  { month: 9, day: 1, title: "Awal Ramadhan" },
  { month: 9, day: 17, title: "Nuzulul Qur'an" },
  { month: 10, day: 1, title: "Idul Fitri" },
  { month: 10, day: 2, title: "Idul Fitri (Hari Kedua)" },
  { month: 12, day: 9, title: "Arafah" },
  { month: 12, day: 10, title: "Idul Adha" },
  { month: 12, day: 11, title: "Hari Tasyrik" },
  { month: 12, day: 12, title: "Hari Tasyrik" },
  { month: 12, day: 13, title: "Hari Tasyrik" },
];

const nationalHolidays: { month: number; day: number; title: string }[] = [
  { month: 1, day: 1, title: "Tahun Baru Masehi" },
  { month: 1, day: 3, title: "Hari Departemen Agama" },
  { month: 1, day: 25, title: "Hari Gizi Nasional" },
  { month: 2, day: 9, title: "Hari Pers Nasional" },
  { month: 2, day: 14, title: "Hari Valentine" },
  { month: 3, day: 1, title: "Hari Kehakiman Nasional" },
  { month: 3, day: 8, title: "Hari Perempuan Internasional" },
  { month: 3, day: 24, title: "Hari Peringatan Bandung Lautan Api" },
  { month: 4, day: 6, title: "Hari Nelayan Nasional" },
  { month: 4, day: 9, title: "Hari TNI Angkatan Udara" },
  { month: 4, day: 21, title: "Hari Kartini" },
  { month: 4, day: 22, title: "Hari Bumi" },
  { month: 5, day: 1, title: "Hari Buruh Internasional" },
  { month: 5, day: 2, title: "Hari Pendidikan Nasional" },
  { month: 5, day: 20, title: "Hari Kebangkitan Nasional" },
  { month: 6, day: 1, title: "Hari Lahir Pancasila" },
  { month: 6, day: 3, title: "Hari Pasar Modal Indonesia" },
  { month: 7, day: 22, title: "Hari Bhakti Adhyaksa" },
  { month: 7, day: 23, title: "Hari Anak Nasional" },
  { month: 8, day: 10, title: "Hari Veteran Nasional" },
  { month: 8, day: 14, title: "Hari Pramuka" },
  { month: 8, day: 17, title: "Hari Kemerdekaan RI" },
  { month: 9, day: 11, title: "Hari Radio Republik Indonesia" },
  { month: 10, day: 1, title: "Hari Kesaktian Pancasila" },
  { month: 10, day: 5, title: "Hari Tentara Nasional Indonesia" },
  { month: 10, day: 28, title: "Hari Sumpah Pemuda" },
  { month: 11, day: 10, title: "Hari Pahlawan" },
  { month: 11, day: 28, title: "Hari Menanam Pohon Indonesia" },
  { month: 12, day: 1, title: "Hari AIDS Sedunia" },
  { month: 12, day: 22, title: "Hari Ibu" },
  { month: 12, day: 25, title: "Hari Natal" },
];

const javaneseHolidays: { month: number; day: number; title: string; description: string }[] = [
  { month: 1, day: 1, title: "Tahun Baru Jawa (1 Sura)", description: "Tahun baru dalam kalender Jawa Islam" },
  { month: 1, day: 10, title: "Malam Satu Suro", description: "Malam sakral dalam tradisi Jawa" },
];

function isInMonth(date: Date, month: number, day: number): boolean {
  return date.getMonth() + 1 === month && date.getDate() === day;
}

function findIslamicHolidaysInYear(gregorianYear: number): Holiday[] {
  const holidays: Holiday[] = [];
  const hijriYear = Math.floor((gregorianYear - 622) * (33 / 32));

  for (const h of islamicHolidays) {
    for (const hy of [hijriYear - 1, hijriYear, hijriYear + 1]) {
      try {
        const greg = hijriToGregorian(hy, h.month, h.day);
        if (greg.year === gregorianYear) {
          holidays.push({
            date: `${greg.year}-${greg.month.toString().padStart(2, "0")}-${greg.day.toString().padStart(2, "0")}`,
            title: h.title,
            description: `${h.day} ${getHijriMonthName(h.month)} ${hy} H`,
            type: "islamic",
          });
        }
      } catch {}
    }
  }
  return holidays;
}

function findNationalHolidaysInYear(year: number): Holiday[] {
  return nationalHolidays.map((h) => ({
    date: `${year}-${h.month.toString().padStart(2, "0")}-${h.day.toString().padStart(2, "0")}`,
    title: h.title,
    description: "",
    type: "national" as const,
  }));
}

function findImlekHolidaysInYear(year: number): Holiday[] {
  const holidays: Holiday[] = [];
  const cny = estimateChineseNewYear(year);
  const shio = getShioAnimal(year);
  holidays.push({
    date: `${year}-${(cny.getMonth() + 1).toString().padStart(2, "0")}-${cny.getDate().toString().padStart(2, "0")}`,
    title: "Tahun Baru Imlek",
    description: `Tahun ${shio} - Tahun Baru Cina`,
    type: "imlek",
  });
  const capGoMe = new Date(cny);
  capGoMe.setDate(capGoMe.getDate() + 14);
  if (capGoMe.getFullYear() === year) {
    holidays.push({
      date: `${year}-${(capGoMe.getMonth() + 1).toString().padStart(2, "0")}-${capGoMe.getDate().toString().padStart(2, "0")}`,
      title: "Cap Go Meh",
      description: "Perayaan 15 hari setelah Imlek",
      type: "imlek",
    });
  }
  return holidays;
}

export function getHolidaysForYear(year: number): Holiday[] {
  const holidays: Holiday[] = [
    ...findIslamicHolidaysInYear(year),
    ...findNationalHolidaysInYear(year),
    ...findImlekHolidaysInYear(year),
  ];
  holidays.sort((a, b) => a.date.localeCompare(b.date));
  return holidays;
}

export function getHolidaysForMonth(year: number, month: number): Holiday[] {
  return getHolidaysForYear(year).filter((h) => h.date.startsWith(`${year}-${month.toString().padStart(2, "0")}`));
}

export function getHolidaysForDate(year: number, month: number, day: number): Holiday[] {
  const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  return getHolidaysForYear(year).filter((h) => h.date === dateStr);
}

export function getHolidayBadgeColor(type: Holiday["type"]): string {
  switch (type) {
    case "islamic": return "badge-green";
    case "national": return "badge-blue";
    case "jawa": return "badge-gold";
    case "imlek": return "badge-red";
    default: return "badge";
  }
}

export function getHolidayTypeName(type: Holiday["type"]): string {
  switch (type) {
    case "islamic": return "Islam";
    case "national": return "Nasional";
    case "jawa": return "Jawa";
    case "imlek": return "Imlek";
    default: return "Lainnya";
  }
}
