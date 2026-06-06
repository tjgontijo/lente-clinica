import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-white">
      {/* Background Gradients & Patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--lc-teal-50)] via-white to-[var(--lc-amber-50)] opacity-70" />
        <div className="absolute inset-0 lc-dot-pattern opacity-[0.07]" />
        <div
          className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full bg-[var(--lc-teal-200)] blur-[120px] opacity-35 lc-animate-float mix-blend-multiply"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-[var(--lc-amber-200)] blur-[120px] opacity-25 lc-animate-float mix-blend-multiply"
          style={{ animationDelay: "-5s", animationDirection: "reverse" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, white 75%)",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md border border-[var(--lc-teal-100)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--lc-teal-800)] mb-10 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--lc-teal-500)] animate-pulse shrink-0" />
            <span>Apoio clínico especializado</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading mx-auto max-w-4xl text-4xl font-light tracking-tight text-[var(--lc-neutral-950)] md:text-6xl lg:text-7xl leading-[1.1] mb-8">
            Acompanhe pacientes medicados com mais{" "}
            <span className="text-[var(--lc-teal-600)] italic">
              clareza clínica.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-lg text-[var(--lc-neutral-600)] md:text-xl leading-relaxed mb-4 font-light">
            A Lente Clínica organiza relatos, destaca sinais relevantes e gera
            fichas de apoio para a sua prática.
          </p>
          <p className="mx-auto max-w-xl text-sm text-[var(--lc-neutral-400)] mb-12">
            Sem substituir sua escuta, diagnóstico ou julgamento profissional.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row mb-6">
            <Link
              href="/sign-in"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--lc-teal-900)] hover:bg-[var(--lc-teal-950)] text-white px-10 py-4 text-base font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Criar minha conta{" "}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="#pain-points"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--lc-neutral-200)] text-[var(--lc-neutral-600)] hover:border-[var(--lc-neutral-300)] hover:text-[var(--lc-neutral-900)] px-8 py-4 text-base font-medium transition-all"
            >
              Ver como funciona
            </Link>
          </div>
          <p className="text-xs text-[var(--lc-neutral-400)] mb-20">
            Cancele quando quiser. Sem compromisso de permanência.
          </p>

          {/* Browser Mockup */}
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="rounded-[40px] border border-[var(--lc-neutral-150)] bg-white p-3 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)]">
              <div className="overflow-hidden rounded-[28px] border border-[var(--lc-neutral-100)] bg-[var(--lc-neutral-50)] aspect-[16/9] flex flex-col items-center justify-center gap-4 text-[var(--lc-neutral-300)]">
                <div className="h-20 w-20 rounded-3xl bg-white shadow-md flex items-center justify-center">
                  <Sparkles size={36} className="text-[var(--lc-teal-200)]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold tracking-widest uppercase mb-1">
                    Plataforma Lente Clínica
                  </p>
                  <p className="text-xs text-[var(--lc-neutral-400)]">
                    Veja como funciona em menos de 2 minutos.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -bottom-8 -left-8 hidden lg:flex items-center gap-4 rounded-3xl bg-white p-5 shadow-2xl border border-[var(--lc-neutral-100)] transition-transform hover:-translate-y-2">
              <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="/images/system/logo_square.png"
                  alt="Lente Clínica"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[var(--lc-neutral-900)]">
                  Curadoria Especializada
                </p>
                <p className="text-xs text-[var(--lc-neutral-500)]">
                  Principais psicofármacos
                </p>
              </div>
            </div>

            <div className="absolute -top-8 -right-8 hidden lg:flex items-center gap-4 rounded-3xl bg-white p-5 shadow-2xl border border-[var(--lc-neutral-100)] transition-transform hover:-translate-y-2">
              <div className="h-12 w-12 rounded-2xl bg-[var(--lc-teal-50)] flex items-center justify-center text-[var(--lc-teal-600)]">
                <Sparkles size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[var(--lc-neutral-900)]">
                  Fichas de Apoio
                </p>
                <p className="text-xs text-[var(--lc-neutral-500)]">
                  Rastreio e observação clínica
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
