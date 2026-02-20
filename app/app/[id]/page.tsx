"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2, Heart, GitCompare, FlaskConical, Rocket, Target, CheckCircle, Star, Download, Building2, Info, ExternalLink, ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCompare } from "@/context/compare-context";
import { useStoreData } from "@/context/store-data-context";
import { cn } from "@/lib/utils";

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCompare, isInCompare, compareList, maxCompareItems } = useCompare();
  const { apps } = useStoreData();
  const app = apps.find((a) => a.id === params.id);
  const inCompare = app ? isInCompare(app.id) : false;
  const canAddCompare = app && (compareList.length < maxCompareItems || inCompare);
  const seekingAny =
    app?.seekingBetaTesters || app?.seekingPilotUsers || app?.seekingValidationUsers;
  const hasCrowdfunding = !!(app?.crowdfunding);
  const crowdfunding = app?.crowdfunding;
  const fundedPercent = crowdfunding
    ? Math.min(100, Math.round((crowdfunding.raised / crowdfunding.goalAmount) * 100))
    : 0;

  /** Default labels per distribution type */
  const distributionLabel: Record<string, string> = {
    "app-store": "App Store",
    "play-store": "Google Play",
    "web": "Web app",
    "huawei": "Huawei AppGallery",
    "direct": "Download",
    "other": "Get app",
  };
  /** Download/get-app options from distributionOptions or legacy URLs */
  const getAppOptions = (a: typeof app) => {
    if (!a) return [];
    if (a.distributionOptions && a.distributionOptions.length > 0) {
      return a.distributionOptions.map((opt) => ({
        href: opt.url,
        label: opt.label ?? distributionLabel[opt.type] ?? "Get app",
      }));
    }
    const opts: { href: string; label: string }[] = [];
    if (a.appStoreUrl) opts.push({ href: a.appStoreUrl, label: "App Store" });
    if (a.playStoreUrl) opts.push({ href: a.playStoreUrl, label: "Google Play" });
    if (a.directDownloadUrl) opts.push({ href: a.directDownloadUrl, label: a.directDownloadLabel || "Download" });
    if (opts.length === 0 && (a.website || a.publisher.website)) {
      opts.push({ href: a.website || a.publisher.website || "#", label: "Get app" });
    }
    return opts;
  };
  const appOptions = app ? getAppOptions(app) : [];

  /** Returns embed URL for YouTube/Vimeo, or null for direct video (use <video> tag). */
  function getVideoEmbed(url: string): { type: "iframe"; src: string } | { type: "video"; src: string } | null {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
        return { type: "iframe", src: `https://www.youtube.com/embed/${u.searchParams.get("v")}` };
      }
      if (u.hostname === "youtu.be" && u.pathname.slice(1)) {
        return { type: "iframe", src: `https://www.youtube.com/embed/${u.pathname.slice(1)}` };
      }
      if (u.hostname.includes("vimeo.com")) {
        const id = u.pathname.replace(/^\//, "").split("/")[0];
        if (id) return { type: "iframe", src: `https://player.vimeo.com/video/${id}` };
      }
      if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) return { type: "video", src: url };
    } catch {}
    return null;
  }

  if (!app) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">App not found.</p>
        <Link href="/" className="ml-2 text-primary hover:underline">Back home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-3 sm:px-4 py-6 sm:py-8">
        <Button
          variant="ghost"
          className="mb-6 min-h-[44px] touch-manipulation text-muted-foreground hover:text-primary -ml-1"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Hero: screenshot + logo + status */}
        <div className="relative mb-8 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="relative aspect-video w-full bg-muted">
            <Image
              src={app.imageUrl}
              alt={app.name}
              fill
              className="object-cover"
              sizes="900px"
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-lg border-2 border-white bg-white shadow-md overflow-hidden">
                <Image src={app.imageUrl} alt="" width={56} height={56} className="object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white drop-shadow-md">{app.name}</h1>
                <p className="text-sm text-white/90">{app.publisher.name}</p>
              </div>
            </div>
            {(app.appType === "beta" || app.appType === "pilot" || app.appType === "validation") && seekingAny && (
              <Badge className="bg-amber-500 text-white border-0">
                {app.appType === "beta" && "Seeking beta testers"}
                {app.appType === "pilot" && "Pilot program open"}
                {app.appType === "validation" && "Seeking validation"}
              </Badge>
            )}
            {hasCrowdfunding && crowdfunding && (
              <Badge className="gs-gradient text-white border-0">
                {fundedPercent}% funded • {crowdfunding.daysLeft} days left
              </Badge>
            )}
          </div>
        </div>

        {/* App type, trial, pricing, rating, downloads + Get app */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex flex-wrap items-center gap-4">
            {app.appType && (
              <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                {app.appType.charAt(0).toUpperCase() + app.appType.slice(1)}
              </span>
            )}
            {app.trialPeriod && (
              <span className="text-muted-foreground">Trial: {app.trialPeriod}</span>
            )}
            {app.pricing && (
              <span className="text-muted-foreground">Pricing: {app.pricing}</span>
            )}
            {app.rating != null && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {app.rating}
                {app.ratingCount != null && (
                  <span className="text-muted-foreground/80">({app.ratingCount})</span>
                )}
              </span>
            )}
            {(app.downloads != null || app.usersCount != null) && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Download className="h-4 w-4" />
                {(app.downloads ?? app.usersCount ?? 0).toLocaleString()} downloads
              </span>
            )}
          </div>
          {!hasCrowdfunding && appOptions.length > 0 && (
            <div className="shrink-0 flex flex-wrap items-center gap-2">
              {appOptions.map((opt) => (
                <a
                  key={opt.label}
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg gs-gradient text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Download className="mr-1.5 h-4 w-4" />
                  {opt.label}
                </a>
              ))}
            </div>
          )}
          {hasCrowdfunding && (
            <Button size="sm" className="shrink-0 rounded-lg gs-gradient text-white px-5">
              Back This App
            </Button>
          )}
        </div>

        {/* About this app: description, screenshots, videos */}
        <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            About this app
          </h2>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
            <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
              {app.longDescription || app.description || "No description provided."}
            </div>
            {app.features && app.features.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Key features</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {app.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Screenshots */}
          {(app.screenshots && app.screenshots.length > 0) && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                Screenshots
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 scrollbar-thin">
                {app.screenshots.map((src, i) => (
                  <div
                    key={i}
                    className="relative shrink-0 w-[280px] sm:w-[320px] aspect-video rounded-lg overflow-hidden border border-border bg-muted"
                  >
                    <Image
                      src={src}
                      alt={`${app.name} screenshot ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {app.videos && app.videos.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Video className="h-4 w-4 text-primary" />
                Videos
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {app.videos.map((url, i) => {
                  const embed = getVideoEmbed(url);
                  if (!embed) return null;
                  if (embed.type === "iframe") {
                    return (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                        <iframe
                          src={embed.src}
                          title={`${app.name} video ${i + 1}`}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                      <video src={embed.src} controls className="w-full h-full object-contain" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Looking for testers / pilot / validation */}
        {seekingAny && (
          <div className="mb-8 rounded-lg border-2 border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Looking for participants
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              This app is actively recruiting early users. Join to get free access and shape the product.
            </p>
            <div className="space-y-3 mb-4">
              {app.seekingBetaTesters && app.launchInfo && (
                <div className="flex items-center justify-between rounded-lg bg-card border border-border p-3">
                  <span className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-primary" />
                    Beta testers: {app.launchInfo.betaUsers ?? 0} / {app.launchInfo.maxBetaUsers ?? "—"} spots
                  </span>
                  <Button size="sm" className="gs-gradient text-white rounded-full">
                    Join beta
                  </Button>
                </div>
              )}
              {app.seekingPilotUsers && app.launchInfo && (
                <div className="flex items-center justify-between rounded-lg bg-card border border-border p-3">
                  <span className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" />
                    Pilot: {app.launchInfo.pilotSlotsFilled ?? 0} / {app.launchInfo.pilotSlots ?? "—"} slots filled
                  </span>
                  <Button size="sm" className="gs-gradient text-white rounded-full">
                    Apply for pilot
                  </Button>
                </div>
              )}
              {app.seekingValidationUsers && app.launchInfo && (
                <div className="flex items-center justify-between rounded-lg bg-card border border-border p-3">
                  <span className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Validation: {app.launchInfo.progress ?? 0}% — {app.launchInfo.validationGoal ?? "Early adopters"}
                  </span>
                  <Button size="sm" className="gs-gradient text-white rounded-full">
                    Join validation
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Funding + reward tiers — only when app is also on crowdfunding platform */}
        {hasCrowdfunding && crowdfunding && (
          <>
            <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-foreground">${crowdfunding.raised.toLocaleString()} raised</span>
                <span className="text-muted-foreground">of ${crowdfunding.goalAmount.toLocaleString()} goal</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                  style={{ width: `${fundedPercent}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{crowdfunding.backers} backers</p>
            </div>
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Reward Tiers</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {crowdfunding.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className="rounded-lg border border-border bg-card p-4 shadow-sm"
                  >
                    <p className="font-semibold text-foreground">{tier.name}</p>
                    <p className="mt-1 text-2xl font-bold text-primary">{tier.price}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{tier.desc}</p>
                    <Button className="mt-4 w-full gs-gradient text-white hover:opacity-90 rounded-lg">
                      Back this tier
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Rating & reviews */}
        {(app.rating != null || (app.reviews && app.reviews.length > 0)) && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              Ratings & reviews
            </h2>
            {app.rating != null && (
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-foreground">{app.rating}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn("h-5 w-5", i <= Math.round(app.rating!) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")}
                    />
                  ))}
                </div>
                {app.ratingCount != null && (
                  <span className="text-sm text-muted-foreground">{app.ratingCount} reviews</span>
                )}
              </div>
            )}
            {app.reviews && app.reviews.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-border">
                {app.reviews.map((r) => (
                  <div key={r.id} className="py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground text-sm">{r.userName}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className={cn("h-3.5 w-3.5", i <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                        ))}
                      </div>
                      {r.verified && (
                        <span className="text-xs text-primary">Verified</span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">{r.date}</span>
                    </div>
                    {r.title && <p className="font-medium text-foreground text-sm">{r.title}</p>}
                    <p className="text-sm text-muted-foreground">{r.content}</p>
                    {r.helpful != null && r.helpful > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">{r.helpful} people found this helpful</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* What's new */}
        {app.whatsNew && app.whatsNew.length > 0 && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              What&apos;s new
            </h2>
            <div className="space-y-6">
              {app.whatsNew.map((entry, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-foreground">Version {entry.version}</span>
                    <span className="text-sm text-muted-foreground">{entry.date}</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {entry.notes.map((note, j) => (
                      <li key={j}>{note}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About the startup */}
        {(app.publisher.about || app.publisher.website) && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              About the developer
            </h2>
            {app.publisher.about && (
              <p className="text-muted-foreground mb-3">{app.publisher.about}</p>
            )}
            {app.publisher.website && (
              <a
                href={app.publisher.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Visit website <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}

        {/* App information */}
        {(app.size || (app.languages && app.languages.length > 0) || app.ageRating || app.inAppPurchase != null || app.version || app.lastUpdated || (app.platforms && app.platforms.length > 0) || app.copyright || app.privacyPolicyUrl || app.website || app.appStoreUrl || app.playStoreUrl || app.directDownloadUrl || (app.distributionOptions && app.distributionOptions.length > 0)) && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Information
            </h2>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              {app.size && <><dt className="text-muted-foreground">Size</dt><dd className="text-foreground">{app.size}</dd></>}
              {app.languages && app.languages.length > 0 && (
                <><dt className="text-muted-foreground">Language</dt><dd className="text-foreground">{app.languages.join(", ")}</dd></>
              )}
              {app.ageRating && <><dt className="text-muted-foreground">Age rating</dt><dd className="text-foreground">{app.ageRating}</dd></>}
              {app.inAppPurchase != null && (
                <><dt className="text-muted-foreground">In-app purchases</dt><dd className="text-foreground">{app.inAppPurchase ? "Yes" : "No"}</dd></>
              )}
              {app.version && <><dt className="text-muted-foreground">Version</dt><dd className="text-foreground">{app.version}</dd></>}
              {app.lastUpdated && <><dt className="text-muted-foreground">Last updated</dt><dd className="text-foreground">{app.lastUpdated}</dd></>}
              {app.platforms && app.platforms.length > 0 && (
                <><dt className="text-muted-foreground">Platforms</dt><dd className="text-foreground">{app.platforms.join(", ")}</dd></>
              )}
              {app.copyright && <><dt className="text-muted-foreground">Copyright</dt><dd className="text-foreground">{app.copyright}</dd></>}
              {app.privacyPolicyUrl && (
                <>
                  <dt className="text-muted-foreground">Privacy policy</dt>
                  <dd>
                    <a href={app.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      View <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </dd>
                </>
              )}
              {app.website && !app.publisher.website && (
                <>
                  <dt className="text-muted-foreground">Website</dt>
                  <dd>
                    <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      Visit <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </dd>
                </>
              )}
              {/* Distribution: from distributionOptions or legacy URLs */}
              {app.distributionOptions && app.distributionOptions.length > 0
                ? app.distributionOptions.map((opt, i) => (
                    <React.Fragment key={i}>
                      <dt className="text-muted-foreground">{opt.label ?? distributionLabel[opt.type] ?? opt.type}</dt>
                      <dd>
                        <a href={opt.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                          {opt.label ?? distributionLabel[opt.type] ?? "Get app"} <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </dd>
                    </React.Fragment>
                  ))
                : (
                  <>
                    {app.appStoreUrl && (
                      <>
                        <dt className="text-muted-foreground">App Store</dt>
                        <dd>
                          <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                            Get on App Store <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </dd>
                      </>
                    )}
                    {app.playStoreUrl && (
                      <>
                        <dt className="text-muted-foreground">Google Play</dt>
                        <dd>
                          <a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                            Get on Google Play <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </dd>
                      </>
                    )}
                    {app.directDownloadUrl && (
                      <>
                        <dt className="text-muted-foreground">Direct download</dt>
                        <dd>
                          <a href={app.directDownloadUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                            {app.directDownloadLabel || "Download"} <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </dd>
                      </>
                    )}
                  </>
                )}
            </dl>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-4">
          {hasCrowdfunding ? (
            <Button
              size="lg"
              className="rounded-xl gs-gradient text-white px-8 hover:opacity-90"
            >
              Back This App
            </Button>
          ) : appOptions.length > 0 ? (
            appOptions.map((opt) => (
              <a
                key={opt.label}
                href={opt.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl gs-gradient text-white px-8 py-3 text-base font-medium hover:opacity-90 transition-opacity"
              >
                <Download className="mr-2 h-5 w-5" />
                {opt.label}
              </a>
            ))
          ) : null}
          <Button variant="outline" size="lg" className="rounded-lg">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          {canAddCompare && (
            <Button
              variant="outline"
              size="lg"
              className="rounded-lg"
              onClick={() => addToCompare(app)}
            >
              <GitCompare className={cn("mr-2 h-4 w-4", inCompare && "text-primary")} />
              {inCompare ? "In compare" : "Add to compare"}
            </Button>
          )}
          <Button variant="ghost" size="icon" className="rounded-lg">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
