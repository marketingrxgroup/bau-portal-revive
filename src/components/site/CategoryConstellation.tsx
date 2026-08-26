import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pickaxe, Forklift, ArrowUp, Loader, Truck, Sprout, MoveVertical, Zap } from "lucide-react";
import { categories } from "@/lib/machines";
import imgExcavator from "@/assets/m-excavator.jpg";
import imgForklift from "@/assets/m-forklift.jpg";
import imgTelehandler from "@/assets/m-telehandler.jpg";
import imgWheelloader from "@/assets/m-wheelloader.jpg";
import imgBackhoe from "@/assets/m-backhoe-loader.jpg";
import imgAgro from "@/assets/banner-agro.jpg";
import imgMini from "@/assets/m-mini-excavator.jpg";
import imgBobcat from "@/assets/m-bobcat-t590.jpg";

type Tile = {
  label: string;
  slug?: string;
  count: number;
  image: string;
  icon: React.ReactNode;
  span: string;
};

const counts = Object.fromEntries(categories.map((c) => [c.slug, c.count]));

// 6-column x 3-row rectangle: spans add up to exactly 18 cells.
const tiles: Tile[] = [
  {
    label: "Багери",
    slug: "bagri",
    count: counts["bagri"] ?? 129,
    image: imgExcavator,
    icon: <Pickaxe className="h-4 w-4" />,
    span: "col-span-2 row-span-2",
  },
  {
    label: "Кари",
    slug: "kari",
    count: counts["kari"] ?? 96,
    image: imgForklift,
    icon: <Forklift className="h-4 w-4" />,
    span: "col-span-2 row-span-1",
  },
  {
    label: "Телескопични товарачи",
    slug: "teleskopichni",
    count: counts["teleskopichni"] ?? 54,
    image: imgTelehandler,
    icon: <ArrowUp className="h-4 w-4" />,
    span: "col-span-2 row-span-1",
  },
  {
    label: "Селскостопанска техника",
    slug: "selskostopanska",
    count: counts["selskostopanska"] ?? 88,
    image: imgAgro,
    icon: <Sprout className="h-4 w-4" />,
    span: "col-span-2 row-span-2",
  },
  {
    label: "Челни товарачи",
    slug: "cheln-tovarachi",
    count: counts["cheln-tovarachi"] ?? 61,
    image: imgWheelloader,
    icon: <Loader className="h-4 w-4" />,
    span: "col-span-2 row-span-1",
  },
  {
    label: "Камиони",
    slug: "kamioni",
    count: counts["kamioni"] ?? 73,
    image: imgBackhoe,
    icon: <Truck className="h-4 w-4" />,
    span: "col-span-2 row-span-1",
  },
  {
    label: "Подемна техника",
    count: 42,
    image: imgMini,
    icon: <MoveVertical className="h-4 w-4" />,
    span: "col-span-1 row-span-1",
  },
  {
    label: "Генератори",
    count: 37,
    image: imgBobcat,
    icon: <Zap className="h-4 w-4" />,
    span: "col-span-1 row-span-1",
  },
];

const subChips = [
  "Мини багери",
  "Верижни багери",
  "Колесни багери",
  "Дизелови кари",
  "Електрокари",
  "Подемна техника",
  "Генератори",
  "Компресори",
  "Бетонови възли",
  "Самосвали",
  "Булдозери",
  "Валяци",
];

export function CategoryConstellation() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % tiles.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-[1480px] px-4 py-12 sm:py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-signal">Каталог</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Разгледай по категории
            </h2>
          </div>
          <Link
            to="/catalog"
            search={{ q: "" }}
            className="hidden text-[11px] font-bold uppercase tracking-widest text-foreground/70 hover:text-foreground sm:block"
          >
            Виж всички →
          </Link>
        </div>

        {/* Mosaic: flush rectangle, dense flow so every cell is filled */}
        <div className="grid grid-flow-dense auto-rows-[8rem] grid-cols-2 gap-3 sm:auto-rows-[9rem] sm:grid-cols-4 lg:grid-cols-6">
          {tiles.map((tile, idx) => (
            <Link
              key={tile.label}
              to="/catalog"
              search={{ q: tile.label }}
              data-active={idx === activeIndex ? "true" : "false"}
              className={`group relative flex flex-col justify-end overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-ink/50 hover:shadow-xl data-[active=true]:-translate-y-1 data-[active=true]:border-ink/50 data-[active=true]:shadow-xl ${tile.span}`}
            >
              {/* Semi-visible photo — stronger silhouette before hover */}
              <img
                src={tile.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-90 saturate-[0.75] transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:saturate-100 group-data-[active=true]:scale-105 group-data-[active=true]:opacity-100 group-data-[active=true]:saturate-100"
              />
              {/* Soft bottom gradient — keeps silhouette readable, no dark wall */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent transition-all duration-500 group-hover:from-black/70 group-hover:via-black/25 group-hover:to-transparent group-data-[active=true]:from-black/70 group-data-[active=true]:via-black/25 group-data-[active=true]:to-transparent" />

              <span className="absolute left-4 top-4 z-10 rounded-md bg-signal/90 p-1.5 text-ink backdrop-blur-sm transition-colors group-hover:bg-signal group-hover:text-ink group-data-[active=true]:bg-signal group-data-[active=true]:text-ink">
                {tile.icon}
              </span>

              <div className="relative z-10">
                <h3 className="font-display text-base font-bold leading-tight text-white transition-colors group-hover:text-white sm:text-lg">
                  {tile.label}
                </h3>
                <p className="mt-1 text-[11px] font-medium text-white/80 transition-colors group-hover:text-white/90 group-data-[active=true]:text-white/90">
                  {tile.count} обяви
                </p>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-signal to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-data-[active=true]:opacity-100" />
            </Link>
          ))}
        </div>

        {/* Subcategory cloud */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {subChips.map((chip) => (
              <Link
                key={chip}
                to="/catalog"
                search={{ q: chip }}
                className="group rounded-full border border-border bg-card px-3.5 py-1.5 text-[12px] font-medium text-foreground/80 transition-all hover:border-ink/40 hover:bg-ink hover:text-ink-foreground"
              >
                <span className="mr-1.5 inline-block h-1 w-1 rounded-full bg-signal/70 transition-transform group-hover:scale-150" />
                {chip}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
