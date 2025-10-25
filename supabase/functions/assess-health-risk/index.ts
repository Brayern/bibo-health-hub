import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      age, 
      bmi, 
      systolicBp, 
      diastolicBp, 
      glucoseLevel, 
      smoking, 
      alcoholConsumption, 
      physicalActivity, 
      familyHistory 
    } = await req.json();

    console.log('Received health data:', { age, bmi, systolicBp, diastolicBp, glucoseLevel });

    // Get Lovable API key
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create AI prompt for risk assessment
    const prompt = `You are a medical health risk assessment AI. Analyze the following health data and provide a comprehensive risk assessment.

Health Data:
- Age: ${age} years
- BMI: ${bmi}
- Blood Pressure: ${systolicBp}/${diastolicBp} mmHg
- Glucose Level: ${glucoseLevel} mg/dL
- Smoking: ${smoking ? 'Yes' : 'No'}
- Alcohol Consumption: ${alcoholConsumption}
- Physical Activity: ${physicalActivity}
- Family History of chronic diseases: ${familyHistory ? 'Yes' : 'No'}

Based on this data, provide:
1. A risk score from 0-100
2. A risk level (low, medium, or high)
3. 3-5 personalized health tips

Format your response as JSON with this exact structure:
{
  "riskScore": <number between 0-100>,
  "riskLevel": "<low|medium|high>",
  "healthTips": ["tip1", "tip2", "tip3"]
}`;

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are a medical AI assistant specializing in health risk assessment. Always respond with valid JSON only." 
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const aiContent = aiResponse.choices[0].message.content;
    
    console.log('AI response:', aiContent);

    // Parse AI response
    let assessment;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiContent;
      assessment = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI assessment');
    }

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Store assessment in database
    const { data: savedAssessment, error: dbError } = await supabase
      .from('health_risk_assessments')
      .insert({
        user_id: user.id,
        age,
        bmi,
        systolic_bp: systolicBp,
        diastolic_bp: diastolicBp,
        glucose_level: glucoseLevel,
        smoking,
        alcohol_consumption: alcoholConsumption,
        physical_activity: physicalActivity,
        family_history: familyHistory,
        risk_level: assessment.riskLevel,
        risk_score: assessment.riskScore,
        health_tips: assessment.healthTips
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save assessment');
    }

    return new Response(
      JSON.stringify({
        assessment: savedAssessment,
        message: 'Health risk assessment completed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in assess-health-risk function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
