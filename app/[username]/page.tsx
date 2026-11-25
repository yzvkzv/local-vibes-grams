import { redirect } from "next/navigation";
import Link from "next/link";
import Shell from "@/components/Shell";
import Avatar from "@/components/Avatar";
import FollowButton from "@/components/FollowButton";
import { getData } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { enrichPosts } from "@/lib/feed";
import { IconComment, IconHeart, IconVideo } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const me = await getSessionUser();
  if (!me) redirect("/login");
  const data = await getData();
  const user = data.users.find(
    (u) => u.username === params.username.toLowerCase()
  );
  if (!user) {
    return (
      <Shell me={me}>
        <div className="mx-auto max-w-[600px] px-4 py-10">
          <div className="rounded-lg border border-neutral-200 p-8 text-center text-sm text-neutral-500">
            Pengguna tidak ditemukan.
          </div>
        </div>
      </Shell>
    );
  }
  const posts = enrichPosts(data, me.id).filter((p) => p.userId === user.id);
  const followers = data.follows.filter((f) => f.followingId === user.id).length;
  const following = data.follows.filter((f) => f.followerId === user.id).length;
  const isMe = user.id === me.id;
  const followed = data.follows.some(
    (f) => f.followerId === me.id && f.followingId === user.id
  );

  return (
    <Shell me={me}>
      <div className="mx-auto max-w-[935px] px-4 py-8">
        <header className="flex gap-4 md:gap-16">
          <div className="shrink-0">
            <span className="md:hidden">
              <Avatar name={user.name} username={user.username} color={user.color} size={80} />
            </span>
            <span className="hidden md:block">
              <Avatar name={user.name} username={user.username} color={user.color} size={110} />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-semibold">{user.username}</h1>
              {isMe ? (
                <Link
                  href="/create"
                  className="rounded-lg bg-neutral-200 px-4 py-1.5 text-sm font-semibold hover:bg-neutral-300"
                >
                  Buat postingan
                </Link>
              ) : (
                <>
                  <FollowButton username={user.username} initialFollowing={followed} />
                  <Link
                    href={`/direct?to=${user.username}`}
                    className="rounded-lg bg-neutral-200 px-4 py-1.5 text-sm font-semibold hover:bg-neutral-300"
                  >
                    Kirim pesan
                  </Link>
                </>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm md:gap-6">
              <span>
                <b>{posts.length}</b> postingan
              </span>
              <span>
                <b>{followers}</b> pengikut
              </span>
              <span>
                <b>{following}</b> mengikuti
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold">{user.name}</p>
            {user.bio ? (
              <p className="text-sm text-neutral-600">{user.bio}</p>
            ) : (
              <p className="text-sm text-neutral-500">
                Cerita, kabar, dan vibes lokal.
              </p>
            )}
          </div>
        </header>

        <div className="mt-10 border-t border-neutral-200">
          <p className="flex items-center justify-center gap-2 py-3 text-xs font-semibold tracking-widest text-neutral-500">
            <IconVideo /> POSTINGAN
          </p>
          {posts.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-500">
              Belum ada postingan.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/p/${p.id}`}
                  className="group relative aspect-square overflow-hidden bg-neutral-100"
                >
                  {p.mediaType === "video" ? (
                    <video src={p.mediaUrl} preload="metadata" muted className="h-full w-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.mediaUrl} alt={p.caption || "Postingan"} loading="lazy" className="h-full w-full object-cover" />
                  )}
                  <span className="absolute inset-0 hidden items-center justify-center gap-4 bg-black/40 text-white group-hover:flex">
                    <span className="flex items-center gap-1 text-sm font-bold">
                      <IconHeart /> {p.likes}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold">
                      <IconComment /> {p.comments}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
