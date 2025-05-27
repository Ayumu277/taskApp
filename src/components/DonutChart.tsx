'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  completion: number; // 0-100
}

const DonutChart: React.FC<DonutChartProps> = ({ completion }) => {
  // Ensure completion is within 0-100 range
  const safeCompletion = Math.min(100, Math.max(0, completion));
  
  // Data for the chart - completed and remaining
  const data = [
    { name: 'Completed', value: safeCompletion },
    { name: 'Remaining', value: 100 - safeCompletion }
  ];
  
  // Colors for the segments
  const COLORS = ['#4ade80', '#e5e7eb']; // green for completed, gray for remaining
  
  return (
    <div style={{ width: '200px', height: '200px', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Centered percentage text overlay */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        <div className="text-2xl font-bold">{Math.round(safeCompletion)}%</div>
      </div>
    </div>
  );
};

export default DonutChart;