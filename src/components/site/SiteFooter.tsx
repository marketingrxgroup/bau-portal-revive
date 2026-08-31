import { Link } from "@tanstack/react-router";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";

const footerLink =
  "text-sm text-ink-foreground/70 transition-colors hover:text-ink-foreground";

const contacts = [
  { label: "Нови машини", phone: "0879 620 220", href: "0879620220", mail: "sales@bauportal.bg" },
  { label: "Втора употреба", phone: "0879 620 260", href: "0879620260", mail: "sales@bauportal.bg" },
  { label: "Рекламации", phone: "0879 670 700", href: "0879670700", mail: "complaint@bauportal.bg" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto max-w-[1480px] px-4 py-8 lg:py-16">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid size-8 place-items-center bg-signal font-black text-ink">
                B
              </span>
              <span className="text-base font-extrabold tracking-tight">
                BAUPORTAL
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-ink-foreground/60">
              Борса за строителна и складова техника — нови, употребявани и
              под наем.
            </p>
          </div>

          {/* Информация */}
          <div className="lg:col-span-2">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider sm:mb-5">
              Информация
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-1 sm:gap-3">
              <li><Link to="/" className={footerLink}>За нас</Link></li>
              <li><Link to="/" className={footerLink}>Екип</Link></li>
              <li><Link to="/" className={footerLink}>Стани партньор</Link></li>
              <li><Link to="/" className={footerLink}>Условия за ползване</Link></li>
              <li><Link to="/" className={footerLink}>Политика за поверителност</Link></li>
              <li><Link to="/" className={footerLink}>Контакти</Link></li>
              <li><Link to="/" className={footerLink}>Блог</Link></li>
            </ul>
          </div>

          {/* Направления */}
          <div className="lg:col-span-2">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider sm:mb-5">
              Направления
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/catalog" search={{ q: "" }} className={footerLink}>
                  Нови машини
                </Link>
              </li>
              <li>
                <Link to="/catalog" search={{ q: "" }} className={footerLink}>
                  Втора употреба
                </Link>
              </li>
              <li>
                <Link to="/catalog" search={{ q: "" }} className={footerLink}>
                  Прикачен инвентар
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакти */}
          <div className="lg:col-span-3">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider sm:mb-5">
              Контакти
            </h4>
            <div className="grid gap-4 sm:gap-6">
              {contacts.map((c) => (
                <div key={c.label} className="space-y-1.5 sm:space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-foreground/50 sm:text-xs">
                    {c.label}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:flex-col sm:items-start sm:gap-2">
                    <a
                      href={`tel:${c.href}`}
                      className="flex items-center gap-2 text-sm text-ink-foreground/70 hover:text-ink-foreground"
                    >
                      <Phone className="h-4 w-4" />
                      {c.phone}
                    </a>
                    <a
                      href={`mailto:${c.mail}`}
                      className="flex items-center gap-2 text-sm text-ink-foreground/70 hover:text-ink-foreground"
                    >
                      <Mail className="h-4 w-4" />
                      {c.mail}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter + Location */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-3">
            <div>
              <h4 className="mb-2 text-sm font-bold uppercase tracking-wider sm:mb-3">
                Бюлетин
              </h4>
              <p className="mb-3 text-sm text-ink-foreground/60 sm:mb-4">
                Бъдете в крак с нашите новини и промоции, като се абонирате за
                нашия бюлетин.
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Email..."
                  className="w-full rounded-sm border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/40"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-sm bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-white/90"
                >
                  Абонирай се
                </button>
              </form>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-bold uppercase tracking-wider sm:mb-3">
                Локация
              </h4>
              <div className="flex items-start gap-2 text-sm text-ink-foreground/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                гр. София, бул. Европа 564
              </div>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-ink-foreground/70 hover:text-ink-foreground sm:mt-4"
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 lg:mt-12">
          <p className="text-center text-xs text-ink-foreground/50">
            © {new Date().getFullYear()} Bauportal · Борса за строителна и
            складова техника
          </p>
        </div>
      </div>
    </footer>
  );
}
