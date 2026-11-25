"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Login gagal.");
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
          <p className="mt-2 text-sm text-neutral-500">
            Cerita, foto, dan kabar dari sekitar komplek kamu — semua di satu
            tempat.
          </p>
          <form onSubmit={submit} className="mt-6 flex flex-col gap-2">
            {error ? (
              <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Email atau username"
              autoComplete="username"
              required
              className="rounded border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata sandi"
              autoComplete="current-password"
              required
              className="rounded border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-lg bg-sky-500 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
            >
              {busy ? "Masuk..." : "Masuk"}
            </button>
          </form>
          <p className="mt-4 text-xs text-neutral-400">
            Akun contoh: <b className="text-neutral-600">yusup</b> /{" "}
            <b className="text-neutral-600">demo1234</b>
          </p>
        </div>
        <div className="mt-3 rounded-sm border border-neutral-300 py-5 text-center text-sm">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-sky-500">
            Daftar
          </Link>
        </div>
      </div>
    </main>
  );
}
