import { NextResponse } from "next/server";
import { getData, saveData, newId } from "@/lib/data";
import { getSessionUser } from "@/lib/session";

// GET /api/messages?to=username — isi percakapan dengan seseorang
export async function GET(request: Request) {
  const me = await getSessionUser();
  if (!me) {
    return NextResponse.json(
      { ok: false, error: "Harus login." },
      { status: 401 }
    );
  }
  const to = new URL(request.url).searchParams.get("to") ?? "";
  const data = await getData();
  const other = data.users.find(
    (u) => u.username === to.trim().toLowerCase()
  );
  if (!other) return NextResponse.json({ ok: true, messages: [] });
  const messages = data.messages
    .filter(
      (m) =>
        (m.senderId === me.id && m.receiverId === other.id) ||
        (m.senderId === other.id && m.receiverId === me.id)
    )
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
    .slice(-80)
    .map((m) => ({ ...m, me: m.senderId === me.id }));
  return NextResponse.json({ ok: true, messages });
}

// POST /api/messages — kirim pesan (body: { to, body })
export async function POST(request: Request) {
  const me = await getSessionUser();
  if (!me) {
    return NextResponse.json(
      { ok: false, error: "Harus login." },
      { status: 401 }
    );
  }
  const body = await request.json().catch(() => null);
  const to = String(body?.to ?? "").trim().toLowerCase();
  const text = String(body?.body ?? "").trim();
  if (!to || !text) {
    return NextResponse.json(
      { ok: false, error: "Tujuan dan isi pesan wajib diisi." },
      { status: 400 }
    );
  }
  const data = await getData();
  const other = data.users.find((u) => u.username === to);
  if (!other) {
    return NextResponse.json(
      { ok: false, error: "Pengguna tidak ditemukan." },
      { status: 404 }
    );
  }
  const message = {
    id: newId(),
    senderId: me.id,
    receiverId: other.id,
    body: text.slice(0, 1000),
    createdAt: new Date().toISOString(),
  };
  data.messages.push(message);
  await saveData(data);
  return NextResponse.json({ ok: true, message: { ...message, me: true } });
}
