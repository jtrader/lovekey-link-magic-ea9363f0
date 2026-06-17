import type { MoodRingState, PresenceState } from "@/lib/lovekey-model";

export type DemoAccount = {
  id: string;
  fullName: string;
  displayName: string;
  role: string;
  location: string;
  availability: PresenceState;
  mood: MoodRingState;
  wellbeing: "All good" | "Steady" | "Stretched" | "Need help";
  visibility: "Full hub" | "Summary only" | "Trusted contacts" | "Paused";
  next: string;
  lastMoment: string;
  privacyNote: string;
  color: string;
  avatarUrl: string;
};

export const demoAccounts: DemoAccount[] = [
  {
    id: "sarah",
    fullName: "Sarah Lee",
    displayName: "Sarah",
    role: "Mum",
    location: "At home",
    availability: "available",
    mood: "healthy",
    wellbeing: "All good",
    visibility: "Full hub",
    next: "Family dinner",
    lastMoment: "Shared an all-good check-in",
    privacyNote: "Calendar and presence visible. Wellbeing detail stays private.",
    color: "bg-health-green",
    avatarUrl: "/avatar-presence/avatar-02.png",
  },
  {
    id: "liam",
    fullName: "Liam Lee",
    displayName: "Liam",
    role: "Son",
    location: "At school",
    availability: "available",
    mood: "stable",
    wellbeing: "Steady",
    visibility: "Summary only",
    next: "School pickup",
    lastMoment: "Safe arrival confirmed",
    privacyNote: "Location is categorical only. No exact tracking.",
    color: "bg-health-blue",
    avatarUrl: "/avatar-presence/avatar-03.png",
  },
  {
    id: "mia",
    fullName: "Mia Chen",
    displayName: "Mia",
    role: "Partner",
    location: "At work",
    availability: "busy",
    mood: "reduced",
    wellbeing: "Stretched",
    visibility: "Trusted contacts",
    next: "Mia's appointment",
    lastMoment: "Marked busy until late afternoon",
    privacyNote: "Work state is visible, family wellbeing is not shared outside this hub.",
    color: "bg-health-yellow",
    avatarUrl: "/avatar-presence/avatar-14.png",
  },
  {
    id: "noah",
    fullName: "Noah Lee",
    displayName: "Noah",
    role: "Child",
    location: "At home",
    availability: "quiet",
    mood: "recovering",
    wellbeing: "Steady",
    visibility: "Summary only",
    next: "Homework wind-down",
    lastMoment: "Quiet mode turned on",
    privacyNote: "Quiet mode reduces notifications and hides extra detail.",
    color: "bg-health-purple",
    avatarUrl: "/avatar-presence/avatar-05.png",
  },
  {
    id: "nan",
    fullName: "Evelyn Hart",
    displayName: "Nan",
    role: "Trusted Contact",
    location: "Away",
    availability: "needs_support",
    mood: "crisis",
    wellbeing: "Need help",
    visibility: "Trusted contacts",
    next: "Gentle check-in",
    lastMoment: "Support request ready for trusted contacts",
    privacyNote: "Support routes to trusted contacts first. No public alert is shown.",
    color: "bg-health-red",
    avatarUrl: "/avatar-presence/avatar-11.png",
  },
];

export const demoHubStats = [
  { label: "People visible", value: "5", detail: "summary signals" },
  { label: "Plans today", value: "3", detail: "dinner, pickup, care" },
  { label: "Support route", value: "Ready", detail: "trusted contacts first" },
  { label: "Privacy", value: "On", detail: "contexts separated" },
];
