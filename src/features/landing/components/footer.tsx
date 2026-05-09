import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--lc-neutral-950)] border-t border-[var(--lc-neutral-800)] py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex mb-4">
              <img
                src="/images/system/logo_horizontal.png"
                alt="Lente Clínica"
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="max-w-sm text-sm text-[var(--lc-neutral-500)] leading-relaxed mb-4">
              Apoio ao acompanhamento de pacientes medicados com organização, segurança e responsabilidade clínica.
            </p>
            <p className="text-xs text-[var(--lc-neutral-600)] max-w-sm leading-relaxed">
              A Lente Clínica não substitui avaliação, diagnóstico ou conduta profissional. Ela organiza informações para apoiar sua escuta, análise e acompanhamento.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--lc-neutral-600)] mb-4">Links</p>
            <ul className="space-y-3 text-sm text-[var(--lc-neutral-500)]">
              {[
                { label: "Termos de Uso", href: "#" },
                { label: "Política de Privacidade", href: "#" },
                { label: "Segurança de Dados", href: "#" },
                { label: "Contato", href: "#" },
                { label: "Aviso Clínico", href: "#" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[var(--lc-teal-400)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--lc-neutral-800)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--lc-neutral-600)]">
            &copy; {new Date().getFullYear()} Lente Clínica. Todos os direitos reservados.
          </p>
          <p className="text-xs text-[var(--lc-neutral-700)] text-center md:text-right max-w-sm">
            Ferramenta de apoio clínico. Não realiza diagnóstico nem define condutas médicas ou terapêuticas.
          </p>
        </div>
      </div>
    </footer>
  );
}
