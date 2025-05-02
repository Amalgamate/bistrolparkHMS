import React, { useEffect, useRef } from 'react';

interface DonutSegment {
  percent: number;
  color: string;
  label?: string;
}

interface DonutChartProps {
  value: number;
  segments: DonutSegment[];
}

export const DonutChart: React.FC<DonutChartProps> = ({ value, segments }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // For high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const innerRadius = radius * 0.7;
    
    // Draw segments
    let startAngle = -Math.PI / 2;
    
    segments.forEach((segment) => {
      const endAngle = startAngle + (segment.percent / 100) * (Math.PI * 2);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      
      ctx.fillStyle = segment.color;
      ctx.fill();
      
      startAngle = endAngle;
    });
    
    // Inner circle with value
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Total label
    ctx.font = 'italic 14px Arial';
    ctx.fillStyle = '#888888';
    ctx.fillText('Total Done', centerX, centerY - 15);
    
    // Value
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#2B4F60';
    ctx.fillText(`${value}%`, centerX, centerY + 15);
    
  }, [value, segments]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};