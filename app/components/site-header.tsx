"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Jobs",
  },
  {
    href: "/companies",
    label: "Companies",
  },
];

const isNavItemActive = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
};

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100 sm:text-sm"
        >
          Fullstack Jobs
        </Link>

        <nav className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
          {navItems.map((navItem) => {
            const isActive = isNavItemActive(pathname, navItem.href);

            return (
              <Link
                key={navItem.href}
                href={navItem.href}
                className={`rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? "border-cyan-200/35 bg-cyan-300/15 text-cyan-50"
                    : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-100"
                }`}
              >
                {navItem.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
