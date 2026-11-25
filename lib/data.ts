import { kv } from "@vercel/kv";
import { seedData } from "./seed";

// ---- Tipe data ----------------------------------------------------------

export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  passwordHash: string;
  bio: string;
  color: string;
  createdAt: string;
};

export type Post = {
  id: string;
  userId: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  caption: string;
  createdAt: string;
};

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  body: string;
  createdAt: string;
};

export type Like = { userId: string; postId: string };
export type Follow = { followerId: string; followingId: string };

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  body: string;
  createdAt: string;
};

export type StoreData = {
  users: User[];
  posts: Post[];
  comments: Comment[];
  likes: Like[];
  follows: Follow[];
  messages: Message[];
};

export type Sessions = Record<string, { userId: string; createdAt: string }>;

// ---- Kunci KV -----------------------------------------------------------
// Satu store Upstash dipakai bersama aplikasi kasir, tapi kuncinya beda:
// kasir  -> "yusup-cell:data"
// medsos -> "lvg:data" dan "lvg:sessions"
export const DATA_KEY = "lvg:data";
export const SESSIONS_KEY = "lvg:sessions";

export function kvConfigured(): boolean {
  return Boolean(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
      (process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

function isValidStoreData(value: unknown): value is StoreData {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.users) &&
    Array.isArray(v.posts) &&
    Array.isArray(v.comments) &&
    Array.isArray(v.likes) &&
    Array.isArray(v.follows) &&
    Array.isArray(v.messages)
  );
}

// Mode lokal (tanpa KV): data hanya hidup di memori server ini.
// Dipakai supaya aplikasi tetap bisa dibuka dan dites sebelum KV dipasang.
// Begitu KV terhubung, semua data pindah ke cloud dan tersimpan permanen.
let memoryData: StoreData | null = null;
let memorySessions: Sessions = {};

export async function getData(): Promise<StoreData> {
  if (!kvConfigured()) {
    if (!memoryData) memoryData = seedData();
    return memoryData;
  }
  const data = await kv.get<StoreData>(DATA_KEY);
  if (data && isValidStoreData(data)) return data;
  const seed = seedData();
  await kv.set(DATA_KEY, seed);
  return seed;
}

export async function saveData(data: StoreData): Promise<void> {
  if (!kvConfigured()) {
    memoryData = data;
    return;
  }
  await kv.set(DATA_KEY, data);
}

export async function getSessions(): Promise<Sessions> {
  if (!kvConfigured()) return memorySessions;
  const s = await kv.get<Sessions>(SESSIONS_KEY);
  return s ?? {};
}

export async function saveSessions(sessions: Sessions): Promise<void> {
  if (!kvConfigured()) {
    memorySessions = sessions;
    return;
  }
  await kv.set(SESSIONS_KEY, sessions);
}

// ---- Helper -------------------------------------------------------------

export function newId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  );
}

export function timeAgo(iso: string): string {
  const t = Date.now() - new Date(iso).getTime();
  const s = Math.floor(t / 1000);
  if (s < 60) return "baru saja";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} mnt`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} h`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const AVATAR_COLORS = [
  "#e1306c",
  "#405de6",
  "#833ab4",
  "#fd1d1d",
  "#f77737",
  "#0095f6",
  "#00a86b",
  "#e67e22",
];
