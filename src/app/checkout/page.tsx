import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/server/db/db";
import { user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { findSubscriptionByUserId } from "@/features/billing/repositories/billing.repository";
import { CheckoutPageContent } from "./checkout-page-content";

export default async function CheckoutPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Fetch subscription status
  const subscription = await findSubscriptionByUserId(session.user.id);

  // If user is already active, send them back to the main dashboard
  if (subscription?.isActive) {
    redirect("/medications");
  }

  // Fetch full user record to retrieve saved cpfCnpj/phone if any
  const fullUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  return (
    <CheckoutPageContent
      cpfCnpj={fullUser?.cpfCnpj || ""}
      phone={fullUser?.phone || ""}
      userEmail={session.user.email}
    />
  );
}
