import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HomePlaceholder } from "@/components/home-placeholder";

export default async function Home() {
  const cookieStore = await cookies();
  if (!cookieStore.has("access_token")) redirect("/login");

  return <HomePlaceholder />;
}
