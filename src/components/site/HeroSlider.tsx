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
        <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
          {/* MAIN STAGE */}
          <div className="group/main relative overflow-hidden rounded-2xl bg-ink aspect-[16/11] sm:aspect-[16/8] lg:aspect-auto lg:h-full">
            <img
              key={s.image}
              src={s.image}
              alt={s.title}
              width={1600}
              height={900}
              className="absolute inset-0 h-full w-full animate-in fade-in object-cover duration-700"
            />
            <div
              className="absolute inset-0 z-[2]"
              style={{
                background:
                  "linear-gradient(to right, rgba(31, 36, 55, .86) 0%, rgba(31, 36, 55, .5) 45%, rgba(31, 36, 55, .25) 68%, rgba(31, 36, 55, .05) 100%)",
              }}
            />

            <div className="absolute inset-x-0 bottom-0 z-[11] p-5 sm:p-8">
              <p className="label-caps inline-flex items-center gap-2 rounded-full bg-signal px-3 py-1 text-ink">
                {s.kicker}
              </p>
              <h1 className="text-shadow-soft mt-3 text-3xl font-extrabold leading-[0.95] tracking-tight text-ink-foreground sm:text-5xl lg:text-6xl">
                {s.title}
              </h1>
              <p className="text-shadow-soft mt-3 max-w-md text-sm text-ink-foreground/75">{s.text}</p>

              <div className="mt-5 flex items-stretch justify-between gap-4">
                <div className="flex divide-x divide-white/30 overflow-hidden rounded-full border border-white/50 bg-white/25 backdrop-blur-2xl">
                  {s.specs.map(([k, v]) => (
                    <div
                      key={k}
                      className="flex flex-col items-center justify-center px-6 py-1.5 text-center"
                    >
                      <div className="text-shadow-soft text-[10px] font-semibold uppercase tracking-widest text-white/70">
                        {k}
                      </div>
                      <div className="text-shadow-soft text-sm font-bold text-white">{v}</div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/machine/$id"
                  params={{ id: s.id }}
                  className="flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-ink transition-transform hover:scale-105"
                >
                  {s.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            {/* counter */}
            <div className="text-shadow-soft absolute right-5 top-5 z-[11] rounded-full bg-ink/60 px-3 py-1 text-[11px] font-bold tracking-widest text-ink-foreground backdrop-blur">
              {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </div>

            {/* hover arrows */}
            <button
              onClick={() => select((i - 1 + slides.length) % slides.length)}
              aria-label="Предишен слайд"
              className="group/arrow absolute left-3 top-1/2 z-[12] -translate-y-1/2 rounded-full border border-white/30 bg-ink/40 p-2.5 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-ink/70 focus:opacity-100 group-hover/main:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => select((i + 1) % slides.length)}
              aria-label="Следващ слайд"
              className="group/arrow absolute right-3 top-1/2 z-[12] -translate-y-1/2 rounded-full border border-white/30 bg-ink/40 p-2.5 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-ink/70 focus:opacity-100 group-hover/main:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* THUMB RAIL */}
          <div className="flex h-full flex-col gap-3">
            <div
              ref={railRef}
              className="flex flex-col gap-3 overflow-y-auto pr-1 min-h-0 max-h-[408px] 2xl:max-h-[548px] scrollbar-hide"
            >
              {slides.map((sl, idx) => (
                <button
                  key={sl.title}
                  onClick={() => select(idx)}
                  aria-label={sl.title}
                  className={`group relative flex h-32 flex-none overflow-hidden rounded-xl border bg-surface text-left transition-colors ${
                    idx === i ? "border-ink" : "border-border hover:border-ink/40"
                  }`}
                >
                  <div className="relative h-full w-32 shrink-0 overflow-hidden bg-muted">
                    <img
                      src={sl.image}
                      alt={sl.title}
                      loading="lazy"
                      className={`h-full w-full object-cover object-center transition-all duration-500 ${
                        idx === i
                          ? ""
                          : "opacity-70 saturate-50 group-hover:opacity-100 group-hover:saturate-100"
                      }`}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-foreground/70">
                      {sl.kicker}
                    </p>
                    <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
                      {sl.title}
                    </p>
                    <p className="text-[11px] text-foreground/60">
                      {sl.specs.map(([, v]) => v).join(" · ")}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <Link
              to="/catalog"
              search={{ q: "" }}
              className="flex h-11 shrink-0 items-center justify-between rounded-xl bg-ink px-4 text-ink-foreground transition-colors hover:bg-signal hover:text-ink"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest">Всички машини</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
