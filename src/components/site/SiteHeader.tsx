import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Phone,
  Menu,
  X,
  Search,
  ChevronDown,
  ArrowUpRight,
  ChevronRight,
  Heart,
  GitCompare,
  User,
} from "lucide-react";
import { categories } from "@/lib/machines";
import { megaGroups } from "@/lib/megaMenu";
import logoAsset from "@/assets/bauportal-logo.png.asset.json";

const navItems = [
  { label: "Налични машини", badge: "90", mega: true },
  { label: "Нови машини", mega: true },
  { label: "Втора употреба", mega: true },
  { label: "Прикачен инвентар", mega: true },
  { label: "Марки", mega: false },
  { label: "За нас", mega: false },
  { label: "Контакти", mega: false },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/catalog", search: { q } });
  };

  return (
    <header className="sticky top-0 z-50" onMouseLeave={() => setMega(null)}>
      <div
        className={`bg-surface transition-shadow duration-300 ${
          scrolled ? "shadow-[0_8px_30px_-18px_rgba(0,0,0,0.5)]" : ""
        }`}
      >
        {/* ROW 1 — logo · search · account actions */}
        <div className="mx-auto grid h-[68px] max-w-[1480px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 lg:h-[76px] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8">
          <Link to="/" aria-label="Bauportal — начало" className="min-w-0 shrink-0">
            <img
              src={logoAsset.url}
              alt="Bauportal"
              width={180}
              height={60}
              className="h-9 w-auto max-w-none object-contain lg:h-11"
            />
          </Link>

          <form onSubmit={submit} className="hidden min-w-0 lg:block">
            <div className="relative mx-auto max-w-[520px]">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Какво търсиш днес?"
                aria-label="Търсене на машини"
                className="h-11 w-full rounded-full border-2 border-signal bg-surface pl-5 pr-12 text-[14px] text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-ink"
              />
              <button
                type="submit"
                aria-label="Търси"
                className="absolute right-1.5 top-1.5 grid size-8 place-items-center rounded-full text-signal-dark transition-colors hover:bg-signal hover:text-ink"
              >
                <Search className="size-5" />
              </button>
            </div>
          </form>

          <div className="flex shrink-0 items-center justify-end gap-1 lg:gap-4">
            <Link
              to="/catalog"
              search={{ q: "" }}
              className="hidden items-center gap-2 rounded-full px-2 py-2 text-[13px] font-semibold text-foreground/80 transition-colors hover:text-foreground lg:inline-flex"
            >
              <Heart className="size-5" /> Любими
            </Link>
            <Link
              to="/catalog"
              search={{ q: "" }}
              className="hidden items-center gap-2 rounded-full px-2 py-2 text-[13px] font-semibold text-foreground/80 transition-colors hover:text-foreground lg:inline-flex"
            >
              <GitCompare className="size-5" /> Сравни
            </Link>
            <Link
              to="/catalog"
              search={{ q: "" }}
              className="hidden items-center gap-2 rounded-full px-2 py-2 text-[13px] font-semibold text-foreground/80 transition-colors hover:text-foreground lg:inline-flex"
            >
              <User className="size-5" /> Акаунт
            </Link>

            <button
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full border border-border lg:hidden"
              aria-label="Меню"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* ROW 2 — main navigation */}
        <div className="border-t border-b border-border bg-secondary/45">
          <div className="mx-auto flex h-[52px] max-w-[1480px] items-center justify-between gap-4 px-4">
            <nav className="hidden min-w-0 items-center divide-x divide-border lg:flex">
              {navItems.map((n) => {
                const isActive = location.pathname === "/catalog" && n.label === "Налични машини";
                const selected = isActive || mega === n.label;
                return (
                  <div key={n.label} onMouseEnter={() => setMega(n.mega ? n.label : null)}>
                    <Link
                      to="/catalog"
                      search={{ q: n.mega ? "" : n.label }}
                      className={`inline-flex h-[52px] items-center gap-1.5 whitespace-nowrap px-4 text-[14px] font-bold leading-none transition-colors duration-150 ${
                        selected
                          ? "bg-ink text-ink-foreground"
                          : "text-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span>{n.label}</span>
                      {n.badge && (
                        <span
                          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-black leading-none ${
                            selected ? "bg-signal text-ink" : "bg-ink text-ink-foreground"
                          }`}
                        >
                          {n.badge}
                        </span>
                      )}
                      {n.mega && (
                        <ChevronDown
                          className={`size-4 opacity-60 transition-transform ${mega === n.label ? "rotate-180" : ""}`}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* mobile inline search */}
            <form onSubmit={submit} className="min-w-0 flex-1 lg:hidden">
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Какво търсиш днес?"
                  aria-label="Търсене на машини"
                  className="h-11 w-full rounded-full border border-border bg-surface pl-5 pr-12 text-[14px] outline-none placeholder:text-foreground/45 focus:border-ink"
                />
                <button
                  type="submit"
                  aria-label="Търси"
                  className="absolute right-1.5 top-1.5 grid size-8 place-items-center rounded-full text-signal-dark transition-colors hover:bg-signal hover:text-ink"
                >
                  <Search className="size-5" />
                </button>
              </div>
            </form>

            <a
              href="tel:+359879620260"
              className="hidden shrink-0 items-center gap-2 rounded-full bg-signal px-4 py-2 text-[14px] font-bold text-ink transition-colors hover:bg-ink hover:text-ink-foreground sm:inline-flex"
            >
              <Phone className="size-4" />
              <span className="hidden sm:inline">0879 620 260</span>
            </a>
          </div>
        </div>

        {/* full-width mega panel */}
        {mega && (
          <div className="absolute left-1/2 top-full hidden w-full max-w-[1480px] -translate-x-1/2 px-4 lg:block">
            <div className="rounded-b-2xl border border-t-0 border-border bg-surface shadow-[0_40px_80px_-50px_rgba(0,0,0,0.6)]">
              <div className="px-4 py-8">
                <div className="grid grid-cols-4 gap-x-8 gap-y-8">
                  {megaGroups.map((g) => (
                    <div key={g.title}>
                      <div className="flex items-center gap-2 border-b border-border pb-2">
                        <span className="h-3 w-1 bg-signal" />
                        <h3 className="text-[13px] font-extrabold uppercase tracking-wide">{g.title}</h3>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {g.items.map((i) => (
                          <li key={i}>
                            <Link
                              to="/catalog"
                              search={{ q: i }}
                              onClick={() => setMega(null)}
                              className="group flex items-center gap-1.5 text-[13px] text-foreground/70 transition-colors hover:text-foreground"
                            >
                              <ChevronRight className="size-4 text-signal transition-colors group-hover:text-signal-dark" />
                              <span className="group-hover:underline">{i}</span>
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            to="/catalog"
                            search={{ q: g.title }}
                            onClick={() => setMega(null)}
                            className="inline-flex items-center gap-1 pt-1 text-[12px] font-bold uppercase tracking-widest hover:text-signal"
                          >
                            Виж всички <ArrowUpRight className="size-3.5" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  ))}

                  <div className="rounded-2xl bg-ink p-5 text-ink-foreground">
                    <p className="label-caps text-signal">{mega}</p>
                    <p className="mt-2 text-lg font-extrabold leading-tight">
                      Над 500 машини, готови за оглед и доставка.
                    </p>
                    <Link
                      to="/catalog"
                      search={{ q: "" }}
                      onClick={() => setMega(null)}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-[12px] font-bold uppercase tracking-widest text-ink"
                    >
                      Целият каталог <ArrowUpRight className="size-3.5" />
                    </Link>
                    <ul className="mt-4 space-y-1 text-[12px] text-ink-foreground/70">
                      {categories.slice(0, 4).map((c) => (
                        <li key={c.slug}>
                          {c.name} · {c.count} обяви
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* mobile */}
      {open && (
        <div className="max-h-[calc(100vh-128px)] overflow-y-auto border-b border-border bg-surface lg:hidden">
          <div className="mx-auto max-w-[1480px] px-4 py-4">
            {megaGroups.map((g) => (
              <div key={g.title} className="border-b border-border">
                <button
                  onClick={() => setMobileGroup(mobileGroup === g.title ? null : g.title)}
                  className="flex w-full items-center justify-between py-3 text-left text-sm font-bold"
                >
                  {g.title}
                  <ChevronDown className={`size-4 transition-transform ${mobileGroup === g.title ? "rotate-180" : ""}`} />
                </button>
                {mobileGroup === g.title && (
                  <ul className="space-y-2 pb-3 pl-3">
                    {g.items.map((i) => (
                      <li key={i}>
                        <Link
                          to="/catalog"
                          search={{ q: i }}
                          onClick={() => setOpen(false)}
                          className="text-[13px] text-foreground/70 transition-colors hover:text-foreground"
                        >
                          {i}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <div className="mt-3 flex flex-wrap gap-2">
              {navItems.map((l) => (
                <Link
                  key={l.label}
                  to="/catalog"
                  search={{ q: "" }}
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-muted px-3 py-2 text-[13px] font-bold"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
