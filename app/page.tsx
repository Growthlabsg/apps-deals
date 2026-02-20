"use client";

import { Suspense } from "react";
import { StoreHome } from "@/components/store-home";

export default function StorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StoreHome />
    </Suspense>
  );
}
