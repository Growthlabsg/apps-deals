"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rocket } from "lucide-react";

interface LaunchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (appId: string) => void;
}

export function LaunchModal({ open, onOpenChange, onSuccess }: LaunchModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onOpenChange(false);
      onSuccess("app-new");
      setName("");
      setDescription("");
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
            Launch app
          </DialogTitle>
          <DialogDescription>
            List your app on GrowthLab so other startups can discover and use it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium mb-1.5 block">
              App name
            </label>
            <Input
              id="name"
              placeholder="e.g. GrowthMetrics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="text-sm font-medium mb-1.5 block">
              Short description
            </label>
            <Input
              id="description"
              placeholder="What does your app do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gs-gradient" disabled={submitting}>
              {submitting ? "Launching…" : "Launch app"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
