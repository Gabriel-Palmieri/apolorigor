import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Custom tokens join the same conflict groups as Tailwind's standard utilities.
const merge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["micro", "caption", "compact", "editorial", "title", "lead"],
        },
      ],
      rounded: [
        {
          rounded: ["card", "control"],
        },
      ],
    },
  },
});
export const cn = (...values) => merge(clsx(values));
