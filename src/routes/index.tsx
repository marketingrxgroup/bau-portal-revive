import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, ArrowUpRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { QuickSearch } from "@/components/site/QuickSearch";
import { SearchAssistantModal } from "@/components/site/SearchAssistantModal";
import { HeroSlider } from "@/components/site/HeroSlider";
import { MachineCard } from "@/components/site/MachineCard";
import { CategoryConstellation } from "@/components/site/CategoryConstellation";
import { categories, machinesListQuery } from "@/lib/machines";
import bannerAgroAsset from "@/assets/banner-fleet.webp.asset.json";
import bannerForkliftAsset from "@/assets/banner-bautrax.webp.asset.json";
import footerLogoAsset from "@/assets/footer-logo-bau-portal.png.asset.json";
import searchBgAsset from "@/assets/search-bg.jpg";
import aboutMainImage from "@/assets/hero-machine.jpg";
import aboutDetailImage from "@/assets/m-excavator.jpg";

const bannerAgro = bannerAgroAsset.url;
const bannerForklift = bannerForkliftAsset.url;
const footerLogo = footerLogoAsset.url;
const searchBg = searchBgAsset;

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(machinesListQuery),
  head: () => ({
    meta: [
      { title: "Bauportal — борса за строителна и складова техника" },
      {
        name: "description",
        content:
          "Нови и употребявани багери, кари, товарачи и камиони. Бърза търсачка и филтри, за да намерите точната машина за минути.",
      },
      { property: "og:title", content: "Bauportal — борса за строителна техника" },
      {
        property: "og:description",
        content: "Багери, кари и товарачи от проверени дилъри. Намерете машина за минути.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const brands = ["JCB", "Komatsu", "Manitou", "Linde", "Kubota", "Caterpillar", "Volvo", "Bobcat"];

function Home() {
  const machines = useSuspenseQuery(machinesListQuery).data;
  const promo = machines.slice(0, 4);
  const rest = machines.slice(4);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState("");

  const openAssistant = (query: string) => {
    setAssistantQuery(query);
    setAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <SearchAssistantModal
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        initialQuery={assistantQuery}
      />

      <HeroSlider />

      {/* SEARCH */}
      <section
        className="relative mt-6 overflow-hidden border-b border-border"
        style={{ backgroundImage: `url(${searchBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink/80" />
        <div className="relative z-10 mx-auto max-w-[1480px] px-4 py-7 sm:py-9">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.14em] text-signal">
              Bauportal AI Search
            </p>
            <h2 className="mt-1 mb-2.5 text-center text-xl font-extrabold text-ink-foreground sm:text-2xl">
              Намери точната машина за секунди
            </h2>
            <QuickSearch variant="glass" onOpenAssistant={openAssistant} />
          </div>
        </div>
      </section>

      {/* MARKETPLACE BODY */}
      <div className="mx-auto grid max-w-[1480px] gap-6 px-4 py-8 lg:grid-cols-1">
        <aside className="hidden h-fit">
          <div className="rounded-xl border border-border bg-surface p-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-foreground">Категории</h2>
            <ul className="mt-3 space-y-1">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/catalog"
                    search={{ q: c.name }}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {c.name}
                    <span className="text-[11px] font-medium text-foreground/70">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/catalog"
              search={{ q: "" }}
              className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-ink px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-ink-foreground hover:bg-signal hover:text-signal-foreground"
            >
              Всички обяви <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-surface p-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-foreground">Състояние</h2>
            <ul className="mt-3 space-y-1">
              {["Нова", "Втора употреба"].map((s) => (
                <li key={s}>
                  <Link
                    to="/catalog"
                    search={{ q: s }}
                    className="block rounded-lg px-2 py-1.5 text-[13px] font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-surface p-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-foreground">Популярни марки</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {brands.map((b) => (
                <Link
                  key={b}
                  to="/catalog"
                  search={{ q: b }}
                  className="rounded-lg border border-border px-2 py-1 text-[12px] font-medium text-foreground/80 transition-colors hover:border-ink hover:text-foreground"
                >
                  {b}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-surface p-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-foreground">Бюджет</h2>
            <ul className="mt-3 space-y-1">
              {["до 25 000 лв.", "25 000 – 50 000 лв.", "50 000 – 100 000 лв.", "над 100 000 лв."].map((p) => (
                <li key={p}>
                  <Link
                    to="/catalog"
                    search={{ q: "" }}
                    className="block rounded-lg px-2 py-1.5 text-[13px] font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
                  >
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-xl bg-ink p-4 text-ink-foreground">
            <p className="text-[11px] font-bold uppercase tracking-widest text-signal">Продавате машина?</p>
            <p className="mt-2 text-sm font-bold leading-snug">Публикувайте обява и достигнете до 40 000 купувачи.</p>
            <Link
              to="/catalog"
              search={{ q: "" }}
              className="mt-3 inline-flex rounded-lg bg-signal px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-signal-foreground"
            >
              Добави обява
            </Link>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-surface p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-foreground">Нужна е помощ?</p>
            <p className="mt-2 text-sm font-bold leading-snug text-foreground">Консултация за избор на машина и лизинг.</p>
            <a
              href="tel:+35928000000"
              className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-signal"
            >
              <Phone className="size-4 text-signal" /> +359 2 800 00 00
            </a>
          </div>
        </aside>


        <main>
          {/* PROMO LISTINGS */}
          <div className="mb-4 flex items-end justify-between border-b border-border pb-3">
            <h2 className="inline-flex items-center gap-2 text-xl font-extrabold uppercase tracking-tight">
              <Flame className="size-5 text-signal" /> Промотирани обяви
            </h2>
            <Link
              to="/catalog"
              search={{ q: "" }}
              className="text-[11px] font-bold uppercase tracking-widest text-foreground/70 hover:text-foreground"
            >
              Виж всички →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {promo.map((m) => (
              <MachineCard key={m.id} machine={m} featured />
            ))}
          </div>

          {/* BANNERS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Banner
              image={bannerForklift}
              kicker="Складова техника"
              title="Кари на склад — доставка до 5 дни"
              cta="Виж карите"
              search="кар"
            />
            <Banner
              image={bannerAgro}
              kicker="Кампания"
              title="Селскостопанска техника с 0% лихва"
              cta="Към кампанията"
              search="селскостопанска"
            />
          </div>

          {/* NEWEST */}
          <div className="mb-4 mt-10 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
            <h2 className="text-xl font-extrabold uppercase tracking-tight">Най-нови обяви</h2>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-foreground/70">
              <span>{machines.length} обяви</span>
              <span className="text-border">|</span>
              <span className="font-bold text-foreground">Подредени по дата</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rest.slice(0, 4).map((m) => (
              <MachineCard key={m.id} machine={m} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/catalog"
              search={{ q: "" }}
              className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-[12px] font-bold uppercase tracking-widest transition-colors hover:bg-ink hover:text-ink-foreground"
            >
              Зареди още обяви
            </Link>
          </div>
        </main>
      </div>

      {/* MARKETPLACE INTRO */}
      <section className="mt-5 overflow-hidden border-y border-border bg-surface">
        <div className="mx-auto max-w-[1480px] px-4 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-12">
            {/* Left Column: Overlapping Images */}
            <div className="relative pb-10 pr-10 lg:col-span-4">
              <div className="relative z-10 aspect-[3/4] w-full xl:aspect-[2/3]">
                <img
                  src={aboutMainImage}
                  alt="Строителна техника"
                  className="h-full w-full rounded-sm object-cover shadow-2xl"
                />
                <div className="absolute -top-3 -left-3 z-20 h-20 w-20 border-t-4 border-l-4 border-signal" />
                <div className="absolute -bottom-8 -right-8 z-30 aspect-square w-1/2 border-[8px] border-surface shadow-xl">
                  <img
                    src={aboutDetailImage}
                    alt="Детайл на машина"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Middle Column: Primary Messaging */}
            <div className="flex flex-col pt-10 lg:col-span-4">
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-signal">
                Bauportal от 2014
              </span>
              <h1 className="font-display text-6xl font-extrabold leading-[0.9] tracking-tighter text-foreground lg:text-7xl xl:text-8xl">
                BAU
                <br />
                <span className="text-muted-foreground">PORTAL</span>
              </h1>
              <div className="mt-6 space-y-5">
                <p className="text-xl font-bold leading-snug text-foreground">
                  Маркетплейс за продажба на строителна техника и машини&nbsp;- нови и употребявани
                </p>
                <p className="text-[15px] leading-relaxed text-foreground/70">
                  Bauportal е специализиран маркетплейс за продажба, покупка, наем, сервиз и услуги, свързани със строителна техника, машини и оборудване. Платформата предлага богат избор от нови и употребявани строителни машини, техника втора употреба, индустриално оборудване, складова техника, земеделски машини и професионални услуги за бизнеса.
                </p>
              </div>
            </div>

            {/* Right Column: Context & Catalog */}
            <div className="flex flex-col pt-10 lg:col-span-4">
              <div className="space-y-5">
                <p className="text-[15px] leading-relaxed text-foreground/70">
                  Bauportal обединява търговци, сервизи, наемодатели и клиенти, които търсят надеждни решения за своята дейност. Тук можете лесно да откриете багери, валяци, челни товарачи, мини багери, подемна техника, генератори, компресори, машини за бетон, пътностроителна техника и други видове оборудване на конкурентни цени.
                </p>
                <p className="text-[15px] leading-relaxed text-foreground/70">
                  Платформата е създадена с фокус върху удобството, бързото намиране на подходяща машина и директната връзка между купувачи и продавачи. Независимо дали търсите употребявана техника за покупка, машина под наем, сервизна услуга или партньор за поддръжка, Bauportal ви помага да намерите правилното решение за вашия проект.<br /><br />
                  С Bauportal получавате не просто достъп до строителна техника и машини, а надежден партньор за развитие на вашия бизнес.
                </p>
              </div>

              <div className="mt-8">
                <div className="mb-4 h-px w-full bg-border" />
                <Link
                  to="/catalog"
                  search={{ q: "" }}
                  className="group inline-flex items-center gap-3"
                >
                  <span className="text-sm font-bold uppercase tracking-widest text-foreground">НАУЧИ ПОВЕЧЕ ЗА НАС</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryConstellation />


      {/* FULL-WIDTH TRANSPARENT LOGO STRIP */}
      <section className="relative overflow-hidden border-y border-border bg-surface py-8 sm:py-12">
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ filter: "grayscale(100%) brightness(0.6) contrast(1.2) opacity(0.18)" }}
        >
          <img
            src={footerLogo}
            alt="Bauportal"
            className="h-24 w-auto max-w-none object-contain sm:h-32 lg:h-40"
          />
        </div>
      </section>


      <SiteFooter />
    </div>
  );
}

function Banner({
  image,
  kicker,
  title,
  cta,
  search,
}: {
  image: string;
  kicker: string;
  title: string;
  cta: string;
  search: string;
}) {
  return (
    <Link
      to="/catalog"
      search={{ q: search }}
      className="group relative overflow-hidden rounded-xl border border-border"
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        width={900}
        height={600}
        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-between p-5 text-ink-foreground">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-signal">{kicker}</span>
          <h3 className="mt-1 max-w-xs text-lg font-extrabold leading-tight text-ink-foreground">{title}</h3>
        </div>
        <span className="inline-flex w-fit rounded-lg bg-signal px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-signal-foreground">
          {cta}
        </span>
      </div>
    </Link>
  );
}

