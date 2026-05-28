"use client";

import { motion } from "framer-motion";
import { PrayerSchedule } from "@/components/PrayerSchedule";
import { QiblaDirectionWidget } from "@/components/QiblaDirection";

export default function JadwalSholatPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Jadwal Sholat</h1>
        <p className="text-gray-400 mt-1">
          Jadwal sholat lima waktu dan arah kiblat berdasarkan lokasi Anda
        </p>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PrayerSchedule />
        <QiblaDirectionWidget />
      </div>
    </div>
  );
}
