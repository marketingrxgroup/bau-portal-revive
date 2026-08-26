import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Sparkles, X, ArrowRight, CornerDownLeft } from "lucide-react";
import { machines, formatPrice } from "@/lib/machines";

type Msg = { role: "ai" | "user"; text: string; results?: typeof machines };

const suggestions = [
  "Мини багер до 30 000 €",
  "Телескопичен товарач след 2018",
  "Кар за палети до 3 м",
  "Челен товарач втора употреба",
];

const placeholders = [
  "Опиши задачата: „да вдига палети до 3 метра“",
  "„Мини багер за тесен двор, до 30 000 €“",
  "„Телескопичен товарач за ферма, след 2018 г.“",
];

function searchMachines(q: string) {
  const words = q.toLowerCase().split(/[\s,]+/).filter((w) => w.length > 2);
  const priceMatch = q.match(/(\d[\d\s.]{2,})\s*(€|евро|eur|лв)?/i);
  const maxPrice = priceMatch?.[1] ? Number(priceMatch[1].replace(/[\s.]/g, "")) : null;
  const yearMatch = q.match(/(?:след|от|after)\s*(20\d{2})/i);
  const minYear = yearMatch ? Number(yearMatch[1]) : null;

  const scored = machines.map((m) => {
    const hay = [m.title, m.brand, m.category, m.subcategory, m.condition, ...(m.tags ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    let score = words.reduce((s, w) => (hay.includes(w) ? s + 2 : s), 0);
    if (maxPrice && maxPrice > 1000 && m.price && m.price <= maxPrice) score += 2;
    if (minYear && m.year >= minYear) score += 2;
    return { m, score };
  });
  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  return (hits.length ? hits : scored.sort(() => 0)).slice(0, 4).map((s) => s.m);
}

export function SearchAssistantModal({ open, onClose, initialQuery = "" }: { open: boolean; onClose: () => void; initialQuery?: string }) {
  const [value, setValue] = useState(initialQuery);
  const [thinking, setThinking] = useState(false);
  const [typed, setTyped] = useState("");
  const [phIndex, setPhIndex] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Здравей! Кажи ми с прости думи каква машина търсиш — за какво ще я ползваш, бюджет, година. Ще подбера подходящите." },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoAskedRef = useRef<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || value) return;
    const full = placeholders[phIndex] ?? "";
    const timer = window.setTimeout(() => {
      if (typed.length === full.length) {
        setTyped("");
        setPhIndex((i) => (i + 1) % placeholders.length);
      } else {
        setTyped(full.slice(0, typed.length + 1));
      }
    }, typed.length === full.length ? 1800 : 45);
    return () => clearTimeout(timer);
  }, [open, value, typed, phIndex]);

  useEffect(() => {
    if (!open) {
      setValue("");
      setMessages([
        { role: "ai", text: "Здравей! Кажи ми с прости думи каква машина търсиш — за какво ще я ползваш, бюджет, година. Ще подбера подходящите." },
      ]);
      autoAskedRef.current = null;
      return;
    }
    setValue(initialQuery);
  }, [open, initialQuery]);

  useEffect(() => {
    if (!open || !initialQuery || autoAskedRef.current === initialQuery) return;
    autoAskedRef.current = initialQuery;
    const t = window.setTimeout(() => ask(initialQuery), 350);
    return () => clearTimeout(t);
  }, [open, initialQuery]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const ask = (q: string) => {
    const query = q.trim();
    if (!query) return;
    setValue("");
    setMessages((m) => [...m, { role: "user", text: query }]);
    setThinking(true);
    window.setTimeout(() => {
      const results = searchMachines(query);
      setThinking(false);
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: results.length
            ? `Намерих ${results.length} машини, които пасват на „${query}“:`
            : "Не открих точно съвпадение — пробвай с по-общо описание.",
          results,
        },
      ]);
    }, 650);
  };

  const lastQuery = useMemo(
    () => [...messages].reverse().find((m) => m.role === "user")?.text ?? "",
    [messages],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[8vh]">
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="AI търсене на машина"
        className="relative flex max-h-[80vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-signal px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-signal-foreground shadow-sm">
            <Sparkles className="size-4 text-signal-foreground" /> AI Асистент
          </span>
          <button
            onClick={onClose}
            aria-label="Затвори"
            className="grid size-9 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "space-y-3"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[80%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-ink-foreground"
                    : "max-w-[85%] rounded-2xl rounded-bl-md bg-muted/70 px-4 py-2.5 text-sm text-foreground"
                }
              >
                {m.text}
              </div>
              {m.results && m.results.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {m.results.map((r) => (
                    <Link
                      key={r.id}
                      to="/machine/$id"
                      params={{ id: r.id }}
                      onClick={onClose}
                      className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-2 transition-colors hover:border-ink"
                    >
                      <img
                        src={r.image}
                        alt={r.title}
                        loading="lazy"
                        className="size-16 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{r.title}</p>
                        <p className="text-xs text-foreground/60">
                          {r.year} · {r.condition}
                        </p>
                        <p className="text-sm font-bold text-foreground">{formatPrice(r.price)}</p>
                      </div>
                      <ArrowRight className="ml-auto size-4 shrink-0 text-foreground/40 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {thinking && (
            <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-muted/70 px-4 py-3">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="size-1.5 animate-bounce rounded-full bg-foreground/50"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border px-5 py-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground/70 transition-colors hover:border-ink hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(value);
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <div className="relative flex flex-1 items-center gap-3 rounded-xl bg-muted/60 px-4">
              <Search className="size-4 shrink-0 text-ink/60" />
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-12 w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-ink/50"
                  aria-label="Търсене на машина"
                />
                {value === "" && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 flex items-center truncate pr-2 text-sm font-medium text-ink/60"
                  >
                    {typed}
                    <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-ink/50" />
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-signal px-7 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-ink-foreground"
            >
              Търси <CornerDownLeft className="size-4" />
            </button>
          </form>

          <button
            onClick={() => {
              navigate({ to: "/catalog", search: { q: lastQuery } });
              onClose();
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-foreground/60 transition-colors hover:text-foreground"
          >
            Виж всички резултати в каталога <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
