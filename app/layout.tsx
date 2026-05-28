import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kalender Nusantara",
  description:
    "Aplikasi kalender lengkap dengan Kalender Masehi, Hijriah, Jawa, dan Cina. Dilengkapi jadwal sholat, arah kiblat, dan informasi hari besar.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌙</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
