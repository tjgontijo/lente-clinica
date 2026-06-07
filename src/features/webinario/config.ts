// Vídeo de teste — VSL do Programa Lente Clínica
// Substituir pelo vídeo do webinário após gravação
export const WEBINAR_PLAYER_SCRIPT_SRC =
  "https://scripts.converteai.net/1eb34a82-3ae7-47c1-aa35-02f2cc9b474e/players/69f77f3930090a44b9530fc8/v4/player.js";
export const WEBINAR_PLAYER_EMBED_ID = "vid-69f77f3930090a44b9530fc8";
export const WEBINAR_VIDEO_ASPECT = "1:1";

// Para teste: 15 min (igual ao CTA da VSL original)
// Produção: 38 * 60 (início do bloco de oferta no roteiro do webinário)
export const OFFER_RELEASE_SECONDS = 15 * 60;

// Ticket do produto — preencher antes de gravar (497 ou 997)
export const OFFER_PRICE = "R$ 497";
export const OFFER_INSTALLMENTS = "10x de R$ 54,90";
export const OFFER_CHECKOUT_URL = "/checkout";

// Duração total do webinário em segundos
export const WEBINAR_DURATION_SECONDS = 50 * 60;

// Oferta fica visível por X minutos após ser revelada
export const OFFER_WINDOW_MINUTES = 30;

// Storage key para persistir oferta revelada entre recarregamentos
export const WEBINAR_OFFER_STORAGE_KEY =
  "webinario-lente-clinica:offer-unlocked";

// Sessão: toda terça às 19h30 (BRT)
export const SESSION_DAYS = [2]; // 2=terça
export const SESSION_HOUR = 19;
export const SESSION_MINUTE = 30;
