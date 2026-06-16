# Product Requirements Document: LoveKey Link + RSP + Love Key Help Network

## 1. Purpose

LoveKey Link is the warm public and product entry point for a human-first coordination, recovery and support ecosystem. Respectful Synchronisation Protocol (RSP) is the invisible coordination infrast[...].

The product must help users feel one simple promise:

> My people are connected, my privacy is respected and help can reach me when it matters.

## 2. Strategic Thesis

- LoveKey Link remains the friendly public-facing entry and MVP onboarding surface.
- LoveKey Hub remains the calm family and trusted-spaces experience.
- The Love Key Help Network becomes the social support and help-routing layer.
- RSP remains the shared consent, permissions, identity context, presence, participation and governance layer.

Family users should never feel like they are using a protocol. They should feel connected to the right people, at the right time, with the right privacy boundary.

## 3. Product Scope

### In scope for the current MVP execution

1. Public homepage copy that leads with "Are my people okay?" rather than protocol terminology.
2. One-profile onboarding that creates or joins a family/personal hub.
3. Invite flow for trusted members.
4. Gentle presence states and contextual visibility language.
5. A visible support request surface that answers "Who needs care now?"
6. RSP documentation sections for journey, consent, permissions and support routing.
7. PRD-aligned terminology: hub, presence, moments, support, permissions, recovery circle and respectful synchronisation.

### Out of scope for current MVP execution

1. Real Help Network organisation matching.
2. Emergency dispatch or regulated clinical escalation.
3. Token/status-layer launch beyond documentation and utility framing.
4. Partner developer sandbox or full API publication.
5. Compliance-significant recovery flows without specialist review.

## 4. Primary Personas

- **Family coordinator:** wants reassurance without becoming a surveillance administrator.
- **Trusted contact:** wants to know when help is welcome and what context they are allowed to see.
- **Person requesting support:** needs a shame-free way to ask for help or confirm safety.
- **Community/recovery participant:** needs separate contexts and consent-aware escalation.
- **Developer/partner:** needs RSP concepts separated from the warm family UI.

## 5. Core User Journey Requirements

### R1 — Discover

The homepage must lead with an emotional promise and hide protocol complexity.

- Acceptance: hero copy asks whether people are okay and promises privacy-respecting connection.
- Acceptance: RSP is presented as documentation/infrastructure, not the first family-user concept.

### R2 — Onboard

The onboarding flow must create one profile and one initial hub.

- Acceptance: terminology uses "hub" instead of "node".
- Acceptance: the user understands the hub is private and can later bridge other spaces by consent.

### R3 — Invite trusted people

The product must make invitations feel private and intentional.

- Acceptance: invite copy refers to trusted people and hub membership.
- Acceptance: invite links remain framed as private and temporary.

### R4 — Share presence

The app must make presence feel reassuring and not like tracking.

- Acceptance: presence states are low-resolution and user-controlled.
- Acceptance: visibility language tells the user who can see the current signal.

### R5 — Request support

The app must make support requests calm, visible and shame-free.

- Acceptance: the app contains a "Who needs care now?" surface.
- Acceptance: support options include all-good, safe-arrival and needs-support states.
- Acceptance: copy explains that support routes to trusted contacts before wider Help Network escalation.

### R6 — Document RSP

The `/rsp` page must explain RSP as the technical/governance layer.

- Acceptance: RSP docs include journey integration, consent modules, permission defaults, support routing and consent ledger concepts.
- Acceptance: protocol, token and governance concepts remain separated from the family UI.

## 6. Functional Requirements

| Module           | MVP requirement                                      | RSP role                                                           |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| Identity context | One user profile can participate in multiple hubs.   | Preserve person-owned identity while separating contexts.          |
| Hub membership   | A user creates or joins a private hub.               | Assign contextual roles and membership boundaries.                 |
| Permissions      | Show what others can see.                            | Scope presence, location, calendar, recovery and admin visibility. |
| Presence         | User-controlled low-resolution status.               | Synchronise only permitted signals.                                |
| Support routing  | User can signal okay, safe arrival or needs support. | Route to trusted contacts based on consent and urgency.            |
| Consent ledger   | Document permission/support event audit concepts.    | Support accountability without surveillance dashboards.            |

## 7. UX Principles

- Warm and calm blue as default.
- Red only for recovery or crisis states.
- People first, systems second.
- Presence before messaging.
- Support without shame.
- Context separation by default.
- No dense dashboards or protocol-first family copy.
- Every home screen answers: are my people okay?
- Every support flow answers: who needs care now?

## 8. Data Model Direction

The current implementation uses family-oriented tables. Future schema evolution should map family concepts to hub concepts without breaking the MVP:

- `families` → hub-compatible private space.
- `family_members` → hub memberships.
- `family_invites` → hub invitations.
- `presence_states` and `family_presence` → presence signals.
- Added in the RSP schema execution: `rsp_permissions`, `rsp_consent_events`, `trusted_contacts`, and `support_requests`.
- Future additions: `support_routes`, `permission_audits`, `participation_signals`, `help_network_referrals`.

## 9. Success Metrics

- Users understand the product promise in under 10 seconds.
- Users can complete profile → hub → invite → presence → support request without protocol terminology.
- Users can identify what others can see.
- Users describe the support flow as calm, not alarming.
- RSP documentation remains clear for developers and partners without overwhelming family users.

## 10. Current Execution Checklist

- [x] Homepage reframed around "Are my people okay?"
- [x] RSP positioned as documentation/infrastructure.
- [x] `/rsp` includes Journey and Consent sections.
- [x] Onboarding terminology changed from family node to family hub.
- [x] App navigation changed from node/circles/participation to presence/hubs/moments/support.
- [x] Home app includes contextual visibility language.
- [x] Home app includes a support request panel that routes first to trusted contacts.
- [x] PRD added to the repository for implementation traceability.
- [x] RSP permission and consent schema defined in a Supabase migration.
- [x] MVP support flow persists presence/support intent and records a consent-routing event.