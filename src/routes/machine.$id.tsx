import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Phone, Mail, Check, CreditCard, ChevronDown, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MachineCard } from "@/components/site/MachineCard";
import { LeasingLogo } from "@/components/site/LeasingLogo";
import { SpecGrid } from "@/components/site/SpecGrid";
import { brandLogos, formatPrice, machineQuery, machinesListQuery } from "@/lib/machines";

export const Route = createFileRoute("/machine/$id")({
  loader: async ({ params, context }) => {
    const machine = await context.queryClient.ensureQueryData(machineQuery(params.id));
    await context.queryClient.ensureQueryData(machinesListQuery);
    if (!machine) throw notFound();
    return machine;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.brand ?? "Машина"} ${loaderData?.title ?? ""} | Bauportal` },
      {
        name: "description",
        content: loaderData?.description ?? "Детайли за машина в каталога на Bauportal.",
      },
      { property: "og:title", content: `${loaderData?.brand ?? ""} ${loaderData?.title ?? ""}` },
      { property: "og:description", content: loaderData?.description ?? "" },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MachinePage,
});

function MachinePage() {
  const machine = Route.useLoaderData();
  const machines = useSuspenseQuery(machinesListQuery).data;
  const [leasingOpen, setLeasingOpen] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const images = machine.images?.length
    ? machine.images
    : Array.from({ length: 4 }, () => machine.image);
  const discountPercent = machine.originalPrice && machine.price !== null
    ? Math.round((1 - machine.price / machine.originalPrice) * 100)
    : null;
  const brandLogo = brandLogos[machine.brand];
  const relatedByCategory = machines
    .filter((m) => m.id !== machine.id && m.category === machine.category)
    .slice(0, 4);
  const relatedByBrand = machines
    .filter((m) => m.id !== machine.id && m.brand === machine.brand)
    .slice(0, 4);

  const baseSpecs: [string, string][] = [
    ["Марка", machine.brand],
    ...(machine.model ? ([["Модел", machine.model]] as [string, string][]) : []),
    ["Моточасове", machine.hours.toLocaleString("bg-BG")],
    ["Работно тегло", `${machine.weightT} т`],
    ["Мощност", `${machine.powerHp} к.с.`],
    ["Състояние", machine.condition],
    ["Локация", machine.location],
  ];

  const seen = new Set<string>();
  const specs: [string, string][] = [
    ...baseSpecs,
    ...((machine.specs ?? []).map((s) => [s.label, s.value] as [string, string])),
  ].filter(([k]) => {
    const key = k.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });


  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1480px] px-4">
          <nav className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap px-3 py-2 text-xs text-foreground/70 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link to="/" className="flex items-center gap-1 hover:text-foreground">
              <Home className="size-3.5" />
              <span>Начало</span>
            </Link>
            <ChevronRight className="size-3.5 text-foreground/40" />
            <Link to="/catalog" search={{ q: machine.category }} className="hover:text-foreground">
              {machine.category}
            </Link>
            {machine.subcategory && (
              <>
                <ChevronRight className="size-3.5 text-foreground/40" />
                <Link to="/catalog" search={{ q: machine.subcategory }} className="hover:text-foreground">
                  {machine.subcategory}
                </Link>
              </>
            )}
            <ChevronRight className="size-3.5 text-foreground/40" />
            <span className="font-semibold text-foreground">{machine.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1480px] px-4 pb-8">
        <div className="mt-3 grid gap-6 lg:mt-6 lg:grid-cols-[1fr_1.5fr] lg:gap-8 items-start">
          {/* MOBILE TITLE — above the image on small screens */}
          <div className="lg:hidden">
            <p className="label-caps text-foreground/70">{machine.brand}</p>
            <h1 className="mt-0.5 text-2xl font-extrabold leading-tight text-foreground">{machine.title}</h1>
          </div>

          {/* LEFT COLUMN — sticky visual + hero stats */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="relative">
              {discountPercent !== null && (
                <span className="absolute left-3 top-3 z-10 rounded bg-red-600 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow">
                  -{discountPercent}%
                </span>
              )}
              <div className="group relative">
                <img
                  src={images[imageIdx]}
                  alt={`${machine.brand} ${machine.title}`}
                  width={800}
                  height={600}
                  className="aspect-[4/3] w-full border border-border bg-surface object-cover"
                />
                <button
                  type="button"
                  aria-label="Предишна снимка"
                  onClick={() => setImageIdx((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-black/60"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Следваща снимка"
                  onClick={() => setImageIdx((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-black/60"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageIdx(i)}
                  aria-label={`Снимка ${i + 1}`}
                  className={`aspect-[4/3] w-full overflow-hidden border object-cover transition-opacity hover:opacity-100 ${
                    imageIdx === i ? "border-ink opacity-100" : "border-border opacity-70"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${machine.title} снимка ${i + 1}`}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-px border border-border bg-border">
              {[
                ["Година", String(machine.year)],
                ["Кат. №", machine.catNo ?? "—"],
                ["Моточасове", machine.hours.toLocaleString("bg-BG")],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface px-2 py-3 text-center sm:px-6 sm:py-5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/70 sm:text-xs">{k}</p>
                  <p className="mt-1 text-base font-extrabold text-signal sm:text-2xl">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — scrollable content */}
          <div>
            <div className="hidden lg:block">
              <p className="label-caps text-foreground/70">{machine.brand}</p>
              <h1 className="mt-1 text-3xl font-extrabold leading-tight text-foreground">{machine.title}</h1>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">{machine.description}</p>

            <div className="mt-5 border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <p className={`text-3xl font-extrabold ${machine.originalPrice ? "text-red-600" : "text-foreground"}`}>
                        {formatPrice(machine.price)}
                      </p>
                      {machine.originalPrice && machine.price !== null && (
                        <p className="text-lg font-semibold text-foreground/50 line-through">
                          {new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(machine.originalPrice)} €
                        </p>
                      )}
                    </div>
                  <p className="mt-1 text-xs text-foreground/60">Без ДДС · възможен лизинг</p>
                </div>
                {brandLogo && (
                  <div className="shrink-0 rounded-lg border border-border bg-background px-3 py-2 text-center">
                    <img
                      src={brandLogo}
                      alt={`${machine.brand} лого`}
                      loading="lazy"
                      className="h-10 w-auto max-w-[120px] object-contain"
                    />
                  </div>
                )}
              </div>

              <div className={`mt-4 grid grid-cols-1 gap-2 ${machine.leasing ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                <button className="flex items-center justify-center gap-2 bg-ink py-3 text-[11px] font-bold uppercase tracking-widest text-ink-foreground transition-colors hover:bg-ink/90">
                  <Mail className="size-4" /> Изпрати запитване
                </button>
                <a
                  href="tel:+35928000000"
                  className="flex items-center justify-center gap-2 border border-border py-3 text-[11px] font-bold uppercase tracking-widest text-foreground transition-colors hover:border-ink"
                >
                  <Phone className="size-4" /> +359 2 800 00 00
                </a>
                {machine.leasing && (
                  <button
                    type="button"
                    onClick={() => setLeasingOpen((v) => !v)}
                    aria-expanded={leasingOpen}
                    className="flex items-center justify-center gap-2 bg-signal px-2 py-3 text-[11px] font-bold uppercase tracking-widest text-ink transition-colors hover:bg-signal/90"
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="size-4" /> Купи на лизинг
                    </span>
                    <ChevronDown
                      className={`size-4 transition-transform ${leasingOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
              </div>

              {machine.leasing && (
                <div>

                  {leasingOpen && (
                    <div className="mt-2 space-y-2">
                      {machine.leasing.map((l) => (
                        <a
                          key={l.provider}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-opacity hover:opacity-90 ${l.className}`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[12px] font-bold text-white">Купи с</span>
                            <LeasingLogo provider={l.provider} />
                          </span>
                          <span className="text-[10px] font-semibold text-white/90">
                            от {l.monthlyFrom} €/мес.
                          </span>
                        </a>
                      ))}
                      <p className="text-[11px] leading-relaxed text-foreground/60">
                        Онлайн одобрение за минути. Финалните условия се определят от
                        финансиращата институция.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 overflow-hidden border border-border bg-surface">
              <dl className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
                {specs
                  .filter(([k]) => {
                    const key = k.toLowerCase();
                    return key !== "година" && key !== "моточасове" && key !== "кат. №";
                  })
                  .map(([k, v]) => (
                    <div key={k} className="bg-surface px-3 py-2.5">
                      <dt className="text-[10px] uppercase leading-tight tracking-widest text-foreground/70">{k}</dt>
                      <dd className="text-sm font-bold leading-snug text-foreground">{v}</dd>
                    </div>
                  ))}
              </dl>
            </div>

            {machine.descriptionBlocks && (
              <div className="mt-8">
                <div className="space-y-6">
                  {machine.descriptionBlocks.map((block, i) => {
                    if (block.type === "h2") {
                      return (
                        <h2 key={i} className="border-b border-border pb-3 text-xl font-extrabold text-foreground">
                          {block.text}
                        </h2>
                      );
                    }
                    if (block.type === "h3") {
                      return (
                        <h3 key={i} className="pt-2 text-lg font-extrabold text-foreground">
                          {block.text}
                        </h3>
                      );
                    }
                    if (block.type === "p") {
                      return (
                        <p key={i} className="text-sm leading-relaxed text-foreground/70">
                          {block.text}
                        </p>
                      );
                    }
                    if (block.type === "ul") {
                      return (
                        <ul key={i} className="space-y-2">
                          {block.items.map((item, j) => (
                            <li key={j} className="flex gap-3 text-sm text-foreground/80">
                              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-signal" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (block.type === "table") {
                      return <SpecGrid key={i} rows={block.rows} />;
                    }

                    if (block.type === "faq") {
                      return (
                        <div key={i} className="max-w-4xl divide-y divide-border border border-border bg-surface">
                          {block.items.map((f, j) => (
                            <details key={j} className="group px-5 py-4" open={j === 0}>
                              <summary className="flex cursor-pointer list-none items-start gap-3 text-sm font-extrabold text-foreground">
                                <span className="text-signal">{String(j + 1).padStart(2, "0")}</span>
                                <span className="flex-1">{f.q}</span>
                                <span className="text-foreground/60 transition-transform group-open:rotate-45">+</span>
                              </summary>
                              <p className="mt-3 pl-8 text-sm leading-relaxed text-foreground/70">{f.a}</p>
                            </details>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}


            {machine.equipment && (
              <div className="mt-10">
                <h2 className="border-b border-border pb-3 text-xl font-extrabold text-foreground">Оборудване</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {machine.equipment.map((e) => (
                    <li key={e} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-signal" /> {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* FULL-WIDTH SIMILAR MACHINES */}
        <div className="mt-14 space-y-12">
          {relatedByCategory.length > 0 && (
            <section>
              <div className="mb-5 flex items-end justify-between border-b border-border pb-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/60">Още предложения</p>
                  <h2 className="mt-1 text-xl font-extrabold uppercase tracking-tight text-foreground">Подобни от категория</h2>
                </div>
                <Link
                  to="/catalog"
                  search={{ q: machine.category }}
                  className="flex items-center gap-1 text-xs font-bold text-foreground/60 transition-colors hover:text-signal"
                >
                  Виж всички <ChevronRight className="size-3.5" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedByCategory.map((m) => (
                  <MachineCard key={m.id} machine={m} />
                ))}
              </div>
            </section>
          )}

          {relatedByBrand.length > 0 && (
            <section>
              <div className="mb-5 flex items-end justify-between border-b border-border pb-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/60">Същата марка</p>
                  <h2 className="mt-1 text-xl font-extrabold uppercase tracking-tight text-foreground">Подобни от марка</h2>
                </div>
                <Link
                  to="/catalog"
                  search={{ q: machine.brand }}
                  className="flex items-center gap-1 text-xs font-bold text-foreground/60 transition-colors hover:text-signal"
                >
                  Виж всички <ChevronRight className="size-3.5" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedByBrand.map((m) => (
                  <MachineCard key={m.id} machine={m} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
