import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[var(--lc-bg-app)]">
      <aside className="relative hidden w-1/2 overflow-hidden lg:flex">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--lc-teal-900)] via-[var(--lc-teal-800)] to-[var(--lc-teal-600)]" />
        <div className="absolute -bottom-32 -right-28 h-96 w-96 rounded-full bg-[var(--lc-teal-400)]/20 blur-[90px]" />
        <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-[var(--lc-teal-300)]/10 blur-[80px]" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <div className="h-4 w-4 rounded-full border-2 border-white" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Lente Clínica
              </p>
            </div>

            <h1 className="mt-12 font-sans text-5xl font-medium leading-tight tracking-tight">
              Apoio clínico para quem acompanha pacientes medicados.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Transforme dúvidas e relatos sobre medicação em observações
              clínicas úteis para o seu atendimento.
            </p>
          </div>

          <div className="space-y-4 text-sm text-white/60">
            <div className="h-px w-12 bg-white/30" />
            <p>Sua lente de observação e registro em saúde mental.</p>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[430px]">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-[var(--lc-teal-600)] flex items-center justify-center">
                <div className="h-3 w-3 rounded-full border border-white" />
              </div>
              <span className="font-semibold text-[var(--lc-teal-900)]">
                Lente Clínica
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--lc-border-default)] bg-white p-6 shadow-[var(--lc-shadow-md)] sm:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
