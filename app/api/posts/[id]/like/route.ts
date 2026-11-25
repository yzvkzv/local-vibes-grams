import { NextResponse } from "next/server";
import { getData, saveData } from "@/lib/data";
import { getSessionUser } from "@/lib/session";

// POST /api/posts/[id]/like — like / unlike
export async function POST(
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
  const post = data.posts.find((p) => p.id === params.id);
  if (!post) {
    return NextResponse.json(
      { ok: false, error: "Post tidak ditemukan." },
      { status: 404 }
    );
  }
  const idx = data.likes.findIndex(
    (l) => l.postId === post.id && l.userId === me.id
  );
  let liked = true;
  if (idx >= 0) {
    data.likes.splice(idx, 1);
    liked = false;
  } else {
    data.likes.push({ userId: me.id, postId: post.id });
  }
  await saveData(data);
  const count = data.likes.filter((l) => l.postId === post.id).length;
  return NextResponse.json({ ok: true, liked, likes: count });
}
