"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Search, Check, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockSubmissions } from "@/lib/marketplace-data";
import { getSubmissions, approveSubmission, rejectSubmission, setSubmissionNeedsRevision } from "@/lib/store-data";
import { useStoreData } from "@/context/store-data-context";
import type { SubmissionStatus } from "@/types/marketplace";

export default function ReviewPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<"app" | "deal" | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const { refresh: refreshStore } = useStoreData();
  const [submissions, setSubmissions] = useState<typeof mockSubmissions>(() =>
    getSubmissions(mockSubmissions)
  );

  useEffect(() => {
    setSubmissions(getSubmissions(mockSubmissions));
  }, []);

  const filtered = submissions.filter((s) => {
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.company.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && s.status !== statusFilter) return false;
    if (typeFilter && s.type !== typeFilter) return false;
    return true;
  });

  const selected = submissions.find((s) => s.id === selectedId);

  const updateStatus = (id: string, status: SubmissionStatus, notes: string) => {
    if (status === "approved") {
      setSubmissions((prev) => approveSubmission(id, prev));
      refreshStore();
    } else if (status === "rejected") {
      setSubmissions((prev) => rejectSubmission(id, prev, notes));
    } else if (status === "needs_revision") {
      setSubmissions((prev) => setSubmissionNeedsRevision(id, prev, notes));
    } else {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status, reviewNotes: notes || s.reviewNotes } : s
        )
      );
    }
    setSelectedId(null);
    setReviewNotes("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Review submissions</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Approve, reject, or request revision for app and deal submissions.
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | "")}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="">All status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="needs_revision">Needs revision</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "app" | "deal" | "")}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="">All types</option>
            <option value="app">App</option>
            <option value="deal">Deal</option>
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-2">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No submissions match filters.</p>
              </div>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full text-left rounded-xl border border-border bg-card p-4 transition-colors ${
                    selectedId === s.id ? "ring-2 ring-primary" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{s.title}</p>
                      <p className="text-sm text-muted-foreground">{s.company} • {s.type}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        s.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : s.status === "rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : s.status === "needs_revision"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4 h-fit">
            {selected ? (
              <>
                <h3 className="font-semibold mb-2">{selected.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{selected.company} • {selected.type}</p>
                <p className="text-sm text-muted-foreground mb-4">{selected.description}</p>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Review notes</label>
                  <textarea
                    value={reviewNotes || selected.reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add notes for submitter…"
                    className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="gs-gradient text-white"
                    onClick={() => updateStatus(selected.id, "approved", reviewNotes)}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={() => updateStatus(selected.id, "rejected", reviewNotes)}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(selected.id, "needs_revision", reviewNotes)}
                  >
                    <MessageSquare className="mr-1 h-4 w-4" />
                    Needs revision
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Select a submission to review.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
