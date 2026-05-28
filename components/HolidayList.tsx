"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Compass, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { getHolidaysForYear, getHolidayBadgeColor, getHolidayTypeName, type Holiday } from "@/lib/holidays";
import { getMonthName } from "@/lib/dateUtils";

export function HolidayList() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [filter, setFilter] = useState<string>("all");

  const allHolidays = useMemo(() => getHolidaysForYear(year), [year]);

  const filteredHolidays = useMemo(() => {
    if (filter === "all") return allHolidays;
    return allHolidays.filter((h) => h.type === filter);
  }, [allHolidays, filter]);

  const grouped = useMemo(() => {
    const groups: Record<string, Holiday[]> = {};
    for (const h of filteredHolidays) {
      const month = h.date.substring(5, 7);
      if (!groups[month]) groups[month] = [];
      groups[month].push(h);
    }
    return groups;
  }, [filteredHolidays]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gold-500/10">
          <Compass className="w-5 h-5 text-gold-400" />
        </div>
        <h3 className="text-lg font-semibold">Hari Besar {year}</h3>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setYear(year - 1)} className="btn-secondary text-sm py-1">
          <ChevronLeft className="w-4 h-4 inline" /> {year - 1}
        </button>
        <span className="font-bold text-lg">{year}</span>
        <button onClick={() => setYear(year + 1)} className="btn-secondary text-sm py-1">
          {year + 1} <ChevronRight className="w-4 h-4 inline" />
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { value: "all", label: "Semua" },
          { value: "islamic", label: "Islam" },
          { value: "national", label: "Nasional" },
          { value: "imlek", label: "Imlek" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              filter === f.value
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/5 text-gray-400 border border-transparent hover:bg-white/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-gray-400 py-8">Tidak ada hari besar untuk ditampilkan</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([month, holidays]) => (
            <div key={month}>
              <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                {getMonthName(parseInt(month))}
              </h4>
              <div className="space-y-2">
                {holidays.map((holiday, i) => {
                  const day = parseInt(holiday.date.split("-")[2]);
                  return (
                    <motion.div
                      key={`${holiday.date}-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold">
                        {day}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{holiday.title}</p>
                        {holiday.description && (
                          <p className="text-xs text-gray-400 truncate">{holiday.description}</p>
                        )}
                      </div>
                      <span className={getHolidayBadgeColor(holiday.type)}>
                        {getHolidayTypeName(holiday.type)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
