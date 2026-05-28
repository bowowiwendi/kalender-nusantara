"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  getMonthDays,
  getFirstDayOfMonth,
  getDayName,
  isToday,
  isDateEqual,
  gregorianToJDN,
} from "@/lib/dateUtils";
import { gregorianToHijri } from "@/lib/hijri";
import { getPasaranForDate } from "@/lib/jawa";
import { getShioAnimal } from "@/lib/chineseCalendar";
import { getHolidaysForDate } from "@/lib/holidays";

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  showHijri?: boolean;
  showJawa?: boolean;
  showCina?: boolean;
}

export function CalendarGrid({
  year,
  month,
  selectedDate,
  onSelectDate,
  showHijri = true,
  showJawa = true,
  showCina = false,
}: CalendarGridProps) {
  const daysInMonth = getMonthDays(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const calendarDays = useMemo(() => {
    const days: (number | null)[][] = [];
    let week: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) week.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d);
      if (week.length === 7) {
        days.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      days.push(week);
    }
    return days;
  }, [daysInMonth, firstDay]);

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
        {calendarDays.map((week, wi) =>
          week.map((day, di) => {
            if (day === null) return <div key={`empty-${wi}-${di}`} />;
            const date = new Date(year, month - 1, day);
            const isSelected = isDateEqual(date, selectedDate);
            const isTodayDate = isToday(date);
            const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            const hijri = gregorianToHijri(year, month, day);
            const pasaran = getPasaranForDate(year, month, day);
            const holidays = getHolidaysForDate(year, month, day);

            return (
              <motion.button
                key={dateStr}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectDate(date)}
                className={`
                  relative flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-xl
                  transition-all duration-200 min-h-[60px] sm:min-h-[80px]
                  ${isSelected
                    ? "bg-emerald-500/20 border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                    : isTodayDate
                      ? "bg-gold-500/10 border border-gold-500/30"
                      : "hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                <span
                  className={`
                    text-sm sm:text-base font-semibold leading-tight
                    ${isTodayDate ? "text-gold-400" : isSelected ? "text-emerald-300" : ""}
                  `}
                >
                  {day}
                </span>
                {showHijri && (
                  <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 leading-tight mt-0.5">
                    {hijri.day}/{hijri.month}
                  </span>
                )}
                {showJawa && (
                  <span className="text-[8px] sm:text-[9px] text-gold-400/70 dark:text-gold-400/50 leading-tight">
                    {pasaran}
                  </span>
                )}
                {holidays.length > 0 && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {holidays.slice(0, 2).map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          h.type === "islamic" ? "bg-emerald-400" :
                          h.type === "national" ? "bg-blue-400" :
                          h.type === "imlek" ? "bg-red-400" : "bg-gold-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
