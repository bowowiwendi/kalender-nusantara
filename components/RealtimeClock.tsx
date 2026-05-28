"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export function RealtimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const dayName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][time.getDay()];
  const monthName = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ][time.getMonth()];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-gold-400" />
        <span className="text-sm font-medium text-gold-400 uppercase tracking-wider">
          Waktu Saat Ini
        </span>
      </div>
      <motion.div
        key={time.getTime()}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className="text-5xl sm:text-6xl font-bold tracking-wider tabular-nums"
      >
        <span className="text-gradient">{hours}</span>
        <span className="text-gold-400 mx-1 animate-pulse-soft">:</span>
        <span className="text-gradient">{minutes}</span>
        <span className="text-gold-400 mx-1 animate-pulse-soft">:</span>
        <span className="text-gradient">{seconds}</span>
      </motion.div>
      <p className="mt-3 text-gray-500 dark:text-gray-400">
        {dayName}, {time.getDate()} {monthName} {time.getFullYear()}
      </p>
    </motion.div>
  );
}
