"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light";
type Language = "id" | "en";

interface Settings {
  theme: Theme;
  language: Language;
  location: {
    lat: number;
    lng: number;
    city: string;
  };
  prayerMethod: number;
  showHijri: boolean;
  showJawa: boolean;
  showCina: boolean;
}

interface ThemeContextType {
  settings: Settings;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  updateSettings: (partial: Partial<Settings>) => void;
  isDark: boolean;
}

const defaultSettings: Settings = {
  theme: "dark",
  language: "id",
  location: {
    lat: -6.2088,
    lng: 106.8456,
    city: "Jakarta",
  },
  prayerMethod: 2,
  showHijri: true,
  showJawa: true,
  showCina: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kalender-nusantara-settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("kalender-nusantara-settings", JSON.stringify(settings));
  }, [settings, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settings.theme, mounted]);

  const setTheme = useCallback((theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  }, []);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-night-blue-950">
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        settings,
        setTheme,
        toggleTheme,
        updateSettings,
        isDark: settings.theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
