-- Create health risk assessments table
CREATE TABLE public.health_risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  age INTEGER NOT NULL,
  bmi NUMERIC NOT NULL,
  systolic_bp INTEGER NOT NULL,
  diastolic_bp INTEGER NOT NULL,
  glucose_level NUMERIC NOT NULL,
  smoking BOOLEAN NOT NULL DEFAULT false,
  alcohol_consumption TEXT NOT NULL CHECK (alcohol_consumption IN ('none', 'moderate', 'heavy')),
  physical_activity TEXT NOT NULL CHECK (physical_activity IN ('sedentary', 'light', 'moderate', 'active')),
  family_history BOOLEAN NOT NULL DEFAULT false,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  risk_score NUMERIC NOT NULL,
  health_tips TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.health_risk_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own risk assessments"
ON public.health_risk_assessments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own risk assessments"
ON public.health_risk_assessments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own risk assessments"
ON public.health_risk_assessments
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_health_risk_assessments_user_id ON public.health_risk_assessments(user_id);
CREATE INDEX idx_health_risk_assessments_created_at ON public.health_risk_assessments(created_at DESC);