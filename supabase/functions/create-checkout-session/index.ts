import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2025-01-27.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } },
);

const TIERS: Record<string, { name: string; description: string; amount: number; credits: number; bonus: number }> = {
  standard:  { name: "RSP Certification (Standard)",              description: "Structured RSP framework review with written assessment and recommendations.", amount: 10000,  credits: 100,  bonus: 0 },
  full:      { name: "RSP Certification (Full + Badge Issuance)", description: "Full review plus RSP Certification Badge — verifiable on-chain credential (NFT Tier 3).", amount: 25000,  credits: 250,  bonus: 0 },
  partner:   { name: "RSP Partner Certification",                 description: "Enterprise-scale certification with Partner Licence marker (NFT Tier 4) and registry co-authorship.", amount: 100000, credits: 1000, bonus: 0 },
  certifier: { name: "RSP Certifier Licence",                     description: "Licence to issue RSP Certification Badges, at 125 credits per issuance.", amount: 100000, credits: 1000, bonus: 0 },
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    // Verify Supabase auth token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return json({ error: "Unauthorized" }, 401);
    }

    // Parse request body
    const { tier, successUrl, cancelUrl } = await req.json();
    if (!tier || !TIERS[tier]) {
      return json({ error: "Invalid tier" }, 400);
    }

    const selectedTier = TIERS[tier];

    // Get user profile for prefilled email
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .maybeSingle();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "gbp",
      customer_email: profile?.email ?? user.email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: selectedTier.amount,
            product_data: {
              name: selectedTier.name,
              description: `${selectedTier.credits + selectedTier.bonus} RSP Coordination Credits`,
            },
          },
        },
      ],
      metadata: {
        user_id: user.id,
        tier,
        credits: selectedTier.credits,
        bonus: selectedTier.bonus,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return json({ url: session.url, sessionId: session.id });

  } catch (err) {
    console.error("create-checkout-session error:", (err as Error).message);
    return json({ error: "Internal server error" }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
