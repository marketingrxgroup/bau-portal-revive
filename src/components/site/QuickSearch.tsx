import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Sparkles, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const quick = ["Мини багери", "Кари", "Телескопични товарачи", "Челни товарачи", "Камиони", "за копаене", "за извозване", "за къртене", "Багери", "Комбинирани багери", "Мини челни товарачи"];

const placeholders = [
  "Марка, модел или тип машина — напр. „багер до 2 тона“",
  "За какво ти трябва машина — за копане, за разтоварване?",
  "Опиши задачата: „да вдига палети до 3 метра“",
  "„Мини багер за тесен двор, до 30 000 €“",
  "„Телескопичен товарач за ферма, след 2018 г.“",
];

interface QuickSearchProps {
  variant?: "default" | "glass";
  onOpenAssistant?: (query: string) => void;
}

export function QuickSearch({ variant = "default", onOpenAssistant }: QuickSearchProps) {
  const isGlass = variant === "glass";
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const quickRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollQuick = (dir: "left" | "right") => {
    const el = quickRef.current;
    if (!el) return;
    const amount = 240;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  useEffect(() => {
    if (focused) return;
    const full = placeholders[index] ?? "";

    const timer = window.setTimeout(() => {
      if (deleting) {
        if (typed.length === 0) {
          setIndex((i) => (i + 1) % placeholders.length);
          setDeleting(false);
        } else {
          setTyped(full.slice(0, typed.length - 1));
        }
      } else {
        if (typed.length === full.length) {
          setDeleting(true);
        } else {
          setTyped(full.slice(0, typed.length + 1));
        }
      }
    }, deleting ? 30 : typed.length === full.length ? 2000 : 45);

    return () => clearTimeout(timer);
  }, [index, deleting, typed, focused]);

  const submit = (q: string) => navigate({ to: "/catalog", search: { q } });

  const handleSubmit = (q: string) => {
    if (onOpenAssistant) {
      onOpenAssistant(q || value);
    } else {
      submit(q || value);
    }
  };

  return (
    <div className={`rounded-2xl p-1.5 ${isGlass ? "border border-white/25 bg-white/20 shadow-[0_24px_60px_-45px_rgba(0,0,0,0.7)] backdrop-blur-xl" : "border border-border bg-surface shadow-sm"}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(value);
        }}
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <div className={`relative flex flex-1 items-center gap-3 px-4 ${isGlass ? "rounded-xl bg-white/15 ring-1 ring-white/25" : "rounded-xl bg-muted/60"}`}>
          <Search className={`size-4 shrink-0 ${isGlass ? "text-white/70" : "text-foreground/50"}`} />
          <div className="relative flex-1">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={`h-12 w-full bg-transparent text-sm font-medium outline-none ${isGlass ? "text-white placeholder:text-white/70" : "text-foreground placeholder:text-foreground/40"}`}
              aria-label="Търсене на машина"
            />
            {value === "" && (
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 left-0 flex items-center truncate pr-2 text-sm font-medium ${isGlass ? "text-white/80" : "text-foreground/45"}`}
              >
                {typed}
                <span className={`ml-0.5 inline-block h-3.5 w-px animate-pulse ${isGlass ? "bg-white/50" : "bg-foreground/40"}`} />
              </span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] ${isGlass ? "bg-signal text-signal-foreground hover:bg-signal/90" : "bg-ink text-ink-foreground hover:bg-ink/90"}`}
        >
          <Sparkles className={`size-4 ${isGlass ? "text-signal-foreground" : "text-signal"}`} /> AI Асистент
        </button>
      </form>

      <div className="mt-3 flex flex-col items-start gap-2 px-3 sm:flex-row sm:items-center">
        <span className={`inline-flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${isGlass ? "text-white/70" : "text-foreground/70"}`}>
          <SlidersHorizontal className="size-3.5" /> Популярни
        </span>
        <div className="relative flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() => scrollQuick("left")}
            className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors sm:inline-flex ${isGlass ? "border border-white/25 bg-white/15 text-white/90 hover:bg-white/25" : "border border-border bg-surface text-foreground/70 hover:bg-muted"}`}
            aria-label="Назад"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div
            ref={quickRef}
            className="flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {quick.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSubmit(s)}
                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${isGlass ? "border-white/25 bg-white/10 text-white/90 hover:border-signal hover:bg-white/20 hover:text-white" : "border-border text-foreground/70 hover:border-ink hover:text-foreground"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollQuick("right")}
            className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors sm:inline-flex ${isGlass ? "border border-white/25 bg-white/15 text-white/90 hover:bg-white/25" : "border border-border bg-surface text-foreground/70 hover:bg-muted"}`}
            aria-label="Напред"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
