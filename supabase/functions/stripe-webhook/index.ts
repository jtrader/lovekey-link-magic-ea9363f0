import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2025-01-27.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } },
);

// amount (in pence) -> { purchased, bonus } — fallback when metadata is absent
const CREDIT_TIERS: Record<number, { purchased: number; bonus: number }> = {
  10000: { purchased: 100, bonus: 0 },
  25000: { purchased: 250, bonus: 0 },
  100000: { purchased: 1000, bonus: 0 },
};

// tier key -> human label for transaction descriptions
const TIER_LABELS: Record<string, string> = {
  standard: "RSP Certification (Standard)",
  full: "RSP Certification (Full + Badge Issuance)",
  partner: "RSP Partner Certification",
  certifier: "RSP Certifier Licence",
};

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return new Response("Bad request", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.error("Signature verification failed:", (err as Error).message);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const email = session.customer_details?.email ?? null;
      const name = session.customer_details?.name ?? null;
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null;
      const stripeCustomerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id ?? null;
      const amountTotal = session.amount_total ?? 0;
      const userId = session.metadata?.user_id ?? null;
      const tierKey = session.metadata?.tier ?? null;

      if (!email) {
        console.error("No customer email on session", session.id);
        return new Response("Missing customer email", { status: 500 });
      }

      // Prefer metadata (authoritative per tier), fall back to amount lookup.
      const metaCredits = Number(session.metadata?.credits ?? NaN);
      const metaBonus = Number(session.metadata?.bonus ?? NaN);
      const tier = Number.isFinite(metaCredits)
        ? { purchased: metaCredits, bonus: Number.isFinite(metaBonus) ? metaBonus : 0 }
        : CREDIT_TIERS[amountTotal];

      if (!tier) {
        console.warn(`Unrecognized purchase (amount=${amountTotal}, tier=${tierKey}). Skipping credit grant.`);
        return new Response(JSON.stringify({ received: true, skipped: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const tierLabel = (tierKey && TIER_LABELS[tierKey]) || `${tier.purchased} credits`;

      // a. Upsert customer by email
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .upsert(
          {
            email,
            name,
            ...(userId ? { user_id: userId } : {}),
            ...(stripeCustomerId ? { stripe_customer_id: stripeCustomerId } : {}),
          },
          { onConflict: "email" },
        )
        .select("id")
        .single();

      if (customerError || !customer) {
        console.error("Customer upsert failed:", customerError);
        return new Response("Database error", { status: 500 });
      }

      // b. Insert purchase transaction
      const { error: purchaseError } = await supabase
        .from("credit_transactions")
        .insert({
          customer_id: customer.id,
          type: "purchase",
          credits: tier.purchased,
          description: `${tierLabel} — ${tier.purchased} credits`,
          stripe_payment_id: paymentIntentId,
        });

      if (purchaseError) {
        console.error("Purchase insert failed:", purchaseError);
        return new Response("Database error", { status: 500 });
      }

      // c. Insert bonus transaction if applicable
      if (tier.bonus > 0) {
        const { error: bonusError } = await supabase
          .from("credit_transactions")
          .insert({
            customer_id: customer.id,
            type: "bonus",
            credits: tier.bonus,
            description: "Tier bonus",
            stripe_payment_id: paymentIntentId,
          });

        if (bonusError) {
          console.error("Bonus insert failed:", bonusError);
          return new Response("Database error", { status: 500 });
        }
      }

      console.log(
        `Granted ${tier.purchased} + ${tier.bonus} bonus credits to ${email}`,
      );
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook handler error:", (err as Error).message);
    return new Response("Server error", { status: 500 });
  }
});
