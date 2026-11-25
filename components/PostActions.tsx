"use client";

import { useState } from "react";
import { IconHeart, IconShare } from "./Icons";
import type { EnrichedPost } from "@/lib/feed";

export default function PostActions({ post }: { post: EnrichedPost }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [copied, setCopied] = useState(false);

  async function toggleLike() {
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setLiked(data.liked);
        setLikes(data.likes);
      }
    } catch {
      setLiked(!next);
      setLikes((n) => n + (next ? -1 : 1));
    }
  }

  async function share() {
    const url = `${window.location.origin}/p/${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Local Vibes Grams", url });
        return;
      }
      throw new Error("no share");
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        /* abaikan */
      }
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <button onClick={toggleLike} aria-label="Suka" className="transition hover:opacity-60">
          <IconHeart filled={liked} />
        </button>
        <button onClick={share} aria-label="Bagikan" className="transition hover:opacity-60">
          <IconShare />
        </button>
        <span className="ml-auto text-xs text-neutral-500">
          {copied ? "Link disalin" : ""}
        </span>
      </div>
      <p className="pt-2 text-sm font-semibold">{likes} suka</p>
    </div>
  );
}
