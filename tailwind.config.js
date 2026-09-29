const semantic = [
  "bg",
  "bg-elevated",
  "card",
  "sidebar",
  "sidebar-text",
  "input-bg",
  "border",
  "border-soft",
  "gold",
  "gold-dim",
  "gold-text",
  "gold-strong",
  "text",
  "text-sub",
  "text-muted",
  "accent-ink",
  "button-ink",
  "paper",
];
const colors = Object.fromEntries(
  semantic.map((name) => [name, `var(--${name})`]),
);
for (const tone of ["green", "orange", "yellow", "red", "grey", "blue"]) {
  for (const part of ["fg", "bg", "border"])
    colors[`${tone}-${part}`] = `var(--status-${tone}-${part})`;
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...colors,
        "sidebar-muted":
          "color-mix(in srgb, var(--sidebar-text) 50%, transparent)",
      },
      gridTemplateColumns: {
        "agenda-preview": "5.5rem minmax(0, 1fr)",
        intro: "minmax(0, 1.6fr) minmax(0, 0.8fr)",
        fashion: "minmax(0, 1.35fr) minmax(0, 1fr)",
        step: "2rem minmax(0, 1fr)",
        product: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
        "rental-row": "1.2fr 1fr 0.8fr 1.2fr 0.6fr auto",
        "package-row": "96px 1.3fr 1fr 1fr auto",
        dashboard: "2.2fr 1fr",
        tiles: "repeat(auto-fill, minmax(min(100%, 10rem), 1fr))",
        "participant-row":
          "38px minmax(150px, 1fr) 104px 132px 104px 140px 16px",
        checkout: "1.35fr 1fr",
        catalog: "repeat(auto-fill, minmax(min(100%, 14rem), 1fr))",
        hero: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
        pair: "minmax(0, 1fr) minmax(0, 1fr)",
        summary: "minmax(0, 1fr) minmax(0, 320px)",
        panels: "repeat(auto-fill, minmax(min(100%, 20rem), 1fr))",
      },
      aspectRatio: {
        landscape: "4/3",
        editorial: "4/5",
        wide: "5/4",
        portrait: "3/4",
      },
      screens: { tablet: "621px", desktop: "901px", wide: "1281px", phone: "481px" },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        micro: ["0.625rem", "1.5"],
        caption: ["0.6875rem", "1.5"],
        compact: ["0.8125rem", "1.5"],
        fashion: ["clamp(2.75rem, 6.2vw, 6rem)", "1.05"],
        editorial: ["clamp(2.4rem, 6vw, 4.6rem)", "1.04"],
        title: ["clamp(1.7rem, 3.4vw, 2.7rem)", "1.1"],
        lead: ["clamp(1rem, 1.5vw, 1.18rem)", "1.6"],
      },
      borderRadius: { card: "var(--radius)", control: "var(--radius-sm)" },
      boxShadow: { surface: "var(--shadow)" },
      maxWidth: ({ theme }) => ({ ...theme('spacing'), site: "clamp(73.75rem, 92vw, 100rem)", form: "45rem", measure: "46ch" }),
      minWidth: ({ theme }) => ({ ...theme('spacing') }),
      minHeight: ({ theme }) => ({ ...theme('spacing') }),
      width: { dialog: "calc(100% - 2rem)" },
      opacity: { 55: ".55" },
      maxHeight: { dialog: "calc(100dvh - 2rem)" },
      spacing: {
        "hero-photo": "clamp(19rem, 36vw, 32rem)",
        gutter: "clamp(1.25rem, 4vw, 2.5rem)",
        section: "clamp(3.5rem, 8vw, 7rem)",
        rhythm: "clamp(1.5rem, 5vw, 4rem)",
      },
    },
  },
  plugins: [],
};
