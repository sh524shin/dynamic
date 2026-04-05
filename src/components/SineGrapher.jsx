import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
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
  Legend
);

const SineGrapher = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [c, setC] = useState(0);
  const [d, setD] = useState(0);
  const [isAnimate, setIsAnimate] = useState(true);
  const [offset, setOffset] = useState(0);

  // Animation Loop for "Flow" Effect
  useEffect(() => {
    let animationFrame;
    if (isAnimate) {
      const animate = () => {
        setOffset((prev) => (prev + 0.05) % (Math.PI * 2));
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isAnimate]);

  const generateData = () => {
    const labels = [];
    const mainData = [];
    const glowData = [];
    const shadowData = [];
    
    // Multi-layer for 3D Ribbon perception
    for (let x = -10; x <= 10; x += 0.2) {
      labels.push(x.toFixed(1));
      // Clamp values strictly to prevent scale overflow
      let val = a * Math.sin(b * (x - offset) + c) + d;
      val = Math.max(-5.5, Math.min(5.5, val)); 
      
      mainData.push(val);
      glowData.push(Math.min(5.8, val + 0.1)); 
      shadowData.push(Math.max(-5.8, val - 0.1)); 
    }

    return {
      labels,
      datasets: [
        {
          label: 'Main Pulse',
          data: mainData,
          borderColor: '#00f3ff',
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 4,
          fill: false,
        },
        {
          label: 'Glow Echo',
          data: glowData,
          borderColor: 'rgba(0, 243, 255, 0.2)',
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 12,
          fill: false,
        },
        {
          label: '3D Shadow',
          data: shadowData,
          borderColor: 'rgba(99, 102, 241, 0.1)',
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
          fill: true,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 }, 
    scales: {
      y: {
        min: -6,
        max: 6,
        suggestedMin: -6,
        suggestedMax: 6,
        afterDataLimits: (scale) => {
          scale.max = 6;
          scale.min = -6;
        },
        grid: { color: 'rgba(255, 255, 255, 0.02)' },
        ticks: { 
          color: '#64748b', 
          font: { size: 10 }, 
          stepSize: 2,
          precision: 0
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
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 glass p-8 h-[450px] relative">
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
        <Line data={generateData()} options={options} />
      </div>

      <div className="glass p-8 space-y-8 h-full bg-slate-900/40">
        <h3 className="text-2xl mb-6 font-black tracking-tight text-white">시각화 컨트롤</h3>
        
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
