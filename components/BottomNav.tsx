"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import {
  IconCreate,
  IconExplore,
  IconHome,
  IconHomeFilled,
  IconMessenger,
} from "./Icons";

export default function BottomNav({
  me,
}: {
  me: { username: string; name: string; color: string };
}) {
  const pathname = usePathname();
  const items = [
    { href: "/", label: "Beranda", icon: <IconHome />, activeIcon: <IconHomeFilled />, active: pathname === "/" },
    { href: "/explore", label: "Jelajahi", icon: <IconExplore />, activeIcon: <IconExplore />, active: pathname === "/explore" },
    { href: "/create", label: "Buat", icon: <IconCreate />, activeIcon: <IconCreate />, active: pathname === "/create" },
    { href: "/direct", label: "Pesan", icon: <IconMessenger />, activeIcon: <IconMessenger />, active: pathname?.startsWith("/direct") },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-neutral-200 bg-white py-2 md:hidden">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          aria-label={it.label}
          className={`p-2 ${it.active ? "text-neutral-900" : "text-neutral-700"}`}
        >
          {it.active ? it.activeIcon : it.icon}
        </Link>
      ))}
      <Link href={`/${me.username}`} aria-label="Profil" className="p-2">
        <span
          className={`block rounded-full p-[2px] ${
            pathname === `/${me.username}` ? "ring-2 ring-neutral-900" : ""
          }`}
        >
          <Avatar name={me.name} username={me.username} color={me.color} size={24} />
        </span>
      </Link>
    </nav>
  );
}
