import { Button } from "./Button.jsx";
import { cn } from "../../lib/cn.js";
export function BotaoIcone({ children, onClick, title, active }) {
  return (
    <Button
      variant="ghost"
      size="compact"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "size-9 p-0 text-base",
        active && "border-transparent bg-gold-dim text-gold-text",
      )}
    >
      {children}
    </Button>
  );
}
