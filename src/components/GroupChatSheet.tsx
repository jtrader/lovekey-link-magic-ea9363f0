/**
 * GroupChatSheet
 *
 * Side-panel group chat for a hub. Opens when the central Love Key Heart is clicked.
 * Messages are stored locally for now (real-time persistence comes later via Supabase Realtime).
 */
import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Send, Smile } from "lucide-react";
import { type HubType, getHubType } from "@/lib/lovekey-model";

type Member = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string | null;
  body: string;
  sentAt: Date;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Starter messages tailored by hub category
const STARTER_MESSAGES: Record<string, string[]> = {
  Family: [
    "Hey everyone 👋",
    "Anyone home for dinner tonight?",
    "Reminder: school pickup at 3:15 today.",
  ],
  Community: [
    "Welcome to the group chat! 👋",
    "Next session details are pinned above.",
    "Let us know if you can make it this week.",
  ],
  Work: [
    "Good morning team 👋",
    "Stand-up at 9:30 — see you there.",
    "Updates in the channel above.",
  ],
  Recovery: [
    "Safe space here — always. 💙",
    "Checking in — how is everyone doing?",
  ],
};

function getStarters(hubType: HubType): string[] {
  const { category } = getHubType(hubType);
  return STARTER_MESSAGES[category] ?? STARTER_MESSAGES["Family"];
}

// ─── Avatar bubble ────────────────────────────────────────────────────────────

function AvatarBubble({
  name,
  avatarUrl,
  size = "sm",
}: {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "h-9 w-9 text-sm" : "h-7 w-7 text-[11px]";
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary ring-2 ring-background ${dim}`}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  isSelf,
}: {
  message: Message;
  isSelf: boolean;
}) {
  return (
    <div className={`flex items-end gap-2 ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
      {!isSelf && (
        <AvatarBubble name={message.senderName} avatarUrl={message.senderAvatar} />
      )}
      <div className={`max-w-[75%] ${isSelf ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
        {!isSelf && (
          <span className="ml-1 text-[10px] font-medium text-muted-foreground">
            {message.senderName}
          </span>
        )}
        <div
          className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
            isSelf
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm bg-card ring-1 ring-border"
          }`}
        >
          {message.body}
        </div>
        <span className="mx-1 text-[10px] text-muted-foreground">{formatTime(message.sentAt)}</span>
      </div>
    </div>
  );
}

// ─── GroupChatSheet ───────────────────────────────────────────────────────────

export function GroupChatSheet({
  open,
  onOpenChange,
  hubName,
  hubType,
  currentUser,
  members,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hubName: string;
  hubType?: HubType;
  currentUser: Member;
  members: Member[];
}) {
  const resolvedHubType = hubType ?? "immediate_family";
  const starters = getStarters(resolvedHubType);

  // Seed starter messages from the hub type on first open
  const [messages, setMessages] = useState<Message[]>(() =>
    starters.map((body, i) => ({
      id: `starter-${i}`,
      senderId: "system",
      senderName: hubName,
      senderAvatar: null,
      body,
      sentAt: new Date(Date.now() - (starters.length - i) * 60_000),
    }))
  );

  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change or sheet opens
  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [messages, open]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const sendMessage = () => {
    const body = draft.trim();
    if (!body) return;
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatarUrl,
        body,
        sentAt: new Date(),
      },
    ]);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Active members bar (exclude self, show up to 4)
  const otherMembers = members.filter((m) => m.id !== currentUser.id).slice(0, 4);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full max-w-md flex-col gap-0 p-0 pb-safe"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-soft-blue text-white shadow-sm">
              <Heart className="h-4 w-4" fill="currentColor" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <SheetTitle className="truncate text-base leading-tight">{hubName}</SheetTitle>
              <SheetDescription className="text-[11px]">Group chat</SheetDescription>
            </div>
          </div>

          {/* Member avatars row */}
          {otherMembers.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5">
              <div className="flex -space-x-2">
                {otherMembers.map((m) => (
                  <AvatarBubble key={m.id} name={m.name} avatarUrl={m.avatarUrl} size="sm" />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {otherMembers.length === 1
                  ? otherMembers[0].name
                  : `${otherMembers.length} members`}
              </span>
            </div>
          )}
        </SheetHeader>

        {/* Message list */}
        <ScrollArea className="flex-1 px-5 py-4">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isSelf={msg.senderId === currentUser.id}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="border-t border-border bg-background px-4 py-3">
          <div className="flex items-end gap-2">
            <AvatarBubble
              name={currentUser.name}
              avatarUrl={currentUser.avatarUrl}
              size="sm"
            />
            <div className="flex flex-1 items-end gap-2 rounded-2xl border border-input bg-background px-3 py-2 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Send a message…"
                rows={1}
                className="max-h-24 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!draft.trim()}
                aria-label="Send"
                className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Presence before messaging · messages stay private to this hub
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
