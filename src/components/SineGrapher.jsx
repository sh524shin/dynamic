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

  const generateData = () => {
    const labels = [];
    const data = [];
    for (let x = -10; x <= 10; x += 0.2) {
      labels.push(x.toFixed(1));
      data.push(a * Math.sin(b * x + c) + d);
    }
    return {
      labels,
      datasets: [
        {
          label: `y = ${a}sin(${b}x + ${c}) + ${d}`,
          data: data,
          borderColor: '#00f3ff', // Neon Cyan
          backgroundColor: 'rgba(0, 243, 255, 0.1)',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 4,
          fill: true,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: -5,
        max: 5,
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#64748b' },
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#64748b' },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 glass p-8 aspect-video min-h-[400px]">
        <Line data={generateData()} options={options} />
      </div>

      <div className="glass p-8 space-y-8 h-full">
        <h3 className="text-2xl mb-6 font-black tracking-tight text-white drop-shadow-sm">파라미터 조절</h3>
        
        <div className="space-y-8">
          <div className="slider-group group">
            <div className="flex justify-between items-center text-sm mb-3">
              <label className="font-bold text-text-muted group-hover:text-neon-cyan transition-colors">진폭 (Amplitude): {a}</label>
              <span className="opacity-50"><InlineMath math="a" /></span>
            </div>
            <input 
              type="range" min="0.1" max="3" step="0.1" value={a} 
              onChange={(e) => setA(parseFloat(e.target.value))}
            />
          </div>

          <div className="slider-group group">
            <div className="flex justify-between items-center text-sm mb-3">
              <label className="font-bold text-text-muted group-hover:text-secondary transition-colors">주기 (Frequency): {b}</label>
              <span className="opacity-50"><InlineMath math="b" /></span>
            </div>
            <input 
              type="range" min="0.1" max="5" step="0.1" value={b} 
              onChange={(e) => setB(parseFloat(e.target.value))}
            />
          </div>

          <div className="slider-group group">
            <div className="flex justify-between items-center text-sm mb-3">
              <label className="font-bold text-text-muted group-hover:text-accent transition-colors">수평 이동 (Phase): {c}</label>
              <span className="opacity-50"><InlineMath math="c" /></span>
            </div>
            <input 
              type="range" min="-3" max="3" step="0.1" value={c} 
              onChange={(e) => setC(parseFloat(e.target.value))}
            />
          </div>

          <div className="slider-group group">
            <div className="flex justify-between items-center text-sm mb-3">
              <label className="font-bold text-text-muted group-hover:text-white transition-colors">수직 이동 (Shift): {d}</label>
              <span className="opacity-50"><InlineMath math="d" /></span>
            </div>
            <input 
              type="range" min="-3" max="3" step="0.1" value={d} 
              onChange={(e) => setD(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-sm backdrop-blur-md">
          <p className="text-secondary font-black mb-2 uppercase tracking-widest text-[10px]">Key Mathematical Concept</p>
          <div className="space-y-2 text-text-muted">
            <p>주기(T) = <InlineMath math="\frac{2\pi}{|b|}" /></p>
            <p>치역 = <InlineMath math="[ -|a|+d, |a|+d ]" /></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SineGrapher;
