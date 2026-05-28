"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CalendarDays } from "lucide-react";
import { computeWeton, type WetonInfo } from "@/lib/jawa";
import { gregorianToHijri, getHijriMonthName } from "@/lib/hijri";
import { getShio } from "@/lib/chineseCalendar";
import { getDayName, getMonthName, getMoonPhase } from "@/lib/dateUtils";

export function PasaranSearch() {
  const today = new Date();
  const [dateStr, setDateStr] = useState(
    `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`
  );
  const [result, setResult] = useState<{
    weton: WetonInfo;
    hijri: { year: number; month: number; day: number };
    shio: { animal: string; element: string };
    moon: { name: string; illumination: number };
  } | null>(() => {
    const w = computeWeton(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const h = gregorianToHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const s = getShio(today.getFullYear());
    const m = getMoonPhase(today);
    return { weton: w, hijri: h, shio: s, moon: m };
  });

  const handleSearch = () => {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return;
    const w = computeWeton(y, m, d);
    const h = gregorianToHijri(y, m, d);
    const s = getShio(y);
    const moon = getMoonPhase(new Date(y, m - 1, d));
    setResult({ weton: w, hijri: h, shio: s, moon });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-gold-500/10">
          <Search className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Cari Pasaran</h3>
          <p className="text-xs text-gray-400">Masukkan tanggal untuk melihat weton &amp; pasaran</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        <input
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="input-field flex-1"
        />
        <button onClick={handleSearch} className="btn-primary px-5">
          Cari
        </button>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={dateStr}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 border-2 border-gold-400/30 mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h2 className="text-xl font-bold text-gold-400">{result.weton.weton}</h2>
              <p className="text-sm text-gray-400 mt-1">
                {getDayName(new Date(dateStr).getDay())}, {parseInt(dateStr.split("-")[2])} {getMonthName(parseInt(dateStr.split("-")[1]))} {dateStr.split("-")[0]}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <InfoBox label="Pasaran" value={result.weton.pasaran} />
              <InfoBox label="Neptu Hari" value={String(result.weton.neptuHari)} />
              <InfoBox label="Neptu Pasaran" value={String(result.weton.neptuPasaran)} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InfoBox
                label="Total Neptu"
                value={String(result.weton.totalNeptu)}
                highlight
              />
              <InfoBox label="Fase Bulan" value={result.moon.name} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InfoBox
                label="Hijriah"
                value={`${result.hijri.day} ${getHijriMonthName(result.hijri.month)} ${result.hijri.year} H`}
              />
              <InfoBox label="Shio" value={`${result.shio.animal} - ${result.shio.element}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InfoBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? "text-gold-400" : ""}`}>{value}</p>
    </div>
  );
}
