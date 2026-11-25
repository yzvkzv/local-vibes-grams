import { NextResponse } from "next/server";
import { getData } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { enrichPosts } from "@/lib/feed";

// GET /api/posts?offset=0&limit=8 — daftar postingan terbaru (untuk "Muat lagi")
export async function GET(request: Request) {
  const me = await getSessionUser();
  if (!me) {
    return NextResponse.json(
      { ok: false, error: "Harus login." },
      { status: 401 }
    );
  }
  const url = new URL(request.url);
  const offset = Math.max(0, parseInt(url.searchParams.get("offset") ?? "0", 10) || 0);
  const limit = Math.min(12, Math.max(3, parseInt(url.searchParams.get("limit") ?? "8", 10) || 8));
  const data = await getData();
  const posts = enrichPosts(data, me.id).slice(offset, offset + limit);
  return NextResponse.json({ ok: true, posts });
}
