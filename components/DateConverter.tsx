"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, Calendar } from "lucide-react";
import { gregorianToHijri, getHijriMonthName } from "@/lib/hijri";
import { computeWeton } from "@/lib/jawa";
import { getShio } from "@/lib/chineseCalendar";
import { getMonthName, getDayName, getMonthDays } from "@/lib/dateUtils";

export function DateConverter() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());

  const hijri = gregorianToHijri(year, month, day);
  const weton = computeWeton(year, month, day);
  const shio = getShio(year);

  const daysInMonth = getMonthDays(year, month);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-emerald-500/10">
          <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold">Konversi Tanggal</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Tahun</label>
          <input
            type="number"
            value={year}
            onChange={(e) => {
              const y = parseInt(e.target.value) || 2024;
              setYear(y);
              const maxDay = getMonthDays(y, month);
              if (day > maxDay) setDay(maxDay);
            }}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Bulan</label>
          <select
            value={month}
            onChange={(e) => {
              const m = parseInt(e.target.value);
              setMonth(m);
              const maxDay = getMonthDays(year, m);
              if (day > maxDay) setDay(maxDay);
            }}
            className="input-field"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{getMonthName(m)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Tanggal</label>
          <select
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value))}
            className="input-field"
          >
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <ConversionRow
          icon="📅"
          label="Masehi"
          value={`${getDayName(new Date(year, month - 1, day).getDay())}, ${day} ${getMonthName(month)} ${year}`}
        />
        <ConversionRow
          icon="☪️"
          label="Hijriah"
          value={`${hijri.day} ${getHijriMonthName(hijri.month)} ${hijri.year} H`}
        />
        <ConversionRow
          icon="🕉️"
          label="Jawa (Weton)"
          value={`${weton.weton} - Neptu ${weton.totalNeptu}`}
        />
        <ConversionRow
          icon="🐉"
          label="Cina (Shio)"
          value={`${shio.fullName} - ${shio.animal} (${shio.element})`}
        />
      </div>
    </motion.div>
  );
}

function ConversionRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 dark:bg-white/5 border border-white/5">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}
