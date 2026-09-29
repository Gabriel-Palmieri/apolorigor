// Classes explícitas para que o Tailwind inclua os estados no build.
const tons = {
  grey: [
    "text-grey-fg",
    "bg-grey-bg",
    "border-grey-border",
    "bg-grey-fg",
    "border-grey-fg",
  ],
  green: [
    "text-green-fg",
    "bg-green-bg",
    "border-green-border",
    "bg-green-fg",
    "border-green-fg",
  ],
  orange: [
    "text-orange-fg",
    "bg-orange-bg",
    "border-orange-border",
    "bg-orange-fg",
    "border-orange-fg",
  ],
  yellow: [
    "text-yellow-fg",
    "bg-yellow-bg",
    "border-yellow-border",
    "bg-yellow-fg",
    "border-yellow-fg",
  ],
  red: [
    "text-red-fg",
    "bg-red-bg",
    "border-red-border",
    "bg-red-fg",
    "border-red-fg",
  ],
  blue: [
    "text-blue-fg",
    "bg-blue-bg",
    "border-blue-border",
    "bg-blue-fg",
    "border-blue-fg",
  ],
};

const aparencias = Object.fromEntries(
  Object.entries(tons).map(
    ([tom, [textClassName, bg, border, markerClassName, outlineClassName]]) => [
      tom,
      {
        textClassName,
        bg,
        border,
        markerClassName,
        outlineClassName,
        classes: `${bg} ${textClassName} ${border}`,
      },
    ],
  ),
);

export function aparenciaTom(tom) {
  return aparencias[tom] ?? aparencias.grey;
}

export function aparenciaStatus(mapa, estado) {
  return aparenciaTom(mapa[estado]?.tone);
}
