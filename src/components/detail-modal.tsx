"use client";

import Image from "next/image";
import type { App, Deal } from "@/types/store";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Tag, ExternalLink } from "lucide-react";

interface DetailModalProps {
  item: App | Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailModal({ item, open, onOpenChange }: DetailModalProps) {
  if (!item) return null;

  const isApp = item.type === "app";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md sm:max-w-lg">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-muted -mt-6 -mx-6 mb-4">
          <Image
            src={item.imageUrl}
            alt={isApp ? item.name : item.title}
            fill
            className="object-cover"
            sizes="600px"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1">
            {item.badges.map((b) => (
              <Badge
                key={b}
                variant={b === "Deal" || b === "Limited time" ? "deal" : "default"}
              >
                {b}
              </Badge>
            ))}
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isApp ? item.name : item.title}
          </DialogTitle>
          {!isApp && (
            <p className="text-sm text-muted-foreground">from {(item as Deal).appName}</p>
          )}
          <p className="text-sm text-muted-foreground">
            by {item.publisher.name}
            {item.publisher.verified && (
              <span className="ml-1 text-[#0F7377] dark:text-teal-400">✓</span>
            )}
          </p>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <div className="flex gap-4 rounded-xl bg-muted/50 p-4">
          {isApp ? (
            <>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
                <span className="text-sm font-medium">{(item as App).usersCount} users</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
                <span className="text-sm font-medium">{(item as App).dealsCount} deals</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-[#0F7377] dark:text-teal-400" />
              <span className="text-sm font-medium">{(item as Deal).discount}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="gs-gradient">
            {isApp ? "View app" : "Get deal"}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
