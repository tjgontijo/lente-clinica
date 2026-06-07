// Sessões toda terça-feira às 19h30 (BRT = UTC-3)
export const SESSION_DAYS = [2]; // 2=terça (0=domingo)
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
  // Convert now's timestamp to a Date that represents BRT when read in UTC.
  // Since BRT is UTC-3, we subtract 3 hours from now.getTime().
  const brtTime = now.getTime() - 3 * 3600 * 1000;
  const brtDate = new Date(brtTime);

  let candidateTime = brtTime;

  for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
    const check = new Date(brtTime);
    check.setUTCDate(brtDate.getUTCDate() + daysAhead);
    check.setUTCHours(SESSION_HOUR, SESSION_MINUTE, 0, 0);

    const checkTime = check.getTime();
    if (
      SESSION_DAYS.includes(check.getUTCDay()) &&
      checkTime > brtTime - SESSION_DURATION_SECONDS * 1000 - OFFER_WINDOW_SECONDS * 1000
    ) {
      candidateTime = checkTime;
      break;
    }
  }

  // Convert the candidate time in BRT back to UTC startsAt date by adding 3 hours
  const startsAt = new Date(candidateTime + 3 * 3600 * 1000);
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
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const hh = h.toString().padStart(2, "0");
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");

  if (d > 0) {
    return `${d}d ${hh}:${mm}:${ss}`;
  }
  return `${hh}:${mm}:${ss}`;
}
