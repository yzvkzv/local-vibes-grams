"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Avatar from "./Avatar";
import {
  IconCreate,
  IconExplore,
  IconHome,
  IconHomeFilled,
  IconLogout,
  IconMessenger,
  IconSearch,
} from "./Icons";

export default function Sidebar({
  me,
}: {
  me: { username: string; name: string; color: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const items = [
    { href: "/", label: "Beranda", icon: <IconHome />, activeIcon: <IconHomeFilled />, active: pathname === "/" },
    { href: "/search", label: "Cari", icon: <IconSearch />, activeIcon: <IconSearch />, active: pathname === "/search" },
    { href: "/explore", label: "Jelajahi", icon: <IconExplore />, activeIcon: <IconExplore />, active: pathname === "/explore" },
    { href: "/direct", label: "Pesan", icon: <IconMessenger />, activeIcon: <IconMessenger />, active: pathname?.startsWith("/direct") },
    { href: "/create", label: "Buat", icon: <IconCreate />, activeIcon: <IconCreate />, active: pathname === "/create" },
  ];

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[245px] flex-col border-r border-neutral-200 bg-white px-3 py-6 md:flex">
      <Link href="/" className="px-3 pb-8">
        <span className="text-[22px] font-bold italic tracking-tight text-neutral-900">
          Local Vibes Grams
        </span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`flex items-center gap-4 rounded-lg px-3 py-3 text-[15px] transition hover:bg-neutral-100 ${
              it.active ? "font-bold text-neutral-900" : "text-neutral-800"
            }`}
          >
            {it.active ? it.activeIcon : it.icon}
            {it.label}
          </Link>
        ))}
        <Link
          href={`/${me.username}`}
          className={`mt-1 flex items-center gap-4 rounded-lg px-3 py-3 text-[15px] transition hover:bg-neutral-100 ${
            pathname === `/${me.username}` ? "font-bold" : ""
          }`}
        >
          <Avatar name={me.name} username={me.username} color={me.color} size={24} />
          Profil
        </Link>
      </nav>
      <button
        onClick={logout}
        disabled={loggingOut}
        className="flex items-center gap-4 rounded-lg px-3 py-3 text-[15px] text-neutral-800 transition hover:bg-neutral-100 disabled:opacity-50"
      >
        <IconLogout />
        {loggingOut ? "Keluar..." : "Keluar"}
      </button>
    </aside>
  );
}
