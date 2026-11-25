import { cookies } from "next/headers";
import { getData, getSessions, saveSessions, type User } from "./data";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  newSessionToken,
} from "./auth";

export async function getSessionUser(): Promise<User | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const sessions = await getSessions();
  const session = sessions[token];
  if (!session) return null;
  const data = await getData();
  return data.users.find((u) => u.id === session.userId) ?? null;
}

export async function createSession(userId: string): Promise<string> {
  const token = newSessionToken();
  const sessions = await getSessions();
  sessions[token] = { userId, createdAt: new Date().toISOString() };
  // Buang sesi yang lebih tua dari 30 hari supaya KV tidak penuh.
  const cutoff = Date.now() - SESSION_MAX_AGE * 1000;
  for (const [t, s] of Object.entries(sessions)) {
    if (new Date(s.createdAt).getTime() < cutoff) delete sessions[t];
  }
  await saveSessions(sessions);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return token;
}

export async function destroySession(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    const sessions = await getSessions();
    delete sessions[token];
    await saveSessions(sessions);
  }
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
