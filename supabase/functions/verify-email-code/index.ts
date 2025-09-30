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
    const { email, code } = await req.json();
    
    if (!email || !code) {
      throw new Error('Email and code are required');
    }

    console.log('Verifying code for email:', email);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Clean up expired codes first
    await supabase.rpc('cleanup_expired_verification_codes');

    // Find valid verification code
    const { data: verificationData, error: verificationError } = await supabase
      .from('email_verification_codes')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('code', code)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (verificationError || !verificationData) {
      console.error('Verification failed:', verificationError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired verification code' 
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Mark code as used
    await supabase
      .from('email_verification_codes')
      .update({ is_used: true })
      .eq('id', verificationData.id);

    console.log('Email verification successful');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email verified successfully' 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-email-code function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});