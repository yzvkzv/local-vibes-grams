import { NextResponse } from "next/server";
import { getData } from "@/lib/data";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const login = String(body?.login ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!login || !password) {
    return NextResponse.json(
      { ok: false, error: "Isi email/username dan kata sandi." },
      { status: 400 }
    );
  }

  const data = await getData();
  const user = data.users.find(
    (u) => u.username === login || u.email === login
  );
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { ok: false, error: "Login gagal. Cek kembali akun dan kata sandi." },
      { status: 401 }
    );
  }

  await createSession(user.id);
  return NextResponse.json({
    ok: true,
    user: { id: user.id, username: user.username, name: user.name },
  });
}
