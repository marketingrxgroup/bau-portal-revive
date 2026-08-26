import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Phone, Menu, X, Search, ChevronDown, ArrowUpRight, ChevronRight, Heart, GitCompare } from "lucide-react";
import { categories } from "@/lib/machines";
import { megaGroups } from "@/lib/megaMenu";
import logoAsset from "@/assets/bauportal-logo.png.asset.json";
import { SearchAssistantModal } from "./SearchAssistantModal";

const navItems = [
  { label: "Налични машини", badge: "90", mega: true },
  { label: "Нови машини", mega: true },
  { label: "Втора употреба", mega: true },
  { label: "Прикачен инвентар", mega: true },
  { label: "Марки", mega: true },
];


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50" onMouseLeave={() => setMega(null)}>
      <SearchAssistantModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <div className="bg-ink text-ink-foreground">
        <div className="mx-auto flex h-9 max-w-[1480px] items-center justify-between px-4 text-[11px] tracking-wide">
          <span className="label-caps text-signal">Bauportal · машини втора употреба и нови</span>
          <div className="flex items-center gap-3">
            <button aria-label="Любими" className="hover:text-signal">
              <Heart className="size-4" />
            </button>
            <button aria-label="Сравни" className="hover:text-signal">
              <GitCompare className="size-4" />
            </button>
            <a href="tel:+35928000000" className="inline-flex items-center gap-2 hover:text-signal">
              <Phone className="size-4" /> +359 2 800 00 00
            </a>
          </div>
        </div>
      </div>

      <div
        className={`border-b border-border transition-all duration-300 ${
          scrolled ? "bg-surface/85 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.5)] backdrop-blur-xl" : "bg-surface"
        }`}
      >
        <div className="mx-auto grid h-[68px] max-w-[1480px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-2 xl:gap-6">
          <Link to="/" aria-label="Bauportal — начало" className="min-w-0 transition-transform hover:-translate-y-0.5">
            <img
              src={logoAsset.url}
              alt="Bauportal"
              width={180}
              height={60}
              className="h-8 w-auto max-w-none shrink-0 object-contain sm:h-9 lg:h-8 xl:h-10"
            />
          </Link>

          {/* desktop nav */}
          <nav className="hidden min-w-0 justify-self-center items-center gap-0 overflow-hidden rounded-full border border-ink-foreground/20 bg-ink/85 p-1 shadow-sm backdrop-blur-md lg:flex xl:gap-0.5">
            {navItems.map((n) => {
              const isActive =
                location.pathname === "/catalog" && n.label === "Налични машини";
              const selected = isActive || mega === n.label;
              return (
                <div key={n.label} onMouseEnter={() => setMega(n.mega ? n.label : null)}>
                  <Link
                    to="/catalog"
                    search={{ q: "" }}
                    className={`inline-flex h-9 items-center justify-center gap-0.5 whitespace-nowrap rounded-full px-2 text-[10px] font-bold uppercase leading-none tracking-[0.02em] transition-all lg:px-2 lg:text-[10px] xl:gap-1 xl:px-3.5 xl:text-[11.5px] xl:tracking-[0.08em] 2xl:px-4 ${
                      selected
                        ? "bg-gradient-to-b from-white to-white/90 text-ink shadow-[0_2px_14px_rgba(255,255,255,0.22)] backdrop-blur-lg"
                        : "text-ink-foreground hover:bg-white/10 hover:text-foreground hover:backdrop-blur-sm"
                    }`}
                  >
                    <span className="mt-px">{n.label}</span>
                    {n.badge && (
                      <span className="inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-signal px-1 text-[9px] font-black leading-none text-ink ring-1 ring-ink/20 xl:h-[18px] xl:min-w-[18px] xl:px-1.5 xl:text-[10px]">
                        {n.badge}
                      </span>
                    )}
                    {n.mega && (
                      <ChevronDown
                        className={`size-3 transition-transform xl:size-3.5 ${mega === n.label ? "rotate-180" : ""}`}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2">

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-signal px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-ink transition-all hover:bg-ink hover:text-ink-foreground lg:px-3 lg:py-2.5 lg:text-[11px] xl:px-4 xl:text-[12px] xl:tracking-widest"
            >
              <Search className="size-4 shrink-0 text-ink transition-colors group-hover:text-signal" />
              <span className="hidden xl:inline">Търси машина</span>
              <span className="xl:hidden">Търси</span>
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full border border-border lg:hidden"
              aria-label="Меню"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
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
        <div className="max-h-[calc(100vh-107px)] overflow-y-auto border-b border-border bg-surface lg:hidden">
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
                  <ul className="pb-3 pl-3 space-y-2">
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
                  className="rounded-full bg-muted px-3 py-2 text-[11.5px] font-bold uppercase tracking-[0.08em]"
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
