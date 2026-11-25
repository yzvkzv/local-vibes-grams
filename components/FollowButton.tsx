"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FollowButton({
  username,
  initialFollowing,
}: {
  username: string;
  initialFollowing: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const next = !following;
    setFollowing(next);
    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.ok) setFollowing(data.following);
      router.refresh();
    } catch {
      setFollowing(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-lg px-5 py-1.5 text-sm font-semibold transition disabled:opacity-50 ${
        following
          ? "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
          : "bg-sky-500 text-white hover:bg-sky-600"
      }`}
    >
      {following ? "Mengikuti" : "Ikuti"}
    </button>
  );
}
