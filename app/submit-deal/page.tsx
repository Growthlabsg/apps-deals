"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, ArrowLeft, Percent, Clock, Coins, Download, Gift, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addSubmission } from "@/lib/store-data";
import type { Submission } from "@/types/marketplace";
import { DEAL_TYPE_OPTIONS } from "@/lib/deal-types";
import type { DealType } from "@/types/store";

const DEAL_TYPE_ICONS: Record<DealType, typeof Percent> = {
  discount: Percent,
  free_trial: Clock,
  credits: Coins,
  free_download: Download,
  free: Gift,
  bundle: Gift,
  partnership: Handshake,
};

const DISPOSABLE_DOMAINS = ["tempmail", "throwaway", "guerrilla", "10minute", "mailinator", "fakeinbox", "trashmail"];
const SUSPICIOUS_WORDS = ["viagra", "casino", "crypto scam", "click here", "act now", "free money", "winner"];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function looksLikeSpam(text: string): boolean {
  const lower = text.toLowerCase();
  return SUSPICIOUS_WORDS.some((w) => lower.includes(w));
}

function validateDealForm(data: {
  title: string;
  company: string;
  description: string;
  contactEmail: string;
  type: string;
  value: string;
  deadline: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  website?: string;
  honeypot?: string;
}): string[] {
  const errors: string[] = [];
  if (data.honeypot) {
    errors.push("Submission blocked. Please try again.");
    return errors;
  }
  if (!data.title.trim()) errors.push("Deal title is required");
  else if (data.title.length < 3) errors.push("Deal title must be at least 3 characters");
  else if (data.title.length > 100) errors.push("Deal title must be under 100 characters");
  if (!data.company.trim()) errors.push("Company name is required");
  else if (data.company.length < 2) errors.push("Company name must be at least 2 characters");
  else if (data.company.length > 80) errors.push("Company name must be under 80 characters");
  if (!data.description.trim()) errors.push("Description is required");
  else if (data.description.length < 20) errors.push("Description must be at least 20 characters (help us verify the offer)");
  else if (data.description.length > 2000) errors.push("Description must be under 2000 characters");
  if (looksLikeSpam(data.title) || looksLikeSpam(data.description))
    errors.push("Content appears invalid. Please describe a genuine offer.");
  if (!data.contactEmail.trim()) errors.push("Contact email is required");
  else if (!isValidEmail(data.contactEmail)) errors.push("Invalid email format");
  else {
    const domain = data.contactEmail.split("@")[1]?.toLowerCase() ?? "";
    if (DISPOSABLE_DOMAINS.some((d) => domain.includes(d)))
      errors.push("Please use a business or permanent email address.");
  }
  if (!data.type) errors.push("Deal type is required");
  if (!data.value.trim()) errors.push("Offer value is required");
  if (!data.deadline.trim()) errors.push("Deadline is required");
  if (data.deadline && new Date(data.deadline) <= new Date())
    errors.push("Deadline must be in the future");
  if (data.website && !/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(data.website))
    errors.push("Website must be a valid URL (e.g. https://company.com)");
  if (!data.termsAccepted) errors.push("You must accept the Terms of Service");
  if (!data.privacyAccepted) errors.push("You must accept the Privacy Policy");
  return errors;
}

export default function SubmitDealPage() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [deadline, setDeadline] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [website, setWebsite] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateDealForm({
      title,
      company,
      description,
      contactEmail,
      type,
      value,
      deadline,
      termsAccepted,
      privacyAccepted,
      website: website || undefined,
      honeypot: honeypot || undefined,
    });
    if (errors.length > 0) {
      toast.error("Please fix the following errors", {
        description: errors.slice(0, 3).join(", ") + (errors.length > 3 ? ` and ${errors.length - 3} more` : ""),
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    const id = `DEAL-${Date.now().toString(36).toUpperCase()}`;
    const sub: Submission = {
      id,
      type: "deal",
      title,
      company,
      description,
      status: "pending",
      priority: "normal",
      submittedAt: new Date().toISOString(),
      submittedBy: company,
      submitterEmail: contactEmail,
      reviewNotes: "",
      data: {
        title,
        company,
        description,
        website: website || "",
        contactEmail,
        contactPhone: "",
        type: type as DealType,
        value,
        discount: value,
        deadline,
        location: "Global",
        category: "General",
        requirements: "",
        benefits: "",
        couponCode: couponCode.trim() || "",
        terms: "",
        termsAccepted,
        privacyAccepted,
      },
    };
    addSubmission(sub);
    setSubmissionId(id);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="rounded-2xl border border-border bg-card p-8 max-w-md text-center">
          <p className="font-semibold text-primary mb-2">Deal submitted</p>
          <p className="text-sm text-muted-foreground mb-2">
            Reference: <code className="rounded bg-muted px-1.5 py-0.5">{submissionId}</code>
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            GrowthLab will review your deal in 24–48 hours. It will go live only after approval.
          </p>
          <Link href="/?tab=deals">
            <Button className="gs-gradient text-white">Back to Deals</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link href="/?tab=submit">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mb-2">Submit a deal</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Offer discounts, free trials, free credits, free downloads, bundles, or more to the GrowthLab community. Review in 24–48 hours.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6">
          <div>
            <label className="block text-sm font-medium mb-2">Deal title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 50% off first year"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Company *</label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's the offer and how do users redeem it?"
              className="w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contact email *</label>
            <Input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Company website (optional)</label>
            <Input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Coupon code (optional)</label>
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="e.g. GROWTH50"
            />
          </div>
          <div className="hidden" aria-hidden>
            <label>Leave blank</label>
            <Input
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Deal type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEAL_TYPE_OPTIONS.map((opt) => {
                const Icon = DEAL_TYPE_ICONS[opt.value];
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors min-h-[44px] ${
                      type === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Offer value *</label>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={
                  DEAL_TYPE_OPTIONS.find((o) => o.value === type)?.placeholder ?? "e.g. 50% off or $50"
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Deadline *</label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="rounded border-input"
              />
              I accept the Terms of Service
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="rounded border-input"
              />
              I accept the Privacy Policy
            </label>
          </div>
          <Button type="submit" className="w-full gs-gradient text-white" disabled={isSubmitting}>
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Submitting…" : "Submit deal"}
          </Button>
        </form>
      </div>
    </div>
  );
}
