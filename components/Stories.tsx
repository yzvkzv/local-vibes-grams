import Link from "next/link";
import Avatar from "./Avatar";
import type { User } from "@/lib/data";

export default function Stories({ users }: { users: User[] }) {
  return (
    <div className="no-scrollbar flex gap-4 overflow-x-auto border-b border-neutral-200 px-2 py-4">
      {users.map((u) => (
        <Link
          key={u.id}
          href={`/${u.username}`}
          className="flex w-[74px] shrink-0 flex-col items-center gap-1"
        >
          <span className="story-ring rounded-full p-[3px]">
            <span className="block rounded-full bg-white p-[2px]">
              <Avatar name={u.name} username={u.username} color={u.color} size={56} />
            </span>
          </span>
          <span className="w-full truncate text-center text-xs text-neutral-700">
            {u.username}
          </span>
        </Link>
      ))}
    </div>
  );
}
