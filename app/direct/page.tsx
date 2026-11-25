import { redirect } from "next/navigation";
import Shell from "@/components/Shell";
import DirectChat from "@/components/DirectChat";
import { getData } from "@/lib/data";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DirectPage({
  searchParams,
}: {
  searchParams: { to?: string };
}) {
  const me = await getSessionUser();
  if (!me) redirect("/login");
  const data = await getData();
  const peerIds = new Set<string>();
  for (const m of data.messages) {
    if (m.senderId === me.id) peerIds.add(m.receiverId);
    if (m.receiverId === me.id) peerIds.add(m.senderId);
  }
  const peers = data.users
    .filter((u) => peerIds.has(u.id))
    .map((u) => ({ username: u.username, name: u.name, color: u.color }));
  const selected = (searchParams.to ?? "").trim().toLowerCase();
  return (
    <Shell me={me}>
      <DirectChat me={me} peers={peers} selected={selected} />
    </Shell>
  );
}
