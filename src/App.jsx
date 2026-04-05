import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Book, Activity, Home, Info } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import SineGrapher from './components/SineGrapher';
import FormulaSection from './components/FormulaSection';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', title: '홈', icon: <Home size={20} /> },
    { id: 'simulator', title: '시뮬레이터', icon: <Activity size={20} /> },
    { id: 'formulas', title: '공식 요약', icon: <Book size={20} /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation Bar - Modern Floating Pill */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-auto">
        <div className="glass px-2 py-2 flex items-center gap-1 backdrop-blur-3xl shadow-2xl">
          <div className="px-4 pr-6 border-r border-glass-stroke hidden md:flex items-center gap-2">
            <Calculator className="text-neon-cyan" size={24} />
            <span className="brand text-lg font-black tracking-tighter">MATH<span className="text-primary-glow">AI</span></span>
          </div>
          <div className="flex gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-pill flex items-center gap-2 ${
                  activeTab === item.id 
                  ? 'active' 
                  : 'text-text-muted hover:text-text-main'
                }`}
              >
                {item.icon}
                <span className="text-sm font-bold tracking-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container pt-32 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 flex flex-col md:flex-row items-center justify-center gap-12"
            >
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
                  <span className="text-transparent bg-clip-text bg-accent-gradient">삼각함수를</span><br />
                  직관적으로 마스터하세요.
                </h1>
                <p className="text-text-muted text-lg mb-12 max-w-2xl mx-auto md:mx-0">
                  1 CPU, 1GB RAM에서도 부드럽게 작동하는 최첨단 수학 시각화 시스템.<br />
                  사인법칙부터 코사인법칙까지, 눈으로 보고 직접 조절하며 배우세요.
                </p>
                <div className="flex justify-center md:justify-start gap-6">
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="relative group px-10 py-5 overflow-hidden rounded-2xl bg-primary font-black text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-100 group-hover:scale-110 transition-transform" />
                    <span className="relative z-10 text-white">시뮬레이터 시작</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('formulas')}
                    className="glass px-10 py-5 text-lg font-black text-white hover:bg-white/10 transition-all border border-white/20 hover:border-white/40"
                  >
                    공식 도감 보기
                  </button>
                </div>
              </div>
              
              <div className="flex-1 relative max-w-sm md:max-w-md w-full">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <img 
                  src="/pythagoras.png" 
                  alt="Pythagoras AI Character" 
                  className="relative z-10 w-full h-auto drop-shadow-[0_20px_50px_rgba(99,102,241,0.3)] animate-fade"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'simulator' && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <SineGrapher />
            </motion.div>
          )}

          {activeTab === 'formulas' && (
            <motion.div
              key="formulas"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FormulaSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-glass-border text-center text-text-muted text-sm px-4">
        <p>© 2026 MathAI. Optimization for 1 CPU / 1GB RAM Instance.</p>
        <p className="mt-2">Oracle Cloud (168.107.37.200) Deployment Optimized.</p>
      </footer>
    </div>
  );
}

export default App;
