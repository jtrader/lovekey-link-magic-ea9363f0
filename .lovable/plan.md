## Goal
Add a clickable "Buy →" button to each of the four credit cards in the RSP page's Credits section, linking to Stripe Payment Links (placeholders for now), plus a fulfilment note below the grid.

## Changes (all in `src/routes/rsp.tsx`)

### 1. Add Stripe link constants
Near the top of `RSPPage()` (around line 504), add:
```text
const STRIPE_LINKS = {
  starter: 'https://buy.stripe.com/REPLACE_STARTER',
  builder: 'https://buy.stripe.com/REPLACE_BUILDER',
  pro:     'https://buy.stripe.com/REPLACE_PRO',
  partner: 'https://buy.stripe.com/REPLACE_PARTNER',
}
```

### 2. Update the credits grid (lines 804–818)
- Add a `key` field (`starter`/`builder`/`pro`/`partner`) to each card object so it can map to the right Stripe link.
- Inside each `.rsp-credit-card`, after the note, add a proper `<a>` button (the user's snippet was missing its opening `<a` tag — I'll add it correctly):
```text
<a
  href={STRIPE_LINKS[c.key as keyof typeof STRIPE_LINKS]}
  target="_blank"
  rel="noopener noreferrer"
  className="rsp-btn-primary"
  style={{ marginTop: 16, fontSize: '.8rem', padding: '8px 18px', display: 'inline-flex' }}
>
  Buy →
</a>
```

### 3. Add the fulfilment note
Below the grid (after `</div>` closing `.rsp-credits-grid`), add:
```text
<p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--rsp-text-muted)', marginTop: 16 }}>
  Credits are fulfilled automatically after payment. A confirmation email is sent once your credits are active.
</p>
```

## Notes
- Placeholder URLs (`REPLACE_*`) stay in for now; you can swap them for real Stripe Payment Links later.
- These Payment Links should be configured in Stripe to trigger the existing `stripe-webhook` function so credits are granted automatically.
- No backend or styling-token changes needed; reuses the existing `.rsp-btn-primary` class.
