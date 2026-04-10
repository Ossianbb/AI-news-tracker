"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Digest" },
  { href: "/learn", label: "Learn" },
  { href: "/library", label: "Library" },
  { href: "/knowledge", label: "Progress" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="text-base font-bold text-zinc-900">
          AI News Tracker
        </Link>
        <div className="flex gap-1 overflow-x-auto">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
