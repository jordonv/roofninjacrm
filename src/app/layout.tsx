import './globals.css';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'RoofNinjaCRM',
  description: 'RoofNinjaCRM — CRM & Estimating foundation for roofing pros'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-neutral-50 text-neutral-900">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/roofninjacrm-logo.svg" alt="RoofNinjaCRM" width={28} height={28} />
              <span className="font-semibold">RoofNinjaCRM</span>
            </Link>
            <nav className="ml-auto flex gap-4 text-sm">
              <Link href="/login">Login</Link>
              <Link href="/app" className="px-3 py-1.5 rounded bg-black text-white">Open App</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
