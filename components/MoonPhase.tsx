"use client";

import { motion } from "framer-motion";
import { getMoonPhase } from "@/lib/dateUtils";
import { useEffect, useState } from "react";

export function MoonPhase() {
  const [phase, setPhase] = useState(() => getMoonPhase(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase(getMoonPhase(new Date()));
    }, 3600000);
    return () => clearInterval(timer);
  }, []);

  const illumination = phase.illumination;
  const moonSize = 120;
  const shadowWidth = (1 - phase.phase) * moonSize;
  const isWaxing = phase.phase < 0.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="text-sm font-medium text-gold-400 uppercase tracking-wider text-center mb-4">
        Fase Bulan
      </h3>
      <div className="flex flex-col items-center gap-4">
        <div className="relative" style={{ width: moonSize, height: moonSize }}>
          <div
            className="w-full h-full rounded-full bg-gradient-to-br from-gold-200 to-gold-400 dark:from-gold-300 dark:to-gold-500"
            style={{ boxShadow: "0 0 30px rgba(245, 158, 11, 0.3)" }}
          />
          <div
            className="absolute top-0 rounded-full bg-night-blue-900 dark:bg-night-blue-950"
            style={{
              width: shadowWidth,
              height: moonSize,
              left: isWaxing ? "auto" : 0,
              right: isWaxing ? 0 : "auto",
              transition: "all 0.5s ease",
            }}
          />
        </div>
        <p className="text-lg font-semibold">{phase.name}</p>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${illumination}%` }}
            className="h-full bg-gradient-to-r from-gold-400 to-gold-300 rounded-full"
          />
        </div>
        <p className="text-sm text-gray-400">
          {illumination}% Terang
        </p>
      </div>
    </motion.div>
  );
}
