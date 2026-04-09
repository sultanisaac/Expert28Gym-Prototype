import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, goal, plan, user_id } = req.body;

  // Basic validation
  if (!email || !plan) {
    return res.status(400).json({ error: 'Missing required fields: email or plan' });
  }

  try {
    // 1. Fetch current price ID and metadata from Supabase
    const { data: planData, error: planError } = await supabase
      .from('membership_plans')
      .select('stripe_price_id, price, interval, currency')
      .eq('name', plan)
      .eq('is_active', true)
      .single();

    if (planError || !planData) {
      console.error('[Stripe] Plan lookup error:', planError);
      return res.status(404).json({ error: 'Plan not found or inactive' });
    }

    const priceId = planData.stripe_price_id;
    const planCurrency = (planData.currency || 'idr').toLowerCase();
    
    // 2. Fetch the price from Stripe to confirm if it is recurring
    const stripePrice = await stripe.prices.retrieve(priceId!);
    const mode = stripePrice.recurring ? 'subscription' : 'payment';

    // 2b. If Stripe price currency doesn't match DB currency, create a new price in the correct currency
    let finalPriceId = priceId!;
    if (stripePrice.currency !== planCurrency) {
      console.warn(`[Stripe] Currency mismatch: Stripe=${stripePrice.currency}, DB=${planCurrency}. Creating corrected price.`);
      const correctedPrice = await stripe.prices.create({
        unit_amount: Math.round(planData.price * 100),
        currency: planCurrency,
        product: stripePrice.product as string,
        ...(stripePrice.recurring && {
          recurring: { interval: stripePrice.recurring.interval }
        })
      });
      finalPriceId = correctedPrice.id;
    }

    // Base URL for redirects
    const host = req.headers.host || '';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = process.env.VITE_APP_URL || `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: mode,
      metadata: {
        email: email || '',
        name: name || '',
        phone: phone || '',
        goal: goal || '',
        plan: plan,
        user_id: user_id || '',
        role_upgrade: 'client'
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/client/dashboard?cancelled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('[Stripe] create session error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
