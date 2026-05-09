import { Navbar } from "@/features/landing/components/navbar";
import { Hero } from "@/features/landing/components/hero";
import { PainPoints } from "@/features/landing/components/pain-points";
import { TargetAudience } from "@/features/landing/components/target-audience";
import { Features } from "@/features/landing/components/features";
import { Pricing } from "@/features/landing/components/pricing";
import { FAQ } from "@/features/landing/components/faq";
import { Footer } from "@/features/landing/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      {/* white */}
      <PainPoints />
      {/* neutral-100 */}
      <TargetAudience />
      {/* white */}
      <Features />
      {/* neutral-100 */}
      <Pricing />
      {/* neutral-950 dark */}
      <FAQ />
      {/* white */}
      <Footer />
      {/* neutral-950 dark — closes the page */}
    </main>
  );
}
