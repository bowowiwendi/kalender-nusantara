"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, Home, Briefcase, Search, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  calculateGeneralGoodDay,
  calculateMovingHouse,
  calculateStartingBusiness,
  calculateWedding,
  findGoodDays,
  getNeptu,
  getNeptuFromDate,
  getWetonFromDate,
  getPurposeLabel,
  type PetungResult,
  type WeddingResult,
  getDayNames,
  getPasaranNames,
} from "@/lib/petung";
import { getMonthName } from "@/lib/dateUtils";

type PetungMode = "general" | "moving" | "business" | "wedding";

const modeConfig: Record<PetungMode, { icon: React.ReactNode; title: string; desc: string }> = {
  general: {
    icon: <Star className="w-5 h-5 text-gold-400" />,
    title: "Hari Baik (Pancasuda)",
    desc: "Mencari hari baik untuk segala keperluan umum",
  },
  moving: {
    icon: <Home className="w-5 h-5 text-emerald-400" />,
    title: "Pindah Rumah",
    desc: "Mencari hari baik untuk pindah rumah (Guru-Ratu-Rogoh-Sempoyong)",
  },
  business: {
    icon: <Briefcase className="w-5 h-5 text-blue-400" />,
    title: "Memulai Usaha",
    desc: "Mencari hari baik untuk memulai usaha / bisnis",
  },
  wedding: {
    icon: <Heart className="w-5 h-5 text-red-400" />,
    title: "Kecocokan Jodoh",
    desc: "Menghitung kecocokan pasangan berdasarkan weton",
  },
};

function NeptuInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const neptu = value ? getNeptu(value) : 0;
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Contoh: Senin Pon"
          className="input-field flex-1"
        />
        <div className="w-14 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-sm">
          {neptu || "?"}
        </div>
      </div>
    </div>
  );
}

function PetungResultCard({ result, label }: { result: PetungResult | WeddingResult; label: string }) {
  const isWedding = "totalNeptu" in result && !("divisor" in result);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-5 rounded-xl border-2 ${
        result.isGood
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-red-500/30 bg-red-500/5"
      }`}
    >
      <div className="text-center mb-3">
        <div className={`text-3xl font-bold mb-1 ${result.isGood ? "text-emerald-400" : "text-red-400"}`}>
          {result.label}
        </div>
        <p className="text-lg font-medium">{result.meaning}</p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-3 text-sm text-gray-400">
        <span>Total Neptu: <strong className="text-white">{result.totalNeptu}</strong></span>
        {"divisor" in result && (
          <>
            <span>|</span>
            <span>Bagi {result.divisor}: <strong className="text-white">{(result as PetungResult).remainder}</strong></span>
          </>
        )}
      </div>

      <p className="text-sm text-gray-300 text-center">{result.description}</p>

      {"score" in result && (
        <div className="mt-3 flex justify-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`w-6 h-1.5 rounded-full ${
                i < (result as PetungResult).score ? "bg-emerald-400" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function PetungTool() {
  const [mode, setMode] = useState<PetungMode>("general");

  const [dateInputs, setDateInputs] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });

  const [person1, setPerson1] = useState("");
  const [person2, setPerson2] = useState("");
  const [targetDate, setTargetDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  });

  const [result, setResult] = useState<(PetungResult | WeddingResult) | null>(null);
  const [goodDays, setGoodDays] = useState<{ date: Date; result: PetungResult }[]>([]);
  const [showMonthly, setShowMonthly] = useState(false);

  const person1Neptu = getNeptu(person1);
  const person2Neptu = getNeptu(person2);

  const handleCalculate = () => {
    if (mode === "wedding") {
      if (!person1 || !person2) return;
      const r = calculateWedding(person1Neptu, person2Neptu);
      setResult(r);
      setGoodDays([]);
    } else {
      if (!person1) return;
      const [y, m, d] = targetDate.split("-").map(Number);
      const targetNeptu = getNeptuFromDate(y, m, d);
      let r: PetungResult;
      switch (mode) {
        case "moving": r = calculateMovingHouse(person1Neptu, targetNeptu); break;
        case "business": r = calculateStartingBusiness(person1Neptu, targetNeptu); break;
        default: r = calculateGeneralGoodDay(person1Neptu, targetNeptu);
      }
      setResult(r);
      setGoodDays([]);
    }
  };

  const handleShowMonthly = () => {
    if (!person1) return;
    const [y, m] = targetDate.split("-").map(Number);
    const days = findGoodDays(y, m, person1Neptu, mode === "moving" ? "moving" : mode === "business" ? "business" : "general");
    setGoodDays(days);
    setResult(null);
    setShowMonthly(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gold-500/10">
          <Search className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Petung Jawa</h3>
          <p className="text-xs text-gray-400">Mencari hari baik & kecocokan berdasarkan primbon Jawa</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.entries(modeConfig) as [PetungMode, typeof modeConfig[PetungMode]][]).map(([key, config]) => (
          <button
            key={key}
            onClick={() => { setMode(key); setResult(null); setGoodDays([]); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              mode === key
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                : "bg-white/5 text-gray-400 border border-transparent hover:bg-white/10"
            }`}
          >
            {config.icon}
            {config.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
        >
          {mode === "wedding" ? (
            <div className="space-y-4 mb-6">
              <p className="text-xs text-gray-400 bg-white/5 p-3 rounded-xl leading-relaxed">
                Hitung kecocokan pasangan berdasarkan weton kelahiran. Masukkan weton Anda dan pasangan.
              </p>
              <NeptuInput label="Weton Anda" value={person1} onChange={setPerson1} />
              <NeptuInput label="Weton Pasangan" value={person2} onChange={setPerson2} />
              <button
                onClick={handleCalculate}
                disabled={!person1 || !person2}
                className="btn-primary w-full disabled:opacity-40"
              >
                Hitung Kecocokan
              </button>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              <p className="text-xs text-gray-400 bg-white/5 p-3 rounded-xl leading-relaxed">
                Masukkan weton Anda, lalu pilih tanggal yang ingin diperiksa.
              </p>
              <NeptuInput label="Weton Anda / Keluarga" value={person1} onChange={setPerson1} />

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Tanggal yang Dicek</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="flex gap-2">
                <button onClick={handleCalculate} disabled={!person1} className="btn-primary flex-1 disabled:opacity-40">
                  Cek Hari Ini
                </button>
                <button onClick={handleShowMonthly} disabled={!person1} className="btn-secondary flex-1 disabled:opacity-40">
                  <CalendarDays className="w-4 h-4 inline mr-1" />
                  Lihat Bulan Ini
                </button>
              </div>

              {showMonthly && goodDays.length > 0 && (
                <div className="text-xs text-gray-400 text-center">
                  Ditemukan {goodDays.length} hari baik di bulan{" "}
                  {getMonthName(parseInt(targetDate.split("-")[1]))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {result && <PetungResultCard result={result} label={getPurposeLabel(mode)} />}

      {goodDays.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 space-y-2"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            Hari Baik di {getMonthName(parseInt(targetDate.split("-")[1]))} {targetDate.split("-")[0]}
          </h4>
          {goodDays.slice(0, 15).map(({ date, result: r }) => {
            const weton = getWetonFromDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
            return (
              <div
                key={date.toISOString()}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm font-bold text-emerald-400">
                  {date.getDate()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {getDayNames()[date.getDay()]} {date.getDate()} {getMonthName(date.getMonth() + 1)}
                  </p>
                  <p className="text-xs text-gray-400">{weton} · Neptu {r.totalNeptu}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-400">{r.label}</p>
                  <p className="text-xs text-gray-500">{r.meaning}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < r.score ? "bg-emerald-400" : "bg-white/10"}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      <div className="mt-6 pt-4 border-t border-white/10">
        <details className="group">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">
            Tabel Neptu Hari & Pasaran
          </summary>
          <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-medium text-gray-400 mb-1 uppercase tracking-wider">Hari</p>
              {getDayNames().map((day, i) => (
                <div key={day} className="flex justify-between py-0.5 border-b border-white/5">
                  <span>{day}</span>
                  <span className="font-bold text-gold-400">{[5, 4, 3, 7, 8, 6, 9][i]}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-400 mb-1 uppercase tracking-wider">Pasaran</p>
              {getPasaranNames().map((p, i) => (
                <div key={p} className="flex justify-between py-0.5 border-b border-white/5">
                  <span>{p}</span>
                  <span className="font-bold text-emerald-400">{[5, 9, 7, 4, 8][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </motion.div>
  );
}
