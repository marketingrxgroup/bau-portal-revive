import { createContext, useContext, useState, type ReactNode } from "react";
import { SearchAssistantModal } from "@/components/site/SearchAssistantModal";

interface AssistantCtx {
  openAssistant: (query?: string) => void;
}

const Ctx = createContext<AssistantCtx>({ openAssistant: () => {} });

export function useAssistant() {
  return useContext(Ctx);
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const openAssistant = (q = "") => {
    setQuery(q);
    setOpen(true);
  };

  return (
    <Ctx.Provider value={{ openAssistant }}>
      {children}
      <SearchAssistantModal open={open} onClose={() => setOpen(false)} initialQuery={query} />
    </Ctx.Provider>
  );
}
