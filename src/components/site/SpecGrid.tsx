import { useState } from "react";
import { ChevronDown } from "lucide-react";

const LIMIT = 9;

export function SpecGrid({
  rows,
  limit = LIMIT,
  title = "Технически характеристики",
}: {
  rows: { label: string; value: string }[];
  limit?: number;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const visible = open ? rows : rows.slice(0, limit);

  return (
    <div className="overflow-hidden border border-border bg-surface">
      <div className="flex items-center justify-between border-b-2 border-signal bg-ink px-5 py-3">
        <h2 className="text-sm font-extrabold uppercase tracking-tight text-ink-foreground">
          {title}
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-signal">
          {rows.length} параметъра
        </span>
      </div>
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((row) => (
          <div key={row.label} className="bg-surface px-4 py-2.5 transition-colors hover:bg-secondary">
            <p className="text-[10px] font-bold uppercase leading-tight tracking-widest text-foreground/60">
              {row.label}
            </p>
            <p className="text-sm font-extrabold leading-snug text-foreground">{row.value}</p>
          </div>
        ))}
      </div>
      {rows.length > limit && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-center gap-2 border-t border-border bg-muted/30 py-3 text-[11px] font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-signal/15"
        >
          {open ? "Покажи по-малко" : `Покажи още ${rows.length - limit}`}
          <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}
