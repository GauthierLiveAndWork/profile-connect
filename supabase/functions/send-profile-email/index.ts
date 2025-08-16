import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendProfileEmailRequest {
  profileId: string;
  recipientEmail: string;
  senderName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT token for authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { profileId, recipientEmail, senderName }: SendProfileEmailRequest = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error || !profile) {
      throw new Error('Profile not found');
    }

    const profileUrl = `${Deno.env.get('SUPABASE_URL')?.replace('https://', 'https://acab41b3-d497-4ba3-b9d4-f7df895f5c2d.lovableproject.com')}/profile/${profileId}`;
    
    const emailResponse = await resend.emails.send({
      from: "LiveWork <stratellisgroup@gmail.com>",
      to: [recipientEmail],
      subject: `${profile.first_name} ${profile.last_name} a partagé son profil LiveWork avec vous`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">Profil LiveWork</h1>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 10px 0;">${profile.first_name} ${profile.last_name}</h2>
            <p style="color: #64748b; margin: 0;">${profile.job_role} - ${profile.sector}</p>
            ${profile.bio ? `<p style="margin: 15px 0 0 0;">${profile.bio}</p>` : ''}
          </div>

          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">🎯 Proposition de valeur</h3>
            <p style="margin: 0;">${profile.value_proposition}</p>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">💼 Compétences principales</h3>
            <p style="margin: 0;">${profile.top_skills}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${profileUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Voir le profil complet
            </a>
          </div>

          <p style="color: #64748b; text-align: center; font-size: 14px; margin-top: 30px;">
            ${senderName ? `Envoyé par ${senderName} via ` : 'Envoyé via '}LiveWork
          </p>
        </div>
      `,
    });

    console.log("Profile email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-profile-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);