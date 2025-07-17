import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseServiceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'customer']
    });

    if (session.payment_status === 'paid') {
      // Update order status to 'paid'
      const { error: updateError } = await supabaseServiceClient
        .from('orders')
        .update({ 
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_session_id', session_id);

      if (updateError) {
        console.error('Error updating order:', updateError);
      }

      // Here you would integrate with your email service (like Resend, SendGrid, etc.)
      // For now, we'll simulate sending a receipt
      const receiptData = {
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_intent: session.payment_intent,
        receipt_url: `${req.headers.get("origin")}/receipt/${session_id}`
      };

      // In a real implementation, you would send the email here
      console.log('Receipt would be sent to:', receiptData.customer_email);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Receipt sent successfully',
        receiptData 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      throw new Error('Payment not completed');
    }
  } catch (error) {
    console.error('Receipt sending error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});