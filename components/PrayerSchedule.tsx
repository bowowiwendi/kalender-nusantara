"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Sun, Sunrise, SunMoon, Sunset, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { calculatePrayerTimes, getTimezoneOffset, getQiblaDirection, type PrayerTimes } from "@/lib/prayerTimes";

const prayerIcons: Record<string, React.ReactNode> = {
  fajr: <Moon className="w-4 h-4" />,
  sunrise: <Sunrise className="w-4 h-4" />,
  dhuhr: <Sun className="w-4 h-4" />,
  asr: <SunMoon className="w-4 h-4" />,
  maghrib: <Sunset className="w-4 h-4" />,
  isha: <Moon className="w-4 h-4" />,
};

const prayerNames: Record<string, string> = {
  fajr: "Subuh",
  sunrise: "Terbit",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
};

const prayerColors: Record<string, string> = {
  fajr: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  sunrise: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  dhuhr: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  asr: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  maghrib: "bg-red-500/20 text-red-400 border-red-500/30",
  isha: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

export function PrayerSchedule() {
  const { settings } = useTheme();
  const [now, setNow] = useState(new Date());
  const [cityName, setCityName] = useState(settings.location.city);
  const [lat, setLat] = useState(settings.location.lat);
  const [lng, setLng] = useState(settings.location.lng);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const tz = getTimezoneOffset();
  const prayerTimes = useMemo(
    () => calculatePrayerTimes(now, lat, lng, tz, settings.prayerMethod),
    [now, lat, lng, tz, settings.prayerMethod]
  );

  const getNextPrayer = (times: PrayerTimes): { key: string; time: string; index: number } | null => {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const entries = Object.entries(times).filter(([k]) => k !== "date");
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      const [h, m] = value.split(":").map(Number);
      const prayerMinutes = h * 60 + m;
      if (prayerMinutes > currentMinutes) {
        return { key, time: value, index: i };
      }
    }
    return null;
  };

  const nextPrayer = getNextPrayer(prayerTimes);
  const entries = Object.entries(prayerTimes).filter(([k]) => k !== "date");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-emerald-500/10">
          <Clock className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold">Jadwal Sholat</h3>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
        <MapPin className="w-4 h-4" />
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className="bg-transparent border-b border-white/10 focus:border-emerald-400 outline-none px-1"
          placeholder="Nama kota..."
        />
      </div>

      {nextPrayer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
        >
          <p className="text-xs text-gray-400">Waktu sholat berikutnya</p>
          <p className="text-lg font-bold text-emerald-400">
            {prayerNames[nextPrayer.key]} — {nextPrayer.time}
          </p>
        </motion.div>
      )}

      <div className="space-y-2">
        {entries.map(([key, time]) => (
          <div
            key={key}
            className={`flex items-center justify-between p-3 rounded-xl border ${
              prayerColors[key]
            } ${nextPrayer?.key === key ? "ring-2 ring-emerald-400/50" : ""}`}
          >
            <div className="flex items-center gap-2">
              {prayerIcons[key]}
              <span className="font-medium">{prayerNames[key]}</span>
            </div>
            <span className="font-bold tabular-nums">{time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
