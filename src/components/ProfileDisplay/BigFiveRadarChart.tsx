import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface BigFiveRadarChartProps {
  data: Array<{
    dimension: string;
    score: number;
    color: string;
  }>;
}

export const BigFiveRadarChart = ({ data }: BigFiveRadarChartProps) => {
  // Transformer les données pour le radar chart
  const radarData = data.map(item => ({
    dimension: item.dimension,
    score: item.score * 20, // Convertir de 0-5 à 0-100 pour une meilleure visualisation
    fullMark: 100
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData}>
          <PolarGrid 
            gridType="polygon" 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.3}
          />
          <PolarAngleAxis 
            dataKey="dimension" 
            tick={{ 
              fill: 'hsl(var(--foreground))', 
              fontSize: 12,
              fontWeight: 500
            }}
            className="text-sm"
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ 
              fill: 'hsl(var(--muted-foreground))', 
              fontSize: 10 
            }}
            tickCount={6}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ 
              fill: 'hsl(var(--primary))', 
              strokeWidth: 2, 
              stroke: 'hsl(var(--background))',
              r: 4
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};