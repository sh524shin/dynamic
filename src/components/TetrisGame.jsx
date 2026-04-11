import React, { useReducer, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Trophy, ArrowRight, ArrowDown, ArrowLeft, ArrowUp } from 'lucide-react';

// --- Tetris Logic Constants ---
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

// --- Reducer for Atomic Game State ---
const createInitialState = () => {
  const p = getRandomPiece();
  const x = Math.floor(COLS / 2) - Math.floor(p.shape[0].length / 2);
  return {
    grid: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
    activePiece: { ...p, pos: { x, y: 0 } },
    nextPiece: getRandomPiece(),
    score: 0,
    level: 1,
    isGameOver: false,
    isPaused: false,
    speed: INITIAL_SPEED,
  };
};

function reducer(state, action) {
  switch (action.type) {
    case 'SPAWN': {
      if (state.isGameOver) return state;
      const piece = state.nextPiece;
      const x = Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2);
      if (checkCollision(piece.shape, x, 0, state.grid)) return { ...state, isGameOver: true };
      return { ...state, activePiece: { ...piece, pos: { x, y: 0 } }, nextPiece: getRandomPiece() };
    }
    case 'MOVE': {
      if (!state.activePiece || state.isPaused || state.isGameOver) return state;
      const { shape, pos } = state.activePiece;
      if (!checkCollision(shape, pos.x + action.dx, pos.y + action.dy, state.grid)) {
        return { ...state, activePiece: { ...state.activePiece, pos: { x: pos.x + action.dx, y: pos.y + action.dy } } };
      }
      if (action.dy > 0) return reducer(state, { type: 'LOCK' });
      return state;
    }
    case 'ROTATE': {
      if (!state.activePiece || state.isPaused || state.isGameOver) return state;
      const { shape, pos } = state.activePiece;
      const rotated = shape[0].map((_, i) => shape.map(row => row[i]).reverse());
      if (!checkCollision(rotated, pos.x, pos.y, state.grid)) {
        return { ...state, activePiece: { ...state.activePiece, shape: rotated } };
      }
      return state;
    }
    case 'LOCK': {
      const { activePiece: piece, grid: board } = state;
      if (!piece) return state;
      const newGrid = board.map(row => [...row]);
      piece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell !== 0) {
            const y = piece.pos.y + r;
            const x = piece.pos.x + c;
            if (y >= 0 && y < ROWS && x >= 0 && x < COLS) newGrid[y][x] = piece.color;
          }
        });
      });
      const rowsRemaining = newGrid.filter(row => !row.every(c => c !== 0));
      const linesCleared = ROWS - rowsRemaining.length;
      const finalGrid = [...Array.from({ length: linesCleared }, () => Array(COLS).fill(0)), ...rowsRemaining];
      const p = [0, 100, 300, 500, 800][linesCleared] * state.level;
      const newScore = state.score + p;
      const newLevel = Math.floor(newScore / 1000) + 1;
      return reducer({ 
        ...state, 
        grid: finalGrid, score: newScore, level: newLevel, 
        speed: Math.max(100, INITIAL_SPEED * Math.pow(0.92, newLevel - 1)),
        activePiece: null 
      }, { type: 'SPAWN' });
    }
    case 'HARD_DROP': {
      if (!state.activePiece || state.isPaused || state.isGameOver) return state;
      let dy = 0;
      while (!checkCollision(state.activePiece.shape, state.activePiece.pos.x, state.activePiece.pos.y + dy + 1, state.grid)) dy++;
      return reducer(state, { type: 'MOVE', dx: 0, dy });
    }
    case 'PAUSE': return { ...state, isPaused: !state.isPaused };
    case 'RESET': return createInitialState();
    default: return state;
  }
}

const TetrisGame = () => {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Game Loop
  useEffect(() => {
    if (state.isGameOver || state.isPaused) return;
    const loop = setInterval(() => dispatch({ type: 'MOVE', dx: 0, dy: 1 }), state.speed);
    return () => clearInterval(loop);
  }, [state.isGameOver, state.isPaused, state.speed]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (stateRef.current.isGameOver) return;
      switch (e.key) {
        case 'ArrowLeft': dispatch({ type: 'MOVE', dx: -1, dy: 0 }); break;
        case 'ArrowRight': dispatch({ type: 'MOVE', dx: 1, dy: 0 }); break;
        case 'ArrowDown': dispatch({ type: 'MOVE', dx: 0, dy: 1 }); break;
        case 'ArrowUp': dispatch({ type: 'ROTATE' }); break;
        case ' ': dispatch({ type: 'HARD_DROP' }); break;
        case 'p': case 'P': dispatch({ type: 'PAUSE' }); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const renderGrid = () => {
    const board = state.grid.map(row => [...row]);
    if (state.activePiece && !state.isPaused) {
      state.activePiece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell !== 0) {
            const y = state.activePiece.pos.y + r;
            const x = state.activePiece.pos.x + c;
            if (y >= 0 && y < ROWS && x >= 0 && x < COLS) board[y][x] = state.activePiece.color;
          }
        });
      });
    }
    return board.flat().map((color, i) => (
      <div key={i} className="w-full h-full border-[0.5px] border-white/5" style={{ backgroundColor: color || 'rgba(0,0,0,0.1)' }} />
    ));
  };

  const MobileBtn = ({ icon: Icon, color, onClick, label, className }) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-transform active:scale-90 ${className}`}
      style={{ 
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: color, 
        boxShadow: `0 0 10px ${color}88`,
        color: color
      }}
    >
      <Icon size={24} />
      {label && <span className="text-[10px] mt-1 font-black uppercase text-white">{label}</span>}
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-8 py-4 px-4 select-none">
      {/* Game Board Container */}
      <div className="relative p-2 bg-slate-900 border-4 border-white/20 rounded-2xl shadow-2xl">
        <div 
          className="grid" 
          style={{ 
            gridTemplateColumns: `repeat(${COLS}, min(8vw, 30px))`, 
            gridTemplateRows: `repeat(${ROWS}, min(8vw, 30px))`,
            gap: '1px'
          }}
        >
          {renderGrid()}
        </div>

        <AnimatePresence>
          {(state.isGameOver || state.isPaused) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-xl">
              <div className="text-center">
                <h2 className="text-4xl font-black text-white mb-8 uppercase italic">{state.isGameOver ? 'GAME OVER' : 'PAUSED'}</h2>
                <button 
                  onClick={() => dispatch({ type: state.isGameOver ? 'RESET' : 'PAUSE' })} 
                  className="px-10 py-4 bg-primary text-white font-black rounded-xl uppercase tracking-widest shadow-lg"
                >
                  {state.isGameOver ? 'Restart' : 'Resume'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controller Section - Fixed position to avoid overlapping */}
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        {/* D-Pad Zone */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-2">
            <MobileBtn icon={ArrowLeft} color="#00f3ff" onClick={() => dispatch({ type: 'MOVE', dx: -1, dy: 0 })} />
            <MobileBtn icon={ArrowRight} color="#00f3ff" onClick={() => dispatch({ type: 'MOVE', dx: 1, dy: 0 })} />
            <MobileBtn icon={ArrowDown} color="#00f3ff" onClick={() => dispatch({ type: 'MOVE', dx: 0, dy: 1 })} className="col-span-2 py-6" label="Soft Drop" />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <MobileBtn icon={RotateCcw} color="#bc13fe" onClick={() => dispatch({ type: 'ROTATE' })} label="Rotate" className="h-full" />
            <MobileBtn icon={ArrowUp} color="#facc15" label="Hard Drop" onClick={() => dispatch({ type: 'HARD_DROP' })} />
          </div>
        </div>

        {/* Dashboard Area */}
        <div className="p-6 bg-slate-800/80 border border-white/10 rounded-3xl flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">Score</span>
              <span className="text-3xl font-black text-neon-cyan">{state.score.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">Level</span>
              <span className="text-3xl font-black text-neon-purple">{state.level}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-4 px-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase text-text-muted">Next</span>
              <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${state.nextPiece.shape[0].length}, 10px)` }}>
                {state.nextPiece.shape.map((r, ri) => r.map((c, ci) => (
                  <div key={`${ci}-${ri}`} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c ? state.nextPiece.color : 'rgba(255,255,255,0.05)' }} />
                )))}
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => dispatch({ type: 'PAUSE' })} 
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase text-white tracking-widest transition-all"
              >
                {state.isPaused ? 'Engage' : 'Pause'}
              </button>
              <button 
                onClick={() => dispatch({ type: 'RESET' })} 
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all active:rotate-180"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;
