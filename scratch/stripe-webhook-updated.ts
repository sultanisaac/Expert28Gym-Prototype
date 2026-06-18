import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── Stripe signature verification secret ─────────────────────────────────────
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const STRIPE_SECRET_KEY      = Deno.env.get("STRIPE_SECRET_KEY")!;
const SUPABASE_URL           = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const stripe   = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  // Stripe only sends POST requests
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Webhook] Signature verification failed:", message);
    return new Response(`Webhook signature verification failed: ${message}`, { status: 400 });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Webhook] Error processing ${event.type}:`, message);
    return new Response(`Processing error: ${message}`, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const meta     = session.metadata ?? {};
  const userId   = meta.user_id;
  const planName = meta.plan ?? meta.plan_name ?? "Unknown";
  const planInterval = meta.plan_interval ?? "month"; // Dynamically passed from checkout session
  const email    = session.customer_email ?? meta.email ?? "";
  const name     = meta.name ?? "";
  const amount   = (session.amount_total ?? 0) / 100;
  const currency = (session.currency ?? "idr").toUpperCase();

  console.log(`[Webhook] Payment completed for user_id=${userId}, plan=${planName}, interval=${planInterval}`);

  if (userId) {
    // Calculate membership expiry based on plan interval
    const expiresAt = new Date();
    if (planInterval === 'week' || planInterval === '7 days') {
      expiresAt.setDate(expiresAt.getDate() + 7);
    } else if (planInterval === 'year') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 30); // Default to month/30 days
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        role: "client",
        membership_tier: planName,
        membership_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileError) {
      console.error("[Webhook] Failed to update profile:", profileError.message);
      throw profileError;
    }
    console.log(`[Webhook] ✅ Profile upgraded for user_id=${userId}`);
  } else {
    console.warn("[Webhook] ⚠️  No user_id in session metadata — profile not updated.");
  }

  const { error: paymentError } = await supabase
    .from("payment_history")
    .insert({
      user_id:        userId || null,
      stripe_session_id: session.id,
      amount:         amount,
      currency:       currency,
      status:         "completed",
      member_email:   email,
      member_name:    name,
      plan_name:      planName,
    });

  if (paymentError) {
    console.error("[Webhook] Failed to insert payment_history:", paymentError.message);
  } else {
    console.log("[Webhook] ✅ Payment recorded in payment_history");
  }

  if (userId) {
    await supabase.from("notifications").insert({
      user_id: userId,
      type:    "payment",
      title:   "Welcome to Expert28! 🎉",
      message: `Your ${planName} membership is now active. Let's get to work!`,
      metadata: {
        plan:       planName,
        amount:     amount,
        currency:   currency,
        session_id: session.id,
      },
    });
    console.log(`[Webhook] ✅ Welcome notification sent to user_id=${userId}`);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  console.log(`[Webhook] Subscription cancelled for Stripe customer: ${customerId}`);

  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) {
    console.warn("[Webhook] Customer already deleted in Stripe.");
    return;
  }

  const email = (customer as Stripe.Customer).email;
  if (!email) {
    console.warn("[Webhook] No email on Stripe customer, cannot downgrade profile.");
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      role:                 "user",
      membership_tier:      null,
      membership_expires_at: null,
      updated_at:           new Date().toISOString(),
    })
    .eq("email", email);

  if (error) {
    console.error("[Webhook] Failed to downgrade profile:", error.message);
    throw error;
  }

  console.log(`[Webhook] ✅ Profile downgraded for email=${email}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (profile?.id) {
    await supabase.from("notifications").insert({
      user_id: profile.id,
      type:    "alert",
      title:   "Membership Cancelled",
      message: "Your membership has been cancelled. We hope to see you back soon!",
    });
  }
}
