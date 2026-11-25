"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Shell from "@/components/Shell";
import { IconCreate } from "@/components/Icons";

export default function CreatePage({
  me,
}: {
  me: { username: string; name: string; color: string };
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function onFile(f: File | undefined) {
    if (!f) return;
    const ext = (f.name.split(".").pop() ?? "").toLowerCase();
    const ok = ["jpg", "jpeg", "png", "webp", "gif", "mp4"].includes(ext);
    if (!ok) {
      setError("Format tidak didukung. Pakai JPG, PNG, WebP, GIF, atau MP4.");
      return;
    }
    const max = ext === "mp4" ? 12 * 1024 * 1024 : 5 * 1024 * 1024;
    if (f.size > max) {
      setError(
        ext === "mp4"
          ? "Video terlalu besar. Maksimal 12MB."
          : "Gambar terlalu besar. Maksimal 5MB."
      );
      return;
    }
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || busy) return;
    setError("");
    setBusy(true);
    try {
      const form = new FormData();
      form.append("media", file);
      form.append("caption", caption);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Gagal mengunggah. Coba lagi.");
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

  const isVideo = file?.type.startsWith("video/");

  return (
    <Shell me={me}>
      <div className="mx-auto max-w-[600px] px-4 py-8">
        <h1 className="mb-1 text-xl font-bold">Buat postingan baru</h1>
        <p className="mb-6 text-sm text-neutral-500">
          Bagikan momen lokal terbaik hari ini.
        </p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {error ? (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          ) : null}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-neutral-50"
          >
            {preview ? (
              isVideo ? (
                <video src={preview} controls className="max-h-[480px] w-full object-contain" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Pratinjau" className="max-h-[480px] w-full object-contain" />
              )
            ) : (
              <span className="flex flex-col items-center gap-2 text-neutral-500">
                <IconCreate />
                <span className="text-sm">Pilih gambar atau video</span>
                <span className="text-xs">Gambar maks 5MB · Video MP4 maks 12MB</span>
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/mp4"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          {file ? (
            <p className="text-xs text-neutral-500">
              {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB ·{" "}
              <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="font-semibold text-sky-500">
                Ganti file
              </button>
            </p>
          ) : null}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Tulis caption yang menarik..."
            className="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
          />
          <button
            type="submit"
            disabled={!file || busy}
            className="rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
          >
            {busy ? "Mengunggah..." : "Posting Sekarang"}
          </button>
        </form>
      </div>
    </Shell>
  );
}
