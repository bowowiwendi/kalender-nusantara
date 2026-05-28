"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { getQiblaDirection, getQiblaDirectionName } from "@/lib/prayerTimes";

export function QiblaDirectionWidget() {
  const { settings } = useTheme();
  const { lat, lng } = settings.location;

  const qiblaAngle = useMemo(() => getQiblaDirection(lat, lng), [lat, lng]);
  const directionName = getQiblaDirectionName(qiblaAngle);
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  const distance = useMemo(() => {
    const R = 6371;
    const dLat = ((kaabaLat - lat) * Math.PI) / 180;
    const dLng = ((kaabaLng - lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((kaabaLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }, [lat, lng]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-emerald-500/10">
          <Compass className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold">Arah Kiblat</h3>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-gray-600/30" />
          {["N", "TL", "T", "TG", "S", "BD", "B", "BL"].map((dir, i) => (
            <span
              key={dir}
              className="absolute text-xs text-gray-500"
              style={{
                left: `${50 + 38 * Math.cos((i * 45 * Math.PI) / 180 - Math.PI / 2)}%`,
                top: `${50 + 38 * Math.sin((i * 45 * Math.PI) / 180 - Math.PI / 2)}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {dir}
            </span>
          ))}
          <motion.div
            animate={{ rotate: qiblaAngle }}
            transition={{ type: "spring", stiffness: 100 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
          >
            <div className="absolute top-1 left-1/2 -translate-x-1/2">
              <div
                className="w-1 h-16 bg-gradient-to-t from-emerald-500 to-gold-400 rounded-full mx-auto"
                style={{
                  transformOrigin: "bottom center",
                  boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
                }}
              />
            </div>
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-400" />
        </div>

        <p className="text-2xl font-bold text-emerald-400">{directionName}</p>
        <p className="text-lg text-gold-400">{qiblaAngle.toFixed(1)}°</p>
        <p className="text-sm text-gray-400 mt-1">
          Jarak ke Ka&apos;bah: {distance.toLocaleString()} km
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {settings.location.city}, {lat.toFixed(2)}°, {lng.toFixed(2)}°
        </p>
      </div>
    </motion.div>
  );
}
