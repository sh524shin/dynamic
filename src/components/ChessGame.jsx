import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight, Trophy, History } from 'lucide-react';

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [status, setStatus] = useState('White to move');
  const [gameOver, setGameOver] = useState(null);

  const safeGameMutate = useCallback((modify) => {
    setGame((g) => {
      const update = new Chess(g.fen());
      modify(update);
      return update;
    });
  }, []);

  const onDrop = (sourceSquare, targetSquare) => {
    let move = null;
    safeGameMutate((game) => {
      try {
        move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q', // always promote to queen for simplicity
        });
      } catch (e) {
        move = null;
      }
    });

    if (move === null) return false;
    
    setMoveHistory(prev => [...prev, move.san]);
    return true;
  };

  useEffect(() => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) setGameOver(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`);
      else if (game.isDraw()) setGameOver('Draw!');
      else setGameOver('Game Over');
    } else {
      setStatus(game.inCheck() ? 'Check!' : `${game.turn() === 'w' ? 'White' : 'Black'} to move`);
    }
  }, [game]);

  const resetGame = () => {
    setGame(new Chess());
    setMoveHistory([]);
    setGameOver(null);
  };

  const customStyles = {
    capturedPieces: "flex flex-wrap gap-1 p-2 bg-slate-800/50 rounded-lg min-h-[40px] border border-white/5",
    historyItem: "text-[10px] font-mono px-2 py-1 bg-slate-700/50 rounded border border-white/5 text-slate-300",
    statusBadge: "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* LEFT: MAIN BOARD */}
      <div className="w-full max-w-[500px] relative aspect-square shadow-[0_0_50px_rgba(0,243,255,0.15)] rounded-xl overflow-hidden border-4 border-slate-800">
        <Chessboard 
          id="BasicBoard"
          position={game.fen()} 
          onPieceDrop={onDrop} 
          boardOrientation="white"
          customDarkSquareStyle={{ backgroundColor: '#1e293b' }}
          customLightSquareStyle={{ backgroundColor: '#334155' }}
          customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 6px rgba(0, 243, 255, 0.75)' }}
          animationDuration={300}
        />
        
        {/* GAME OVER OVERLAY */}
        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              <Trophy size={64} className="text-yellow-400 mb-4 animate-bounce" />
              <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">{gameOver}</h2>
              <button 
                onClick={resetGame}
                className="mt-6 px-8 py-3 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg"
              >
                PLAY AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT: SIDEBAR */}
      <div className="w-full lg:w-72 flex flex-col gap-4">
        {/* STATUS BOX */}
        <div className="glass p-4 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-2 opacity-10"><History size={48} /></div>
          <div className="relative z-10">
            <h3 className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase mb-3">Game Status</h3>
            <div className={`${customStyles.statusBadge} ${game.inCheck() ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${game.inCheck() ? 'bg-red-400' : 'bg-neon-cyan'}`} />
              {status}
            </div>
          </div>
        </div>

        {/* MOVE HISTORY */}
        <div className="glass p-4 rounded-2xl border border-white/10 shadow-xl flex-1 max-h-[300px] overflow-hidden flex flex-col">
          <h3 className="text-[10px] font-black text-text-muted tracking-[0.2em] uppercase mb-3">Move History</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-2">
              {moveHistory.reduce((acc, curr, i) => {
                if (i % 2 === 0) acc.push([curr]);
                else acc[acc.length - 1].push(curr);
                return acc;
              }, []).map((pair, idx) => (
                <React.Fragment key={idx}>
                  <div className="text-[10px] text-slate-500 font-bold self-center">{idx + 1}.</div>
                  <div className="flex gap-1">
                    <span className={customStyles.historyItem}>{pair[0]}</span>
                    {pair[1] && <span className={customStyles.historyItem}>{pair[1]}</span>}
                  </div>
                </React.Fragment>
              ))}
              {moveHistory.length === 0 && (
                <div className="col-span-2 text-[11px] text-slate-600 italic py-4 text-center">No moves yet...</div>
              )}
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={resetGame}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-[12px] uppercase tracking-widest rounded-xl border border-white/5 transition-all"
          >
            <RotateCcw size={16} /> RESTART GAME
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
