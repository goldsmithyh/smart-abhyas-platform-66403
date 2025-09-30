import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, paperId, userInfo } = await req.json();
    
    console.log('Creating Razorpay order for amount:', amount, 'paperId:', paperId);

    const razorpayKeyId = 'rzp_live_PyaKPT1dVoYKhE';
    const razorpaySecret = Deno.env.get('RAZORPAY_SECRET_KEY');

    if (!razorpaySecret) {
      throw new Error('Razorpay secret key not configured');
    }

    // Create order with Razorpay API
    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpaySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          paperId: paperId,
          userEmail: userInfo.email,
          schoolName: userInfo.schoolName
        }
      }),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('Razorpay API error:', errorText);
      throw new Error(`Razorpay API error: ${orderResponse.status}`);
    }

    const order = await orderResponse.json();
    console.log('Razorpay order created:', order.id);

    return new Response(JSON.stringify(order), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});