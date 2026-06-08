import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } },
);

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

    // Find the customer linked to this auth user (fallback to email match)
    const { data: customer } = await supabase
      .from("customers")
      .select("id, email, name")
      .or(`user_id.eq.${user.id}${user.email ? `,email.eq.${user.email}` : ""}`)
      .maybeSingle();

    if (!customer) {
      return json({ balance: 0, transactions: [], customer: null });
    }

    // Sum all credit transactions for this customer
    const { data: transactions, error: txError } = await supabase
      .from("credit_transactions")
      .select("type, credits, description, created_at")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false });

    if (txError) {
      console.error("get-balance tx error:", txError);
      return json({ error: "Internal server error" }, 500);
    }

    const balance = (transactions ?? []).reduce(
      (sum, t) => sum + (t.credits ?? 0),
      0,
    );

    return json({
      balance,
      transactions: transactions ?? [],
      customer: { email: customer.email, name: customer.name },
    });
  } catch (err) {
    console.error("get-balance error:", (err as Error).message);
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
