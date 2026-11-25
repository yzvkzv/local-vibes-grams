"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import type { EnrichedPost } from "@/lib/feed";

const PAGE_SIZE = 8;

export default function FeedList({
  initial,
  total,
}: {
  initial: EnrichedPost[];
  total: number;
}) {
  const [posts, setPosts] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(initial.length >= total);

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts?offset=${posts.length}&limit=${PAGE_SIZE}`
      );
      const data = await res.json();
      if (data.ok && data.posts.length > 0) {
        setPosts((p) => [...p, ...data.posts]);
        if (posts.length + data.posts.length >= total) setDone(true);
      } else {
        setDone(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
      {!done && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="my-6 w-full rounded-lg border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 disabled:opacity-50"
        >
          {loading ? "Memuat..." : "Muat postingan lagi"}
        </button>
      )}
    </>
  );
}
