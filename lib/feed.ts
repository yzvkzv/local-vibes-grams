import { getData, type Post, type StoreData, type User } from "./data";

export type EnrichedPost = Post & {
  username: string;
  name: string;
  color: string;
  likes: number;
  liked: boolean;
  comments: number;
};

export function enrichPosts(
  data: StoreData,
  meId: string | null
): EnrichedPost[] {
  const byUser = new Map<string, User>(data.users.map((u) => [u.id, u]));
  return [...data.posts]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .map((p) => {
      const u = byUser.get(p.userId);
      return {
        ...p,
        username: u?.username ?? "pengguna",
        name: u?.name ?? "Pengguna",
        color: u?.color ?? "#999",
        likes: data.likes.filter((l) => l.postId === p.id).length,
        liked: meId
          ? data.likes.some((l) => l.postId === p.id && l.userId === meId)
          : false,
        comments: data.comments.filter((c) => c.postId === p.id).length,
      };
    });
}
