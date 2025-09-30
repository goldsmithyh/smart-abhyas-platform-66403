
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

    // Get Brevo API key from Supabase secrets
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    
    let emailSent = false;
    let emailError = null;

    if (!brevoApiKey) {
      console.error('BREVO_API_KEY not found in environment variables');
      emailError = 'Email service not configured';
    } else {
      try {
        const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': brevoApiKey,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            sender: {
              name: "Smart Creations",
              email: "smartshikshans@gmail.com"
            },
            to: [
              {
                email: email,
                name: email.split('@')[0]
              }
            ],
            subject: "Your Account Verification Code - Smart Abhyas",
            htmlContent: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #2563eb; margin: 0;">Smart Abhyas</h1>
                  <p style="color: #666; margin: 5px 0;">Educational Platform</p>
                </div>
                
                <div style="background: #f8fafc; padding: 30px; border-radius: 8px; text-align: center;">
                  <h2 style="color: #333; margin-bottom: 20px;">Email Verification Required</h2>
                  <p style="color: #666; margin-bottom: 30px;">Please use the following 6-digit code to verify your email address:</p>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e5e7eb;">
                    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: monospace;">
                      ${code}
                    </div>
                  </div>
                  
                  <p style="color: #ef4444; font-weight: 500; margin: 20px 0;">⏰ This code will expire in 5 minutes</p>
                  <p style="color: #666; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    © 2024 Smart Abhyas Platform. All rights reserved.
                  </p>
                </div>
              </div>
            `
          })
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.text();
          console.error('Brevo API error:', errorData);
          emailError = 'Failed to send email: ' + errorData;
        } else {
          const responseData = await emailResponse.json();
          console.log('Email sent successfully via Brevo:', responseData);
          emailSent = true;
        }
      } catch (error: any) {
        console.error('Email sending error:', error);
        emailError = 'Email service temporarily unavailable: ' + error.message;
      }
    }

    // Always return success if we stored the code in database
    // This ensures the UI shows the code input field
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: emailSent 
          ? 'Verification code sent successfully to your email' 
          : 'Verification code generated. Email service may be temporarily unavailable.',
        emailSent: emailSent,
        emailError: emailError
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
    console.error("Error in send-brevo-verification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
