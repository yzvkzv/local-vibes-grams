import { redirect } from "next/navigation";
import Link from "next/link";
import Shell from "@/components/Shell";
import Avatar from "@/components/Avatar";
import CommentSection from "@/components/CommentSection";
import PostActions from "@/components/PostActions";
import { getData, timeAgo } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { enrichPosts } from "@/lib/feed";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: { id: string } }) {
  const me = await getSessionUser();
  if (!me) redirect("/login");
  const data = await getData();
  const enriched = enrichPosts(data, me.id).find((p) => p.id === params.id);
  if (!enriched) {
    return (
      <Shell me={me}>
        <div className="mx-auto max-w-[600px] px-4 py-10">
          <div className="rounded-lg border border-neutral-200 p-8 text-center text-sm text-neutral-500">
            Post tidak ditemukan.
          </div>
        </div>
      </Shell>
    );
  }
  const comments = data.comments
    .filter((c) => c.postId === enriched.id)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .map((c) => {
      const u = data.users.find((x) => x.id === c.userId);
      return {
        ...c,
        username: u?.username ?? "pengguna",
        color: u?.color ?? "#999",
      };
    });

  return (
    <Shell me={me}>
      <div className="mx-auto max-w-[935px] px-1 py-6 md:px-4">
        <div className="overflow-hidden rounded-md border border-neutral-200 md:flex">
          <div className="flex items-center justify-center bg-black md:w-[55%]">
            {enriched.mediaType === "video" ? (
              <video src={enriched.mediaUrl} controls preload="metadata" className="max-h-[600px] w-full object-contain" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={enriched.mediaUrl} alt={enriched.caption || "Postingan"} className="max-h-[600px] w-full object-contain" />
            )}
          </div>
          <div className="flex min-h-[400px] flex-1 flex-col md:w-[45%]">
            <header className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
              <Link href={`/${enriched.username}`}>
                <Avatar name={enriched.name} username={enriched.username} color={enriched.color} size={32} />
              </Link>
              <Link href={`/${enriched.username}`} className="text-sm font-semibold">
                {enriched.username}
              </Link>
              <span className="text-xs text-neutral-400">· {timeAgo(enriched.createdAt)}</span>
            </header>
            <div className="border-b border-neutral-200 px-4 py-3 text-sm leading-snug">
              <Link href={`/${enriched.username}`} className="mr-2 font-semibold">
                {enriched.username}
              </Link>
              {enriched.caption}
            </div>
            <CommentSection postId={enriched.id} initial={comments} me={me} />
            <div className="border-t border-neutral-200 px-4 py-3">
              <PostActions post={enriched} />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
