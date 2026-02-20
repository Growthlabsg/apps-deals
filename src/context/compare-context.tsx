"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { App } from "@/types/store";

interface CompareContextType {
  compareList: App[];
  addToCompare: (app: App) => void;
  removeFromCompare: (appId: string) => void;
  clearCompare: () => void;
  isInCompare: (appId: string) => boolean;
  maxCompareItems: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<App[]>([]);
  const maxCompareItems = 4;

  const addToCompare = useCallback((app: App) => {
    setCompareList((prev) => {
      if (prev.length >= maxCompareItems || prev.some((a) => a.id === app.id)) return prev;
      return [...prev, app];
    });
  }, []);

  const removeFromCompare = useCallback((appId: string) => {
    setCompareList((prev) => prev.filter((app) => app.id !== appId));
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  const isInCompare = useCallback(
    (appId: string) => compareList.some((app) => app.id === appId),
    [compareList]
  );

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        maxCompareItems,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
}
