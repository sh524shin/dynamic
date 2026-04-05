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
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 3,
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
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' },
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 glass p-6 aspect-video">
        <Line data={generateData()} options={options} />
      </div>

      <div className="glass p-6 space-y-8 h-full bg-slate-900/50">
        <h3 className="text-xl mb-4 text-secondary">파라미터 조절</h3>
        
        <div className="space-y-6">
          <div className="slider-group">
            <div className="flex justify-between text-sm mb-2">
              <label>진폭 (a): {a}</label>
              <InlineMath math="a \sin(bx+c)+d" />
            </div>
            <input 
              type="range" min="0.1" max="3" step="0.1" value={a} 
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full accent-primary h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="slider-group">
            <label className="block text-sm mb-2">주기 (b): {b}</label>
            <input 
              type="range" min="0.1" max="5" step="0.1" value={b} 
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full accent-secondary h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="slider-group">
            <label className="block text-sm mb-2">수평 이동 (c): {c}</label>
            <input 
              type="range" min="-3" max="3" step="0.1" value={c} 
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full accent-indigo-400 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="slider-group">
            <label className="block text-sm mb-2">수직 이동 (d): {d}</label>
            <input 
              type="range" min="-3" max="3" step="0.1" value={d} 
              onChange={(e) => setD(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-sm">
          <p className="text-primary font-bold mb-1">Key Concept:</p>
          주기(T) = <InlineMath math="\frac{2\pi}{|b|}" /> <br />
          최댓값 = <InlineMath math="|a| + d" /> / 최솟값 = <InlineMath math="-|a| + d" />
        </div>
      </div>
    </div>
  );
};

export default SineGrapher;
