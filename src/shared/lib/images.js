export const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='640' viewBox='0 0 480 640'%3E%3Crect width='480' height='640' fill='%23ccc'/%3E%3C/svg%3E";

// fallback para fotos de catálogo que não carregam (URLs externas)
export const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect width='300' height='400' fill='%23ECE7DA'/%3E%3Cg fill='none' stroke='%23A79D84' stroke-width='1'%3E%3Cpath d='M0 60h300M0 120h300M0 180h300M0 240h300M0 300h300M0 360h300'/%3E%3C/g%3E%3Ctext x='150' y='205' font-family='monospace' font-size='13' fill='%236B6453' text-anchor='middle' letter-spacing='2'%3EFOTO EM BREVE%3C/text%3E%3C/svg%3E";
export function onImgError(e) {
  if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG;
}

// ── Fita métrica horizontal — marcações a cada 1 e 5 unidades ──────────────────
