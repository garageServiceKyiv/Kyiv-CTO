"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Послуги" },
  { href: "/pricing", label: "Ціни" },
  { href: "/portfolio", label: "Наші роботи" },
  { href: "/contacts", label: "Контакти" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/20 flex justify-between items-center px-6 lg:px-10 py-3 lg:py-4">
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-10 lg:h-12 w-auto invert" />
        <span className="text-xl lg:text-2xl font-black text-primary-container tracking-tight font-headline">
          AUTO SERVICE GARAGE
        </span>
      </Link>

      <div className="hidden md:flex gap-8 items-center">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-headline uppercase tracking-tighter font-bold text-sm transition-colors duration-200 ${
              pathname === link.href
                ? "text-primary-container border-b-2 border-primary-container pb-1"
                : "text-white/60 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <span className="font-headline text-xs tracking-widest text-white/50 hidden lg:block">
          073 222 69 68
        </span>
        <Link
          href="/contacts"
          className="bg-primary-container text-on-primary font-headline font-bold uppercase tracking-tighter text-sm px-5 lg:px-6 py-2 hover:bg-primary-dim transition-colors active:scale-95"
        >
          Запис
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-1 text-white"
          aria-label="Меню"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 glass-nav border-b border-outline-variant/20 md:hidden">
          <div className="px-6 py-4 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block font-headline uppercase tracking-tighter font-bold text-sm ${
                  pathname === link.href ? "text-primary-container" : "text-white/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a href="tel:+380732226968" className="block font-headline text-sm text-white/50 pt-2 border-t border-outline-variant/20">
              073 222 69 68
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
