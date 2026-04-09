import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, plan_id, data } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'Missing action (create/update/delete)' });
  }

  try {
    if (action === 'create') {
      const { name, description, price, features, interval, currency, badge, original_price } = data;
      
      // 1. Create Product in Stripe
      const product = await stripe.products.create({
        name,
        description: description || '',
        metadata: { source: 'admin_dashboard' }
      });

      // 2. Create Price in Stripe
        const stripePrice = await stripe.prices.create({
          unit_amount: Math.round(price * 100),
          currency: currency || 'idr',
          product: product.id,
          ...(interval !== 'one-time' && {
            recurring: { interval: interval === 'week' ? 'week' : 'month' }
          })
        });
  
        // 3. Save to Supabase
        const { data: newPlan, error: insertError } = await supabase
          .from('membership_plans')
          .insert({
            name,
            description,
            price,
            currency: (currency || 'idr').toLowerCase(),
          interval: interval || 'month',
          features: features || [],
          badge,
          original_price,
          stripe_product_id: product.id,
          stripe_price_id: stripePrice.id,
          is_active: true
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return res.status(200).json(newPlan);
    }

    if (action === 'update') {
      if (!plan_id) return res.status(400).json({ error: 'Missing plan_id' });
      
      const { name, description, price, features, interval, badge, is_active, original_price } = data;

      // Get existing plan to check if price changed
      const { data: existingPlan, error: fetchError } = await supabase
        .from('membership_plans')
        .select('*')
        .eq('id', plan_id)
        .single();

      if (fetchError || !existingPlan) return res.status(404).json({ error: 'Plan not found' });

      let newPriceId = existingPlan.stripe_price_id;

      // If price or interval changed, create new Price in Stripe
      if (price !== undefined && (Number(price) !== Number(existingPlan.price) || interval !== existingPlan.interval)) {
        const stripePrice = await stripe.prices.create({
          unit_amount: Math.round(price * 100),
          currency: existingPlan.currency,
          product: existingPlan.stripe_product_id,
          ...((interval || existingPlan.interval) !== 'one-time' && {
            recurring: { interval: (interval || existingPlan.interval) === 'week' ? 'week' : 'month' }
          })
        });
        newPriceId = stripePrice.id;
      }

      // 3. Update Stripe Product status and metadata
      await stripe.products.update(existingPlan.stripe_product_id, {
        name: name || existingPlan.name,
        description: description || existingPlan.description,
        active: is_active !== undefined ? is_active : true // Reactivate if it was archived
      });

      // Update Supabase
      const { data: updatedPlan, error: updateError } = await supabase
        .from('membership_plans')
        .update({
          name: name ?? existingPlan.name,
          description: description ?? existingPlan.description,
          price: price ?? existingPlan.price,
          features: features ?? existingPlan.features,
          interval: interval ?? existingPlan.interval,
          badge: badge ?? existingPlan.badge,
          original_price: original_price !== undefined ? original_price : existingPlan.original_price,
          is_active: is_active ?? existingPlan.is_active,
          stripe_price_id: newPriceId,
          updated_at: new Date().toISOString()
        })
        .eq('id', plan_id)
        .select()
        .single();

      if (updateError) throw updateError;
      return res.status(200).json(updatedPlan);
    }

    if (action === 'delete') {
      if (!plan_id) return res.status(400).json({ error: 'Missing plan_id' });
      
      // Physically delete is risky if there are users on it, 
      // but the user asked for CRUD. We'll mark as inactive and then try to delete.
      // Better to just delete the record from DB if it's a prototype.
      const { error: deleteError } = await supabase
        .from('membership_plans')
        .delete()
        .eq('id', plan_id);

      if (deleteError) throw deleteError;
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (err: any) {
    console.error(`[Admin] ${action} plan error:`, err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
