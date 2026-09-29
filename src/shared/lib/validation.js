export const emailOk = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
export const telOk = (v) => String(v || "").replace(/\D/g, "").length >= 10;
