"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Moon, Star, Users } from "lucide-react";
import { CalendarGrid } from "@/components/CalendarGrid";
import { CalendarHeader } from "@/components/CalendarHeader";
import { RealtimeClock } from "@/components/RealtimeClock";
import { MoonPhase } from "@/components/MoonPhase";
import { PasaranSearch } from "@/components/PasaranSearch";
import { useTheme } from "@/context/ThemeContext";
import { gregorianToHijri, getHijriMonthName } from "@/lib/hijri";
import { computeWeton } from "@/lib/jawa";
import { getShio } from "@/lib/chineseCalendar";
import { getHolidaysForDate, getHolidayBadgeColor, getHolidayTypeName } from "@/lib/holidays";
import { PrayerSchedule } from "@/components/PrayerSchedule";
import { QiblaDirectionWidget } from "@/components/QiblaDirection";

export default function Dashboard() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(today);
  const { settings } = useTheme();

  const day = selectedDate.getDate();
  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

  const hijri = gregorianToHijri(year, month, day);
  const weton = computeWeton(year, month, day);
  const shio = getShio(year);
  const holidays = getHolidaysForDate(year, month, day);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
    setSelectedDate(now);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <RealtimeClock />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CalendarHeader
            year={currentYear}
            month={currentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
          <CalendarGrid
            year={currentYear}
            month={currentMonth}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setCurrentYear(date.getFullYear());
              setCurrentMonth(date.getMonth() + 1);
            }}
            showHijri={settings.showHijri}
            showJawa={settings.showJawa}
            showCina={settings.showCina}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PrayerSchedule />
            <QiblaDirectionWidget />
          </div>
        </div>

        <div className="space-y-6">
          <MoonPhase />
          <PasaranSearch />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold">Detail Tanggal</h3>
            </div>
            <div className="space-y-3">
              <DetailRow
                icon={<CalendarDays className="w-4 h-4 text-emerald-400" />}
                label="Masehi"
                value={`${day} ${["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"][month-1]} ${year}`}
              />
              <DetailRow
                icon={<Moon className="w-4 h-4 text-gold-400" />}
                label="Hijriah"
                value={`${hijri.day} ${getHijriMonthName(hijri.month)} ${hijri.year} H`}
              />
              <DetailRow
                icon={<Star className="w-4 h-4 text-gold-400" />}
                label="Weton"
                value={`${weton.weton} (Neptu ${weton.totalNeptu})`}
              />
              <DetailRow
                icon={<Users className="w-4 h-4 text-oriental-red-400" />}
                label="Shio"
                value={`${shio.animal} - ${shio.element}`}
              />
            </div>
            {holidays.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Hari Besar</p>
                {holidays.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <span className={getHolidayBadgeColor(h.type)}>
                      {getHolidayTypeName(h.type)}
                    </span>
                    <span className="text-sm">{h.title}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
