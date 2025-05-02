import React, { useEffect, useRef } from 'react';

interface DataPoint {
  label: string;
  discharge: number;
  new: number;
}

interface LineChartProps {
  data: DataPoint[];
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
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
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 30, right: 20, bottom: 40, left: 40 };
    
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Find max value for scale
    const maxValue = Math.max(
      ...data.map(d => Math.max(d.discharge, d.new)),
      60 // Set minimum max to 60 for better visualization
    );
    
    // Scale functions
    const xScale = (i: number) => padding.left + (i / (data.length - 1)) * chartWidth;
    const yScale = (value: number) => padding.top + chartHeight - (value / maxValue) * chartHeight;
    
    // Draw grid lines
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (i / 4) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      // Y-axis labels
      ctx.fillStyle = '#888888';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(maxValue - (i / 4) * maxValue)}`, padding.left - 5, y);
    }
    
    // Draw area fill for discharge data
    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(data[0].discharge));
    
    for (let i = 0; i < data.length; i++) {
      if (i > 0) {
        const x0 = xScale(i - 1);
        const y0 = yScale(data[i - 1].discharge);
        const x1 = xScale(i);
        const y1 = yScale(data[i].discharge);
        
        // Control points for smooth curve
        const cpx1 = x0 + (x1 - x0) / 3;
        const cpy1 = y0;
        const cpx2 = x1 - (x1 - x0) / 3;
        const cpy2 = y1;
        
        ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x1, y1);
      }
    }
    
    // Complete the area fill
    ctx.lineTo(xScale(data.length - 1), yScale(0));
    ctx.lineTo(xScale(0), yScale(0));
    ctx.closePath();
    
    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(43, 79, 96, 0.2)');
    gradient.addColorStop(1, 'rgba(43, 79, 96, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw line for discharge data
    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(data[0].discharge));
    
    for (let i = 0; i < data.length; i++) {
      if (i > 0) {
        const x0 = xScale(i - 1);
        const y0 = yScale(data[i - 1].discharge);
        const x1 = xScale(i);
        const y1 = yScale(data[i].discharge);
        
        // Control points for smooth curve
        const cpx1 = x0 + (x1 - x0) / 3;
        const cpy1 = y0;
        const cpx2 = x1 - (x1 - x0) / 3;
        const cpy2 = y1;
        
        ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x1, y1);
      }
    }
    
    ctx.strokeStyle = '#2B4F60';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw data points for discharge
    for (let i = 0; i < data.length; i++) {
      const x = xScale(i);
      const y = yScale(data[i].discharge);
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#2B4F60';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Draw dashed line for new data
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(xScale(0), yScale(data[0].new));
    
    for (let i = 0; i < data.length; i++) {
      if (i > 0) {
        const x0 = xScale(i - 1);
        const y0 = yScale(data[i - 1].new);
        const x1 = xScale(i);
        const y1 = yScale(data[i].new);
        
        // Control points for smooth curve
        const cpx1 = x0 + (x1 - x0) / 3;
        const cpy1 = y0;
        const cpx2 = x1 - (x1 - x0) / 3;
        const cpy2 = y1;
        
        ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x1, y1);
      }
    }
    
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
    
    // X-axis labels
    ctx.fillStyle = '#888888';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    data.forEach((d, i) => {
      const x = xScale(i);
      ctx.fillText(d.label, x, height - padding.bottom + 10);
    });
    
  }, [data]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};