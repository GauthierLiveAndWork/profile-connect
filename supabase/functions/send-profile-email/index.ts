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

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Helper function for rate limiting
function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(identifier);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

// Input validation and sanitization
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function sanitizeHtml(text: string): string {
  return text
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, 1000); // Limit length
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
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing or invalid authentication token' }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Initialize Supabase client with auth
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { profileId, recipientEmail, senderName }: SendProfileEmailRequest = await req.json();

    // Input validation
    if (!profileId || typeof profileId !== 'string' || profileId.length > 100) {
      return new Response(JSON.stringify({ error: 'Invalid profile ID' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!recipientEmail || !validateEmail(recipientEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid recipient email address' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Rate limiting based on user ID
    const rateLimitKey = `email_${user.id}`;
    if (!checkRateLimit(rateLimitKey, 10, 300000)) { // 10 emails per 5 minutes
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait before sending more emails.' }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Use public_profiles view for secure data access
    const { data: profile, error } = await supabase
      .from('public_profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error || !profile) {
      console.log('Profile fetch error:', error);
      return new Response(JSON.stringify({ error: 'Profile not found or not public' }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify the profile is actually public
    if (!profile.is_public) {
      return new Response(JSON.stringify({ error: 'Profile is not public' }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const profileUrl = `${Deno.env.get('SUPABASE_URL')?.replace('https://', 'https://acab41b3-d497-4ba3-b9d4-f7df895f5c2d.lovableproject.com')}/profile/${profileId}`;
    
    // Sanitize profile data before including in email
    const sanitizedProfile = {
      first_name: sanitizeHtml(profile.first_name || ''),
      last_name: sanitizeHtml(profile.last_name || ''),
      job_role: sanitizeHtml(profile.job_role || ''),
      sector: sanitizeHtml(profile.sector || ''),
      bio: profile.bio ? sanitizeHtml(profile.bio) : '',
      value_proposition: sanitizeHtml(profile.value_proposition || ''),
      top_skills: sanitizeHtml(profile.top_skills || ''),
    };

    const sanitizedSenderName = senderName ? sanitizeHtml(senderName) : '';
    
    const emailResponse = await resend.emails.send({
      from: "LiveWork <stratellisgroup@gmail.com>",
      to: [recipientEmail],
      subject: `${sanitizedProfile.first_name} ${sanitizedProfile.last_name} a partagé son profil LiveWork avec vous`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">Profil LiveWork</h1>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 10px 0;">${sanitizedProfile.first_name} ${sanitizedProfile.last_name}</h2>
            <p style="color: #64748b; margin: 0;">${sanitizedProfile.job_role} - ${sanitizedProfile.sector}</p>
            ${sanitizedProfile.bio ? `<p style="margin: 15px 0 0 0;">${sanitizedProfile.bio}</p>` : ''}
          </div>

          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">🎯 Proposition de valeur</h3>
            <p style="margin: 0;">${sanitizedProfile.value_proposition}</p>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">💼 Compétences principales</h3>
            <p style="margin: 0;">${sanitizedProfile.top_skills}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${profileUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Voir le profil complet
            </a>
          </div>

          <p style="color: #64748b; text-align: center; font-size: 14px; margin-top: 30px;">
            ${sanitizedSenderName ? `Envoyé par ${sanitizedSenderName} via ` : 'Envoyé via '}LiveWork
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