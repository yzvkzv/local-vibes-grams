import { redirect } from "next/navigation";
import Link from "next/link";
import Shell from "@/components/Shell";
import Stories from "@/components/Stories";
import FeedList from "@/components/FeedList";
import Avatar from "@/components/Avatar";
import { getData } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { enrichPosts } from "@/lib/feed";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const me = await getSessionUser();
  if (!me) redirect("/login");
  const data = await getData();
  const posts = enrichPosts(data, me.id);
  const first = posts.slice(0, 8);
  const suggestions = data.users
    .filter((u) => u.id !== me.id)
    .filter((u) => !data.follows.some((f) => f.followerId === me.id && f.followingId === u.id))
    .slice(0, 5);

  return (
    <Shell me={me}>
      <div className="mx-auto flex max-w-[935px] justify-center gap-16 px-0 md:px-4">
        <div className="w-full max-w-[470px]">
          <Stories users={data.users} />
          {posts.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 p-8 text-center text-sm text-neutral-500">
              Belum ada postingan. Jadilah yang pertama membagikan momen lokal.
            </div>
          ) : (
            <FeedList initial={first} total={posts.length} />
          )}
        </div>
        <aside className="hidden w-[320px] shrink-0 pt-8 xl:block">
          <div className="flex items-center gap-3">
            <Link href={`/${me.username}`}>
              <Avatar name={me.name} username={me.username} color={me.color} size={44} />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/${me.username}`} className="block truncate text-sm font-semibold">
                {me.username}
              </Link>
              <span className="block truncate text-sm text-neutral-500">{me.name}</span>
            </div>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-semibold text-neutral-500">
                Disarankan untuk Anda
              </p>
              <div className="mt-3 flex flex-col gap-3">
                {suggestions.map((u) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <Link href={`/${u.username}`}>
                      <Avatar name={u.name} username={u.username} color={u.color} size={40} />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/${u.username}`} className="block truncate text-sm font-semibold">
                        {u.username}
                      </Link>
                      <span className="block truncate text-xs text-neutral-500">{u.name}</span>
                    </div>
                    <Link href={`/${u.username}`} className="text-xs font-semibold text-sky-500">
                      Lihat
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="mt-8 text-xs leading-relaxed text-neutral-400">
            Local Vibes Grams — cerita, foto, dan kabar dari sekitar komplek kamu.
          </p>
        </aside>
      </div>
    </Shell>
  );
}
