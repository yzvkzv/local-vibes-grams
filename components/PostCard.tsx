"use client";

import Link from "next/link";
import { useState } from "react";
import Avatar from "./Avatar";
import { IconComment, IconDots, IconHeart, IconShare } from "./Icons";
import { timeAgo } from "@/lib/data";
import { type EnrichedPost } from "@/lib/feed";

export default function PostCard({ post }: { post: EnrichedPost }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
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

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: comment }),
      });
      const data = await res.json();
      if (data.ok) {
        setCommentCount((n) => n + 1);
        setComment("");
      }
    } finally {
      setBusy(false);
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
    <article className="border-b border-neutral-200 pb-5">
      <header className="flex items-center gap-3 px-1 py-3">
        <Link href={`/${post.username}`}>
          <Avatar name={post.name} username={post.username} color={post.color} size={38} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/${post.username}`}
            className="block truncate text-sm font-semibold text-neutral-900 hover:text-neutral-500"
          >
            {post.username}
          </Link>
          <span className="block text-xs text-neutral-500">
            {timeAgo(post.createdAt)}
          </span>
        </div>
        <span className="text-neutral-800">
          <IconDots />
        </span>
      </header>

      <Link href={`/p/${post.id}`} className="block overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
        {post.mediaType === "video" ? (
          <video
            src={post.mediaUrl}
            controls
            preload="metadata"
            className="max-h-[580px] w-full object-contain"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.mediaUrl}
            alt={post.caption || `Postingan @${post.username}`}
            loading="lazy"
            className="max-h-[580px] w-full object-contain"
          />
        )}
      </Link>

      <div className="flex items-center gap-4 px-1 pt-3">
        <button onClick={toggleLike} aria-label="Suka" className="transition hover:opacity-60">
          <IconHeart filled={liked} />
        </button>
        <Link href={`/p/${post.id}`} aria-label="Komentar" className="transition hover:opacity-60">
          <IconComment />
        </Link>
        <button onClick={share} aria-label="Bagikan" className="transition hover:opacity-60">
          <IconShare />
        </button>
        <span className="ml-auto text-xs text-neutral-500">
          {copied ? "Link disalin" : ""}
        </span>
      </div>

      <div className="px-1 pt-2 text-sm">
        <p className="font-semibold text-neutral-900">
          {likes} suka
        </p>
        {post.caption ? (
          <p className="mt-1 leading-snug">
            <Link href={`/${post.username}`} className="mr-2 font-semibold text-neutral-900">
              {post.username}
            </Link>
            <span className="text-neutral-800">{post.caption}</span>
          </p>
        ) : null}
        {commentCount > 0 ? (
          <Link
            href={`/p/${post.id}`}
            className="mt-1 block text-sm text-neutral-500"
          >
            Lihat semua {commentCount} komentar
          </Link>
        ) : null}
        <form onSubmit={submitComment} className="mt-2 flex items-center gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tambahkan komentar..."
            className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
          <button
            type="submit"
            disabled={!comment.trim() || busy}
            className="text-sm font-semibold text-sky-500 disabled:opacity-40"
          >
            Kirim
          </button>
        </form>
      </div>
    </article>
  );
}
