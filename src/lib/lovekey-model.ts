import {
  Baby,
  BookOpen,
  Briefcase,
  CalendarDays,
  Car,
  HeartHandshake,
  Home,
  LifeBuoy,
  MapPin,
  Moon,
  School,
  Shield,
  Users,
} from "lucide-react";

export type HubType =
  | "immediate_family"
  | "birth_family"
  | "blended_family"
  | "co_parenting"
  | "elder_care"
  | "sporting_group"
  | "book_club"
  | "corporate_team"
  | "recovery_circle";

export type HubRole =
  | "Dad"
  | "Mum"
  | "Parent"
  | "Partner"
  | "Child"
  | "Son"
  | "Daughter"
  | "Sibling"
  | "Step-parent"
  | "Step-sibling"
  | "Guardian"
  | "Carer"
  | "Neighbour"
  | "Coach"
  | "Player"
  | "Parent Helper"
  | "Volunteer"
  | "Member"
  | "Host"
  | "Organizer"
  | "Operations Manager"
  | "HR Advisor"
  | "IT Support"
  | "Marketing Lead"
  | "Trusted Contact"
  | "Support Person"
  | "Recovery Guardian";

export type PresenceState = "available" | "busy" | "quiet" | "needs_support";
export type MoodRingState =
  | "healthy"
  | "stable"
  | "reduced"
  | "fragmenting"
  | "crisis"
  | "recovering";
export type PermissionSignalType =
  | "presence"
  | "location"
  | "calendar"
  | "emotional_status"
  | "work_status"
  | "contact_methods"
  | "recovery_access"
  | "admin_rights";
export type SupportSignal = "All good" | "Safe arrival" | "Need support";
export type HubVisibility = "private" | "public";
export type PublicJoinMode = "invite" | "open" | "password";

export type HubSlotTemplate = {
  /** Short role label shown beneath the avatar */
  role: string;
  /** Stable starter avatar key for deterministic local portrait selection */
  seed: string;
};

export type HubInviteTemplate = {
  /** Button / sheet headline, e.g. "Invite a family member" */
  inviteLabel: string;
  /** 4 default placeholder slots shown in Nucleus before any members join */
  defaultSlots: [HubSlotTemplate, HubSlotTemplate, HubSlotTemplate, HubSlotTemplate];
};

export const hubInviteTemplates: Record<HubType, HubInviteTemplate> = {
  immediate_family: {
    inviteLabel: "Invite a family member",
    defaultSlots: [
      { role: "Partner", seed: "lena-hayes" },
      { role: "Son", seed: "marcus-reed" },
      { role: "Daughter", seed: "sofia-chen" },
      { role: "Family", seed: "noah-patel" },
    ],
  },
  birth_family: {
    inviteLabel: "Invite a family member",
    defaultSlots: [
      { role: "Parent", seed: "dorothy-silva" },
      { role: "Parent", seed: "graham-osei" },
      { role: "Sibling", seed: "priya-santos" },
      { role: "Sibling", seed: "kieran-walsh" },
    ],
  },
  blended_family: {
    inviteLabel: "Invite a family member",
    defaultSlots: [
      { role: "Step-parent", seed: "alice-morgan" },
      { role: "Step-parent", seed: "james-okoro" },
      { role: "Step-sibling", seed: "ella-foster" },
      { role: "Guardian", seed: "sam-nguyen" },
    ],
  },
  co_parenting: {
    inviteLabel: "Invite a co-parent",
    defaultSlots: [
      { role: "Co-parent", seed: "rachel-kim" },
      { role: "Child", seed: "theo-martin" },
      { role: "Child", seed: "isla-brooks" },
      { role: "Guardian", seed: "david-ali" },
    ],
  },
  elder_care: {
    inviteLabel: "Invite a care member",
    defaultSlots: [
      { role: "Elder", seed: "margaret-jones" },
      { role: "Carer", seed: "chen-liu" },
      { role: "Neighbour", seed: "betty-anderson" },
      { role: "Support", seed: "oliver-smith" },
    ],
  },
  sporting_group: {
    inviteLabel: "Invite a team mate",
    defaultSlots: [
      { role: "Coach", seed: "blake-turner" },
      { role: "Player", seed: "ava-scott" },
      { role: "Player", seed: "finn-jackson" },
      { role: "Player", seed: "zara-hussain" },
    ],
  },
  book_club: {
    inviteLabel: "Invite a member",
    defaultSlots: [
      { role: "Host", seed: "helen-price" },
      { role: "Reader", seed: "carlos-diaz" },
      { role: "Reader", seed: "marie-dubois" },
      { role: "Organiser", seed: "tom-wright" },
    ],
  },
  corporate_team: {
    inviteLabel: "Invite a team member",
    defaultSlots: [
      { role: "Manager", seed: "sarah-coleman" },
      { role: "HR", seed: "raj-mehta" },
      { role: "IT Lead", seed: "mei-zhang" },
      { role: "Team", seed: "ethan-black" },
    ],
  },
  recovery_circle: {
    inviteLabel: "Invite a trusted contact",
    defaultSlots: [
      { role: "Trusted", seed: "julia-harris" },
      { role: "Support", seed: "patrick-o-brien" },
      { role: "Guardian", seed: "nadia-volkov" },
      { role: "Trusted", seed: "leon-adeyemi" },
    ],
  },
};

export const hubTypes: {
  value: HubType;
  label: string;
  members: string;
  purpose: string;
  category: "Family" | "Community" | "Work" | "Recovery";
  namePlaceholder: string;
  roleSuggestions: HubRole[];
}[] = [
  {
    value: "immediate_family",
    label: "Immediate Family",
    members: "Wife, husband, son, daughters",
    purpose: "Daily routines, wellbeing, calendar and presence",
    category: "Family",
    namePlaceholder: "The Lee Household",
    roleSuggestions: ["Dad", "Mum", "Partner", "Child"],
  },
  {
    value: "birth_family",
    label: "Birth Family",
    members: "Father, mother, sister, brother",
    purpose: "Extended family support, updates and check-ins",
    category: "Family",
    namePlaceholder: "The Nguyen Family",
    roleSuggestions: ["Parent", "Son", "Daughter", "Sibling"],
  },
  {
    value: "blended_family",
    label: "Blended Family",
    members: "Step-parents, step-siblings, guardians",
    purpose: "Shared care and reduced friction",
    category: "Family",
    namePlaceholder: "The Morgan Care Crew",
    roleSuggestions: ["Step-parent", "Step-sibling", "Guardian"],
  },
  {
    value: "co_parenting",
    label: "Co-parenting",
    members: "Parents, children, guardians",
    purpose: "Child-centered schedules and transitions",
    category: "Family",
    namePlaceholder: "Ari's Co-parenting Hub",
    roleSuggestions: ["Dad", "Mum", "Guardian"],
  },
  {
    value: "elder_care",
    label: "Elder Care",
    members: "Elderly parent, carers, neighbours",
    purpose: "Appointments, medication, emergency support",
    category: "Family",
    namePlaceholder: "Nan's Care Circle",
    roleSuggestions: ["Carer", "Child", "Neighbour", "Trusted Contact"],
  },
  {
    value: "sporting_group",
    label: "Sporting Group",
    members: "Teams, parents, coaches",
    purpose: "Training, events, transport and availability",
    category: "Community",
    namePlaceholder: "Saturday Netball",
    roleSuggestions: ["Coach", "Player", "Parent Helper", "Volunteer"],
  },
  {
    value: "book_club",
    label: "Book Club",
    members: "Readers, organizers, hosts",
    purpose: "Meetings, reading lists, RSVP and discussion",
    category: "Community",
    namePlaceholder: "Thursday Readers",
    roleSuggestions: ["Member", "Host", "Organizer"],
  },
  {
    value: "corporate_team",
    label: "Corporate Team",
    members: "Marketing, IT, HR, healthcare",
    purpose: "Work availability, wellbeing and role presence",
    category: "Work",
    namePlaceholder: "Care Team Alpha",
    roleSuggestions: ["Operations Manager", "HR Advisor", "IT Support", "Marketing Lead"],
  },
  {
    value: "recovery_circle",
    label: "Recovery Circle",
    members: "Trusted contacts and professionals",
    purpose: "Support readiness, secure coordination",
    category: "Recovery",
    namePlaceholder: "My Recovery Circle",
    roleSuggestions: ["Trusted Contact", "Support Person", "Recovery Guardian"],
  },
];

export const hubVisibilityOptions: {
  value: HubVisibility;
  label: string;
  description: string;
}[] = [
  {
    value: "private",
    label: "Private hub",
    description: "Only invited members can find or enter this hub.",
  },
  {
    value: "public",
    label: "Public hub",
    description: "Appears in nearby public hub search with summary details only.",
  },
];

export const publicJoinModes: {
  value: PublicJoinMode;
  label: string;
  description: string;
}[] = [
  {
    value: "invite",
    label: "Invite first",
    description: "People can find the hub, then request or use an invite.",
  },
  {
    value: "open",
    label: "Open",
    description: "People nearby can join without a shared password.",
  },
  {
    value: "password",
    label: "Password",
    description: "People nearby need the shared hub password to join.",
  },
];

export const moodRingStates: { value: MoodRingState; label: string; className: string }[] = [
  { value: "healthy", label: "Healthy", className: "bg-health-green" },
  { value: "stable", label: "Stable", className: "bg-health-blue" },
  { value: "reduced", label: "Reduced", className: "bg-health-yellow" },
  { value: "fragmenting", label: "Fragmenting", className: "bg-health-orange" },
  { value: "crisis", label: "Crisis", className: "bg-health-red" },
  { value: "recovering", label: "Recovering", className: "bg-health-purple" },
];

export const lowResolutionLocations = [
  { value: "Home", label: "Home", Icon: Home },
  { value: "School", label: "School", Icon: School },
  { value: "Work", label: "Work", Icon: Briefcase },
  { value: "Driving", label: "Driving", Icon: Car },
  { value: "Travelling", label: "Travelling", Icon: MapPin },
  { value: "Away", label: "Away", Icon: Moon },
];

export const permissionSignals: {
  value: PermissionSignalType;
  label: string;
  description: string;
}[] = [
  {
    value: "presence",
    label: "Presence",
    description: "Available, busy, quiet or needing support",
  },
  {
    value: "location",
    label: "Location",
    description: "Approximate context only unless permitted",
  },
  { value: "calendar", label: "Calendar", description: "Shared availability or specific events" },
  {
    value: "emotional_status",
    label: "Emotional Status",
    description: "Mood, wellbeing or support signals",
  },
  { value: "work_status", label: "Work Status", description: "Role visibility in work hubs only" },
  {
    value: "contact_methods",
    label: "Contact Methods",
    description: "Message, call or support request",
  },
  {
    value: "recovery_access",
    label: "Recovery Access",
    description: "Trusted support and recovery permissions",
  },
  {
    value: "admin_rights",
    label: "Admin Rights",
    description: "Manage members, invites and hub rules",
  },
];

export const todayTogetherItems = [
  { title: "Family dinner", time: "Today · 6:30 PM", Icon: CalendarDays },
  { title: "Mia's appointment", time: "Tomorrow · 10:00 AM", Icon: HeartHandshake },
  { title: "School pickup", time: "Today · 3:15 PM", Icon: Baby },
];

export const hubSpaceCards = [
  { title: "Home Hub", body: "Your central place for family life.", Icon: Home },
  { title: "Wellbeing Hub", body: "Warm check-ins and support.", Icon: HeartHandshake },
  { title: "Calendar Hub", body: "Events, appointments and plans.", Icon: CalendarDays },
  { title: "Support Hub", body: "Help, recovery and trusted contacts.", Icon: LifeBuoy },
];

export type HelpNetworkService = {
  title: string;
  stage: "Prepare" | "Respond" | "Recover" | "Heal";
  body: string;
  href: string;
  logo: string;
};

export const helpNetworkServices: HelpNetworkService[] = [
  {
    title: "First Aid Angel",
    stage: "Prepare",
    body: "AI first aid guidance and plain-language emergency steps.",
    href: "https://firstaidangel.org",
    logo: "https://firstaidangel.org/apple-touch-icon.png",
  },
  {
    title: "Crisis Compass",
    stage: "Respond",
    body: "Step-by-step emergency guidance for active crisis moments.",
    href: "https://crisis-compass.org",
    logo: "https://crisis-compass.org/crisis-compass-logo.png",
  },
  {
    title: "Aid Angel",
    stage: "Recover",
    body: "Disaster recovery support, payments and service navigation.",
    href: "https://aidangel.app",
    logo: "https://aidangel.app/apple-touch-icon.png",
  },
  {
    title: "Guardian Guide",
    stage: "Heal",
    body: "Mental health and emotional support finder for Australia.",
    href: "https://guardianguide.org",
    logo: "https://guardianguide.org/favicon.png",
  },
];

export const privacyPreviewDefaults = [
  { Icon: Shield, label: "Presence", value: "Summary visible" },
  { Icon: MapPin, label: "Location", value: "Approximate only" },
  { Icon: CalendarDays, label: "Calendar", value: "Shared events" },
  { Icon: BookOpen, label: "Wellbeing", value: "Private by default" },
  { Icon: Users, label: "Admin", value: "Hub owner only" },
];

export function getHubType(value?: string | null) {
  return hubTypes.find((type) => type.value === value) ?? hubTypes[0];
}
