import { NextResponse } from "next/server";
import { getData, saveData } from "@/lib/data";
import { getSessionUser } from "@/lib/session";

// POST /api/follow — ikuti / berhenti mengikuti (body: { username })
export async function POST(request: Request) {
  const me = await getSessionUser();
  if (!me) {
    return NextResponse.json(
      { ok: false, error: "Harus login." },
      { status: 401 }
    );
  }
  const body = await request.json().catch(() => null);
  const username = String(body?.username ?? "").trim().toLowerCase();
  const data = await getData();
  const target = data.users.find((u) => u.username === username);
  if (!target || target.id === me.id) {
    return NextResponse.json(
      { ok: false, error: "Pengguna tidak ditemukan." },
      { status: 404 }
    );
  }
  const idx = data.follows.findIndex(
    (f) => f.followerId === me.id && f.followingId === target.id
  );
  let following = true;
  if (idx >= 0) {
    data.follows.splice(idx, 1);
    following = false;
  } else {
    data.follows.push({ followerId: me.id, followingId: target.id });
  }
  await saveData(data);
  const followers = data.follows.filter(
    (f) => f.followingId === target.id
  ).length;
  return NextResponse.json({ ok: true, following, followers });
}
