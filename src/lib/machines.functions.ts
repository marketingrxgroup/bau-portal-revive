import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { rowToMachine, type Machine, type MachineRow } from "./machines";

// Columns shared by list + single fetches.
const MACHINE_COLUMNS =
  "id,title,brand,model,cat_no,category,subcategory,year,hours,weight_t,power_hp,price,original_price,location,condition,image,images,tags,description,specs,equipment,description_blocks,faq,long_description,basic_description,featured,status";

// Public catalog: all published machines, featured first, newest first.
export const getMachines = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase
    .from("machines")
    .select(MACHINE_COLUMNS)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Неуспешно зареждане на машини: ${error.message}`);
  return (data ?? []).map((r) => rowToMachine(r as unknown as MachineRow)) as Machine[];
});

// Single published machine by id (null when missing/unpublished).
export const getMachine = createServerFn({ method: "GET" })
  .validator((d) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabase
      .from("machines")
      .select(MACHINE_COLUMNS)
      .eq("id", data.id)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw new Error(`Неуспешно зареждане на машина: ${error.message}`);
    if (!row) return null;
    return rowToMachine(row as unknown as MachineRow) as Machine | null;
  });
