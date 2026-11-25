import { NextResponse } from "next/server";
import { getData, saveData, AVATAR_COLORS, newId } from "@/lib/data";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const username = String(body?.username ?? "").trim().toLowerCase();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!name || !username || !email || !password) {
    return NextResponse.json(
      { ok: false, error: "Semua field wajib diisi." },
      { status: 400 }
    );
  }
  if (!/^[a-z0-9._]{3,30}$/.test(username)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Username hanya boleh huruf kecil, angka, titik, dan underscore (3-30 karakter).",
      },
      { status: 400 }
    );
  }
  const RESERVED = new Set([
    "login",
    "register",
    "explore",
    "create",
    "direct",
    "search",
    "p",
    "api",
    "admin",
    "support",
    "localvibesgrams",
  ]);
  if (RESERVED.has(username)) {
    return NextResponse.json(
      { ok: false, error: "Username itu tidak bisa dipakai." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Format email tidak valid." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { ok: false, error: "Kata sandi minimal 6 karakter." },
      { status: 400 }
    );
  }

  const data = await getData();
  if (
    data.users.some(
      (u) => u.username === username || u.email === email
    )
  ) {
    return NextResponse.json(
      { ok: false, error: "Username atau email sudah dipakai." },
      { status: 409 }
    );
  }

  const user = {
    id: newId(),
    username,
    name,
    email,
    passwordHash: hashPassword(password),
    bio: "",
    color: AVATAR_COLORS[data.users.length % AVATAR_COLORS.length],
    createdAt: new Date().toISOString(),
  };
  data.users.push(user);
  await saveData(data);
  await createSession(user.id);

  return NextResponse.json({
    ok: true,
    user: { id: user.id, username: user.username, name: user.name },
  });
}
