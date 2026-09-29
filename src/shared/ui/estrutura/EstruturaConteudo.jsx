import { cn } from "../../lib/cn.js";
export function Section({ children, id, className, bleed }) {
  return (
    <section id={id} className={cn(bleed ? "py-0" : "py-section", className)}>
      {children}
    </section>
  );
}
export function Wrap({ children, narrow, className }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-gutter",
        narrow ? "max-w-form" : "max-w-site",
        className,
      )}
    >
      {children}
    </div>
  );
}
