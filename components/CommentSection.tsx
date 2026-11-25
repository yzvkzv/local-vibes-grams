"use client";

import { useState } from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import { timeAgo } from "@/lib/data";

type CommentItem = {
  id: string;
  body: string;
  createdAt: string;
  username: string;
  color: string;
};

export default function CommentSection({
  postId,
  initial,
  me,
}: {
  postId: string;
  initial: CommentItem[];
  me: { username: string; name: string; color: string };
}) {
  const [comments, setComments] = useState(initial);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (data.ok) {
        setComments((c) => [data.comment, ...c]);
        setBody("");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-neutral-500">
            Belum ada komentar. Jadilah yang pertama berkomentar.
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="mb-3 flex gap-3">
              <Link href={`/${c.username}`} className="shrink-0">
                <Avatar name={c.username} username={c.username} color={c.color} size={32} />
              </Link>
              <p className="text-sm leading-snug">
                <Link href={`/${c.username}`} className="mr-2 font-semibold">
                  {c.username}
                </Link>
                {c.body}
                <span className="ml-2 text-xs text-neutral-400">{timeAgo(c.createdAt)}</span>
              </p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-neutral-200 px-4 py-3">
        <Avatar name={me.name} username={me.username} color={me.color} size={32} />
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tambahkan komentar..."
          className="min-w-0 flex-1 text-sm outline-none placeholder:text-neutral-400"
        />
        <button
          type="submit"
          disabled={!body.trim() || busy}
          className="text-sm font-semibold text-sky-500 disabled:opacity-40"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
