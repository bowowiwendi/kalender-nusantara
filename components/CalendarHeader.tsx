"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthName } from "@/lib/dateUtils";

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({ year, month, onPrevMonth, onNextMonth, onToday }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrevMonth}
        className="p-2.5 rounded-xl hover:bg-white/10 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      <motion.div
        key={`${month}-${year}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center cursor-pointer"
        onClick={onToday}
      >
        <h2 className="text-xl sm:text-2xl font-bold">
          {getMonthName(month)} {year}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">Klik untuk kembali ke hari ini</p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNextMonth}
        className="p-2.5 rounded-xl hover:bg-white/10 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
