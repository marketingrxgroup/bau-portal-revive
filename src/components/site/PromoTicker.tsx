import { Dot } from "lucide-react";

const items = [
  "БЪРЗА ДОСТАВКА ДО ОБЕКТ",
  "BAUPORTAL",
  "EST. 2014",
  "ЦЯЛА БЪЛГАРИЯ",
  "ВНОС НА МАШИНИ ПО ПОРЪЧКА",
  "МАШИНИ ПО ПОРЪЧКА",
  "НАЛИЧНИ МАШИНИ",
  "НОВИ МАШИНИ",
  "ВТОРА УПОТРЕБА",
  "600+ МАШИНИ ПОД НАЕМ",
  "СОБСТВЕН СЕРВИЗ 24/7",
];

export function PromoTicker() {
  const ticker = [...items, ...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden border-b border-border bg-secondary py-2.5 text-secondary-foreground">
      <div className="animate-marquee flex items-center whitespace-nowrap">
        {ticker.map((text, i) => (
          <div key={`${text}-${i}`} className="flex items-center">
            <span className="px-4 text-[11px] font-bold uppercase tracking-widest text-ink/80">
              {text}
            </span>
            <Dot className="size-4 shrink-0 text-signal" />
          </div>
        ))}
      </div>
    </div>
  );
}
