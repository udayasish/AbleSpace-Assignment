import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginCard } from "@/components/auth/login-card";
import { BrandMark } from "@/components/brand-mark";

export default async function LoginPage() {
  const cookieStore = await cookies();
  if (cookieStore.has("access_token")) redirect("/");

  return (
    <div className="flex flex-1 items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <BrandMark />
        <LoginCard />
        <p className="text-muted-foreground text-center text-xs text-balance">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
