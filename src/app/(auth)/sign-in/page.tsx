import { redirect } from "next/navigation";

import { SignInForm } from "@/features/auth/components/sign-in-form";
import { getServerSession } from "@/server/auth/server-session";

export default async function SignInPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/medications");
  }

  return <SignInForm />;
}
