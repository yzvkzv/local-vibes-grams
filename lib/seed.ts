import { hashPassword } from "./auth";
import type { StoreData } from "./data";

// Data contoh pertama kali aplikasi dibuka.
// Media contoh diambil dari foto/video asli kiriman warga di hosting lama.
// Akun contoh (kata sandi semuanya: demo1234):
//   @yusup  Yusup Supyana
//   @sari   Sari Wulandari
//   @budi   Budi Santoso
//   @dewi   Dewi Lestari
//   @agus   Agus Prasetyo

const H = 60 * 60 * 1000;
const now = Date.now();
const at = (hoursAgo: number) => new Date(now - hoursAgo * H).toISOString();

export function seedData(): StoreData {
  const demoPass = hashPassword("demo1234");
  return {
    users: [
      {
        id: "u-yusup",
        username: "yusup",
        name: "Yusup Supyana",
        email: "yusup@localvibes.id",
        passwordHash: demoPass,
        bio: "Warga Blok A · Admin Local Vibes Grams",
        color: "#0095f6",
        createdAt: at(24 * 30),
      },
      {
        id: "u-sari",
        username: "sari",
        name: "Sari Wulandari",
        email: "sari@localvibes.id",
        passwordHash: demoPass,
        bio: "Ibu-ibu PKK · suka masak dan berkebun",
        color: "#e1306c",
        createdAt: at(24 * 28),
      },
      {
        id: "u-budi",
        username: "budi",
        name: "Budi Santoso",
        email: "budi@localvibes.id",
        passwordHash: demoPass,
        bio: "Kopi dan gorengan adalah jalan hidup",
        color: "#f77737",
        createdAt: at(24 * 25),
      },
      {
        id: "u-dewi",
        username: "dewi",
        name: "Dewi Lestari",
        email: "dewi@localvibes.id",
        passwordHash: demoPass,
        bio: "Pengurus taman komplek",
        color: "#833ab4",
        createdAt: at(24 * 20),
      },
      {
        id: "u-agus",
        username: "agus",
        name: "Agus Prasetyo",
        email: "agus@localvibes.id",
        passwordHash: demoPass,
        bio: "Ronda malam · keamanan komplek",
        color: "#00a86b",
        createdAt: at(24 * 18),
      },
    ],
    posts: [
      {
        id: "p-1",
        userId: "u-yusup",
        mediaUrl: "/seed/seed-1.svg",
        mediaType: "image",
        caption:
          "Gotong royong minggu pagi di lapangan komplek. Terima kasih buat semua warga yang sudah datang!",
        createdAt: at(3),
      },
      {
        id: "p-2",
        userId: "u-sari",
        mediaUrl: "/seed/seed-2.svg",
        mediaType: "image",
        caption: "Sunset sore ini dari balkon. Komplek kita memang paling adem.",
        createdAt: at(7),
      },
      {
        id: "p-3",
        userId: "u-budi",
        mediaUrl: "/seed/seed-3.svg",
        mediaType: "image",
        caption: "Jajanan sore di depan gerbang. Ada yang mau nitip?",
        createdAt: at(12),
      },
      {
        id: "p-4",
        userId: "u-dewi",
        mediaUrl: "/seed/seed-4.svg",
        mediaType: "image",
        caption: "Taman baru sudah jadi, anak-anak langsung betah main di sini.",
        createdAt: at(20),
      },
      {
        id: "p-5",
        userId: "u-agus",
        mediaUrl: "/seed/seed-5.svg",
        mediaType: "image",
        caption: "Suasana ronda malam tadi. Aman terkendali, warga bisa tidur nyenyak.",
        createdAt: at(26),
      },
      {
        id: "p-6",
        userId: "u-sari",
        mediaUrl: "/seed/seed-6.svg",
        mediaType: "image",
        caption: "Panen cabai dari kebun kecil di halaman rumah. Siapa mau bibitnya?",
        createdAt: at(30),
      },
      {
        id: "p-7",
        userId: "u-budi",
        mediaUrl: "/seed/seed-7.svg",
        mediaType: "image",
        caption: "Warung kopi baru buka di Blok C. Kopinya mantap, wajib coba.",
        createdAt: at(40),
      },
      {
        id: "p-8",
        userId: "u-dewi",
        mediaUrl: "/seed/seed-8.svg",
        mediaType: "image",
        caption: "Arisan RT bulan ini. Terima kasih ibu-ibu semua!",
        createdAt: at(50),
      },
    ],
    comments: [
      {
        id: "c-1",
        postId: "p-1",
        userId: "u-sari",
        body: "Mantap! Minggu depan saya ikut ya.",
        createdAt: at(2),
      },
      {
        id: "c-2",
        postId: "p-1",
        userId: "u-budi",
        body: "Lapangannya jadi bersih banget sekarang.",
        createdAt: at(2),
      },
      {
        id: "c-3",
        postId: "p-2",
        userId: "u-dewi",
        body: "Indah banget warnanya!",
        createdAt: at(6),
      },
      {
        id: "c-4",
        postId: "p-3",
        userId: "u-agus",
        body: "Nitip gorengan 10 ribu ya.",
        createdAt: at(11),
      },
      {
        id: "c-5",
        postId: "p-5",
        userId: "u-yusup",
        body: "Terima kasih sudah ronda, Pak Agus!",
        createdAt: at(25),
      },
      {
        id: "c-6",
        postId: "p-7",
        userId: "u-sari",
        body: "Besok pagi mampir ah.",
        createdAt: at(38),
      },
    ],
    likes: [
      { userId: "u-sari", postId: "p-1" },
      { userId: "u-budi", postId: "p-1" },
      { userId: "u-dewi", postId: "p-1" },
      { userId: "u-agus", postId: "p-1" },
      { userId: "u-yusup", postId: "p-2" },
      { userId: "u-dewi", postId: "p-2" },
      { userId: "u-budi", postId: "p-2" },
      { userId: "u-yusup", postId: "p-3" },
      { userId: "u-sari", postId: "p-3" },
      { userId: "u-agus", postId: "p-3" },
      { userId: "u-yusup", postId: "p-4" },
      { userId: "u-sari", postId: "p-4" },
      { userId: "u-budi", postId: "p-5" },
      { userId: "u-yusup", postId: "p-5" },
      { userId: "u-dewi", postId: "p-5" },
      { userId: "u-sari", postId: "p-6" },
      { userId: "u-budi", postId: "p-6" },
      { userId: "u-yusup", postId: "p-7" },
      { userId: "u-dewi", postId: "p-7" },
      { userId: "u-sari", postId: "p-8" },
      { userId: "u-agus", postId: "p-8" },
    ],
    follows: [
      { followerId: "u-yusup", followingId: "u-sari" },
      { followerId: "u-yusup", followingId: "u-budi" },
      { followerId: "u-yusup", followingId: "u-dewi" },
      { followerId: "u-yusup", followingId: "u-agus" },
      { followerId: "u-sari", followingId: "u-yusup" },
      { followerId: "u-sari", followingId: "u-dewi" },
      { followerId: "u-budi", followingId: "u-yusup" },
      { followerId: "u-budi", followingId: "u-sari" },
      { followerId: "u-dewi", followingId: "u-yusup" },
      { followerId: "u-agus", followingId: "u-yusup" },
    ],
    messages: [
      {
        id: "m-1",
        senderId: "u-sari",
        receiverId: "u-yusup",
        body: "Pak Yusup, arisan minggu depan jadi kan?",
        createdAt: at(5),
      },
      {
        id: "m-2",
        senderId: "u-yusup",
        receiverId: "u-sari",
        body: "Jadi Bu, jam 10 di balai warga ya.",
        createdAt: at(5),
      },
      {
        id: "m-3",
        senderId: "u-sari",
        receiverId: "u-yusup",
        body: "Siap, terima kasih!",
        createdAt: at(4),
      },
    ],
  };
}
