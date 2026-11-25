"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Pendaftaran gagal.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-[350px]">
        <div className="rounded-sm border border-neutral-300 px-10 pb-6 pt-10 text-center">
          <h1 className="text-[32px] font-bold italic leading-tight tracking-tight">
            Local Vibes Grams
          </h1>
          <p className="mt-2 text-sm font-semibold text-neutral-500">
            Daftar untuk melihat foto dan kabar dari warga sekitar komplek kamu.
          </p>
          <form onSubmit={submit} className="mt-6 flex flex-col gap-2">
            {error ? (
              <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              autoComplete="name"
              required
              className="rounded border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
              placeholder="Username"
              autoComplete="username"
              required
              className="rounded border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              required
              className="rounded border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata sandi (minimal 6 karakter)"
              autoComplete="new-password"
              required
              className="rounded border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-lg bg-sky-500 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
            >
              {busy ? "Mendaftar..." : "Daftar"}
            </button>
          </form>
        </div>
        <div className="mt-3 rounded-sm border border-neutral-300 py-5 text-center text-sm">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-sky-500">
            Masuk
          </Link>
        </div>
      </div>
    </main>
  );
}
