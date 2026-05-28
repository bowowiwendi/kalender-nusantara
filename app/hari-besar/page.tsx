"use client";

import { motion } from "framer-motion";
import { HolidayList } from "@/components/HolidayList";

export default function HariBesarPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Hari Besar</h1>
        <p className="text-gray-400 mt-1">
          Hari besar Islam, Nasional Indonesia, dan Imlek
        </p>
      </motion.div>
      <HolidayList />
    </div>
  );
}
