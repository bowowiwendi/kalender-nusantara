"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Info } from "lucide-react";
import { computeWeton, type WetonInfo } from "@/lib/jawa";
import { getMonthName, getMonthDays } from "@/lib/dateUtils";

const neptuHariData: { day: string; neptu: number; color: string }[] = [
  { day: "Minggu", neptu: 5, color: "text-gold-400" },
  { day: "Senin", neptu: 4, color: "text-blue-400" },
  { day: "Selasa", neptu: 3, color: "text-red-400" },
  { day: "Rabu", neptu: 7, color: "text-green-400" },
  { day: "Kamis", neptu: 8, color: "text-purple-400" },
  { day: "Jumat", neptu: 6, color: "text-orange-400" },
  { day: "Sabtu", neptu: 9, color: "text-cyan-400" },
];

const pasaranNeptuData: { pasaran: string; neptu: number; color: string }[] = [
  { pasaran: "Legi", neptu: 5, color: "text-gold-400" },
  { pasaran: "Pahing", neptu: 9, color: "text-red-400" },
  { pasaran: "Pon", neptu: 7, color: "text-green-400" },
  { pasaran: "Wage", neptu: 4, color: "text-blue-400" },
  { pasaran: "Kliwon", neptu: 8, color: "text-purple-400" },
];

export function WetonDisplay() {
  const [date, setDate] = useState(new Date());
  const [weton, setWeton] = useState<WetonInfo>(computeWeton(date.getFullYear(), date.getMonth() + 1, date.getDate()));

  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const handlePrev = () => setDate(new Date(year, month - 2, date.getDate()));
  const handleNext = () => setDate(new Date(year, month, date.getDate()));

  useEffect(() => {
    setWeton(computeWeton(year, month, date.getDate()));
  }, [year, month, date.getDate()]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gold-500/10">
          <Star className="w-5 h-5 text-gold-400" />
        </div>
        <h3 className="text-lg font-semibold">Cek Weton Jawa</h3>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={handlePrev} className="btn-secondary text-sm py-1">&larr; Sebelumnya</button>
        <span className="font-medium">{getMonthName(month)} {year}</span>
        <button onClick={handleNext} className="btn-secondary text-sm py-1">Berikutnya &rarr;</button>
      </div>

      <div className="text-center mb-6">
        <motion.div
          key={`${year}-${month}-${date.getDate()}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 border-2 border-gold-400/30 mb-4"
        >
          <span className="text-3xl">⭐</span>
        </motion.div>
        <h2 className="text-2xl font-bold text-gold-400">{weton.weton}</h2>
        <p className="text-gray-400 mt-1">
          {date.getDate()} {getMonthName(month)} {year}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 rounded-xl bg-white/5">
          <p className="text-xs text-gray-400">Neptu Hari</p>
          <p className="text-xl font-bold text-emerald-400">{weton.neptuHari}</p>
          <p className="text-xs text-gray-500">{weton.dayName}</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5">
          <p className="text-xs text-gray-400">Neptu Pasaran</p>
          <p className="text-xl font-bold text-gold-400">{weton.neptuPasaran}</p>
          <p className="text-xs text-gray-500">{weton.pasaran}</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5">
          <p className="text-xs text-gray-400">Total Neptu</p>
          <p className={`text-xl font-bold ${weton.totalNeptu >= 15 ? "text-oriental-red-400" : weton.totalNeptu >= 12 ? "text-gold-400" : "text-emerald-400"}`}>
            {weton.totalNeptu}
          </p>
          <p className="text-xs text-gray-500">{weton.description}</p>
        </div>
      </div>

      <details className="group">
        <summary className="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-gray-200 transition-colors">
          <Info className="w-4 h-4" />
          Tabel Nilai Neptu
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-xs text-gray-400 mb-2 uppercase">Neptu Hari</p>
            {neptuHariData.map((item) => (
              <div key={item.day} className="flex justify-between py-1 border-b border-white/5">
                <span>{item.day}</span>
                <span className={`font-bold ${item.color}`}>{item.neptu}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="font-medium text-xs text-gray-400 mb-2 uppercase">Neptu Pasaran</p>
            {pasaranNeptuData.map((item) => (
              <div key={item.pasaran} className="flex justify-between py-1 border-b border-white/5">
                <span>{item.pasaran}</span>
                <span className={`font-bold ${item.color}`}>{item.neptu}</span>
              </div>
            ))}
          </div>
        </div>
      </details>
    </motion.div>
  );
}
