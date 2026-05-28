export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}

export interface PrayerMethod {
  id: number;
  name: string;
  fajrAngle: number;
  ishaAngle: number;
}

export const prayerMethods: PrayerMethod[] = [
  { id: 0, name: "KEMENAG RI", fajrAngle: 20, ishaAngle: 18 },
  { id: 1, name: "Muhammadiyah", fajrAngle: 20, ishaAngle: 18 },
  { id: 2, name: "MWL (Muslim World League)", fajrAngle: 18, ishaAngle: 17 },
  { id: 3, name: "ISNA (North America)", fajrAngle: 15, ishaAngle: 15 },
  { id: 4, name: "Egyptian General Authority", fajrAngle: 19.5, ishaAngle: 17.5 },
  { id: 5, name: "University of Islamic Sciences, Karachi", fajrAngle: 18, ishaAngle: 18 },
  { id: 6, name: "Umm al-Qura, Makkah", fajrAngle: 18.5, ishaAngle: 0 },
  { id: 7, name: "Dubai", fajrAngle: 18.2, ishaAngle: 18.2 },
  { id: 8, name: "Qatar", fajrAngle: 18, ishaAngle: 0 },
  { id: 9, name: "Kuwait", fajrAngle: 18, ishaAngle: 17.5 },
  { id: 10, name: "Tehran", fajrAngle: 17.7, ishaAngle: 14 },
  { id: 11, name: "Jafari (Shia)", fajrAngle: 16, ishaAngle: 14 },
];

function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

function radToDeg(rad: number): number {
  return rad * (180 / Math.PI);
}

function getSunDeclination(jd: number): { decl: number; eqTime: number } {
  const t = (jd - 2451545.0) / 36525;
  const l = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  const anom = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  const sinL = Math.sin(degToRad(l));
  const eqTime = 0.0053 * Math.sin(degToRad(anom)) - 0.0069 * Math.sin(2 * degToRad(l));
  const obl = 23.439291 - 0.0130042 * t;
  const decl = radToDeg(Math.asin(Math.sin(degToRad(obl)) * sinL));
  return { decl, eqTime };
}

function fixHour(h: number): number {
  const result = h % 24;
  return result < 0 ? result + 24 : result;
}

export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  timezone: number,
  methodId: number = 2
): PrayerTimes {
  const method = prayerMethods.find((m) => m.id === methodId) || prayerMethods[2];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
    Math.floor(275 * month / 9) + day - 730531.5;
  const { decl, eqTime: eqt } = getSunDeclination(jd);

  const dhuhr = 12 + (lng * 4 - eqt * 60) / 60 - timezone;
  const dhuhrFormatted = formatTime(dhuhr - 0.16);

  const sunAlt = -0.833;
  const sunriseAngle = radToDeg(Math.acos(
    (Math.sin(degToRad(sunAlt)) - Math.sin(degToRad(lat)) * Math.sin(degToRad(decl))) /
    (Math.cos(degToRad(lat)) * Math.cos(degToRad(decl)))
  ));
  const sunrise = fixHour(dhuhr - sunriseAngle / 15);
  const maghrib = fixHour(dhuhr + sunriseAngle / 15);

  const fajrAngle = degToRad(90 + method.fajrAngle);
  const fajrAlt = radToDeg(Math.acos(
    (Math.cos(fajrAngle) - Math.sin(degToRad(lat)) * Math.sin(degToRad(decl))) /
    (Math.cos(degToRad(lat)) * Math.cos(degToRad(decl)))
  ));
  const fajr = fixHour(dhuhr - fajrAlt / 15);

  const ishaAngleRad = degToRad(90 + method.ishaAngle);
  const ishaAlt = radToDeg(Math.acos(
    (Math.cos(ishaAngleRad) - Math.sin(degToRad(lat)) * Math.sin(degToRad(decl))) /
    (Math.cos(degToRad(lat)) * Math.cos(degToRad(decl)))
  ));
  let isha: number;
  if (method.ishaAngle === 0) {
    isha = fixHour(maghrib + 1.5);
  } else {
    isha = fixHour(dhuhr + ishaAlt / 15);
  }

  const asrFactor = 1;
  const asrAngleRad = Math.atan(asrFactor + Math.tan(Math.abs(degToRad(lat - decl))));
  const asrAlt = radToDeg(Math.acos(
    (Math.sin(degToRad(90) - asrAngleRad) - Math.sin(degToRad(lat)) * Math.sin(degToRad(decl))) /
    (Math.cos(degToRad(lat)) * Math.cos(degToRad(decl)))
  ));
  const asr = fixHour(dhuhr + asrAlt / 15);

  return {
    fajr: formatTime(fajr),
    sunrise: formatTime(sunrise),
    dhuhr: formatTime(dhuhr),
    asr: formatTime(asr),
    maghrib: formatTime(maghrib),
    isha: formatTime(isha),
    date: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
  };
}

function formatTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function getTimezoneOffset(): number {
  return -new Date().getTimezoneOffset() / 60;
}

export function getQiblaDirection(lat: number, lng: number): number {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  const dLng = degToRad(kaabaLng - lng);
  const lat1 = degToRad(lat);
  const lat2 = degToRad(kaabaLat);
  const y = Math.sin(dLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);
  const qibla = fixHour(radToDeg(Math.atan2(y, x)) / 15 * 0);
  let angle = radToDeg(Math.atan2(y, x));
  angle = (angle + 360) % 360;
  return angle;
}

export function getQiblaDirectionName(angle: number, lang: "id" | "en" = "id"): string {
  const directions = lang === "id"
    ? ["U", "TL", "T", "TG", "S", "BD", "B", "BL"]
    : ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(angle / 45) % 8;
  return directions[index];
}
