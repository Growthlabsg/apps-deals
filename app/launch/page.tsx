"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Check, Upload, DollarSign, FileCheck } from "lucide-react";
import { GoalReachedModal } from "@/components/goal-reached-modal";
import { cn } from "@/lib/utils";
import { addSubmission } from "@/lib/store-data";
import type { Submission } from "@/types/marketplace";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Basic Info", icon: FileCheck },
  { id: 2, title: "Media", icon: Upload },
  { id: 3, title: "Funding & Deals", icon: DollarSign },
  { id: 4, title: "Review & Publish", icon: Check },
];

export default function LaunchWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showGoalReached, setShowGoalReached] = useState(false);
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    category: "",
    oneLiner: "",
    goalAmount: "",
    duration: "",
    appType: "",
    seekingBetaTesters: false,
    seekingPilotUsers: false,
    seekingValidationUsers: false,
    pilotSlots: "",
    maxBetaUsers: "",
    contactEmail: "",
    honeypot: "",
    longDescription: "",
    screenshotUrls: "",
    videoUrls: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  const validateStep4 = (): string[] => {
    const err: string[] = [];
    if (!form.name.trim()) err.push("App name is required");
    else if (form.name.length < 2) err.push("App name must be at least 2 characters");
    if (!form.tagline.trim()) err.push("Tagline is required");
    if (!form.category.trim()) err.push("Category is required");
    if (!form.oneLiner.trim()) err.push("One-liner is required");
    else if (form.oneLiner.length < 10) err.push("One-liner must be at least 10 characters");
    if (!form.contactEmail.trim()) err.push("Contact email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.contactEmail)) err.push("Invalid email format");
    if (form.honeypot) err.push("Submission blocked. Please try again.");
    return err;
  };

  const next = () => {
    if (step < 4) setStep(step + 1);
    else {
      const errors = validateStep4();
      if (errors.length > 0) {
        toast.error("Please fix the following", { description: errors.join(", ") });
        return;
      }
      const id = `APP-${Date.now().toString(36).toUpperCase()}`;
      const sub: Submission = {
        id,
        type: "app",
        title: form.name,
        company: form.tagline,
        description: form.oneLiner,
        status: "pending",
        priority: "normal",
        submittedAt: new Date().toISOString(),
        submittedBy: form.name,
        submitterEmail: form.contactEmail,
        reviewNotes: "",
        data: {
          title: form.name,
          company: form.tagline,
          description: form.oneLiner,
          longDescription: form.longDescription.trim() || undefined,
          screenshots: form.screenshotUrls.trim() ? form.screenshotUrls.split(/\n|,/).map((u) => u.trim()).filter(Boolean) : undefined,
          videos: form.videoUrls.trim() ? form.videoUrls.split(/\n|,/).map((u) => u.trim()).filter(Boolean) : undefined,
          website: "",
          contactEmail: form.contactEmail,
          contactPhone: "",
          type: form.appType || "trial",
          category: form.category,
          trialPeriod: form.seekingPilotUsers ? `${form.pilotSlots || "—"} pilot slots` : "",
          pricing: "",
          targetAudience: "",
          keyFeatures: "",
          termsAccepted: true,
          privacyAccepted: true,
        },
      };
      addSubmission(sub);
      setSubmissionId(id);
      setSubmitted(true);
    }
  };
  const prev = () => setStep(Math.max(1, step - 1));

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="rounded-2xl border border-border bg-card p-8 max-w-md text-center">
          <p className="font-semibold text-primary mb-2">App submitted for review</p>
          <p className="text-sm text-muted-foreground mb-2">
            Reference: <code className="rounded bg-muted px-1.5 py-0.5">{submissionId}</code>
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            GrowthLab will review your app in 24–48 hours. Your app will go live only after approval.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/?tab=submit">
              <Button className="gs-gradient text-white">Back to Submit</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Store</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Store
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-8">Launch Your App</h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar progress */}
          <aside className="w-full shrink-0 lg:w-56">
            <nav className="space-y-1">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    step >= s.id ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}
                >
                  <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", step > s.id ? "bg-primary text-primary-foreground" : step === s.id ? "gs-gradient text-white" : "bg-muted")}>
                    {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                  </span>
                  {s.title}
                </div>
              ))}
            </nav>
          </aside>

          {/* Step content */}
          <div className="flex-1 rounded-lg border border-border bg-card p-6 shadow-sm">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Basic Info</h2>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">App name</label>
                  <Input className="rounded-lg" placeholder="e.g. My SaaS" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Tagline</label>
                  <Input className="rounded-lg" placeholder="One line pitch" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Category</label>
                  <Input className="rounded-lg" placeholder="e.g. Productivity" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">One-liner</label>
                  <Input className="rounded-lg" placeholder="Short description" value={form.oneLiner} onChange={(e) => setForm({ ...form, oneLiner: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Contact email *</label>
                  <Input type="email" className="rounded-lg" placeholder="you@company.com" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
                </div>
                <div className="hidden" aria-hidden>
                  <Input tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Program type</label>
                  <select
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={form.appType}
                    onChange={(e) => setForm({ ...form, appType: e.target.value })}
                  >
                    <option value="">Select type</option>
                    <option value="trial">Trial</option>
                    <option value="beta">Beta</option>
                    <option value="pilot">Pilot</option>
                    <option value="validation">Validation</option>
                    <option value="free">Free</option>
                    <option value="demo">Demo</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Are you looking for early users?</p>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.seekingBetaTesters}
                      onChange={(e) => setForm({ ...form, seekingBetaTesters: e.target.checked })}
                      className="rounded border-input"
                    />
                    Seeking beta testers
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.seekingPilotUsers}
                      onChange={(e) => setForm({ ...form, seekingPilotUsers: e.target.checked })}
                      className="rounded border-input"
                    />
                    Seeking pilot users
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.seekingValidationUsers}
                      onChange={(e) => setForm({ ...form, seekingValidationUsers: e.target.checked })}
                      className="rounded border-input"
                    />
                    Seeking validation participants
                  </label>
                  {(form.seekingBetaTesters || form.seekingPilotUsers) && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {form.seekingPilotUsers && (
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Pilot slots (total)</label>
                          <Input
                            type="number"
                            placeholder="e.g. 50"
                            value={form.pilotSlots}
                            onChange={(e) => setForm({ ...form, pilotSlots: e.target.value })}
                            className="rounded-lg h-9"
                          />
                        </div>
                      )}
                      {form.seekingBetaTesters && (
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Max beta users</label>
                          <Input
                            type="number"
                            placeholder="e.g. 1000"
                            value={form.maxBetaUsers}
                            onChange={(e) => setForm({ ...form, maxBetaUsers: e.target.value })}
                            className="rounded-lg h-9"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Media & description</h2>
                <p className="text-sm text-muted-foreground">Add a full description, screenshot URLs, and video URLs for your app listing.</p>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Full description (optional)</label>
                  <textarea
                    className="w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Detailed description of your app. Supports multiple paragraphs."
                    value={form.longDescription}
                    onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Screenshot URLs (optional)</label>
                  <textarea
                    className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-xs"
                    placeholder="One URL per line or comma-separated. Use direct image links."
                    value={form.screenshotUrls}
                    onChange={(e) => setForm({ ...form, screenshotUrls: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Video URLs (optional)</label>
                  <textarea
                    className="w-full min-h-[60px] rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-xs"
                    placeholder="YouTube, Vimeo, or direct .mp4 URLs. One per line or comma-separated."
                    value={form.videoUrls}
                    onChange={(e) => setForm({ ...form, videoUrls: e.target.value })}
                  />
                </div>
                <div className="rounded-lg border-2 border-dashed border-input p-8 text-center">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-xs text-muted-foreground">Upload assets elsewhere and paste URLs above, or use your CDN.</p>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Funding & Deals</h2>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Funding goal ($)</label>
                  <Input type="number" className="rounded-lg" placeholder="25000" value={form.goalAmount} onChange={(e) => setForm({ ...form, goalAmount: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Campaign duration (days)</label>
                  <Input className="rounded-lg" placeholder="30" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                </div>
                <p className="text-sm text-muted-foreground">Add reward tiers (Early Bird, Pro, Team, Lifetime Deal) in the next screen.</p>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Review & Publish</h2>
                <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {form.name || "—"}</p>
                  <p><span className="text-muted-foreground">Tagline:</span> {form.tagline || "—"}</p>
                  <p><span className="text-muted-foreground">Category:</span> {form.category || "—"}</p>
                  <p><span className="text-muted-foreground">Program type:</span> {form.appType ? form.appType.charAt(0).toUpperCase() + form.appType.slice(1) : "—"}</p>
                  {(form.seekingBetaTesters || form.seekingPilotUsers || form.seekingValidationUsers) && (
                    <p><span className="text-muted-foreground">Looking for:</span>{" "}
                      {[form.seekingBetaTesters && "Beta testers", form.seekingPilotUsers && "Pilot users", form.seekingValidationUsers && "Validation"].filter(Boolean).join(", ")}
                      {form.pilotSlots && ` (${form.pilotSlots} pilot slots)`}
                      {form.maxBetaUsers && ` (${form.maxBetaUsers} beta users)`}
                    </p>
                  )}
                  <p><span className="text-muted-foreground">Goal:</span> ${form.goalAmount || "—"}</p>
                </div>
                <Button className="w-full rounded-lg gs-gradient text-white hover:opacity-90" onClick={next}>
                  Submit for Review
                </Button>
              </div>
            )}

            {step < 4 && (
              <div className="mt-8 flex justify-between">
                <Button variant="outline" className="rounded-lg border-[#E2E8F0]" onClick={prev} disabled={step === 1}>
                  Previous
                </Button>
                <Button className="rounded-lg gs-gradient text-white hover:opacity-90" onClick={next}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <GoalReachedModal open={showGoalReached} onClose={() => { setShowGoalReached(false); router.push("/my-launches"); }} raised={25000} backers={127} />
    </div>
  );
}
