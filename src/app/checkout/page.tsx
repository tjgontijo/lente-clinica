import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/server/db/db";
import { user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { findSubscriptionByUserId } from "@/features/billing/repositories/billing.repository";
import { CheckoutPageContent } from "./checkout-page-content";
import { redirect } from "next/navigation";

interface CheckoutPageProps {
  searchParams: Promise<{ plan?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { plan } = await searchParams;
  const reqHeaders = await headers();

  const session = await auth.api.getSession({ headers: reqHeaders });

  // If logged in and already subscribed, redirect to dashboard
  if (session?.user) {
    const subscription = await findSubscriptionByUserId(session.user.id);
    if (subscription?.isActive) {
      redirect("/medications");
    }
  }

  // Fetch saved cpfCnpj/phone if user is logged in
  const fullUser = session?.user
    ? await db.query.user.findFirst({ where: eq(user.id, session.user.id) })
    : null;

  return (
    <CheckoutPageContent
      cpfCnpj={fullUser?.cpfCnpj ?? ""}
      phone={fullUser?.phone ?? ""}
      userEmail={session?.user?.email ?? ""}
      initialPlan={plan ?? "professional_monthly"}
    />
  );
}
