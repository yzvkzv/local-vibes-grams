import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getData, saveData, newId } from "@/lib/data";
import { getSessionUser } from "@/lib/session";

const ALLOWED: Record<string, { type: "image" | "video"; max: number }> = {
  jpg: { type: "image", max: 5 * 1024 * 1024 },
  jpeg: { type: "image", max: 5 * 1024 * 1024 },
  png: { type: "image", max: 5 * 1024 * 1024 },
  webp: { type: "image", max: 5 * 1024 * 1024 },
  gif: { type: "image", max: 5 * 1024 * 1024 },
  mp4: { type: "video", max: 12 * 1024 * 1024 },
};

// POST /api/upload — upload foto/video ke Vercel Blob lalu buat postingan.
// Form-data: media (file), caption (teks).
// Perbaikan dari versi PHP lama: file tidak lagi disimpan ke folder hosting
// (yang sering gagal karena batas upload & permission), melainkan ke
// Vercel Blob — penyimpanan file resmi Vercel.
export async function POST(request: Request) {
  const me = await getSessionUser();
  if (!me) {
    return NextResponse.json(
      { ok: false, error: "Harus login." },
      { status: 401 }
    );
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Penyimpanan file (Blob) belum dipasang. Buat Blob store di dashboard Vercel lalu hubungkan ke project ini.",
      },
      { status: 503 }
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("media");
  const caption = String(form?.get("caption") ?? "").trim();
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { ok: false, error: "Pilih file gambar/video dulu." },
      { status: 400 }
    );
  }
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const rule = ALLOWED[ext];
  if (!rule) {
    return NextResponse.json(
      { ok: false, error: "Format tidak didukung. Pakai JPG, PNG, WebP, GIF, atau MP4." },
      { status: 400 }
    );
  }
  if (file.size > rule.max) {
    return NextResponse.json(
      {
        ok: false,
        error:
          rule.type === "video"
            ? "Video terlalu besar. Maksimal 12MB."
            : "Gambar terlalu besar. Maksimal 5MB.",
      },
      { status: 400 }
    );
  }

  try {
    const filename = `posts/${Date.now()}_${newId()}.${ext}`;
    const blob = await put(filename, file, { access: "public" });
    const data = await getData();
    const post = {
      id: newId(),
      userId: me.id,
      mediaUrl: blob.url,
      mediaType: rule.type,
      caption: caption.slice(0, 1000),
      createdAt: new Date().toISOString(),
    };
    data.posts.push(post);
    await saveData(data);
    return NextResponse.json({ ok: true, post });
  } catch (err) {
    console.error("Gagal upload ke Blob:", err);
    return NextResponse.json(
      { ok: false, error: "Gagal mengunggah file. Coba lagi." },
      { status: 500 }
    );
  }
}
