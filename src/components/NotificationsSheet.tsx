/**
 * NotificationsSheet
 *
 * Unified personal notification feed. Opens from the bell icon in the app header.
 *
 * Data sources (real Supabase queries):
 *  - family_invites   → someone used your invite link to join
 *  - family_members   → someone new joined a hub you belong to
 *  - hub_moments      → recent hub moments (care touchpoints) in your hubs
 *  - support_requests → support requests raised in your hubs
 *
 * Read state is persisted in localStorage keyed by notification ID so the
 * unread count badge is accurate across page refreshes.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import {
  Bell,
  UserPlus,
  Heart,
  HandHeart,
  MessageCircle,
  Check,
  Activity,
  Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Notification = {
  id: string;
  kind:
    | "invite_accepted"
    | "member_joined"
    | "hub_moment"
    | "support_request"
    | "hub_event";
  title: string;
  body: string;
  createdAt: Date;
  hubName?: string;
  read: boolean;
};

const STORAGE_KEY = "lk_read_notification_ids";

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function markRead(ids: string[]) {
  try {
    const existing = getReadIds();
    ids.forEach((id) => existing.add(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing]));
  } catch {
    /* ignore storage errors */
  }
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 2) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const kindIcon: Record<Notification["kind"], typeof Bell> = {
  invite_accepted: UserPlus,
  member_joined: UserPlus,
  hub_moment: Activity,
  support_request: HandHeart,
  hub_event: Sparkles,
};

const kindColor: Record<Notification["kind"], string> = {
  invite_accepted: "bg-health-green/15 text-health-green",
  member_joined: "bg-primary/10 text-primary",
  hub_moment: "bg-health-blue/15 text-health-blue",
  support_request: "bg-health-red/15 text-health-red",
  hub_event: "bg-health-purple/15 text-health-purple",
};

// ─── Data fetching ─────────────────────────────────────────────────────────

async function fetchNotifications(userId: string): Promise<Notification[]> {
  const readIds = getReadIds();
  const results: Notification[] = [];

  // 1. family_invites — used_at not null = someone accepted my invite
  const { data: invites } = await supabase
    .from("family_invites")
    .select("id, created_at, used_at, family_id, families(name)")
    .eq("created_by", userId)
    .not("used_at", "is", null)
    .order("used_at", { ascending: false })
    .limit(20);

  if (invites) {
    for (const inv of invites) {
      const id = `invite_accepted_${inv.id}`;
      const familyName = (inv as { families?: { name?: string } | null })
        ?.families?.name ?? "your hub";
      results.push({
        id,
        kind: "invite_accepted",
        title: "Invite accepted",
        body: `Someone joined ${familyName} via your invite link.`,
        createdAt: new Date(inv.used_at as string),
        hubName: familyName,
        read: readIds.has(id),
      });
    }
  }

  // 2. family_members — people who joined hubs you're in (excluding yourself)
  //    Fetch hub IDs first, then recent members
  const { data: myMemberships } = await supabase
    .from("family_members")
    .select("family_id, families(name)")
    .eq("user_id", userId);

  if (myMemberships && myMemberships.length > 0) {
    const hubIds = myMemberships.map((m) => m.family_id).filter(Boolean) as string[];
    const hubNameMap = new Map<string, string>();
    for (const m of myMemberships) {
      const f = (m as { families?: { name?: string; id?: string } | null }).families;
      if (f?.name && m.family_id) hubNameMap.set(m.family_id, f.name);
    }

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: newMembers } = await supabase
      .from("family_members")
      .select("user_id, family_id, role_label, joined_at, profiles(full_name, avatar_url)")
      .in("family_id", hubIds)
      .neq("user_id", userId)
      .gte("joined_at", since)
      .order("joined_at", { ascending: false })
      .limit(20);

    if (newMembers) {
      for (const member of newMembers) {
        // Synthetic ID from composite key
        const id = `member_joined_${member.family_id}_${member.user_id}`;
        const hubName = hubNameMap.get(member.family_id ?? "") ?? "your hub";
        const profileName =
          (member as { profiles?: { full_name?: string } | null })?.profiles
            ?.full_name ?? "Someone";
        results.push({
          id,
          kind: "member_joined",
          title: "New member",
          body: `${profileName} joined ${hubName}.`,
          createdAt: new Date(member.joined_at),
          hubName,
          read: readIds.has(id),
        });
      }
    }

    // 3. hub_moments — recent moments in your hubs
    const { data: moments } = await supabase
      .from("hub_moments")
      .select(
        "id, contact_label, event_type, event_summary, created_at, family_id",
      )
      .in("family_id", hubIds)
      .order("created_at", { ascending: false })
      .limit(15);

    if (moments) {
      for (const moment of moments) {
        const id = `hub_moment_${moment.id}`;
        const hubName = hubNameMap.get(moment.family_id ?? "") ?? "your hub";
        const summary =
          moment.event_summary ||
          moment.event_type.replace(/_/g, " ");
        results.push({
          id,
          kind: "hub_moment",
          title: "Hub moment",
          body: `${moment.contact_label}: ${summary}`,
          createdAt: new Date(moment.created_at),
          hubName,
          read: readIds.has(id),
        });
      }
    }

    // 4. support_requests — support raised in your hubs
    const { data: requests } = await supabase
      .from("support_requests")
      .select("id, category, urgency, message, created_at, family_id")
      .in("family_id", hubIds)
      .neq("requester_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (requests) {
      for (const req of requests) {
        const id = `support_request_${req.id}`;
        const hubName = hubNameMap.get(req.family_id ?? "") ?? "your hub";
        const urgencyLabel =
          req.urgency === "high"
            ? "urgent"
            : req.urgency === "medium"
              ? "moderate"
              : "gentle";
        results.push({
          id,
          kind: "support_request",
          title: "Support signal",
          body: `${urgencyLabel} ${req.category} request in ${hubName}.`,
          createdAt: new Date(req.created_at),
          hubName,
          read: readIds.has(id),
        });
      }
    }
  }

  // Sort newest first
  return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// ─── NotificationRow ──────────────────────────────────────────────────────────

function NotificationRow({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) {
  const Icon = kindIcon[notification.kind];
  const colorClass = kindColor[notification.kind];

  return (
    <button
      type="button"
      onClick={() => onRead(notification.id)}
      className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        notification.read ? "opacity-60" : ""
      }`}
    >
      {/* Icon badge */}
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
      >
        <Icon className="h-4 w-4" />
      </span>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium leading-snug">
            {notification.title}
          </span>
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {relativeTime(notification.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground line-clamp-2">
          {notification.body}
        </p>
        {notification.hubName && (
          <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {notification.hubName}
          </span>
        )}
      </div>

      {/* Unread dot */}
      {!notification.read && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}

// ─── NotificationsSheet ───────────────────────────────────────────────────────

export function NotificationsSheet({
  open,
  onOpenChange,
  userId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch on open
  useEffect(() => {
    if (!open || !userId) return;
    setLoading(true);
    fetchNotifications(userId)
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, [open, userId]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const markOneRead = (id: string) => {
    markRead([id]);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    const ids = notifications.map((n) => n.id);
    markRead(ids);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full max-w-sm flex-col gap-0 p-0 pb-safe"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Bell className="h-4 w-4 text-primary" />
              </span>
              <div>
                <SheetTitle className="text-base leading-tight">
                  Notifications
                </SheetTitle>
                <SheetDescription className="text-[11px]">
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : "All caught up"}
                </SheetDescription>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>
        </SheetHeader>

        {/* List */}
        <ScrollArea className="flex-1 px-2 py-2">
          {loading ? (
            <div className="flex flex-col gap-2 px-3 py-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-2xl bg-muted/40 p-3 animate-pulse"
                >
                  <div className="h-8 w-8 shrink-0 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 rounded-full bg-muted" />
                    <div className="h-2.5 w-3/4 rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Heart className="h-7 w-7 text-primary" fill="currentColor" strokeWidth={1.5} />
              </span>
              <p className="text-sm font-medium">Nothing yet</p>
              <p className="text-xs text-muted-foreground">
                Hub activity, support signals and new members will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {notifications.map((n) => (
                <NotificationRow key={n.id} notification={n} onRead={markOneRead} />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer note */}
        <div className="border-t border-border px-5 py-3">
          <p className="text-center text-[10px] text-muted-foreground">
            Notifications are private to you · real-time updates coming soon
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── useUnreadCount ────────────────────────────────────────────────────────────
/**
 * Hook used by the bell icon to compute the unread badge count without
 * opening the sheet. Re-fetches on mount (silent background fetch).
 */
export function useUnreadCount(userId: string | undefined): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    fetchNotifications(userId).then((notifications) => {
      setCount(notifications.filter((n) => !n.read).length);
    });
  }, [userId]);

  return count;
}
