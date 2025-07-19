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
    const { email, otpCode } = await req.json();
    
    if (!email || !otpCode) {
      throw new Error("Email and OTP code are required");
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find the most recent non-verified OTP for this email
    const { data: otpRecord, error: fetchError } = await supabaseAdmin
      .from("otp_verifications")
      .select("*")
      .eq("email", email)
      .eq("otp_code", otpCode)
      .eq("verified", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      throw new Error("Invalid or expired OTP code");
    }

    // Mark OTP as verified
    const { error: updateError } = await supabaseAdmin
      .from("otp_verifications")
      .update({ verified: true })
      .eq("id", otpRecord.id);

    if (updateError) {
      console.error("Error updating OTP:", updateError);
      throw new Error("Failed to verify OTP");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email verified successfully" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});