"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, MapPin, Eye, Calculator } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { prayerMethods } from "@/lib/prayerTimes";

const indonesianCities = [
  { city: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { city: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { city: "Bandung", lat: -6.9175, lng: 107.6191 },
  { city: "Medan", lat: 3.5952, lng: 98.6722 },
  { city: "Semarang", lat: -6.9932, lng: 110.4203 },
  { city: "Makassar", lat: -5.1477, lng: 119.4322 },
  { city: "Yogyakarta", lat: -7.7956, lng: 110.3695 },
  { city: "Palembang", lat: -2.9761, lng: 104.7754 },
  { city: "Denpasar", lat: -8.6705, lng: 115.2126 },
  { city: "Aceh", lat: 5.5483, lng: 95.3238 },
  { city: "Pontianak", lat: -0.0263, lng: 109.3425 },
  { city: "Jayapura", lat: -2.5916, lng: 140.6690 },
  { city: "Balikpapan", lat: -1.2379, lng: 116.8529 },
  { city: "Manado", lat: 1.4748, lng: 124.8421 },
  { city: "Padang", lat: -0.9471, lng: 100.4172 },
  { city: "Malang", lat: -7.9797, lng: 112.6304 },
  { city: "Banjarmasin", lat: -3.3187, lng: 114.5944 },
  { city: "Pekanbaru", lat: 0.5071, lng: 101.4478 },
];

export default function SettingsPage() {
  const { settings, setTheme, isDark, updateSettings } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleCitySelect = (city: string, lat: number, lng: number) => {
    updateSettings({ location: { city, lat, lng } });
    showSaved();
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Pengaturan</h1>
        <p className="text-gray-400 mt-1">Sesuaikan tampilan dan preferensi kalender</p>
      </motion.div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center"
        >
          Pengaturan berhasil disimpan
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gold-500/10">
            {isDark ? <Moon className="w-5 h-5 text-gold-400" /> : <Sun className="w-5 h-5 text-gold-400" />}
          </div>
          <h3 className="text-lg font-semibold">Tema Tampilan</h3>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              !isDark
                ? "border-gold-400 bg-gold-500/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-2 text-gold-400" />
            <p className="text-sm font-medium">Terang</p>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              isDark
                ? "border-gold-400 bg-gold-500/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-2 text-gold-400" />
            <p className="text-sm font-medium">Gelap</p>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/10">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold">Lokasi & Jadwal Sholat</h3>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-2">Kota Saat Ini</label>
          <input
            type="text"
            value={settings.location.city}
            onChange={(e) =>
              updateSettings({
                location: { ...settings.location, city: e.target.value },
              })
            }
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={settings.location.lat}
              onChange={(e) =>
                updateSettings({
                  location: {
                    ...settings.location,
                    lat: parseFloat(e.target.value) || 0,
                  },
                })
              }
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={settings.location.lng}
              onChange={(e) =>
                updateSettings({
                  location: {
                    ...settings.location,
                    lng: parseFloat(e.target.value) || 0,
                  },
                })
              }
              className="input-field"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-2">Pilih Kota</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto scrollbar-thin">
            {indonesianCities.map((c) => (
              <button
                key={c.city}
                onClick={() => handleCitySelect(c.city, c.lat, c.lng)}
                className={`px-3 py-1.5 rounded-lg text-xs text-left transition-all ${
                  settings.location.city === c.city
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/5 hover:bg-white/10 border border-transparent"
                }`}
              >
                {c.city}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-2">Metode Perhitungan</label>
          <select
            value={settings.prayerMethod}
            onChange={(e) => {
              updateSettings({ prayerMethod: parseInt(e.target.value) });
              showSaved();
            }}
            className="input-field"
          >
            {prayerMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-500/10">
            <Eye className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold">Tampilan Kalender</h3>
        </div>

        <div className="space-y-4">
          {[
            { key: "showHijri", label: "Tampilkan tanggal Hijriah" },
            { key: "showJawa", label: "Tampilkan pasaran Jawa" },
            { key: "showCina", label: "Tampilkan shio Cina" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">{label}</span>
              <input
                type="checkbox"
                checked={(settings as any)[key]}
                onChange={(e) => {
                  updateSettings({ [key]: e.target.checked } as any);
                  showSaved();
                }}
                className="w-5 h-5 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500
                  bg-white/10 border border-white/20
                  checked:bg-emerald-500 checked:border-emerald-500"
              />
            </label>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
