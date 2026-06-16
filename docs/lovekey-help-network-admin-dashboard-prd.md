# Love Key HELP Network Administration Dashboard PRD

## Purpose

The Love Key HELP Network administration dashboard is the operational intelligence layer for the wider support network. It turns consented hub signals and anonymous public-site journey patterns into [...].

The product promise is decision support, not command and control: the dashboard should help the right support reach the right person at the right time, with the right permissions, in the right contex[...].

## Product Scope

### Hub Intelligence

Authenticated hub reporting is for known users and consented contexts. It covers support requests, contextual roles, permission health, trust/status, participation signals, and hub health. Private fa[...].

### Public Site Intelligence

Anonymous public-site reporting is for the six HELP Network front doors. It covers public journey patterns, help-seeking intent, topic engagement, form starts, form abandonment, referral paths, conve[...].

## Core Dashboard Questions

1. Who needs support now?
2. Which hubs are healthy, quiet, overloaded, or at risk?
3. Are permissions and contextual roles working safely?
4. Which users, carers, volunteers, or partners are participating reliably?
5. Where is the HELP Network making a measurable difference?

## MVP Screens

### 1. Network Health

Show active hubs, open support requests, urgent requests, average response time, resolved requests, hubs needing attention, active helpers, consent conflicts, and participation trends.

### 2. Support Requests

Provide an operational board for new, assigned, in-progress, waiting, escalated, and resolved requests. Each request card must show only necessary context: request type, hub context, urgency, consent[...].

### 3. Hub Explorer

Allow authorised admins to inspect hub health by category: immediate family, birth family, blended family, co-parenting, elder care, sporting group, book club, corporate team, and recovery circle.

### 4. Permissions & Roles

Show a visual matrix of users, hubs, contextual roles, presence, location, calendar, emotional status, recovery access, and admin rights. Include a clear "Preview what this person can see" featur[...].

### 5. Trust & Status

Show care-readiness bands such as New, Verified, Trusted, Support Ready, Recovery Approved, and Network Steward. Status must be explainable, reviewable, and never a hidden popularity score.

### 6. Participation Analytics

Track check-ins, support requests opened, requests resolved, response time, event participation, repeated non-response, permission changes, hub creation, and recovery contact readiness. Use gentle la[...].

### 7. Public Site Intelligence

Show a six-site matrix with visitors, help intent, conversions, top topics, drop-off points, resource engagement, referral sources, hub conversion, and site health.

### 8. Insights & Recommendations

Surface rule-based recommendations such as repeated elder-care transport requests, high recovery-page exits, mobile form friction, missing backup trusted contacts, or RSP documentation drop-off. AI m[...].

## Data Model Requirements

Raw signals must be stored separately from interpreted insights. The MVP adds tables for public websites, anonymous sessions, page events, help-intent events, consent transitions, support request eve[...].

Future phases should add escalation rules, notification events, role assignment history, trust/status events, organisation profiles, referral sources, form abandonment events, public-site insights, a[...].

## RSP Rules

RSP powers five dashboard functions:

1. Respectful consent: no signal becomes visible unless consent and context allow it.
2. Synchronised context: roles and visibility can change across hubs without merging private data.
3. Support routing: requests route by permissions, trust/status, role, availability, and urgency.
4. Participation recognition: helpers earn status through meaningful contribution, not raw engagement.
5. Governance and auditability: admins can see why an insight appeared and who acted on it.

## Privacy and Safety Rules

1. Consent before insight.
2. Context separation by default.
3. Minimum necessary disclosure.
4. Human review for sensitive status changes.
5. No hidden surveillance scoring.
6. Clear audit trails.
7. Emergency access is limited, logged, and reviewable.
8. Private family signals never leak into corporate or community hubs.
9. AI assists but does not decide sensitive care actions.
10. Users can understand and challenge what is shown.
11. Public analytics uses anonymous or pseudonymous session IDs only.
12. Public analytics uses coarse location only and suppresses small-count sensitive reporting.
13. Anonymous browsing is not joined to known hub identity without explicit consent.

## Success Metrics

Measure human outcomes rather than vanity metrics:

- Time to first response.
- Time to resolution.
- Support request completion rate.
- Repeated unresolved need.
- Consent clarity.
- Hub health trend.
- Helper reliability.
- Recovery readiness.
- User calmness feedback.
- Percentage of anonymous help-seeking visitors who reach a safe next step.

## MVP Execution Checklist

- Create a calm visual admin dashboard route.
- Add Hub Intelligence and Public Site Intelligence sections.
- Add support request command-centre cards.
- Add permissions and contextual roles matrix.
- Add six-site public analytics comparison table.
- Add signal-to-insight pipeline and recommendation examples.
- Add Supabase schema for raw public and admin intelligence events.
- Preserve strict separation between anonymous public analytics and known hub records.