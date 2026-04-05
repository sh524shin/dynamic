import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { InlineMath } from 'react-katex';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SineGrapher = () => {
  const chartRef = useRef(null);
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [c, setC] = useState(0);
  const [d, setD] = useState(0);
  const [isAnimate, setIsAnimate] = useState(true);
  
  // High-performance state for animation (non-react state to avoid re-renders)
  const animationState = useRef({ offset: 0 });

  // 1. Initial stable data structure
  const initialData = useMemo(() => {
    const labels = [];
    for (let x = -10; x <= 10; x += 0.2) {
      labels.push(x.toFixed(1));
    }
    return {
      labels,
      datasets: [
        {
          label: 'Main Pulse',
          data: new Array(labels.length).fill(0),
          borderColor: '#00f3ff',
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 4,
          fill: false,
        },
        {
          label: 'Glow Echo',
          data: new Array(labels.length).fill(0),
          borderColor: 'rgba(0, 243, 255, 0.2)',
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 12,
          fill: false,
        },
        {
          label: '3D Shadow',
          data: new Array(labels.length).fill(0),
          borderColor: 'rgba(99, 102, 241, 0.1)',
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
          fill: true,
        },
      ],
    };
  }, []);

  // 2. Direct Update Animation Loop
  useEffect(() => {
    let animationFrame;
    const updateChart = () => {
      const chart = chartRef.current;
      if (!chart) return;

      if (isAnimate) {
        animationState.current.offset = (animationState.current.offset + 0.05) % (Math.PI * 2);
      }

      const offset = animationState.current.offset;

      // Update data directly on the chart instance
      for (let i = 0; i < chart.data.labels.length; i++) {
        const x = parseFloat(chart.data.labels[i]);
        let val = a * Math.sin(b * (x - offset) + c) + d;
        
        // Hard Clamp to stay within view
        val = Math.max(-6, Math.min(6, val));
        
        chart.data.datasets[0].data[i] = val;
        chart.data.datasets[1].data[i] = Math.min(6.1, val + 0.1); // Slightly allow for glow layering
        chart.data.datasets[2].data[i] = Math.max(-6.1, val - 0.1);
      }

      // Force fixed scale once more before updating
      chart.options.scales.y.min = -6;
      chart.options.scales.y.max = 6;
      
      chart.update('none'); // Update without animation/re-layout
      animationFrame = requestAnimationFrame(updateChart);
    };

    animationFrame = requestAnimationFrame(updateChart);
    return () => cancelAnimationFrame(animationFrame);
  }, [isAnimate, a, b, c, d]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      y: {
        min: -6,
        max: 6,
        afterDataLimits: (scale) => {
          scale.max = 6;
          scale.min = -6;
        },
        grid: { color: 'rgba(255, 255, 255, 0.02)' },
        ticks: { 
          color: '#64748b', 
          font: { size: 10 }, 
          stepSize: 1,
          precision: 0,
          callback: (value) => (Number.isInteger(value) ? value : null) 
        },
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.02)' },
        ticks: { color: '#64748b', font: { size: 10 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
  }), []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 glass p-8 h-[450px] relative overflow-hidden">
        <div className="absolute top-4 right-8 flex items-center gap-2 z-20">
          <button 
            onClick={() => setIsAnimate(!isAnimate)}
            className={`text-[10px] font-black px-3 py-1 rounded-full border transition-all ${
              isAnimate ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan' : 'bg-white/5 border-white/20 text-text-muted'
            }`}
          >
            {isAnimate ? '● LIVE' : '○ PAUSED'}
          </button>
        </div>
        <div className="relative h-full w-full">
          <Line ref={chartRef} data={initialData} options={options} />
        </div>
      </div>

      <div className="glass p-8 space-y-8 h-full bg-slate-900/40">
        <h3 className="text-2xl mb-6 font-black tracking-tight text-white">시뮬레이션 조절</h3>
        
        <div className="space-y-8">
          <div className="slider-group group">
            <div className="flex justify-between items-center text-sm mb-3">
              <label className="font-bold text-text-muted group-hover:text-neon-cyan transition-colors">Amplitude (진폭): {a}</label>
              <span className="opacity-40 text-[10px]">A</span>
            </div>
            <input 
              type="range" min="0.1" max="3" step="0.1" value={a} 
              onChange={(e) => setA(parseFloat(e.target.value))}
            />
          </div>

          <div className="slider-group group">
            <div className="flex justify-between items-center text-sm mb-3">
              <label className="font-bold text-text-muted group-hover:text-secondary transition-colors">Frequency (주기): {b}</label>
              <span className="opacity-40 text-[10px]">B</span>
            </div>
            <input 
              type="range" min="0.1" max="5" step="0.1" value={b} 
              onChange={(e) => setB(parseFloat(e.target.value))}
            />
          </div>

          <div className="slider-group group">
            <div className="flex justify-between items-center text-sm mb-3">
              <label className="font-bold text-text-muted group-hover:text-accent transition-colors">Phase Shift (이동): {c}</label>
              <span className="opacity-40 text-[10px]">C</span>
            </div>
            <input 
              type="range" min="-3" max="3" step="0.1" value={c} 
              onChange={(e) => setC(parseFloat(e.target.value))}
            />
          </div>

          <div className="slider-group group">
            <div className="flex justify-between items-center text-sm mb-3">
              <label className="font-bold text-text-muted group-hover:text-white transition-colors">Vertical Shift: {d}</label>
              <span className="opacity-40 text-[10px]">D</span>
            </div>
            <input 
              type="range" min="-3" max="3" step="0.1" value={d} 
              onChange={(e) => setD(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-sm backdrop-blur-md">
          <p className="text-secondary font-black mb-3 uppercase tracking-tighter text-[10px]">Mathematical Insight</p>
          <div className="space-y-3 text-text-muted">
            <div className="p-2 bg-black/20 rounded-lg">
               <InlineMath math={`y = ${a}\\sin(${b}x + ${c}) + ${d}`} />
            </div>
            <p className="text-[12px]">치역: <InlineMath math={`[${(d-Math.abs(a)).toFixed(1)}, ${(d+Math.abs(a)).toFixed(1)}]`} /></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SineGrapher;
