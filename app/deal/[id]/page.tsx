"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Copy, Share2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStoreData } from "@/context/store-data-context";
import { toast } from "sonner";
import { getDealTypeLabel, DEAL_TYPE_BADGE_CLASS } from "@/lib/deal-types";
import type { DealType } from "@/types/store";

const REDEMPTION_STEPS = [
  "Sign up or log in to the product",
  "Enter coupon code at checkout",
  "Verify your GrowthLab membership if required",
  "Credits or discount applied within 24 hours",
];

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { deals } = useStoreData();
  const deal = deals.find((d) => d.id === params.id);
  const [eligibility, setEligibility] = useState({
    isStartup: false,
    isMember: false,
    acceptTerms: false,
  });
  const [claimed, setClaimed] = useState(false);
  const [claimCode, setClaimCode] = useState(deal?.couponCode ?? "GROWTH50");

  if (!deal) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Deal not found.</p>
        <Link href="/" className="ml-2 text-primary hover:underline">Back home</Link>
      </div>
    );
  }

  const copyCoupon = () => {
    navigator.clipboard.writeText(deal.couponCode || claimCode || "");
    toast.success("Coupon copied!");
  };

  const canClaim =
    eligibility.isStartup && eligibility.isMember && eligibility.acceptTerms;

  const handleClaim = () => {
    if (!canClaim) {
      toast.error("Please confirm all eligibility requirements.");
      return;
    }
    setClaimed(true);
    setClaimCode(deal.couponCode || "GROWTH50");
    toast.success("Deal claimed! Check your email for details.");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-muted-foreground hover:text-primary"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="relative aspect-video w-full bg-muted">
            <Image
              src={deal.imageUrl}
              alt={deal.title}
              fill
              className="object-cover"
              sizes="800px"
            />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <Badge
                className={
                  deal.dealType
                    ? DEAL_TYPE_BADGE_CLASS[deal.dealType as DealType]
                    : "bg-amber-500 text-white border-0 dark:bg-amber-600"
                }
              >
                {deal.dealType ? getDealTypeLabel(deal.dealType as DealType) : "Deal"}
              </Badge>
              {deal.badges.includes("Limited time") && (
                <Badge className="bg-amber-500/90 text-white border-0">Limited time</Badge>
              )}
            </div>
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">{deal.title}</h1>
            <p className="mt-2 text-muted-foreground">{deal.description}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              from {deal.appName} • {deal.publisher.name}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="text-2xl font-bold text-primary">{deal.discount}</span>
              {deal.deadline && (
                <span className="text-sm text-muted-foreground">Valid until {new Date(deal.deadline).toLocaleDateString()}</span>
              )}
              {claimed && (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
                  <code className="text-sm font-mono font-semibold text-foreground">
                    {claimCode}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-primary"
                    onClick={copyCoupon}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {!claimed ? (
              <>
                <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Eligibility
                  </h3>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={eligibility.isStartup}
                        onChange={(e) =>
                          setEligibility((s) => ({ ...s, isStartup: e.target.checked }))
                        }
                        className="rounded border-input"
                      />
                      I am from an early-stage startup / company
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={eligibility.isMember}
                        onChange={(e) =>
                          setEligibility((s) => ({ ...s, isMember: e.target.checked }))
                        }
                        className="rounded border-input"
                      />
                      I am a GrowthLab community member
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={eligibility.acceptTerms}
                        onChange={(e) =>
                          setEligibility((s) => ({ ...s, acceptTerms: e.target.checked }))
                        }
                        className="rounded border-input"
                      />
                      I accept the deal terms and conditions
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button
                    className="flex-1 rounded-lg gs-gradient text-white hover:opacity-90"
                    onClick={handleClaim}
                    disabled={!canClaim}
                  >
                    Claim deal
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-6 rounded-lg border border-border bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-primary font-medium mb-2">
                    <CheckCircle className="h-5 w-5" />
                    Deal claimed
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use the code above at checkout. Redemption steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {REDEMPTION_STEPS.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={copyCoupon}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy code
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
