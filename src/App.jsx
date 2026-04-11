import React, { useState, useReducer, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Book, Activity, Home, Gamepad2, Play, Pause, RotateCcw, Trophy, ArrowRight, ArrowDown, ArrowLeft, ChevronsDown } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import SineGrapher from './components/SineGrapher';
import FormulaSection from './components/FormulaSection';

// --- VERSION TIMESTAMP ---
const VERSION = "2026.04.11.08:23 - Force Arcade Fix";

// --- TETRIS CONSTANTS ---
const COLS = 10;
const ROWS = 20;
const INITIAL_SPEED = 800;

const TETROMINOES = {
  I: { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], color: '#00f3ff' },
  J: { shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], color: '#3b82f6' },
  L: { shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], color: '#f59e0b' },
  O: { shape: [[1, 1], [1, 1]], color: '#facc15' },
  S: { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: '#10b981' },
  T: { shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], color: '#bc13fe' },
  Z: { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: '#ef4444' },
};

const getRandomPiece = () => {
  const keys = Object.keys(TETROMINOES);
  const type = keys[Math.floor(Math.random() * keys.length)];
  return { ...TETROMINOES[type], type };
};

const checkCollision = (shape, x, y, board) => {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] !== 0) {
        const nx = x + c;
        const ny = y + r;
        if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && board[ny][nx] !== 0)) return true;
      }
    }
  }
  return false;
};

const createInitialState = () => {
  const p = getRandomPiece();
  return {
    grid: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
    activePiece: { ...p, pos: { x: 3, y: 0 } },
    nextPiece: getRandomPiece(),
    score: 0, level: 1, isGameOver: false, isPaused: false, speed: INITIAL_SPEED
  };
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SPAWN':
      const piece = state.nextPiece;
      if (checkCollision(piece.shape, 3, 0, state.grid)) return { ...state, isGameOver: true };
      return { ...state, activePiece: { ...piece, pos: { x: 3, y: 0 } }, nextPiece: getRandomPiece() };
    case 'MOVE':
      if (!state.activePiece || state.isPaused || state.isGameOver) return state;
      if (!checkCollision(state.activePiece.shape, state.activePiece.pos.x + action.dx, state.activePiece.pos.y + action.dy, state.grid)) {
        return { ...state, activePiece: { ...state.activePiece, pos: { x: state.activePiece.pos.x + action.dx, y: state.activePiece.pos.y + action.dy } } };
      }
      if (action.dy > 0) return gameReducer(state, { type: 'LOCK' });
      return state;
    case 'ROTATE':
      if (!state.activePiece || state.isPaused || state.isGameOver) return state;
      const rotated = state.activePiece.shape[0].map((_, i) => state.activePiece.shape.map(row => row[i]).reverse());
      if (!checkCollision(rotated, state.activePiece.pos.x, state.activePiece.pos.y, state.grid)) {
        return { ...state, activePiece: { ...state.activePiece, shape: rotated } };
      }
      return state;
    case 'LOCK':
      const newGrid = state.grid.map(r => [...r]);
      state.activePiece.shape.forEach((r, ri) => r.forEach((c, ci) => {
        if (c !== 0) {
          const y = state.activePiece.pos.y + ri;
          const x = state.activePiece.pos.x + ci;
          if (y >= 0 && y < ROWS) newGrid[y][x] = state.activePiece.color;
        }
      }));
      const remaining = newGrid.filter(row => !row.every(cell => cell !== 0));
      const cleared = ROWS - remaining.length;
      const finalGrid = [...Array.from({ length: cleared }, () => Array(COLS).fill(0)), ...remaining];
      const newScore = state.score + [0, 100, 300, 500, 800][cleared] * state.level;
      const newLevel = Math.floor(newScore / 2000) + 1;
      return gameReducer({ ...state, grid: finalGrid, score: newScore, level: newLevel, speed: Math.max(100, INITIAL_SPEED * Math.pow(0.92, newLevel - 1)), activePiece: null }, { type: 'SPAWN' });
    case 'HARD_DROP':
      if (!state.activePiece) return state;
      let d = 0; while (!checkCollision(state.activePiece.shape, state.activePiece.pos.x, state.activePiece.pos.y + d + 1, state.grid)) d++;
      return gameReducer(state, { type: 'MOVE', dx: 0, dy: d });
    case 'PAUSE': return { ...state, isPaused: !state.isPaused };
    case 'RESET': return createInitialState();
    default: return state;
  }
}

const TetrisInternal = () => {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // --- HIGH SCORE ---
  const [highScores, setHighScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tetris-hiscores') || '[]'); }
    catch { return []; }
  });
  const [nameInput, setNameInput] = useState('');
  const isNewHigh = state.isGameOver && state.score > 0 &&
    (highScores.length < 5 || state.score > (highScores[highScores.length - 1]?.score ?? 0));

  const submitScore = () => {
    const name = nameInput.trim().slice(0, 12);
    if (name) {
      const updated = [...highScores, { name, score: state.score }]
        .sort((a, b) => b.score - a.score).slice(0, 5);
      setHighScores(updated);
      localStorage.setItem('tetris-hiscores', JSON.stringify(updated));
    }
    setNameInput('');
    dispatch({ type: 'RESET' });
  };

  useEffect(() => {
    if (state.isGameOver || state.isPaused) return;
    const t = setInterval(() => dispatch({ type: 'MOVE', dx: 0, dy: 1 }), state.speed);
    return () => clearInterval(t);
  }, [state.isGameOver, state.isPaused, state.speed]);

  useEffect(() => {
    const hk = (e) => {
      if (stateRef.current.isGameOver) return;
      if (e.key === 'ArrowLeft') dispatch({ type: 'MOVE', dx: -1, dy: 0 });
      if (e.key === 'ArrowRight') dispatch({ type: 'MOVE', dx: 1, dy: 0 });
      if (e.key === 'ArrowDown') dispatch({ type: 'MOVE', dx: 0, dy: 1 });
      if (e.key === 'ArrowUp') dispatch({ type: 'ROTATE' });
      if (e.key === ' ') dispatch({ type: 'HARD_DROP' });
      if (e.key.toLowerCase() === 'p') dispatch({ type: 'PAUSE' });
    };
    window.addEventListener('keydown', hk);
    return () => window.removeEventListener('keydown', hk);
  }, []);

  const dGrid = () => {
    const b = state.grid.map(r => [...r]);
    if (state.activePiece && !state.isPaused) {
      state.activePiece.shape.forEach((r, ri) => r.forEach((c, ci) => {
        if (c !== 0) {
          const y = state.activePiece.pos.y + ri;
          const x = state.activePiece.pos.x + ci;
          if (y >= 0 && y < ROWS && x >= 0 && x < COLS) b[y][x] = state.activePiece.color;
        }
      }));
    }
    return b.flat().map((c, i) => (
      <div
        key={i}
        style={{
          backgroundColor: c || '#0f172a',
          boxShadow: c ? `inset 0 0 8px ${c}aa` : 'none'
        }}
      />
    ));
  };

  // nav=56px mobile / 64px desktop, score-bar=44px, btn-row=120px
  const CELL = `min(calc((100vw - 12px) / 10), calc((100dvh - 220px) / 20))`;

  return (
    <div key={VERSION} className="flex flex-col w-full select-none" style={{ height: 'calc(100dvh - 56px)' }}>

      {/* SCORE BAR — 3-column grid, always stable */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: '44px', flexShrink: 0, padding: '0 12px', backgroundColor: 'rgba(15,23,42,0.85)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Left: current score + level */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black text-text-muted tracking-widest uppercase">SCORE</span>
          <span className="text-base font-black text-white tabular-nums">{state.score.toLocaleString()}</span>
          <span className="text-[9px] font-black text-text-muted tracking-widest uppercase ml-1">LVL</span>
          <span className="text-base font-black text-neon-cyan tabular-nums">{state.level ?? 1}</span>
        </div>

        {/* Center: best score (always rendered, empty when no scores) */}
        <div>
          {highScores.length > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
              <span style={{ fontSize: '11px' }}>🏆</span>
              <span className="text-[9px] font-black text-yellow-400 uppercase">{highScores[0].name}</span>
              <span className="text-[10px] font-black text-yellow-300 tabular-nums">{highScores[0].score.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Right: pause + reset */}
        <div className="flex items-center gap-2 justify-end">
          <button onClick={() => dispatch({ type: 'PAUSE' })} className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all">
            {state.isPaused ? <Play size={16} className="fill-white" /> : <Pause size={16} className="fill-white" />}
          </button>
          <button onClick={() => dispatch({ type: 'RESET' })} className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* GAME BOARD — centered, square cells */}
      <div className="flex-1 flex items-center justify-center overflow-hidden" style={{ minHeight: 0 }}>
        <div className="relative" style={{ lineHeight: 0 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(10, ${CELL})`,
            gridTemplateRows: `repeat(20, ${CELL})`,
            gap: '1px',
            backgroundColor: '#1e293b',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '3px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5)',
          }}>
            {dGrid()}
          </div>

          <AnimatePresence>
            {(state.isGameOver || state.isPaused) && (
              <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl rounded-lg">
                <div className="w-full px-5 py-6 text-center">

                  {/* NEW HIGH SCORE — name entry */}
                  {state.isGameOver && isNewHigh ? (
                    <>
                      <div className="mb-2 text-yellow-400 text-xs font-black uppercase tracking-[0.3em] animate-pulse">🏆 NEW RECORD!</div>
                      <div className="text-4xl font-black text-white mb-5 tabular-nums">{state.score.toLocaleString()}</div>
                      <input
                        autoFocus
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && submitScore()}
                        maxLength={12}
                        placeholder="이름을 입력하세요"
                        className="w-full max-w-[220px] text-center bg-slate-800 border-2 border-yellow-400/60 rounded-xl text-white text-base font-bold px-3 py-2.5 mb-4 outline-none focus:border-yellow-400 placeholder:text-slate-500"
                        style={{ display: 'block', margin: '0 auto 16px' }}
                      />
                      <button onClick={submitScore}
                        className="relative px-8 py-3 bg-yellow-400 text-slate-900 font-black text-sm rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                        저장 &amp; 재시작
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-black text-white mb-1 tracking-tighter uppercase italic">
                        {state.isGameOver ? 'GAME OVER' : 'PAUSED'}
                      </h2>
                      {state.isGameOver && <div className="text-lg font-black text-neon-cyan mb-4 tabular-nums">{state.score.toLocaleString()}</div>}

                      {/* Leaderboard */}
                      {state.isGameOver && highScores.length > 0 && (
                        <div className="mb-4 bg-slate-900/80 rounded-xl px-3 py-2 border border-white/10">
                          <div className="text-[9px] font-black text-text-muted tracking-[0.25em] uppercase mb-2">🏆 HALL OF FAME</div>
                          {highScores.map((h, i) => (
                            <div key={i} className="flex items-center justify-between py-0.5">
                              <span className="text-[11px] font-black" style={{ color: i===0?'#fbbf24':i===1?'#94a3b8':i===2?'#b45309':'#475569' }}>
                                {['🥇','🥈','🥉','4','5'][i]} {h.name}
                              </span>
                              <span className="text-[11px] font-black text-white tabular-nums">{h.score.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => dispatch({ type: (state.isGameOver ? 'RESET' : 'PAUSE') })}
                        className="relative group px-8 py-3 bg-primary text-white font-black rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-105 transition-all overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600" />
                        <span className="relative z-10 text-sm uppercase tracking-widest">{state.isGameOver ? 'RESTART' : 'RESUME'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* BUTTON ROW — enlarged for mobile accessibility */}
      <div className="flex items-center justify-center gap-2 px-2 bg-slate-900/60 border-t border-white/5" style={{ height: '120px', flexShrink: 0 }}>
        <button onClick={() => dispatch({ type: 'ROTATE' })} className="flex flex-col items-center gap-1.5 flex-1 h-[100px] bg-slate-800 border-2 border-neon-purple/70 rounded-2xl text-neon-purple shadow-[0_0_12px_rgba(188,19,254,0.3)] active:scale-95 transition-all justify-center">
          <RotateCcw size={32} />
          <span className="text-[10px] font-black uppercase">ROTATE</span>
        </button>
        <button onClick={() => dispatch({ type: 'MOVE', dx: -1, dy: 0 })} className="flex flex-col items-center gap-1.5 flex-1 h-[100px] bg-slate-800 border-2 border-neon-cyan/70 rounded-2xl text-neon-cyan shadow-[0_0_12px_rgba(0,243,255,0.3)] active:scale-95 transition-all justify-center">
          <ArrowLeft size={32} />
          <span className="text-[10px] font-black uppercase">LEFT</span>
        </button>
        <button onClick={() => dispatch({ type: 'MOVE', dx: 1, dy: 0 })} className="flex flex-col items-center gap-1.5 flex-1 h-[100px] bg-slate-800 border-2 border-neon-cyan/70 rounded-2xl text-neon-cyan shadow-[0_0_12px_rgba(0,243,255,0.3)] active:scale-95 transition-all justify-center">
          <ArrowRight size={32} />
          <span className="text-[10px] font-black uppercase">RIGHT</span>
        </button>
        <button onClick={() => dispatch({ type: 'MOVE', dx: 0, dy: 1 })} className="flex flex-col items-center gap-1.5 flex-1 h-[100px] bg-slate-800 border-2 border-neon-cyan/70 rounded-2xl text-neon-cyan shadow-[0_0_12px_rgba(0,243,255,0.3)] active:scale-95 transition-all justify-center">
          <ArrowDown size={32} />
          <span className="text-[10px] font-black uppercase">SOFT</span>
        </button>
        <button onClick={() => dispatch({ type: 'HARD_DROP' })} className="flex flex-col items-center gap-1.5 flex-1 h-[100px] bg-slate-800 border-2 border-yellow-400/70 rounded-2xl text-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.3)] active:scale-95 transition-all justify-center">
          <ChevronsDown size={32} />
          <span className="text-[10px] font-black uppercase">HARD</span>
        </button>
      </div>
    </div>
  );
};

// --- APP COMPONENT ---
function App() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', title: '', short: '홈', icon: <Home size={20} /> },
    { id: 'simulator', title: '', short: '시뮬', icon: <Activity size={20} /> },
    { id: 'formulas', title: '', short: '공식', icon: <Book size={20} /> },
    { id: 'tetris', title: '', short: '게임', icon: <Gamepad2 size={20} /> },
  ];

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-glass-border backdrop-blur-3xl" style={{ backgroundColor: 'rgba(2,6,23,0.85)' }}>
        <div className="flex items-center h-14 md:h-16 px-1 md:px-0 md:gap-4 md:container">
          {/* Logo — hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 pr-6 border-r border-glass-stroke flex-shrink-0">
            <Calculator className="text-neon-cyan" size={22} />
            <span className="brand text-base font-black tracking-tighter">MATH<span className="text-primary-glow">AI</span></span>
          </div>
          {/* Nav pills — compact on mobile (icon + short text), full on desktop */}
          <div className="flex w-full md:w-auto justify-around md:justify-start gap-0.5 md:gap-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`nav-pill flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 flex-1 md:flex-none px-1 py-1 md:px-4 md:py-2 ${activeTab === item.id ? 'active' : 'text-text-muted hover:text-text-main'}`}>
                {item.icon}
                <span className="text-[10px] font-bold md:hidden">{item.short}</span>
                <span className="hidden md:inline text-sm font-bold tracking-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className={activeTab === 'tetris' ? 'w-full p-0 overflow-hidden' : 'container pt-20 pb-12'}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-6 md:py-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-7xl mb-4 md:mb-6 leading-tight font-black tracking-tighter"><span className="text-transparent bg-clip-text bg-accent-gradient">삼각함수를</span><br />직관적으로 마스터하세요.</h1>
                <p className="text-text-muted text-base md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto md:mx-0 font-medium">1 CPU, 1GB RAM에서도 부드럽게 작동하는 최첨단 수학 시각화 시스템.<br />사인법칙부터 코사인법칙까지, 눈으로 보고 직접 조절하며 배우세요.</p>
                <div className="flex justify-center md:justify-start gap-5 md:gap-8">
                  <button onClick={() => setActiveTab('simulator')} className="relative group px-10 md:px-12 py-5 md:py-6 overflow-hidden rounded-[24px] bg-primary font-black text-lg md:text-xl transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(99,102,241,0.6)]"><div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-100 group-hover:scale-110 transition-transform" /><span className="relative z-10 text-white uppercase tracking-widest">시뮬레이터 시작</span></button>
                  <button onClick={() => setActiveTab('formulas')} className="glass px-10 md:px-12 py-5 md:py-6 text-lg md:text-xl font-black text-white hover:bg-white/10 transition-all border border-white/20 hover:border-white/40 rounded-[24px]">공식 도감 보기</button>
                </div>
              </div>
              <div className="flex-1 pythagoras-hero-container"><div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" /><img src="/pythagoras.png" alt="Pythagoras AI Character" className="pythagoras-hero-image animate-fade drop-shadow-[0_20px_60px_rgba(99,102,241,0.4)]" /></div>
            </motion.div>
          )}
          {activeTab === 'simulator' && <motion.div key="simulator" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full h-full"><SineGrapher /></motion.div>}
          {activeTab === 'formulas' && <motion.div key="formulas" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><FormulaSection /></motion.div>}
          {activeTab === 'tetris' && (
            <motion.div key="tetris" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full">
              <TetrisInternal />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-glass-border text-center text-text-muted text-sm px-4">
        <p className="font-medium">© 2026 MathAI. Optimization for 1 CPU / 1GB RAM Instance.</p>
        <p className="mt-2 opacity-50">Oracle Cloud (168.107.37.200) Deployment Optimized.</p>
      </footer>
    </div>
  );
}

export default App;
