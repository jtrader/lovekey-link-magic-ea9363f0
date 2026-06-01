# LoveKey × RSP Integration

RSP runs invisibly underneath LoveKey Hub. Users see warm, human presence states. RSP handles the privacy-preserving signal pipeline beneath the surface.

## What this does

- Tracks family member engagement in the Hub via RSP
- Translates RSP visual states into LoveKey presence language
- Writes presence to Supabase `presence_states` in real-time
- Aggregates hub-level health — powers the "Everyone is okay" status
- Burns identifiable source data automatically on signal expiry
- Subscribes to real-time presence changes across all hub members

## Setup

### 1. Run the Supabase migration

```typescript
import { PRESENCE_MIGRATION_SQL } from './src'

// Log it and run in your Supabase SQL editor
console.log(PRESENCE_MIGRATION_SQL)
```

### 2. Wire into your Hub component

```tsx
import { useHubPresence, MOOD_RING_COLOURS } from './src'
import { createClient } from '@supabase/supabase-js'
import { createConsent } from '@rsp/core'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function HubPage({ userId, hubId }: { userId: string; hubId: string }) {
  // Create consent when user accepts privacy settings
  // Store this in your auth/profile system
  const consent = createConsent({
    id:           `consent-${userId}`,
    nodeId:       `node-${userId}-${hubId}`, // anonymised — NOT the userId alone
    scope:        ['coordination'],
    durationDays: 30,
  })

  const {
    status,
    moodRing,
    label,
    needsSupport,
    hubHealth,
    memberPresence,
    track,
    isTracking,
  } = useHubPresence({
    userId,
    nodeId:    `node-${userId}-${hubId}`,  // anonymised node ID
    hubId,
    consent,
    supabase,
    onNeedsSupport: (record) => {
      // Surface a support prompt — e.g. show a gentle check-in card
      console.log('Member needs support:', record.label)
    },
    onHubHealthChange: (health) => {
      // Update hub status line — "Everyone is okay" etc.
      console.log('Hub health:', health.statusLine)
    },
  })

  // Track user opening the hub — fires a pageView signal
  useEffect(() => {
    track.pageView()
  }, [])

  // Track active time — call this on a 1-minute interval
  useEffect(() => {
    const timer = setInterval(track.activeMinute, 60_000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      {/* Hub status line — "Everyone is okay" */}
      <p>{hubHealth?.statusLine}</p>

      {/* Member avatars with mood rings */}
      {memberPresence.map((member) => (
        <MemberAvatar
          key={member.userId}
          label={member.label}
          moodRingColour={MOOD_RING_COLOURS[member.moodRing]}
          needsSupport={member.needsSupport}
        />
      ))}

      {/* Support prompt — shown only when needed */}
      {needsSupport && <SupportPrompt />}
    </div>
  )
}
```

### 3. Track meaningful events

```tsx
// When a member completes a task in Today Together
track.completionOrConversion()

// When a member opens a resource or guide
track.resourceDownload()

// When a member explicitly requests support
// This triggers support_needed state immediately
track.safetyEscalation()

// When a member returns to the hub after being away
track.returnVisit()
```

## State mapping reference

| RSP State | LoveKey Status | Mood Ring | Colour |
|---|---|---|---|
| resonant / mastery | all_good | healthy | Mint Green |
| active / converting | available | stable | Primary Blue |
| aware | quiet | reduced | Warm Amber |
| friction / overload | busy | fragmenting | Warm Amber |
| cooling / drop_off | stepping_back | reduced | Warm Amber |
| support_needed | needs_support | crisis | Coral Red |
| dormant | offline | offline | Grey |

**Coral red is reserved for crisis only** — the Hub stays warm and blue for all other states.

## Privacy guarantee

- The `nodeId` passed to RSP is never the Supabase `userId` — it is an anonymised combination
- Raw behavioural events are burned at signal window expiry (default: 30 minutes)
- Only the translated LoveKey presence state is written to Supabase — never RSP scores, weights, or event logs
- The `presence_states` table contains: status, mood_ring, label, needs_support — nothing else
