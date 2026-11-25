import { redirect } from "next/navigation";
import CreateForm from "./CreateForm";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CreatePage() {
  const me = await getSessionUser();
  if (!me) redirect("/login");
  return <CreateForm me={me} />;
}
