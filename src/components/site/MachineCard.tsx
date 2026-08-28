import { Link } from "@tanstack/react-router";
import { Heart, GitCompare, Clock, Calendar, Weight, Tag } from "lucide-react";
import { formatPrice, type Machine } from "@/lib/machines";

export function MachineCard({ machine, featured = false }: { machine: Machine; featured?: boolean }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-200 hover:border-ink/40 hover:shadow-[0_18px_40px_-30px_rgba(0,0,0,0.55)]">
      <Link
        to="/machine/$id"
        params={{ id: machine.id }}
        className="relative block aspect-[4/3] overflow-hidden bg-secondary"
      >
        <img
          src={machine.image}
          alt={`${machine.brand} ${machine.title}`}
          loading="lazy"
          width={800}
          height={600}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-2 top-2 flex gap-1.5">
          {featured && (
            <span className="rounded-md bg-signal px-2 py-1 text-[10px] font-black uppercase tracking-wider text-signal-foreground">
              Промо
            </span>
          )}
          <span
            className={`rounded-md border border-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm ${
              machine.condition === "Нова"
                ? "bg-badge-new/90"
                : "bg-badge-used/90"
            }`}
          >
            {machine.condition}
          </span>
        </div>
      </Link>

      <div className="absolute right-2 top-2 flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Сравни"
          className="grid size-8 place-items-center rounded-full bg-surface/90 text-foreground/60 backdrop-blur transition-colors hover:bg-signal hover:text-ink"
        >
          <GitCompare className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Запази обявата"
          className="grid size-8 place-items-center rounded-full bg-surface/90 text-foreground/60 backdrop-blur transition-colors hover:bg-signal hover:text-ink"
        >
          <Heart className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <Link to="/machine/$id" params={{ id: machine.id }} className="min-h-[44px]">
          <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/70">{machine.brand}</p>
          <h3 className="text-base font-bold leading-snug text-foreground hover:underline">{machine.title}</h3>
        </Link>

        <p className="mt-2 text-[11px] text-foreground/55">
          Категория:{" "}
          <span className="font-bold text-foreground underline underline-offset-2">
            {machine.subcategory ?? machine.category}
          </span>
        </p>

        <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-foreground/70">
          {machine.model && (
            <li className="inline-flex items-center gap-1 font-bold text-foreground">
              <Tag className="size-3" /> {machine.model}
            </li>
          )}
          <li className="inline-flex items-center gap-1">
            <Calendar className="size-3" /> {machine.year}
          </li>
          <li className="inline-flex items-center gap-1">
            <Clock className="size-3" /> {machine.hours.toLocaleString("bg-BG")} мч
          </li>
          <li className="inline-flex items-center gap-1">
            <Weight className="size-3" /> {machine.weightT} т
          </li>
        </ul>

        <div className="mt-3 flex items-end justify-between gap-2 border-t border-border pt-3">
          <div>
            <span className="block text-[10px] uppercase tracking-widest text-foreground/60">Цена</span>
            <span className="text-base font-extrabold tracking-tight text-foreground">{formatPrice(machine.price)}</span>
          </div>
          <Link
            to="/machine/$id"
            params={{ id: machine.id }}
            className="rounded-lg bg-ink px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-ink-foreground transition-colors hover:bg-signal hover:text-signal-foreground"
          >
            Запитване
          </Link>
        </div>

      </div>
    </div>
  );
}
