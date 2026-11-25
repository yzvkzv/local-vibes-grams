import { NextResponse } from "next/server";
import { getData, saveData, newId } from "@/lib/data";
import { getSessionUser } from "@/lib/session";

// GET /api/posts/[id]/comments — daftar komentar
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const me = await getSessionUser();
  if (!me) {
    return NextResponse.json(
      { ok: false, error: "Harus login." },
      { status: 401 }
    );
  }
  const data = await getData();
  const comments = data.comments
    .filter((c) => c.postId === params.id)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .map((c) => {
      const u = data.users.find((x) => x.id === c.userId);
      return {
        ...c,
        username: u?.username ?? "pengguna",
        color: u?.color ?? "#999",
      };
    });
  return NextResponse.json({ ok: true, comments });
}

// POST /api/posts/[id]/comments — tambah komentar
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const me = await getSessionUser();
  if (!me) {
    return NextResponse.json(
      { ok: false, error: "Harus login." },
      { status: 401 }
    );
  }
  const body = await request.json().catch(() => null);
  const text = String(body?.body ?? "").trim();
  if (!text) {
    return NextResponse.json(
      { ok: false, error: "Komentar tidak boleh kosong." },
      { status: 400 }
    );
  }
  const data = await getData();
  if (!data.posts.some((p) => p.id === params.id)) {
    return NextResponse.json(
      { ok: false, error: "Post tidak ditemukan." },
      { status: 404 }
    );
  }
  const comment = {
    id: newId(),
    postId: params.id,
    userId: me.id,
    body: text.slice(0, 1000),
    createdAt: new Date().toISOString(),
  };
  data.comments.push(comment);
  await saveData(data);
  return NextResponse.json({
    ok: true,
    comment: { ...comment, username: me.username, color: me.color },
  });
}
