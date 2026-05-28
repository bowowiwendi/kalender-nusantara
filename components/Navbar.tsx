"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Calendar,
  ArrowLeftRight,
  Clock,
  Star,
  Menu,
  X,
  Compass,
  Users,
  Settings,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const links = [
  { href: "/", label: "Dashboard", icon: Calendar },
  { href: "/konversi", label: "Konversi", icon: ArrowLeftRight },
  { href: "/weton", label: "Weton Jawa", icon: Star },
  { href: "/shio", label: "Shio Cina", icon: Users },
  { href: "/jadwal-sholat", label: "Jadwal Sholat", icon: Clock },
  { href: "/hari-besar", label: "Hari Besar", icon: Compass },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const { toggleTheme, isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Moon className="w-7 h-7 text-gold-400" />
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-gold-400">
              Kalender Nusantara
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.slice(0, -1).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-sm ${isActive ? "active" : ""}`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2.5 rounded-xl transition-all duration-200 hover:bg-white/10 text-gray-600 dark:text-gray-400"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gold-400" />
              ) : (
                <Moon className="w-5 h-5 text-night-blue-600" />
              )}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-white/10"
            >
              {isDark ? <Sun className="w-5 h-5 text-gold-400" /> : <Moon className="w-5 h-5 text-night-blue-600" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl hover:bg-white/10"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-link ${isActive ? "active" : ""}`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
