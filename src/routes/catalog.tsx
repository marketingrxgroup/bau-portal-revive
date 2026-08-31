import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, X, LayoutGrid, Tag, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { QuickSearch } from "@/components/site/QuickSearch";
import { useAssistant } from "@/lib/assistant-context";
import { MachineCard } from "@/components/site/MachineCard";
import { Slider } from "@/components/ui/slider";
import { categories, machinesListQuery } from "@/lib/machines";

type CatalogSearch = { q: string };

const categoryDescriptions: Record<string, string> = {
  "Налична строителна техника и машини":
    "Открийте нови и употребявани машини, налични за бърза продажа и доставка — сервизирани и готови за работа. Подбрани предложения за строителството, индустрията и професионалната дейност, включително възможност за внос по поръчка.",
  Багери:
    "Багерите са основната копаеща машина на строителния обект — хидравлична техника, при която стрелата, ръкохватката и работният орган изкопават, товарят и преместват земни маси, скала и строителни отпадъци. Категорията обхваща цялото семейство по оперативно тегло: от компактни мини багери под около 2 тона, през колесни багери за градска работа, до тежки верижни багери над 25 тона за кариери и мащабни изкопи. Отделен подклас са комбинираните багери (багер-товарачи), които съчетават копаене и товарене в една машина. Сред марките на пазара са Caterpillar, Komatsu, Hitachi, Volvo, Liebherr, JCB, Hyundai, Kubota и Takeuchi.",
  Кари: "Карите (оварителите) са незаменими за вътрешно-цехова логистика, товаро-разтоварна дейност и мантинаж на палети. Обхващат електрически и дизелови модели с различна носимоспособност — от леки Stackers до тежки Reach trucks и четириопорни карета за строителни площадки.",
  "Телескопични товарачи":
    "Телескопичните товарачи съчетават товарене с височина — стрелата им се разгъва хоризонтално и вертикално, което ги прави универсални за строителни обекти, селскостопански ферми и промишлени бази. Работят с различни приставки: вилица, кофа, макара и кука.",
  "Челни товарачи":
    "Челните товарачи са тежки колесни машини за товарене и преместване на насипни материали — пръст, чакъл, трошен камък и отпадъци. С високопроходими гуми и голяма кофа са основна единица в кариери, депа и инфраструктурни обекти.",
  Камиони:
    "Камионите обхващат товарния транспорт за строителство и индустрия — самосвали за насипни материали, платформи за превоз на техника и специализирани надстройки за конкретни задачи, с различна тонажност и задвижване.",
  "Селскостопанска техника":
    "Селскостопанската техника включва трактори, комбайни и специализирани машини за обработка на земята — от оран и сеитба до прибиране на реколтата. Представени са модели с различна мощност и производителност за малки ферми и аграрни стопанства.",
};

export const Route = createFileRoute("/catalog")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(machinesListQuery),
  head: () => ({
    meta: [
      { title: "Каталог машини — багери, кари, товарачи | Bauportal" },
      {
        name: "description",
        content:
          "Разгледайте обявите за строителна и складова техника с филтри по категория, марка и година.",
      },
      { property: "og:title", content: "Каталог машини | Bauportal" },
      { property: "og:description", content: "Филтрирайте багери, кари и товарачи по марка и година." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Catalog,
});

function Catalog() {
  const { q } = Route.useSearch();
  const machines = useSuspenseQuery(machinesListQuery).data;
  const [category, setCategory] = useState<string>("Всички");
  const [subcategory, setSubcategory] = useState<string>("Всички");
  const [brand, setBrand] = useState<string>("Всички");
  const [condition, setCondition] = useState<"all" | "Нова" | "Втора употреба">("all");
  const [brandQuery, setBrandQuery] = useState("");
  const [yearFrom, setYearFrom] = useState<string>("");
  const [yearTo, setYearTo] = useState<string>("");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [sort, setSort] = useState<string>("new");
  const [catQuery, setCatQuery] = useState("");
  const { openAssistant } = useAssistant();
  const [catQuery, setCatQuery] = useState("");
  const [mobileSheet, setMobileSheet] = useState<"categories" | "brands" | "filters" | null>(null);

  const priceBounds = useMemo(() => {
    const prices = machines.map((m) => m.price ?? 0).filter((p) => p > 0);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, []);

  const brands = useMemo(() => ["Всички", ...new Set(machines.map((m) => m.brand))], []);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    machines.forEach((m) => map.set(m.category, (map.get(m.category) ?? 0) + 1));
    return map;
  }, []);

  const results = useMemo(() => {
    const needle = q.toLowerCase();
    const yFrom = yearFrom ? parseInt(yearFrom, 10) : null;
    const yTo = yearTo ? parseInt(yearTo, 10) : null;
    const pMin = priceMin ? parseInt(priceMin, 10) : null;
    const pMax = priceMax ? parseInt(priceMax, 10) : null;

    const list = machines.filter((m) => {
      const matchCat = category === "Всички" || m.category === category;
      const matchSub = subcategory === "Всички" || m.subcategory === subcategory;
      const matchBrand = brand === "Всички" || m.brand === brand;
      const matchCondition = condition === "all" || m.condition === condition;
      const matchYear = (!yFrom || m.year >= yFrom) && (!yTo || m.year <= yTo);
      const matchPrice =
        m.price !== null &&
        (pMin === null || m.price >= pMin) &&
        (pMax === null || m.price <= pMax);
      const haystack = `${m.title} ${m.brand} ${m.category} ${m.subcategory ?? ""} ${m.tags.join(" ")} ${m.location}`.toLowerCase();
      const matchQuery =
        !needle ||
        needle
          .split(/[\s,]+/)
          .filter((w) => w.length > 2)
          .some((w) => haystack.includes(w));
      return matchCat && matchSub && matchBrand && matchCondition && matchYear && matchPrice && matchQuery;
    });
    const price = (m: (typeof machines)[number]) => m.price ?? Number.MAX_SAFE_INTEGER;
    if (sort === "price-asc") return [...list].sort((a, b) => price(a) - price(b));
    if (sort === "price-desc") return [...list].sort((a, b) => price(b) - price(a));
    if (sort === "year") return [...list].sort((a, b) => b.year - a.year);
    return list;
  }, [q, category, subcategory, brand, condition, yearFrom, yearTo, priceMin, priceMax, sort]);

  const subcategories = useMemo(() => {
    if (category === "Всички") return [];
    const counts = new Map<string, number>();
    machines
      .filter((m) => m.category === category)
      .forEach((m) => {
        if (m.subcategory) counts.set(m.subcategory, (counts.get(m.subcategory) ?? 0) + 1);
      });
    return Array.from(counts.entries()).map(([label, count]) => ({ label, count }));
  }, [category]);

  const visibleCategories = useMemo(() => {
    const needle = catQuery.trim().toLowerCase();
    const list = categories.map((c) => ({ name: c.name, count: categoryCounts.get(c.name) ?? c.count }));
    return needle ? list.filter((c) => c.name.toLowerCase().includes(needle)) : list;
  }, [catQuery, categoryCounts]);

  const chips = [
    brand !== "Всички" ? { label: brand, clear: () => setBrand("Всички") } : null,
    condition !== "all" ? { label: condition, clear: () => setCondition("all") } : null,
    yearFrom || yearTo ? { label: `Година: ${yearFrom || "…"} – ${yearTo || "…"}`, clear: () => { setYearFrom(""); setYearTo(""); } } : null,
    priceMin || priceMax ? { label: `Цена: ${priceMin || "…"} – ${priceMax || "…"} €`, clear: () => { setPriceMin(""); setPriceMax(""); } } : null,
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <SearchAssistantModal
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        initialQuery={assistantQuery}
      />

      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1480px] px-4 py-3">
          <div className="min-w-0">
            <nav className="text-xs text-foreground/70">
              <Link to="/" className="hover:text-foreground">
                Начало
              </Link>{" "}
              / <span className="text-foreground">{category === "Всички" ? "Налични машини" : category}</span>
            </nav>
            <h1 className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl">
              {category === "Всички" ? "Налична строителна техника и машини" : `Продажба на ${category.toLowerCase()}`}
            </h1>
            {(() => {
              const key = category === "Всички" ? "Налична строителна техника и машини" : category;
              const desc = categoryDescriptions[key];
              return desc ? (
                <p className="mt-1.5 max-w-none text-[15px] leading-relaxed" style={{ color: "#3f3d3d" }}>
                  {category === "Всички" ? (
                    <>
                      Открийте <strong className="font-semibold text-foreground">нови и употребявани машини</strong>, налични за бърза
                      продажа и доставка — сервизирани и готови за работа. Подбрани предложения за строителството, индустрията и
                      професионалната дейност, включително възможност за внос по поръчка.
                    </>
                  ) : (
                    desc
                  )}
                </p>
              ) : null;
            })()}
            {q && (
              <p className="mt-1 text-sm text-foreground/70">
                Резултати за: <span className="bg-signal px-1.5 font-semibold text-signal-foreground">{q}</span>
              </p>
            )}
          </div>

          <div className="mt-3">
            <QuickSearch
              onOpenAssistant={(query) => {
                setAssistantQuery(query);
                setAssistantOpen(true);
              }}
            />
          </div>

        </div>
      </div>



      <div className="mx-auto grid max-w-[1480px] gap-6 px-4 pb-24 pt-8 lg:grid-cols-[300px_1fr] lg:pb-8">
        <aside className="hidden h-fit space-y-4 lg:block lg:sticky lg:top-[120px]">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-lg font-extrabold tracking-tight">Категории</h2>

            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/60" />
              <input
                value={catQuery}
                onChange={(e) => setCatQuery(e.target.value)}
                placeholder="Търси"
                className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-ink"
              />
            </div>
            <ul className="max-h-[420px] space-y-0.5 overflow-y-auto pr-1">
              <li>
                <button
                  onClick={() => {
                    setCategory("Всички");
                    setSubcategory("Всички");
                  }}
                  className={`flex w-full items-center justify-between rounded-r-lg border-l-2 px-3 py-1.5 text-left text-sm transition-colors ${
                    category === "Всички"
                      ? "border-foreground/30 bg-signal font-bold text-signal-foreground"
                      : "border-transparent text-foreground/80 hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  Всички <span className={`text-xs font-semibold ${category === "Всички" ? "text-signal-foreground/80" : "text-foreground/70"}`}>({machines.length})</span>
                </button>
              </li>
              {visibleCategories.map((c) => {
                const isSelected = category === c.name;
                return (
                  <li key={c.name}>
                    <button
                      onClick={() => {
                        setCategory(c.name);
                        setSubcategory("Всички");
                      }}
                      className={`flex w-full items-center justify-between rounded-r-lg border-l-2 px-3 py-1.5 text-left text-sm transition-colors ${
                        isSelected
                          ? "border-foreground/30 bg-signal font-bold text-signal-foreground"
                          : "border-transparent text-foreground/80 hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className={`text-xs font-semibold ${isSelected ? "text-signal-foreground/80" : "text-foreground/70"}`}>({c.count})</span>
                    </button>
                    {isSelected && subcategories.length > 0 && (
                      <ul className="mt-1 mb-2 space-y-0.5 pl-4">
                        {subcategories.map((s) => (
                          <li key={s.label}>
                            <button
                              onClick={() => setSubcategory(s.label)}
                              className={`flex w-full items-center justify-between rounded-r-lg border-l-2 px-3 py-1 text-left text-sm transition-colors ${
                                subcategory === s.label
                                  ? "border-foreground/30 bg-signal font-semibold text-signal-foreground"
                                  : "border-transparent text-foreground/70 hover:bg-muted/60 hover:text-foreground"
                              }`}
                            >
                              {s.label}
                              <span className="text-xs text-foreground/70">({s.count})</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Състояние */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-sm font-extrabold tracking-tight">Състояние</h2>
            <ul className="space-y-1">
              {[
                { key: "all", label: "Всички", count: machines.length },
                { key: "Нова", label: "Нови", count: machines.filter((m) => m.condition === "Нова").length },
                { key: "Втора употреба", label: "Втора употреба", count: machines.filter((m) => m.condition === "Втора употреба").length },
              ].map((c) => (
                <li key={c.key}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 transition-colors hover:bg-muted/50">
                    <input
                      type="checkbox"
                      checked={condition === (c.key as typeof condition)}
                      onChange={() => setCondition(c.key as typeof condition)}
                      className="size-4 rounded border-border text-signal focus:ring-signal"
                    />
                    <span className="flex-1 text-sm text-foreground">{c.label}</span>
                    <span className="text-xs font-semibold text-foreground/60">({c.count})</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Марка */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-sm font-extrabold tracking-tight">Марка</h2>
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/50" />
              <input
                value={brandQuery}
                onChange={(e) => setBrandQuery(e.target.value)}
                placeholder="Търси"
                className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-ink"
              />
            </div>
            <ul className="max-h-[260px] space-y-0.5 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none]">
              <li>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 transition-colors hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={brand === "Всички"}
                    onChange={() => setBrand("Всички")}
                    className="size-4 rounded border-border text-signal focus:ring-signal"
                  />
                  <span className="flex-1 text-sm text-foreground">Всички</span>
                  <span className="text-xs font-semibold text-foreground/60">({machines.length})</span>
                </label>
              </li>
              {brands
                .filter((b) => b !== "Всички" && b.toLowerCase().includes(brandQuery.trim().toLowerCase()))
                .map((b) => {
                  const count = machines.filter((m) => m.brand === b).length;
                  return (
                    <li key={b}>
                      <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 transition-colors hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={brand === b}
                          onChange={() => setBrand(b)}
                          className="size-4 rounded border-border text-signal focus:ring-signal"
                        />
                        <span className="flex-1 text-sm text-foreground">{b}</span>
                        <span className="text-xs font-semibold text-foreground/60">({count})</span>
                      </label>
                    </li>
                  );
                })}
            </ul>
          </div>

          {/* Година */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-sm font-extrabold tracking-tight">Година</h2>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                placeholder="От"
                className="h-10 w-full rounded-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ink"
              />
              <span className="text-foreground/50">–</span>
              <input
                type="number"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                placeholder="До"
                className="h-10 w-full rounded-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ink"
              />
              <button
                type="button"
                className="h-10 shrink-0 rounded-full bg-signal px-4 text-xs font-bold uppercase tracking-wider text-signal-foreground transition-colors hover:bg-signal/90"
              >
                Търси
              </button>
            </div>
          </div>

          {/* Цена */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-sm font-extrabold tracking-tight">Цена</h2>
            <div className="mb-4 px-1">
              <Slider
                value={[
                  priceMin ? Math.max(priceBounds.min, parseInt(priceMin, 10)) : priceBounds.min,
                  priceMax ? Math.min(priceBounds.max, parseInt(priceMax, 10)) : priceBounds.max,
                ]}
                max={priceBounds.max}
                min={priceBounds.min}
                step={1000}
                onValueChange={([min, max]) => {
                  setPriceMin(String(min));
                  setPriceMax(String(max));
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Мин. цена"
                className="h-10 w-full rounded-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ink"
              />
              <span className="text-foreground/50">–</span>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Макс. цена"
                className="h-10 w-full rounded-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ink"
              />
              <button
                type="button"
                className="h-10 shrink-0 rounded-full bg-signal px-4 text-xs font-bold uppercase tracking-wider text-signal-foreground transition-colors hover:bg-signal/90"
              >
                Търси
              </button>
            </div>
          </div>

        </aside>

        <section>
          <div className="mb-4 rounded-xl border border-border bg-surface px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold text-foreground">
                  {results.length} {results.length === 1 ? "обява" : "обяви"}
                </p>
                {chips.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {chips.map((c) => (
                      <button
                        key={c.label}
                        onClick={c.clear}
                        className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground/90 hover:bg-ink hover:text-ink-foreground"
                      >
                        {c.label} ✕
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-[11px] font-bold uppercase tracking-widest text-foreground/70">
                  Подреди
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-[13px] text-foreground outline-none"
                >
                  <option value="new">Най-нови</option>
                  <option value="price-asc">Цена ↑</option>
                  <option value="price-desc">Цена ↓</option>
                  <option value="year">Година</option>
                </select>
              </div>
            </div>
          </div>

          {subcategories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSubcategory("Всички")}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                  subcategory === "Всички"
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-border bg-surface text-foreground/80 hover:border-ink hover:text-foreground"
                }`}
              >
                Всички
                <span className={`rounded-full px-1.5 text-[11px] ${subcategory === "Всички" ? "bg-white/15" : "bg-muted text-foreground/70"}`}>
                  {subcategories.reduce((sum, s) => sum + s.count, 0)}
                </span>
              </button>
              {subcategories.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSubcategory(s.label)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                    subcategory === s.label
                      ? "border-ink bg-ink text-ink-foreground"
                      : "border-border bg-surface text-foreground/80 hover:border-ink hover:text-foreground"
                  }`}
                >
                  {s.label}
                  <span className={`rounded-full px-1.5 text-[11px] ${subcategory === s.label ? "bg-white/15" : "bg-muted text-foreground/70"}`}>
                    {s.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {results.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-foreground/70">
              Няма съвпадения. Опитайте с по-общо описание.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((m) => (
                <MachineCard key={m.id} machine={m} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile bottom filter bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-signal bg-surface px-3 py-2.5 lg:hidden">
        <div className="mx-auto flex max-w-[1480px] gap-2">
          <button
            type="button"
            onClick={() => setMobileSheet("categories")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-signal px-3 py-3 text-sm font-bold uppercase tracking-wide text-signal-foreground active:scale-[0.98]"
          >
            <LayoutGrid className="size-4" /> Категории
          </button>
          <button
            type="button"
            onClick={() => setMobileSheet("brands")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-signal px-3 py-3 text-sm font-bold uppercase tracking-wide text-signal-foreground active:scale-[0.98]"
          >
            <Tag className="size-4" /> Марки
          </button>
          <button
            type="button"
            onClick={() => setMobileSheet("filters")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-signal px-3 py-3 text-sm font-bold uppercase tracking-wide text-signal-foreground active:scale-[0.98]"
          >
            <SlidersHorizontal className="size-4" /> Филтри
          </button>
        </div>
      </div>

      {/* Mobile bottom-sheet drawer */}
      {mobileSheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSheet(null)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface p-4 pb-8 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-extrabold tracking-tight">
                {mobileSheet === "categories" ? "Категории" : mobileSheet === "brands" ? "Марки" : "Филтри"}
              </h2>
              <button
                type="button"
                onClick={() => setMobileSheet(null)}
                className="rounded-full p-1.5 text-foreground/70 hover:bg-muted"
                aria-label="Затвори"
              >
                <X className="size-5" />
              </button>
            </div>

            {mobileSheet === "categories" && (
              <div>
                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/60" />
                  <input
                    value={catQuery}
                    onChange={(e) => setCatQuery(e.target.value)}
                    placeholder="Търси"
                    className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-ink"
                  />
                </div>
                <ul className="space-y-0.5">
                  <li>
                    <button
                      onClick={() => { setCategory("Всички"); setSubcategory("Всички"); setMobileSheet(null); }}
                      className={`flex w-full items-center justify-between rounded-r-lg border-l-2 px-3 py-2 text-left text-sm transition-colors ${
                        category === "Всички" ? "border-foreground/30 bg-signal font-bold text-signal-foreground" : "border-transparent text-foreground/80 hover:bg-muted/60"
                      }`}
                    >
                      Всички <span className="text-xs font-semibold text-foreground/70">({machines.length})</span>
                    </button>
                  </li>
                  {visibleCategories.map((c) => {
                    const isSelected = category === c.name;
                    return (
                      <li key={c.name}>
                        <button
                          onClick={() => { setCategory(c.name); setSubcategory("Всички"); setMobileSheet(null); }}
                          className={`flex w-full items-center justify-between rounded-r-lg border-l-2 px-3 py-2 text-left text-sm transition-colors ${
                            isSelected ? "border-foreground/30 bg-signal font-bold text-signal-foreground" : "border-transparent text-foreground/80 hover:bg-muted/60"
                          }`}
                        >
                          <span>{c.name}</span>
                          <span className="text-xs font-semibold text-foreground/70">({c.count})</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {mobileSheet === "brands" && (
              <div>
                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/50" />
                  <input
                    value={brandQuery}
                    onChange={(e) => setBrandQuery(e.target.value)}
                    placeholder="Търси"
                    className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-ink"
                  />
                </div>
                <ul className="max-h-[55vh] space-y-0.5 overflow-y-auto pr-1">
                  <li>
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-2 transition-colors hover:bg-muted/50">
                      <input type="checkbox" checked={brand === "Всички"} onChange={() => { setBrand("Всички"); setMobileSheet(null); }} className="size-4 rounded border-border text-signal focus:ring-signal" />
                      <span className="flex-1 text-sm text-foreground">Всички</span>
                      <span className="text-xs font-semibold text-foreground/60">({machines.length})</span>
                    </label>
                  </li>
                  {brands.filter((b) => b !== "Всички" && b.toLowerCase().includes(brandQuery.trim().toLowerCase())).map((b) => {
                    const count = machines.filter((m) => m.brand === b).length;
                    return (
                      <li key={b}>
                        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-2 transition-colors hover:bg-muted/50">
                          <input type="checkbox" checked={brand === b} onChange={() => { setBrand(b); setMobileSheet(null); }} className="size-4 rounded border-border text-signal focus:ring-signal" />
                          <span className="flex-1 text-sm text-foreground">{b}</span>
                          <span className="text-xs font-semibold text-foreground/60">({count})</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {mobileSheet === "filters" && (
              <div className="space-y-5">
                <div>
                  <h3 className="mb-2 text-sm font-extrabold tracking-tight">Състояние</h3>
                  <ul className="space-y-1">
                    {[
                      { key: "all", label: "Всички", count: machines.length },
                      { key: "Нова", label: "Нови", count: machines.filter((m) => m.condition === "Нова").length },
                      { key: "Втора употреба", label: "Втора употреба", count: machines.filter((m) => m.condition === "Втора употреба").length },
                    ].map((c) => (
                      <li key={c.key}>
                        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 transition-colors hover:bg-muted/50">
                          <input type="checkbox" checked={condition === (c.key as typeof condition)} onChange={() => setCondition(c.key as typeof condition)} className="size-4 rounded border-border text-signal focus:ring-signal" />
                          <span className="flex-1 text-sm text-foreground">{c.label}</span>
                          <span className="text-xs font-semibold text-foreground/60">({c.count})</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-extrabold tracking-tight">Година</h3>
                  <div className="flex items-center gap-2">
                    <input type="number" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} placeholder="От" className="h-10 w-full rounded-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ink" />
                    <span className="text-foreground/50">–</span>
                    <input type="number" value={yearTo} onChange={(e) => setYearTo(e.target.value)} placeholder="До" className="h-10 w-full rounded-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ink" />
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-extrabold tracking-tight">Цена</h3>
                  <div className="mb-3 px-1">
                    <Slider
                      value={[priceMin ? Math.max(priceBounds.min, parseInt(priceMin, 10)) : priceBounds.min, priceMax ? Math.min(priceBounds.max, parseInt(priceMax, 10)) : priceBounds.max]}
                      max={priceBounds.max}
                      min={priceBounds.min}
                      step={1000}
                      onValueChange={([min, max]) => { setPriceMin(String(min)); setPriceMax(String(max)); }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="Мин. цена" className="h-10 w-full rounded-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ink" />
                    <span className="text-foreground/50">–</span>
                    <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="Макс. цена" className="h-10 w-full rounded-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ink" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileSheet(null)}
                  className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-bold uppercase tracking-wide text-ink-foreground active:scale-[0.98]"
                >
                  Покажи {results.length} {results.length === 1 ? "обява" : "обяви"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

