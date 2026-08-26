import { queryOptions } from "@tanstack/react-query";
import tifermecLogo from "@/assets/tifermec-logo.png.asset.json";

// Static brand logo map (logos are shared assets, not per-listing data).
export const brandLogos: Record<string, string> = {
  Eurocomach: tifermecLogo.url,
  Tifermec: tifermecLogo.url,
  Zoomlion: tifermecLogo.url,
};

export type DescriptionBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; rows: { label: string; value: string }[] }
  | { type: "faq"; items: { q: string; a: string }[] };

export type Machine = {
  id: string;
  title: string;
  brand: string;
  category: string;
  subcategory?: string;
  year: number;
  hours: number;
  weightT: number;
  powerHp: number;
  price: number | null;
  originalPrice?: number;
  location: string;
  condition: "Нова" | "Втора употреба";
  image: string;
  images?: string[];
  tags: string[];
  description: string;
  model?: string;
  catNo?: string;
  specs?: { label: string; value: string }[];
  equipment?: string[];
  longDescription?: string[];
  basicDescription?: string[];
  descriptionBlocks?: DescriptionBlock[];
  faq?: { q: string; a: string }[];
  featured?: boolean;
  leasing?: {
    provider: "tbi bank" | "UniCredit Consumer Financing" | "OTP Leasing";
    monthlyFrom: number;
    url: string;
    className: string;
  }[];
};

export const leasingOffers = (price: number) => [
  {
    provider: "tbi bank" as const,
    monthlyFrom: Math.round((price * 1.09) / 48),
    url: "https://tbibank.bg",
    className: "bg-gradient-to-r from-[#f07c1b] to-[#f9a03f]",
  },
  {
    provider: "UniCredit Consumer Financing" as const,
    monthlyFrom: Math.round((price * 1.08) / 60),
    url: "https://unicreditconsumerfinancing.bg",
    className: "bg-gradient-to-r from-[#a3132a] to-[#d92b3c]",
  },
  {
    provider: "OTP Leasing" as const,
    monthlyFrom: Math.round((price * 1.07) / 60),
    url: "https://otpleasing.bg",
    className: "bg-gradient-to-r from-[#0b7a5a] to-[#12a97b]",
  },
];

export const categories = [
  { slug: "bagri", name: "Багери", count: 130 },
  { slug: "kari", name: "Кари", count: 96 },
  { slug: "teleskopichni", name: "Телескопични товарачи", count: 54 },
  { slug: "cheln-tovarachi", name: "Челни товарачи", count: 61 },
  { slug: "kamioni", name: "Камиони", count: 73 },
  { slug: "selskostopanska", name: "Селскостопанска техника", count: 88 },
];

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "По договаряне";
  return `${new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(price)} €`;
}

// ---- DB row mapping ----
// Shape of a row coming back from the `machines` table (snake_case, jsonb parsed).
export type MachineRow = {
  id: string;
  title: string;
  brand: string;
  model: string | null;
  cat_no: string | null;
  category: string;
  subcategory: string | null;
  year: number | null;
  hours: number | null;
  weight_t: number | null;
  power_hp: number | null;
  price: number | null;
  original_price: number | null;
  location: string;
  condition: string;
  image: string;
  images: string[] | null;
  tags: string[] | null;
  description: string | null;
  specs: { label: string; value: string }[] | null;
  equipment: string[] | null;
  description_blocks: DescriptionBlock[] | null;
  faq: { q: string; a: string }[] | null;
  long_description: string[] | null;
  basic_description: string[] | null;
  featured: boolean | null;
  status: string | null;
};

export function rowToMachine(row: MachineRow): Machine {
  const m: Machine = {
    id: row.id,
    title: row.title,
    brand: row.brand,
    category: row.category,
    year: row.year ?? 0,
    hours: row.hours ?? 0,
    weightT: Number(row.weight_t ?? 0),
    powerHp: Number(row.power_hp ?? 0),
    price: row.price,
    location: row.location,
    condition: (row.condition === "Нова" ? "Нова" : "Втора употреба") as Machine["condition"],
    image: row.image,
    tags: row.tags ?? [],
    description: row.description ?? "",
    featured: row.featured ?? false,
  };
  if (row.subcategory) m.subcategory = row.subcategory;
  if (row.model) m.model = row.model;
  if (row.cat_no) m.catNo = row.cat_no;
  if (row.original_price != null) m.originalPrice = row.original_price;
  if (row.images) m.images = row.images;
  if (row.specs) m.specs = row.specs;
  if (row.equipment) m.equipment = row.equipment;
  if (row.description_blocks) m.descriptionBlocks = row.description_blocks;
  if (row.faq) m.faq = row.faq;
  if (row.long_description) m.longDescription = row.long_description;
  if (row.basic_description) m.basicDescription = row.basic_description;
  return m;
}

// ---- Query options (RPC over Supabase via server functions) ----
import { getMachines, getMachine } from "./machines.functions";

export const machinesListQuery = queryOptions({
  queryKey: ["machines"] as const,
  queryFn: () => getMachines(),
});

export const machineQuery = (id: string) =>
  queryOptions({
    queryKey: ["machines", id] as const,
    queryFn: () => getMachine({ data: { id } }),
  });
