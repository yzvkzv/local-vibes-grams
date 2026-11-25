import Link from "next/link";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { IconHeart, IconMessenger } from "./Icons";

export default function Shell({
  me,
  children,
}: {
  me: { username: string; name: string; color: string };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar me={me} />
      {/* Bar atas (hanya di HP) */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
        <Link href="/" className="text-[20px] font-bold italic tracking-tight">
          Local Vibes Grams
        </Link>
        <div className="flex items-center gap-4 text-neutral-800">
          <Link href="/direct" aria-label="Pesan">
            <IconMessenger />
          </Link>
          <Link href="/explore" aria-label="Jelajahi">
            <IconHeart />
          </Link>
        </div>
      </header>
      <main className="pb-16 md:pb-0 md:pl-[245px]">{children}</main>
      <BottomNav me={me} />
    </div>
  );
}
