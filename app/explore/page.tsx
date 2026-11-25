import { redirect } from "next/navigation";
import Link from "next/link";
import Shell from "@/components/Shell";
import { getData } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { enrichPosts } from "@/lib/feed";
import { IconComment, IconHeart, IconVideo } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const me = await getSessionUser();
  if (!me) redirect("/login");
  const data = await getData();
  const posts = enrichPosts(data, me.id);

  return (
    <Shell me={me}>
      <div className="mx-auto max-w-[935px] px-1 py-6 md:px-4">
        <h1 className="mb-4 px-2 text-lg font-bold">Jelajahi</h1>
        {posts.length === 0 ? (
          <p className="rounded-lg border border-neutral-200 p-8 text-center text-sm text-neutral-500">
            Belum ada postingan untuk dijelajahi.
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
                  <>
                    <video src={p.mediaUrl} preload="metadata" muted className="h-full w-full object-cover" />
                    <span className="absolute right-2 top-2 text-white drop-shadow">
                      <IconVideo />
                    </span>
                  </>
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
    </Shell>
  );
}
