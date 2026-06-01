# RSP Developer Library Architecture

**Package concept:** `@rsp/protocol` or `@rsp/core`  
**Initial target:** TypeScript / JavaScript

## Library Purpose

The RSP library translates weighted behavioural events into low-resolution coordination signals, visual states, audit receipts, and source-burn events.

## Suggested Modules

| Module | Purpose |
|---|---|
| `tracker` | capture clicks, scrolls, active time, element events, and custom events |
| `consent` | check consent scope, expiry, and participation state |
| `weights` | define and apply event weights |
| `translator` | convert raw events into low-resolution RSP signals |
| `aggregator` | aggregate signals by node, page, module, agent, cohort, or workflow |
| `visualizer` | output visual state objects for dashboards |
| `burn` | delete, anonymise, expire, or decouple identifiable source data |
| `audit` | produce burn receipts and process proof |
| `tiers` | define NFT tiers and access logic |
| `credits` | manage service-credit balances and redemptions |
| `certification` | perform RSP readiness checks |
| `metadata` | generate NFT and service metadata |

## Example API

```ts
import { RSPTracker } from "@rsp/protocol";

const tracker = new RSPTracker({
  appId: "example-app",
  privacyMode: "source-burn",
  burnAfter: "translation",
  weights: {
    pageView: 1,
    scroll50: 3,
    scroll90: 5,
    elementClick: 8,
    activeMinute: 10,
    formInteraction: 12,
    returnVisit: 20,
    conversion: 25
  }
});

tracker.trackPage("home");
tracker.trackElement("pricing-button", { type: "elementClick", importance: "high" });

const signal = tracker.translateToSignal();
await tracker.burnSource();
```

## Example Signal Output

```json
{
  "nodeId": "pricing-button",
  "nodeType": "element",
  "state": "resonant",
  "intensity": 0.86,
  "trend": "rising",
  "signalWindow": "15m",
  "sourceStatus": "burned"
}
```

## Boundary

The library should support RSP-aligned design patterns. It should not claim to guarantee legal compliance.
