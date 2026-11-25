import { redirect } from "next/navigation";
import Link from "next/link";
import Shell from "@/components/Shell";
import Avatar from "@/components/Avatar";
import { getData } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { enrichPosts } from "@/lib/feed";
import { IconComment, IconHeart } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const me = await getSessionUser();
  if (!me) redirect("/login");
  const q = (searchParams.q ?? "").trim();
  const data = await getData();
  const ql = q.toLowerCase();
  const users = q
    ? data.users.filter(
        (u) =>
          u.username.toLowerCase().includes(ql) ||
          u.name.toLowerCase().includes(ql)
      )
    : [];
  const posts = q
    ? enrichPosts(data, me.id).filter((p) =>
        p.caption.toLowerCase().includes(ql)
      )
    : [];

  return (
    <Shell me={me}>
      <div className="mx-auto max-w-[600px] px-4 py-8">
        <h1 className="mb-4 text-xl font-bold">Cari</h1>
        <form action="/search" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari pengguna atau caption..."
            className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-neutral-400"
          />
        </form>
        {q === "" ? (
          <p className="mt-6 text-sm text-neutral-500">
            Ketik username, nama, atau kata di caption untuk mencari.
          </p>
        ) : (
          <>
            <h2 className="mb-3 mt-8 text-sm font-semibold text-neutral-500">
              Pengguna
            </h2>
            {users.length === 0 ? (
              <p className="text-sm text-neutral-500">Tidak ada pengguna yang cocok.</p>
            ) : (
              users.map((u) => (
                <Link
                  key={u.id}
                  href={`/${u.username}`}
                  className="mb-1 flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-neutral-100"
                >
                  <Avatar name={u.name} username={u.username} color={u.color} size={44} />
                  <span>
                    <b className="block text-sm">{u.username}</b>
                    <small className="block text-xs text-neutral-500">{u.name}</small>
                  </span>
                </Link>
              ))
            )}
            <h2 className="mb-3 mt-8 text-sm font-semibold text-neutral-500">
              Postingan
            </h2>
            {posts.length === 0 ? (
              <p className="text-sm text-neutral-500">Tidak ada postingan yang cocok.</p>
            ) : (
              <div className="grid grid-cols-3 gap-1">
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
          </>
        )}
      </div>
    </Shell>
  );
}
