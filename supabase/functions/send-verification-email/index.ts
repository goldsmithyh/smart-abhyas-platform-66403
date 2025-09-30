
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const { email } = await req.json();
    
    if (!email) {
      throw new Error('Email is required');
    }

    console.log('Sending verification email to:', email);

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Clean up expired codes first
    await supabase.rpc('cleanup_expired_verification_codes');

    // Store verification code in database
    const { error: dbError } = await supabase
      .from('email_verification_codes')
      .insert({
        email: email.toLowerCase().trim(),
        code: code
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store verification code');
    }

    // Send verification email with your verified domain
    try {
      const emailResponse = await resend.emails.send({
        from: "Smart Abhyas <noreply@yourdomain.com>", // Replace with your verified domain
        to: [email],
        subject: "Your Account Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Account Verification Code</h2>
            <p>You requested to access your download history. Please use the following 6-digit code to verify your email:</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="font-size: 32px; color: #2563eb; margin: 0; letter-spacing: 4px;">${code}</h1>
            </div>
            <p style="color: #666;">This code will expire in 10 minutes.</p>
            <p style="color: #666;">If you didn't request this code, you can safely ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">Smart Abhyas Platform</p>
          </div>
        `,
      });

      if (emailResponse.error) {
        console.error('Email error:', emailResponse.error);
        throw new Error('Failed to send verification email: ' + emailResponse.error.message);
      }

      console.log('Verification email sent successfully to:', email);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Verification code sent successfully' 
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (emailError: any) {
      console.error('Email sending error:', emailError);
      
      // If email fails, still return the code for testing purposes
      // Remove this in production once domain is verified
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to send email. Please verify your domain in Resend.',
          testingCode: code, // Remove this line in production
          message: 'Domain verification required'
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
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
