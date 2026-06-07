// Sessões toda terça-feira às 19h30 (BRT = UTC-3)
// Também toda quinta às 19h30 como segunda opção
export const SESSION_DAYS = [2, 4]; // 2=terça, 4=quinta (0=domingo)
export const SESSION_HOUR = 19;
export const SESSION_MINUTE = 30;
export const SESSION_DURATION_SECONDS = 55 * 60; // 55 min
export const OFFER_WINDOW_SECONDS = 30 * 60; // oferta disponível 30 min após fim

export interface SessionInfo {
  startsAt: Date;
  endsAt: Date;
  offerEndsAt: Date;
  status: "waiting" | "live" | "offer" | "ended";
  elapsedSeconds: number; // segundos decorridos desde o início
  secondsUntilStart: number; // segundos até o início (0 se já começou)
}

export function getNextSession(now: Date = new Date()): SessionInfo {
  // Converte para BRT (UTC-3)
  const brtOffset = -3 * 60; // minutos
  const brtNow = new Date(
    now.getTime() + (brtOffset - now.getTimezoneOffset()) * 60000,
  );

  let candidate = new Date(brtNow);
  candidate.setHours(SESSION_HOUR, SESSION_MINUTE, 0, 0);

  // Encontra a próxima sessão (hoje ou futura)
  for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
    const check = new Date(brtNow);
    check.setDate(brtNow.getDate() + daysAhead);
    check.setHours(SESSION_HOUR, SESSION_MINUTE, 0, 0);

    if (
      SESSION_DAYS.includes(check.getDay()) &&
      check.getTime() >
        brtNow.getTime() -
          SESSION_DURATION_SECONDS * 1000 -
          OFFER_WINDOW_SECONDS * 1000
    ) {
      candidate = check;
      break;
    }
  }

  // Converte de volta para UTC
  const startsAt = new Date(
    candidate.getTime() - (brtOffset - now.getTimezoneOffset()) * 60000,
  );
  const endsAt = new Date(startsAt.getTime() + SESSION_DURATION_SECONDS * 1000);
  const offerEndsAt = new Date(endsAt.getTime() + OFFER_WINDOW_SECONDS * 1000);

  const elapsed = Math.floor((now.getTime() - startsAt.getTime()) / 1000);
  const secondsUntilStart = Math.max(
    0,
    Math.floor((startsAt.getTime() - now.getTime()) / 1000),
  );

  let status: SessionInfo["status"];
  if (now < startsAt) {
    status = "waiting";
  } else if (now < endsAt) {
    status = "live";
  } else if (now < offerEndsAt) {
    status = "offer";
  } else {
    status = "ended";
  }

  return {
    startsAt,
    endsAt,
    offerEndsAt,
    status,
    elapsedSeconds: Math.max(0, elapsed),
    secondsUntilStart,
  };
}

export function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
