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
      {/* Navigation Bar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
        <div className="glass px-6 py-4 flex justify-between items-center">
          <div className="brand text-xl text-primary flex items-center gap-2">
            <Calculator className="text-secondary" />
            <span>MathAI</span>
          </div>
          <div className="flex gap-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-2 transition-all flex items-center gap-1.5 rounded-lg ${
                  activeTab === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-text-muted hover:text-text-main'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline font-semibold text-sm">{item.title}</span>
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
              className="text-center py-12"
            >
              <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-accent-gradient">삼각함수를</span><br />
                직관적으로 마스터하세요.
              </h1>
              <p className="text-text-muted text-lg mb-12 max-w-2xl mx-auto">
                1 CPU, 1GB RAM에서도 부드럽게 작동하는 최첨단 수학 시각화 시스템.<br />
                사인법칙부터 코수인법칙까지, 눈으로 보고 직접 조절하며 배우세요.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setActiveTab('simulator')}
                  className="bg-primary text-white px-8 py-4 text-lg font-bold hover:scale-105"
                >
                  시뮬레이터 시작
                </button>
                <button
                  onClick={() => setActiveTab('formulas')}
                  className="glass px-8 py-4 text-lg font-bold hover:bg-white/5"
                >
                  공식 도감 보기
                </button>
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
