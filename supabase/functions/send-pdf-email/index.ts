import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      userEmail, 
      userName, 
      schoolName,
      pdfUrl, 
      pdfFileName,
      subject,
      standard,
      examType,
      paperType 
    } = await req.json();

    console.log('Sending PDF email to:', userEmail);

    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY not configured');
    }

    // Fetch the PDF file
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));

    // Send email with PDF attachment via Brevo
    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Smart Abhyas',
          email: 'noreply@smartabhyas.com'
        },
        to: [
          {
            email: userEmail,
            name: userName || 'Student'
          }
        ],
        subject: `Your ${paperType === 'question' ? 'Question' : 'Answer'} Paper - ${subject}`,
        htmlContent: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #D648D7;">नमस्कार ${userName || 'Student'},</h2>
                <p>आपल्या खरेदीबद्दल धन्यवाद! आपली PDF संलग्न आहे.</p>
                
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Paper Details:</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li><strong>School:</strong> ${schoolName}</li>
                    <li><strong>Standard:</strong> ${standard}</li>
                    <li><strong>Subject:</strong> ${subject}</li>
                    <li><strong>Exam Type:</strong> ${examType}</li>
                    <li><strong>Paper Type:</strong> ${paperType === 'question' ? 'Question Paper' : 'Answer Paper'}</li>
                  </ul>
                </div>
                
                <p>आपल्या शाळेचे watermark सह PDF संलग्न केली आहे.</p>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  काही प्रश्न असल्यास, कृपया आमच्याशी संपर्क साधा.<br>
                  Smart Abhyas टीम
                </p>
              </div>
            </body>
          </html>
        `,
        attachment: [
          {
            content: base64Pdf,
            name: pdfFileName
          }
        ]
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Brevo API error:', errorText);
      throw new Error(`Failed to send email: ${emailResponse.status}`);
    }

    const result = await emailResponse.json();
    console.log('Email sent successfully:', result);

    return new Response(JSON.stringify({ success: true, messageId: result.messageId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending PDF email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
