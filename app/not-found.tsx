import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🌙</div>
        <h1 className="text-4xl font-bold text-gradient mb-2">404</h1>
        <p className="text-gray-400 mb-6">Halaman yang Anda cari tidak ditemukan</p>
        <Link href="/" className="btn-primary inline-block">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
