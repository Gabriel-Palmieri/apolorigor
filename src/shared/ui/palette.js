// Semantic palette for data-driven colour choices. Static elements use utilities directly.
export const C = {
  "bg": "var(--bg)",
  "bgElevated": "var(--bg-elevated)",
  "card": "var(--card)",
  "sidebar": "var(--sidebar)",
  "sidebarText": "var(--sidebar-text)",
  "inputBg": "var(--input-bg)",
  "border": "var(--border)",
  "borderSoft": "var(--border-soft)",
  "gold": "var(--gold)",
  "goldDim": "var(--gold-dim)",
  "goldText": "var(--gold-text)",
  "goldStrong": "var(--gold-strong)",
  "text": "var(--text)",
  "textSub": "var(--text-sub)",
  "textMuted": "var(--text-muted)",
  "accentInk": "var(--accent-ink)",
  "paper": "var(--paper)"
};
const classes = {
  "var(--bg)": {"text":"text-bg","bg":"bg-bg","border":"border-bg","border-l":"border-l-bg","border-r":"border-r-bg","border-t":"border-t-bg","border-b":"border-b-bg","accent":"accent-bg"},
  "var(--bg-elevated)": {"text":"text-bg-elevated","bg":"bg-bg-elevated","border":"border-bg-elevated","border-l":"border-l-bg-elevated","border-r":"border-r-bg-elevated","border-t":"border-t-bg-elevated","border-b":"border-b-bg-elevated","accent":"accent-bg-elevated"},
  "var(--card)": {"text":"text-card","bg":"bg-card","border":"border-card","border-l":"border-l-card","border-r":"border-r-card","border-t":"border-t-card","border-b":"border-b-card","accent":"accent-card"},
  "var(--sidebar)": {"text":"text-sidebar","bg":"bg-sidebar","border":"border-sidebar","border-l":"border-l-sidebar","border-r":"border-r-sidebar","border-t":"border-t-sidebar","border-b":"border-b-sidebar","accent":"accent-sidebar"},
  "var(--sidebar-text)": {"text":"text-sidebar-text","bg":"bg-sidebar-text","border":"border-sidebar-text","border-l":"border-l-sidebar-text","border-r":"border-r-sidebar-text","border-t":"border-t-sidebar-text","border-b":"border-b-sidebar-text","accent":"accent-sidebar-text"},
  "var(--input-bg)": {"text":"text-input-bg","bg":"bg-input-bg","border":"border-input-bg","border-l":"border-l-input-bg","border-r":"border-r-input-bg","border-t":"border-t-input-bg","border-b":"border-b-input-bg","accent":"accent-input-bg"},
  "var(--border)": {"text":"text-border","bg":"bg-border","border":"border-border","border-l":"border-l-border","border-r":"border-r-border","border-t":"border-t-border","border-b":"border-b-border","accent":"accent-border"},
  "var(--border-soft)": {"text":"text-border-soft","bg":"bg-border-soft","border":"border-border-soft","border-l":"border-l-border-soft","border-r":"border-r-border-soft","border-t":"border-t-border-soft","border-b":"border-b-border-soft","accent":"accent-border-soft"},
  "var(--gold)": {"text":"text-gold","bg":"bg-gold","border":"border-gold","border-l":"border-l-gold","border-r":"border-r-gold","border-t":"border-t-gold","border-b":"border-b-gold","accent":"accent-gold"},
  "var(--gold-dim)": {"text":"text-gold-dim","bg":"bg-gold-dim","border":"border-gold-dim","border-l":"border-l-gold-dim","border-r":"border-r-gold-dim","border-t":"border-t-gold-dim","border-b":"border-b-gold-dim","accent":"accent-gold-dim"},
  "var(--gold-text)": {"text":"text-gold-text","bg":"bg-gold-text","border":"border-gold-text","border-l":"border-l-gold-text","border-r":"border-r-gold-text","border-t":"border-t-gold-text","border-b":"border-b-gold-text","accent":"accent-gold-text"},
  "var(--gold-strong)": {"text":"text-gold-strong","bg":"bg-gold-strong","border":"border-gold-strong","border-l":"border-l-gold-strong","border-r":"border-r-gold-strong","border-t":"border-t-gold-strong","border-b":"border-b-gold-strong","accent":"accent-gold-strong"},
  "var(--text)": {"text":"text-text","bg":"bg-text","border":"border-text","border-l":"border-l-text","border-r":"border-r-text","border-t":"border-t-text","border-b":"border-b-text","accent":"accent-text"},
  "var(--text-sub)": {"text":"text-text-sub","bg":"bg-text-sub","border":"border-text-sub","border-l":"border-l-text-sub","border-r":"border-r-text-sub","border-t":"border-t-text-sub","border-b":"border-b-text-sub","accent":"accent-text-sub"},
  "var(--text-muted)": {"text":"text-text-muted","bg":"bg-text-muted","border":"border-text-muted","border-l":"border-l-text-muted","border-r":"border-r-text-muted","border-t":"border-t-text-muted","border-b":"border-b-text-muted","accent":"accent-text-muted"},
  "var(--accent-ink)": {"text":"text-accent-ink","bg":"bg-accent-ink","border":"border-accent-ink","border-l":"border-l-accent-ink","border-r":"border-r-accent-ink","border-t":"border-t-accent-ink","border-b":"border-b-accent-ink","accent":"accent-accent-ink"},
  "var(--paper)": {"text":"text-paper","bg":"bg-paper","border":"border-paper","border-l":"border-l-paper","border-r":"border-r-paper","border-t":"border-t-paper","border-b":"border-b-paper","accent":"accent-paper"},
  "transparent": {"text":"text-transparent","bg":"bg-transparent","border":"border-transparent","border-l":"border-l-transparent","border-r":"border-r-transparent","border-t":"border-t-transparent","border-b":"border-b-transparent","accent":"accent-transparent"},
  "currentColor": {"text":"text-current","bg":"bg-current","border":"border-current","border-l":"border-l-current","border-r":"border-r-current","border-t":"border-t-current","border-b":"border-b-current","accent":"accent-current"},
  "white": {"text":"text-white","bg":"bg-white","border":"border-white","border-l":"border-l-white","border-r":"border-r-white","border-t":"border-t-white","border-b":"border-b-white","accent":"accent-white"},
  "black": {"text":"text-black","bg":"bg-black","border":"border-black","border-l":"border-l-black","border-r":"border-r-black","border-t":"border-t-black","border-b":"border-b-black","accent":"accent-black"},
  "var(--status-green-fg)": {"text":"text-green-fg","bg":"bg-green-fg","border":"border-green-fg","border-l":"border-l-green-fg","border-r":"border-r-green-fg","border-t":"border-t-green-fg","border-b":"border-b-green-fg","accent":"accent-green-fg"},
  "var(--status-green-bg)": {"text":"text-green-bg","bg":"bg-green-bg","border":"border-green-bg","border-l":"border-l-green-bg","border-r":"border-r-green-bg","border-t":"border-t-green-bg","border-b":"border-b-green-bg","accent":"accent-green-bg"},
  "var(--status-green-border)": {"text":"text-green-border","bg":"bg-green-border","border":"border-green-border","border-l":"border-l-green-border","border-r":"border-r-green-border","border-t":"border-t-green-border","border-b":"border-b-green-border","accent":"accent-green-border"},
  "var(--status-orange-fg)": {"text":"text-orange-fg","bg":"bg-orange-fg","border":"border-orange-fg","border-l":"border-l-orange-fg","border-r":"border-r-orange-fg","border-t":"border-t-orange-fg","border-b":"border-b-orange-fg","accent":"accent-orange-fg"},
  "var(--status-orange-bg)": {"text":"text-orange-bg","bg":"bg-orange-bg","border":"border-orange-bg","border-l":"border-l-orange-bg","border-r":"border-r-orange-bg","border-t":"border-t-orange-bg","border-b":"border-b-orange-bg","accent":"accent-orange-bg"},
  "var(--status-orange-border)": {"text":"text-orange-border","bg":"bg-orange-border","border":"border-orange-border","border-l":"border-l-orange-border","border-r":"border-r-orange-border","border-t":"border-t-orange-border","border-b":"border-b-orange-border","accent":"accent-orange-border"},
  "var(--status-yellow-fg)": {"text":"text-yellow-fg","bg":"bg-yellow-fg","border":"border-yellow-fg","border-l":"border-l-yellow-fg","border-r":"border-r-yellow-fg","border-t":"border-t-yellow-fg","border-b":"border-b-yellow-fg","accent":"accent-yellow-fg"},
  "var(--status-yellow-bg)": {"text":"text-yellow-bg","bg":"bg-yellow-bg","border":"border-yellow-bg","border-l":"border-l-yellow-bg","border-r":"border-r-yellow-bg","border-t":"border-t-yellow-bg","border-b":"border-b-yellow-bg","accent":"accent-yellow-bg"},
  "var(--status-yellow-border)": {"text":"text-yellow-border","bg":"bg-yellow-border","border":"border-yellow-border","border-l":"border-l-yellow-border","border-r":"border-r-yellow-border","border-t":"border-t-yellow-border","border-b":"border-b-yellow-border","accent":"accent-yellow-border"},
  "var(--status-red-fg)": {"text":"text-red-fg","bg":"bg-red-fg","border":"border-red-fg","border-l":"border-l-red-fg","border-r":"border-r-red-fg","border-t":"border-t-red-fg","border-b":"border-b-red-fg","accent":"accent-red-fg"},
  "var(--status-red-bg)": {"text":"text-red-bg","bg":"bg-red-bg","border":"border-red-bg","border-l":"border-l-red-bg","border-r":"border-r-red-bg","border-t":"border-t-red-bg","border-b":"border-b-red-bg","accent":"accent-red-bg"},
  "var(--status-red-border)": {"text":"text-red-border","bg":"bg-red-border","border":"border-red-border","border-l":"border-l-red-border","border-r":"border-r-red-border","border-t":"border-t-red-border","border-b":"border-b-red-border","accent":"accent-red-border"},
  "var(--status-grey-fg)": {"text":"text-grey-fg","bg":"bg-grey-fg","border":"border-grey-fg","border-l":"border-l-grey-fg","border-r":"border-r-grey-fg","border-t":"border-t-grey-fg","border-b":"border-b-grey-fg","accent":"accent-grey-fg"},
  "var(--status-grey-bg)": {"text":"text-grey-bg","bg":"bg-grey-bg","border":"border-grey-bg","border-l":"border-l-grey-bg","border-r":"border-r-grey-bg","border-t":"border-t-grey-bg","border-b":"border-b-grey-bg","accent":"accent-grey-bg"},
  "var(--status-grey-border)": {"text":"text-grey-border","bg":"bg-grey-border","border":"border-grey-border","border-l":"border-l-grey-border","border-r":"border-r-grey-border","border-t":"border-t-grey-border","border-b":"border-b-grey-border","accent":"accent-grey-border"},
  "var(--status-blue-fg)": {"text":"text-blue-fg","bg":"bg-blue-fg","border":"border-blue-fg","border-l":"border-l-blue-fg","border-r":"border-r-blue-fg","border-t":"border-t-blue-fg","border-b":"border-b-blue-fg","accent":"accent-blue-fg"},
  "var(--status-blue-bg)": {"text":"text-blue-bg","bg":"bg-blue-bg","border":"border-blue-bg","border-l":"border-l-blue-bg","border-r":"border-r-blue-bg","border-t":"border-t-blue-bg","border-b":"border-b-blue-bg","accent":"accent-blue-bg"},
  "var(--status-blue-border)": {"text":"text-blue-border","bg":"bg-blue-border","border":"border-blue-border","border-l":"border-l-blue-border","border-r":"border-r-blue-border","border-t":"border-t-blue-border","border-b":"border-b-blue-border","accent":"accent-blue-border"}
};
export const colorClass = (value, channel = 'text') => classes[value]?.[channel] ?? classes['var(--text-sub)'][channel];

/** Resolve a semantic status tone only at the presentation boundary. */
export function statusAppearance(map, label) {
  return toneAppearance(map[label]?.tone ?? 'grey');
}

export function toneAppearance(tone) {
  return {
    tone,
    color: 'var(--status-' + tone + '-fg)',
    bg: 'var(--status-' + tone + '-bg)',
    border: 'var(--status-' + tone + '-border)'
  };
}
