"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { App, Deal } from "@/types/store";
import { getApprovedApps, getApprovedDeals } from "@/lib/store-data";

type StoreDataContextValue = {
  apps: App[];
  deals: Deal[];
  refresh: () => void;
};

const StoreDataContext = createContext<StoreDataContextValue | null>(null);

export function StoreDataProvider({ children }: { children: React.ReactNode }) {
  const [apps, setApps] = useState<App[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  const load = useCallback(() => {
    setApps(getApprovedApps());
    setDeals(getApprovedDeals());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    setApps(getApprovedApps());
    setDeals(getApprovedDeals());
  }, []);

  const value: StoreDataContextValue = { apps, deals, refresh };

  return (
    <StoreDataContext.Provider value={value}>
      {children}
    </StoreDataContext.Provider>
  );
}

export function useStoreData(): StoreDataContextValue {
  const ctx = useContext(StoreDataContext);
  if (!ctx) {
    return {
      apps: getApprovedApps(),
      deals: getApprovedDeals(),
      refresh: () => {},
    };
  }
  return ctx;
}
