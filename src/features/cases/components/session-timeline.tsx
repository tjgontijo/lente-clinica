import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, Activity } from "lucide-react";

interface SessionTimelineProps {
	sessions: any[]; // I'll use any for now, but I should define a type
}

export function SessionTimeline({ sessions }: SessionTimelineProps) {
	if (sessions.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className="w-16 h-16 rounded-full bg-[var(--lc-neutral-50)] flex items-center justify-center text-[var(--lc-neutral-200)] mb-4">
					<Calendar size={32} />
				</div>
				<h3 className="text-[16px] font-bold text-[var(--lc-neutral-800)]">
					Nenhuma sessão registrada
				</h3>
				<p className="text-[14px] text-[var(--lc-neutral-500)] max-w-[240px] mt-1">
					As sessões aparecerão aqui conforme forem realizadas.
				</p>
			</div>
		);
	}

	return (
		<div className="relative pl-8 space-y-12 before:absolute before:inset-0 before:left-0 before:w-px before:bg-gradient-to-b before:from-[var(--lc-teal-200)] before:via-[var(--lc-neutral-100)] before:to-transparent">
			{sessions.map((session) => (
				<div key={session.id} className="relative group">
					{/* Dot */}
					<div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-white border-4 border-[var(--lc-teal-500)] shadow-sm z-10 group-hover:scale-125 transition-transform" />

					<div className="flex flex-col gap-4">
						{/* Date & Info */}
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-2">
								<span className="text-[16px] font-bold text-[var(--lc-neutral-900)]">
									{format(new Date(session.date), "dd 'de' MMMM", {
										locale: ptBR,
									})}
								</span>
								<Badge className="bg-[var(--lc-neutral-100)] text-[var(--lc-neutral-600)] border-none text-[10px] h-5">
									Sessão #{session.id.slice(-4).toUpperCase()}
								</Badge>
							</div>
							<span className="text-[13px] text-[var(--lc-neutral-400)] font-medium">
								{format(new Date(session.date), "yyyy 'às' HH:mm", {
									locale: ptBR,
								})}
							</span>
						</div>

						{/* Observations (Symptoms) */}
						{session.observations && session.observations.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{session.observations.map((obs: any) => (
									<Badge
										key={obs.id}
										variant="outline"
										className={`
                      px-2.5 py-1 rounded-full border-none text-[11px] font-bold tracking-tight flex items-center gap-1.5
                      ${
												obs.severity === "High"
													? "bg-red-50 text-red-700"
													: obs.severity === "Medium"
													? "bg-amber-50 text-amber-700"
													: "bg-teal-50 text-teal-700"
											}
                    `}
									>
										<Activity size={10} strokeWidth={3} />
										{obs.symptom.name}
									</Badge>
								))}
							</div>
						)}

						{/* Notes */}
						{session.notes && (
							<div className="bg-[var(--lc-neutral-50)] p-4 rounded-[20px] border border-[var(--lc-neutral-100)] group-hover:border-[var(--lc-teal-100)] transition-colors">
								<div className="flex items-center gap-2 text-[var(--lc-neutral-400)] mb-2">
									<MessageSquare size={14} />
									<span className="text-[11px] font-bold uppercase tracking-wider">
										Notas Clínicas
									</span>
								</div>
								<p className="text-[14px] text-[var(--lc-neutral-700)] leading-relaxed italic">
									"{session.notes}"
								</p>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
