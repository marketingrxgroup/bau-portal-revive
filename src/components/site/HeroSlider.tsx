import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import slide1 from "@/assets/1-mini-bager-slider.jpg.asset.json";
import slide2 from "@/assets/2-kran-slider.jpg.asset.json";
import slide3 from "@/assets/3-bager.jpg.asset.json";
import slide5 from "@/assets/bautrax-sl8x.webp.asset.json";
import slide6 from "@/assets/ofis-konteyner.webp.asset.json";
import zoomlionSlide from "@/assets/zoomlion-mini-bager.webp.asset.json";

const hero = slide3.url;
const excavator = slide1.url;
const telehandler = slide2.url;
const wheelloader = slide5.url;
const bobcat = slide6.url;
const bannerH30d = zoomlionSlide.url;

type Slide = {
  kicker: string;
  title: string;
  text: string;
  cta: string;
  id: string;
  image: string;
  specs: [string, string][];
};

const slides: Slide[] = [
  {
    kicker: "Тежка механизация",
    title: "Мини багер JCB 8030ZTS",
    text: "21 тона работно тегло, пълна сервизна история и хидравлика за чук.",
    cta: "Виж машината",
    id: "crawler-excavator-220",
    image: excavator,
    specs: [
      ["Година", "2018"],
      ["Часове", "7 830"],
      ["Тегло", "21.5 т"],
    ],
  },
  {
    kicker: "В наличност",
    title: "Комбиниран багер New Holland B100",
    text: "Комбиниран багер-товарач за строителство, инфраструктура и ежедневна работа на терен.",
    cta: "Виж повече",
    id: "crawler-excavator-220",
    image: hero,
    specs: [
      ["Година", "2020"],
      ["Часове", "3 240"],
      ["Тегло", "8.6 т"],
    ],
  },
  {
    kicker: "Ново от склад",
    title: "Мини кран Befard XM1200",
    text: "14 м височина на повдигане и 4.5 т товароподемност. Доставка от склад с гаранция.",
    cta: "Виж офертата",
    id: "telehandler-t4514",
    image: telehandler,
    specs: [
      ["Година", "2022"],
      ["Височина", "14 м"],
      ["Товар", "4.5 т"],
    ],
  },
  {
    kicker: "Складова техника",
    title: "Дизелов кар H30D",
    text: "Надежден кар Linde с товароподемност 3 тона, обслужен и готов за работа в склад и на терен.",
    cta: "Виж офертата",
    id: "linde-h30d",
    image: bannerH30d,
    specs: [
      ["Година", "2019"],
      ["Часове", "5 120"],
      ["Товар", "3 т"],
    ],
  },
  {
    kicker: "Компактна мощност",
    title: "Челен товарач S241",
    text: "Кубота челен товарач с кофа 1.0 m³, 4x4 задвижване и икономичен разход.",
    cta: "Виж машината",
    id: "wheel-loader-s241",
    image: wheelloader,
    specs: [
      ["Година", "2020"],
      ["Часове", "2 310"],
      ["Кофа", "1.0 m³"],
    ],
  },
  {
    kicker: "Верижен мини товарач",
    title: "Bobcat T590",
    text: "Висока мощност в компактен пакет. Ниски моточасове, допълнителна хидравлика и готовност за работа.",
    cta: "Виж повече",
    id: "bobcat-t590",
    image: bobcat,
    specs: [
      ["Година", "2019"],
      ["Часове", "1 181"],
      ["Товар", "970 кг"],
    ],
  },
];

const DURATION = 7000;

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [progress, setProgress] = useState(0);
  const start = useRef(Date.now());
  const railRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);

  const select = useCallback((n: number) => {
    setI(n);
    setProgress(0);
    start.current = Date.now();
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const p = (Date.now() - start.current) / DURATION;
      if (p >= 1) {
        start.current = Date.now();
        setProgress(0);
        setI((prev) => (prev + 1) % slides.length);
      } else {
        setProgress(p);
      }
    }, 50);
    return () => clearInterval(t);
  }, []);

  // Track whether the slider is visible so auto-advance doesn't pull scroll
  useEffect(() => {
    const el = railRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-scroll thumbnail rail only when slider is visible (manual click or auto-advance in viewport)
  useEffect(() => {
    if (railRef.current && visibleRef.current) {
      const thumb = railRef.current.children[i] as HTMLElement | undefined;
      if (thumb) {
        thumb.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [i]);

  const s = slides[i] as Slide;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1480px] px-4 pt-4 sm:pt-6">
        <div className="grid gap-3 lg:grid-cols-[1fr_400px]">
          {/* MAIN STAGE */}
          <div className="group/main relative overflow-hidden rounded-2xl bg-ink aspect-[16/11] sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[560px]">
            <img
              key={s.image}
              src={s.image}
              alt={s.title}
              width={1600}
              height={900}
              className="absolute inset-0 h-full w-full animate-in fade-in object-cover duration-700"
            />
            <div className="absolute inset-0 z-[2] bg-gradient-to-b from-ink/70 via-ink/5 to-ink/45" />

            {/* title top-left */}
            <div className="absolute inset-x-0 top-0 z-[11] p-5 sm:p-8">
              <h1 className="text-shadow-soft max-w-[80%] text-xl font-extrabold uppercase leading-tight tracking-tight text-ink-foreground sm:text-3xl lg:text-4xl">
                {s.title}
              </h1>
            </div>

            {/* spec bar + dots bottom */}
            <div className="absolute inset-x-0 bottom-0 z-[11] flex flex-col items-center gap-3 p-4 sm:p-6">
              <div className="flex w-full max-w-[880px] flex-wrap items-center justify-center divide-x divide-white/25 rounded-2xl border border-white/25 bg-ink/45 px-2 py-3 backdrop-blur-xl sm:flex-nowrap">
                {specsOf(s).map(([k, v]) => {
                  const Icon = specIcon(k);
                  return (
                    <div key={k} className="flex min-w-0 flex-1 items-center gap-2.5 px-3 sm:px-5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-ink-foreground/80">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[11px] text-ink-foreground/65">{k}:</span>
                        <span className="block truncate text-[13px] font-bold text-ink-foreground">{v}</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                {slides.map((sl, idx) => (
                  <button
                    key={sl.title}
                    onClick={() => select(idx)}
                    aria-label={sl.title}
                    className={`rounded-full transition-all ${
                      idx === i ? "size-2.5 bg-signal" : "size-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* hover arrows */}
            <button
              onClick={() => select((i - 1 + slides.length) % slides.length)}
              aria-label="Предишен слайд"
              className="absolute left-3 top-1/2 z-[12] -translate-y-1/2 rounded-full border border-white/30 bg-ink/40 p-2.5 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-ink/70 focus:opacity-100 group-hover/main:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => select((i + 1) % slides.length)}
              aria-label="Следващ слайд"
              className="absolute right-3 top-1/2 z-[12] -translate-y-1/2 rounded-full border border-white/30 bg-ink/40 p-2.5 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-ink/70 focus:opacity-100 group-hover/main:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* SIDE PROMO CARDS */}
          <div ref={railRef} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {promos.map((p) => (
              <Link
                key={p.title}
                to="/catalog"
                search={{ q: p.q }}
                className="group relative flex aspect-[16/10] flex-col overflow-hidden rounded-2xl bg-ink lg:aspect-auto lg:h-full"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/20 to-transparent" />
                <div className="relative z-[2] p-5">
                  <p className="text-shadow-soft text-base font-extrabold uppercase leading-tight tracking-tight text-ink-foreground sm:text-lg">
                    {p.title}
                  </p>
                  <p className="text-shadow-soft mt-1 text-[12px] text-ink-foreground/80">{p.text}</p>
                </div>
                <span className="absolute bottom-4 right-4 z-[2] grid size-9 place-items-center rounded-full bg-signal text-ink opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

