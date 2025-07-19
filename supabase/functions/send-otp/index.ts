import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { email } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Store OTP in database (expires in 10 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const { error: insertError } = await supabaseAdmin
      .from("otp_verifications")
      .insert({
        email,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        verified: false
      });

    if (insertError) {
      console.error("Error inserting OTP:", insertError);
      throw new Error("Failed to generate OTP");
    }

    // Send email with OTP (using a simple HTML email)
    const emailContent = `
      <h2>Email Verification - TechHaven</h2>
      <p>Your verification code is: <strong style="font-size: 24px; color: #3b82f6;">${otpCode}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
    `;

    // Send email using Supabase Edge Function
    const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-receipt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
      },
      body: JSON.stringify({
        to: email,
        subject: "Email Verification - TechHaven",
        html: emailContent
      })
    });

    if (!emailResponse.ok) {
      console.error("Failed to send OTP email");
      // Don't throw error here - OTP is still stored and can be used
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "OTP sent successfully",
        expires_in: 600 // 10 minutes in seconds
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error sending OTP:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});