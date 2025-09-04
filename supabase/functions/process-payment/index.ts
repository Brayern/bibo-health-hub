import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    const { email, reference } = await req.json();

    if (!email || !reference) {
      return new Response(
        JSON.stringify({ error: 'Email and reference are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log('Processing payment verification for:', { email, reference, userId: user.id });

    // Verify the payment with Paystack
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      console.error('Paystack secret key not found');
      return new Response(
        JSON.stringify({ error: 'Payment service configuration error' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const verifyData = await verifyResponse.json();
    console.log('Paystack verification response:', verifyData);

    if (!verifyData.status || verifyData.data.status !== 'success') {
      console.error('Payment verification failed:', verifyData);
      return new Response(
        JSON.stringify({ error: 'Payment verification failed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Check if payment amount matches expected amount (500 = $5.00 in cents)
    if (verifyData.data.amount !== 500) {
      console.error('Payment amount mismatch:', verifyData.data.amount);
      return new Response(
        JSON.stringify({ error: 'Payment amount mismatch' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Update user profile to grant reminders access
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ has_reminders_access: true })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Failed to update user profile:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to grant access' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    console.log('Successfully granted reminders access to user:', user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment verified and access granted' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing payment:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});