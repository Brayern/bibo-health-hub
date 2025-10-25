import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

interface TrendData {
  date: string;
  riskScore: number;
  riskLevel: string;
}

export const RiskTrends = () => {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendData();
  }, []);

  const fetchTrendData = async () => {
    try {
      const { data, error } = await supabase
        .from('health_risk_assessments')
        .select('risk_score, risk_level, created_at')
        .order('created_at', { ascending: true })
        .limit(10);

      if (error) throw error;

      const formattedData = data.map(item => ({
        date: new Date(item.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        riskScore: item.risk_score,
        riskLevel: item.risk_level,
      }));

      setTrendData(formattedData);
    } catch (error) {
      console.error('Error fetching trend data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Risk Trends Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading trend data...</p>
        </CardContent>
      </Card>
    );
  }

  if (trendData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Risk Trends Over Time
          </CardTitle>
          <CardDescription>
            Complete at least one assessment to see your risk trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No assessment data available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Risk Trends Over Time
        </CardTitle>
        <CardDescription>
          Track how your health risk score changes over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                domain={[0, 100]}
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="riskScore" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                name="Risk Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">Low Risk (0-33)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Medium Risk (34-66)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm">High Risk (67-100)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
