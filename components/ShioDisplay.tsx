"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Heart, Ban } from "lucide-react";
import { getShio, getFiveElements, type ShioInfo } from "@/lib/chineseCalendar";

const zodiacSymbols: Record<string, string> = {
  Tikus: "🐭", Kerbau: "🐮", Macan: "🐯", Kelinci: "🐰",
  Naga: "🐲", Ular: "🐍", Kuda: "🐴", Kambing: "🐏",
  Monyet: "🐵", Ayam: "🐔", Anjing: "🐶", Babi: "🐷",
};

export function ShioDisplay() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const shio: ShioInfo = getShio(year);
  const fiveElements = getFiveElements(year);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-oriental-red-500/10">
          <Users className="w-5 h-5 text-oriental-red-400" />
        </div>
        <h3 className="text-lg font-semibold">Shio & Elemen</h3>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setYear(year - 1)} className="btn-secondary text-sm py-1">&larr; Mundur</button>
        <div className="text-center">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value) || currentYear)}
            className="input-field text-center w-24"
          />
        </div>
        <button onClick={() => setYear(year + 1)} className="btn-secondary text-sm py-1">Maju &rarr;</button>
      </div>

      <div className="text-center mb-6">
        <motion.div
          key={year}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-6xl mb-4"
        >
          {zodiacSymbols[shio.animal] || "🐉"}
        </motion.div>
        <h2 className="text-2xl font-bold text-oriental-red-400">{shio.animal}</h2>
        <p className="text-gold-400 font-medium text-lg">{shio.fullName}</p>
        <p className="text-gray-400 text-sm mt-1">
          {shio.celestialStem} · {shio.earthlyBranch}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="text-center p-3 rounded-xl bg-white/5">
          <p className="text-xs text-gray-400">Elemen</p>
          <p className="text-lg font-bold text-emerald-400">{fiveElements.element}</p>
          <p className="text-xs text-gray-500">{fiveElements.yinYang}</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5">
          <p className="text-xs text-gray-400">Elemen Tahun</p>
          <p className="text-lg font-bold">{fiveElements.symbol}</p>
          <p className="text-xs text-gray-500">{fiveElements.element}</p>
        </div>
      </div>

      {shio.description && (
        <p className="text-sm text-gray-300 mb-4 text-center">{shio.description}</p>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-red-400" />
          <span className="text-gray-400">Cocok dengan:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {shio.compatibility?.map((animal) => (
            <span key={animal} className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm">
              {animal}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm mt-2">
          <Ban className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">Lawan:</span>
          <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-sm">
            {shio.opposite}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
