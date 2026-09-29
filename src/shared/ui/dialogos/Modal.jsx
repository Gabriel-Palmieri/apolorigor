import { Dialog } from "./Dialog.jsx";
import { Heading } from "../estrutura/Typography.jsx";
import { TickRule } from "../estrutura/Tape.jsx";
import { cn } from "../../lib/cn.js";
const widths = {
  860: "max-w-4xl",
  1000: "max-w-5xl",
  460: "max-w-lg",
  480: "max-w-lg",
  520: "max-w-xl",
  560: "max-w-xl",
  600: "max-w-2xl",
  640: "max-w-2xl",
  680: "max-w-3xl",
  720: "max-w-3xl",
  760: "max-w-4xl",
};
function DialogHeading({ title, subtitle, onClose, panel }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <Heading>{title}</Heading>
        {subtitle && (
          <p className="mb-0 mt-1 text-xs text-text-sub">{subtitle}</p>
        )}
      </div>
      <button
        type="button"
        className="flex size-10 shrink-0 items-center justify-center border-0 bg-transparent text-lg text-text-sub hover:text-text"
        onClick={onClose}
        aria-label={panel ? "Fechar painel" : "Fechar diálogo"}
      >
        ✕
      </button>
    </div>
  );
}
export function Modal({ title, subtitle, onClose, children, width = 560 }) {
  return (
    <Dialog
      label={title}
      onClose={onClose}
      className={cn(
        "apollo-scale-in rounded-card p-6",
        widths[width] ?? "max-w-2xl",
      )}
    >
          <TickRule textClassName="text-gold" className="mb-4 opacity-70" />
      <DialogHeading
        {...{
          title,
          subtitle,
          onClose,
        }}
      />
      {children}
    </Dialog>
  );
}
export function Drawer({ title, subtitle, onClose, children, width = 480 }) {
  return (
    <Dialog
      label={title}
      onClose={onClose}
      className={cn(
        "m-0 ml-auto h-dvh max-h-dvh w-full open:flex open:flex-col",
        widths[width] ?? "max-w-lg",
      )}
    >
      <div className="border-b border-border px-6 py-5">
          <TickRule textClassName="text-gold" className="mb-3.5 opacity-70" />
        <DialogHeading
          {...{
            title,
            subtitle,
            onClose,
          }}
          panel
        />
      </div>
      <div className="overflow-y-auto p-6">{children}</div>
    </Dialog>
  );
}
