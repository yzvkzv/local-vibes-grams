"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";

type Msg = {
  id: string;
  body: string;
  createdAt: string;
  me: boolean;
};

type Peer = { username: string; name: string; color: string };

export default function DirectChat({
  me,
  peers,
  selected,
}: {
  me: { username: string; name: string; color: string };
  peers: Peer[];
  selected: string;
}) {
  const [to, setTo] = useState(selected);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  async function load(target: string) {
    if (!target) return;
    try {
      const res = await fetch(`/api/messages?to=${encodeURIComponent(target)}`);
      const data = await res.json();
      if (data.ok) setMessages(data.messages);
    } catch {
      /* abaikan, coba lagi di polling berikutnya */
    }
  }

  useEffect(() => {
    setMessages([]);
    load(to);
    if (!to) return;
    const t = setInterval(() => load(to), 7000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !to || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, body }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Gagal mengirim pesan.");
        return;
      }
      setBody("");
      await load(to);
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setBusy(false);
    }
  }

  const peer = peers.find((p) => p.username === to);

  return (
    <div className="mx-auto flex h-[calc(100vh-57px)] max-w-[935px] md:h-[calc(100vh-0px)]">
      <aside className={`w-full border-r border-neutral-200 p-4 md:w-[320px] ${to ? "hidden md:block" : ""}`}>
        <h1 className="mb-3 text-lg font-bold">{me.username}</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = (new FormData(e.currentTarget).get("to") as string)?.trim().toLowerCase();
            if (v) setTo(v);
          }}
          className="mb-3"
        >
          <input
            name="to"
            defaultValue={to}
            placeholder="Buka chat dengan username..."
            className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </form>
        {peers.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Belum ada percakapan. Ketik username di atas untuk mulai chat baru.
          </p>
        ) : (
          peers.map((p) => (
            <button
              key={p.username}
              onClick={() => setTo(p.username)}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-neutral-100 ${
                to === p.username ? "bg-neutral-100" : ""
              }`}
            >
              <Avatar name={p.name} username={p.username} color={p.color} size={44} />
              <span className="min-w-0">
                <b className="block truncate text-sm">{p.name}</b>
                <small className="block truncate text-xs text-neutral-500">@{p.username}</small>
              </span>
            </button>
          ))
        )}
      </aside>
      <div className={`min-w-0 flex-1 flex-col ${to ? "flex" : "hidden md:flex"}`}>
        <header className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
          {peer ? (
            <>
              <Avatar name={peer.name} username={peer.username} color={peer.color} size={32} />
              <Link href={`/${peer.username}`} className="text-sm font-semibold">
                @{peer.username}
              </Link>
            </>
          ) : (
            <h2 className="text-sm font-semibold">
              {to ? `@${to}` : "Pilih percakapan"}
            </h2>
          )}
          {to && (
            <button onClick={() => setTo("")} className="ml-auto text-xs font-semibold text-sky-500 md:hidden">
              Kembali
            </button>
          )}
        </header>
        <div ref={boxRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {!to ? (
            <p className="py-10 text-center text-sm text-neutral-500">
              Pilih atau mulai percakapan untuk melihat pesan di sini.
            </p>
          ) : messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-500">
              Belum ada pesan. Kirim pesan pertama ke @{to}.
            </p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`mb-2 flex ${m.me ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${
                    m.me ? "bg-sky-500 text-white" : "bg-neutral-100 text-neutral-800"
                  }`}
                >
                  {m.body}
                </div>
              </div>
            ))
          )}
        </div>
        {error ? (
          <p className="border-t border-neutral-200 px-4 pt-2 text-sm text-red-600">{error}</p>
        ) : null}
        <form onSubmit={send} className="flex items-center gap-2 border-t border-neutral-200 px-4 py-3">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tulis pesan..."
            disabled={!to}
            className="min-w-0 flex-1 rounded-full border border-neutral-300 px-4 py-2 text-sm outline-none focus:border-neutral-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!to || !body.trim() || busy}
            className="text-sm font-semibold text-sky-500 disabled:opacity-40"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}
